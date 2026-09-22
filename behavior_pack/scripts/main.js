import { EquipmentSlot, ItemStack, MolangVariableMap, system, world } from "@minecraft/server";

const LIGHT_ID = "bellity:sun_bigman_light";
const LIGHT_BALL_ID = "bellity:light_ball";
const CREEPY_HORSE_EYE_ID = "bellity:creepy_horse_eye";
const CONNECTABLE_TRAIN_CART_ID = "bellity:connectable_train_cart";
const TRAIN_ID_PROPERTY = "train_id";
const CAR_INDEX_PROPERTY = "car_index";
const HEAD_ID_PROPERTY = "head_id";
const TRAIN_LENGTH_PROPERTY = "train_length";
const TRAIN_SPACING = 1.5;
const TRAIN_MAX_CARS = 8;
const TRAIN_LINK_DISTANCE = 6;
const TRAIN_SELECTION_TICKS = 600;
const TRAIN_HISTORY_MARGIN = 1.5;
const PENDING_TRAIN_REPAIRS_PROPERTY = "bellity:pending_train_repairs";
const CREEPY_HORSE_EYE_ACTIVATE_SOUND = "bellity.creepy_horse_eye_activate";
const EXTRA_KNOCKBACK_STRENGTH = 0.4;
const FREEZE_RADIUS = 7;
const FREEZE_DURATION_TICKS = 200;
const FREEZE_TREMBLE_DISTANCE = 0.025;
const FREEZE_PARTICLE_INTERVAL_TICKS = 10;
const FREEZE_PARTICLES_PER_BURST = 16;
const FREEZE_PARTICLE_ID = "minecraft:colored_flame_particle";
const DROP_ITEMS = [
  "minecraft:apple",
  "minecraft:coal",
  "minecraft:iron_ingot",
  "minecraft:gold_ingot",
  "minecraft:redstone",
  "minecraft:lapis_lazuli",
  "minecraft:emerald",
  "minecraft:diamond",
];

const lastThrowTick = new Map();
const lightProjectiles = new Set();
const frozenEntities = new Map();
const freezeZones = [];
const trainSelections = new Map();
const trainHistories = new Map();
const trainCartStates = new Map();
const pendingTrainRepairs = new Map();
let pendingTrainRepairsRestored = false;
let whiteParticleVariables;

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function getLoadedTrainCarts(dimension) {
  return dimension.getEntities({ type: CONNECTABLE_TRAIN_CART_ID });
}

function getTrainId(cart) {
  const value = cart.getDynamicProperty(TRAIN_ID_PROPERTY);
  return typeof value === "string" ? value : undefined;
}

function getCarIndex(cart) {
  const value = cart.getDynamicProperty(CAR_INDEX_PROPERTY);
  return typeof value === "number" ? value : undefined;
}

function rememberTrainCart(cart) {
  try {
    const storedLength = cart.getDynamicProperty(TRAIN_LENGTH_PROPERTY);
    trainCartStates.set(cart.id, {
      id: cart.id,
      trainId: getTrainId(cart),
      carIndex: getCarIndex(cart),
      trainLength: typeof storedLength === "number" ? storedLength : undefined,
      dimension: cart.dimension,
    });
  } catch {
    // A later tick can refresh the cache if the entity becomes readable again.
  }
}

function initializeTrainHead(cart) {
  const trainId = `bellity-train-${cart.id}`;
  cart.setDynamicProperty(TRAIN_ID_PROPERTY, trainId);
  cart.setDynamicProperty(CAR_INDEX_PROPERTY, 0);
  cart.setDynamicProperty(HEAD_ID_PROPERTY, cart.id);
  cart.setDynamicProperty(TRAIN_LENGTH_PROPERTY, 1);
  cart.triggerEvent("bellity:set_head");
  rememberTrainCart(cart);
  return trainId;
}

function getTrainMembers(dimension, trainId) {
  return getLoadedTrainCarts(dimension)
    .filter((cart) => getTrainId(cart) === trainId)
    .sort((a, b) => (getCarIndex(a) ?? Number.MAX_SAFE_INTEGER) -
      (getCarIndex(b) ?? Number.MAX_SAFE_INTEGER));
}

function hasCompleteTrain(members, expectedLength) {
  return members.length === expectedLength &&
    members.every((cart, index) => getCarIndex(cart) === index);
}

function getHeadForSelection(selection) {
  const head = world.getEntity(selection.headId);
  if (!head?.isValid || head.typeId !== CONNECTABLE_TRAIN_CART_ID) return undefined;
  if (getTrainId(head) !== selection.trainId || getCarIndex(head) !== 0) return undefined;
  return head;
}

function notifyTrainPlayer(player, message) {
  try {
    player.onScreenDisplay.setActionBar(message);
  } catch {
    player.sendMessage(message);
  }
}

function selectTrain(player, cart) {
  let trainId = getTrainId(cart);
  let head = cart;
  if (trainId === undefined) {
    trainId = initializeTrainHead(cart);
  } else if (getCarIndex(cart) !== 0) {
    const headId = cart.getDynamicProperty(HEAD_ID_PROPERTY);
    head = typeof headId === "string" ? world.getEntity(headId) : undefined;
    if (!head?.isValid) {
      notifyTrainPlayer(player, "The train head is not loaded.");
      return;
    }
  }

  trainSelections.set(player.id, {
    trainId,
    headId: head.id,
    dimensionId: head.dimension.id,
    expiresTick: system.currentTick + TRAIN_SELECTION_TICKS,
  });
  notifyTrainPlayer(player, "Train selected. Use the Chain on a standalone cart to append it.");
}

function getLocationBehind(cart, distance) {
  const rotation = cart.getRotation();
  const yawRadians = rotation.y * Math.PI / 180;
  const pitchRadians = rotation.x * Math.PI / 180;
  const horizontalScale = Math.cos(pitchRadians);
  return {
    location: {
      x: cart.location.x + Math.sin(yawRadians) * horizontalScale * distance,
      y: cart.location.y + Math.sin(pitchRadians) * distance,
      z: cart.location.z - Math.cos(yawRadians) * horizontalScale * distance,
    },
    rotation,
  };
}

function appendHistoryPoint(headId, point) {
  const history = trainHistories.get(headId);
  if (!history) return;
  const oldest = history.points.at(-1);
  if (!oldest || distanceBetween(oldest.location, point.location) > 0.01) {
    history.points.push(point);
  }
}

function connectCart(player, selection, target) {
  const head = getHeadForSelection(selection);
  if (!head) {
    trainSelections.delete(player.id);
    notifyTrainPlayer(player, "The selected train is no longer available.");
    return;
  }
  if (head.dimension.id !== target.dimension.id) {
    notifyTrainPlayer(player, "Both carts must be in the same dimension.");
    return;
  }

  const members = getTrainMembers(head.dimension, selection.trainId);
  const storedLength = head.getDynamicProperty(TRAIN_LENGTH_PROPERTY);
  const trainLength = typeof storedLength === "number" ? storedLength : members.length;
  if (!hasCompleteTrain(members, trainLength)) {
    notifyTrainPlayer(player, "The whole train must be loaded before adding a cart.");
    return;
  }
  if (trainLength >= TRAIN_MAX_CARS) {
    notifyTrainPlayer(player, "This train already has the maximum of 8 carts.");
    return;
  }
  const tail = members[members.length - 1] ?? head;
  if (distanceBetween(tail.location, target.location) > TRAIN_LINK_DISTANCE) {
    notifyTrainPlayer(player, "Move the standalone cart within 6 blocks of the train tail.");
    return;
  }

  const placement = sampleTrainHistory(
    trainHistories.get(head.id)?.points ?? [],
    trainLength * TRAIN_SPACING,
  ) ?? getLocationBehind(tail, TRAIN_SPACING);
  try {
    target.teleport(placement.location, {
      dimension: head.dimension,
      keepVelocity: false,
      rotation: placement.rotation,
    });
    target.clearVelocity();
    target.setDynamicProperty(TRAIN_ID_PROPERTY, selection.trainId);
    target.setDynamicProperty(CAR_INDEX_PROPERTY, trainLength);
    target.setDynamicProperty(HEAD_ID_PROPERTY, head.id);
    target.setDynamicProperty(TRAIN_LENGTH_PROPERTY, trainLength + 1);
    for (const member of members) {
      member.setDynamicProperty(TRAIN_LENGTH_PROPERTY, trainLength + 1);
      rememberTrainCart(member);
    }
    target.triggerEvent("bellity:set_follower");
    rememberTrainCart(target);
    appendHistoryPoint(head.id, {
      location: { ...placement.location },
      rotation: { ...placement.rotation },
    });
    trainSelections.delete(player.id);
    notifyTrainPlayer(player, `Cart connected as car ${trainLength + 1} of the train.`);
  } catch (error) {
    console.warn(`Connectable Train Cart link failed: ${error}`);
    notifyTrainPlayer(player, "The cart could not be placed behind the train tail.");
  }
}

function handleTrainCartInteraction(player, target) {
  if (!player.isValid || !target.isValid) return;

  const selection = trainSelections.get(player.id);
  if (!selection || selection.expiresTick < system.currentTick) {
    selectTrain(player, target);
    return;
  }
  if (getTrainId(target) !== undefined) {
    notifyTrainPlayer(player, "Only a standalone cart can be appended; trains cannot be merged.");
    return;
  }
  connectCart(player, selection, target);
}

function interpolateAngle(from, to, amount) {
  const delta = ((to - from + 540) % 360) - 180;
  return from + delta * amount;
}

function sampleTrainHistory(points, targetDistance) {
  let travelled = 0;
  for (let index = 0; index < points.length - 1; index += 1) {
    const newer = points[index];
    const older = points[index + 1];
    const segmentLength = distanceBetween(newer.location, older.location);
    if (segmentLength < 0.0001) continue;
    if (travelled + segmentLength >= targetDistance) {
      const amount = (targetDistance - travelled) / segmentLength;
      return {
        location: {
          x: newer.location.x + (older.location.x - newer.location.x) * amount,
          y: newer.location.y + (older.location.y - newer.location.y) * amount,
          z: newer.location.z + (older.location.z - newer.location.z) * amount,
        },
        rotation: {
          x: newer.rotation.x + (older.rotation.x - newer.rotation.x) * amount,
          y: interpolateAngle(newer.rotation.y, older.rotation.y, amount),
        },
      };
    }
    travelled += segmentLength;
  }
  return undefined;
}

function recordHeadHistory(head, members) {
  let history = trainHistories.get(head.id);
  if (!history) {
    history = {
      points: members.map((cart) => ({
        location: { ...cart.location },
        rotation: cart.getRotation(),
      })),
    };
    trainHistories.set(head.id, history);
    return history;
  }

  const current = { location: { ...head.location }, rotation: head.getRotation() };
  const newest = history.points[0];
  if (!newest || distanceBetween(current.location, newest.location) >= 0.02) {
    history.points.unshift(current);
  } else {
    history.points[0] = current;
  }

  const maximumDistance = (TRAIN_MAX_CARS - 1) * TRAIN_SPACING + TRAIN_HISTORY_MARGIN;
  let travelled = 0;
  let keepCount = history.points.length;
  for (let index = 0; index < history.points.length - 1; index += 1) {
    travelled += distanceBetween(history.points[index].location, history.points[index + 1].location);
    if (travelled > maximumDistance) {
      keepCount = index + 2;
      break;
    }
  }
  history.points.length = keepCount;
  return history;
}

function persistPendingTrainRepairs() {
  try {
    world.setDynamicProperty(
      PENDING_TRAIN_REPAIRS_PROPERTY,
      JSON.stringify([...pendingTrainRepairs]),
    );
  } catch (error) {
    console.warn(`Connectable Train Cart repair persistence failed: ${error}`);
  }
}

function restorePendingTrainRepairs() {
  if (pendingTrainRepairsRestored) return;
  pendingTrainRepairsRestored = true;
  try {
    const stored = world.getDynamicProperty(PENDING_TRAIN_REPAIRS_PROPERTY);
    if (typeof stored !== "string") return;
    for (const [trainId, repair] of JSON.parse(stored)) {
      if (!pendingTrainRepairs.has(trainId)) pendingTrainRepairs.set(trainId, repair);
    }
  } catch (error) {
    console.warn(`Connectable Train Cart repair restore failed: ${error}`);
  }
}

function updateConnectableTrains() {
  restorePendingTrainRepairs();
  const seenHeadIds = new Set();
  for (const dimensionId of ["overworld", "nether", "the_end"]) {
    let carts;
    try {
      carts = getLoadedTrainCarts(world.getDimension(dimensionId));
    } catch {
      continue;
    }

    const trains = new Map();
    for (const cart of carts) {
      rememberTrainCart(cart);
      const trainId = getTrainId(cart);
      if (trainId === undefined) continue;
      const members = trains.get(trainId) ?? [];
      members.push(cart);
      trains.set(trainId, members);
    }

    for (const [trainId, members] of trains) {
      members.sort((a, b) => (getCarIndex(a) ?? Number.MAX_SAFE_INTEGER) -
        (getCarIndex(b) ?? Number.MAX_SAFE_INTEGER));
      const pendingRepair = pendingTrainRepairs.get(trainId);
      if (pendingRepair) {
        repairTrainAfterCartDeath(members[0].dimension, trainId, pendingRepair);
        continue;
      }
      const head = members.find((cart) => getCarIndex(cart) === 0);
      if (!head) continue;
      seenHeadIds.add(head.id);
      const contiguousMembers = [];
      for (const member of members) {
        if (getCarIndex(member) !== contiguousMembers.length) break;
        contiguousMembers.push(member);
      }
      const history = recordHeadHistory(head, contiguousMembers);

      for (const follower of contiguousMembers) {
        const index = getCarIndex(follower);
        if (index === undefined || index < 1) continue;
        const sample = sampleTrainHistory(history.points, index * TRAIN_SPACING);
        if (!sample) continue;
        try {
          follower.teleport(sample.location, {
            dimension: head.dimension,
            keepVelocity: false,
            rotation: sample.rotation,
          });
          follower.clearVelocity();
        } catch (error) {
          console.warn(`Connectable Train Cart tracking failed for ${follower.id}: ${error}`);
        }
      }
    }
  }

  for (const headId of trainHistories.keys()) {
    if (!seenHeadIds.has(headId)) trainHistories.delete(headId);
  }
  for (const [playerId, selection] of trainSelections) {
    if (selection.expiresTick < system.currentTick) trainSelections.delete(playerId);
  }
}

function repairTrainAfterCartDeath(dimension, trainId, pending) {
  const removedIndices = [...new Set(pending.removedIndices ?? [pending.deadIndex])].sort((a, b) => a - b);
  const removedIds = new Set(pending.deadIds ?? [pending.deadId]);
  const survivors = getTrainMembers(dimension, trainId)
    .filter((cart) => !removedIds.has(cart.id));
  const expectedOldIndices = [];
  for (let index = 0; index < pending.oldLength; index += 1) {
    if (!removedIndices.includes(index)) expectedOldIndices.push(index);
  }
  if (survivors.length !== expectedOldIndices.length ||
      !survivors.every((cart, index) => getCarIndex(cart) === expectedOldIndices[index])) {
    return false;
  }

  if (survivors.length === 0) {
    for (const removedId of removedIds) trainHistories.delete(removedId);
    pendingTrainRepairs.delete(trainId);
    persistPendingTrainRepairs();
    return true;
  }
  const newHead = survivors[0];

  const newLength = pending.oldLength - removedIndices.length;
  if (removedIndices.includes(0)) {
    for (const removedId of removedIds) trainHistories.delete(removedId);
  }
  for (const cart of survivors) {
    const oldIndex = getCarIndex(cart);
    if (oldIndex === undefined) continue;
    const removedBefore = removedIndices.filter((index) => index < oldIndex).length;
    const newIndex = oldIndex - removedBefore;
    cart.setDynamicProperty(CAR_INDEX_PROPERTY, newIndex);
    cart.setDynamicProperty(HEAD_ID_PROPERTY, newHead.id);
    cart.setDynamicProperty(TRAIN_LENGTH_PROPERTY, newLength);
    cart.triggerEvent(newIndex === 0 ? "bellity:set_head" : "bellity:set_follower");
    rememberTrainCart(cart);
  }
  pendingTrainRepairs.delete(trainId);
  persistPendingTrainRepairs();
  return true;
}

function handleTrainCartDeath(deadCart, cachedState) {
  let trainId = cachedState?.trainId;
  let deadIndex = cachedState?.carIndex;
  let oldLength = cachedState?.trainLength;
  let dimension = cachedState?.dimension;
  try {
    if (trainId === undefined) trainId = getTrainId(deadCart);
    if (deadIndex === undefined) deadIndex = getCarIndex(deadCart);
    const storedLength = oldLength ?? deadCart.getDynamicProperty(TRAIN_LENGTH_PROPERTY);
    oldLength = typeof storedLength === "number" ? storedLength : undefined;
    if (!dimension) dimension = deadCart.dimension;
  } catch {
    // Cached values are sufficient when Bedrock invalidates the dead entity early.
  }
  if (trainId === undefined || deadIndex === undefined || !dimension) return;
  let deadId = cachedState?.id;
  try {
    if (deadId === undefined) deadId = deadCart.id;
  } catch {
    return;
  }
  trainCartStates.delete(deadId);

  restorePendingTrainRepairs();
  const existingRepair = pendingTrainRepairs.get(trainId);
  if (!existingRepair && (oldLength ?? 1) <= 1) {
    trainHistories.delete(deadId);
    return;
  }

  const pending = existingRepair ?? {
    oldLength: oldLength ?? 1,
    removedIndices: [],
    deadIds: [],
  };
  if (!pending.removedIndices) {
    pending.removedIndices = pending.deadIndex === undefined ? [] : [pending.deadIndex];
  }
  if (!pending.deadIds) pending.deadIds = pending.deadId === undefined ? [] : [pending.deadId];
  if (!pending.removedIndices.includes(deadIndex)) pending.removedIndices.push(deadIndex);
  if (!pending.deadIds.includes(deadId)) pending.deadIds.push(deadId);
  delete pending.deadIndex;
  delete pending.deadId;
  pendingTrainRepairs.set(trainId, pending);
  persistPendingTrainRepairs();
  system.run(() => {
    try {
      repairTrainAfterCartDeath(dimension, trainId, pending);
    } catch (error) {
      console.warn(`Connectable Train Cart death recovery failed: ${error}`);
    }
  });
}

function getWhiteParticleVariables() {
  if (!whiteParticleVariables) {
    whiteParticleVariables = new MolangVariableMap();
    whiteParticleVariables.setColorRGB("variable.color", {
      red: 0.92,
      green: 0.95,
      blue: 1.0,
    });
  }
  return whiteParticleVariables;
}

function dropRandomItem(event) {
  if (!event.hadEffect) return;

  try {
    const itemId = DROP_ITEMS[Math.floor(Math.random() * DROP_ITEMS.length)];
    event.hitEntity.dimension.spawnItem(new ItemStack(itemId, 1), event.hitEntity.location);
  } catch (error) {
    console.warn(`Bellity sword drop failed: ${error}`);
  }
}

function applyDoubleKnockback(event) {
  if (!event.hadEffect) return;

  const attacker = event.attackingEntity;
  const target = event.hitEntity;
  let directionX = target.location.x - attacker.location.x;
  let directionZ = target.location.z - attacker.location.z;
  let horizontalLength = Math.hypot(directionX, directionZ);

  if (horizontalLength < 0.001) {
    const view = attacker.getViewDirection();
    directionX = view.x;
    directionZ = view.z;
    horizontalLength = Math.hypot(directionX, directionZ);
  }
  if (horizontalLength < 0.001) return;

  const horizontalForce = {
    x: (directionX / horizontalLength) * EXTRA_KNOCKBACK_STRENGTH,
    z: (directionZ / horizontalLength) * EXTRA_KNOCKBACK_STRENGTH,
  };

  system.run(() => {
    try {
      target.applyKnockback(horizontalForce, 0);
    } catch (error) {
      console.warn(`Gizagiza sword knockback failed: ${error}`);
    }
  });
}

function throwLight(event) {
  const player = event.source;
  const now = system.currentTick;
  if (now - (lastThrowTick.get(player.id) ?? -100) < 7) return;

  try {
    const equipment = player.getComponent("minecraft:equippable");
    const mainhand = equipment?.getEquipmentSlot(EquipmentSlot.Mainhand);
    const item = mainhand?.getItem();
    if (!item || item.typeId !== LIGHT_ID) return;

    const durability = item.getComponent("minecraft:durability");
    if (!durability) throw new Error("Light item has no durability component");

    const direction = player.getViewDirection();
    const head = player.getHeadLocation();
    const origin = {
      x: head.x + direction.x * 0.6,
      y: head.y + direction.y * 0.6,
      z: head.z + direction.z * 0.6,
    };
    const projectile = player.dimension.spawnEntity(LIGHT_BALL_ID, origin);
    const flight = projectile.getComponent("minecraft:projectile");
    if (!flight) {
      projectile.remove();
      throw new Error("Light ball has no projectile component");
    }

    lightProjectiles.add(projectile.id);
    system.runTimeout(() => lightProjectiles.delete(projectile.id), 200);
    flight.owner = player;
    flight.shoot({
      x: direction.x * 1.5,
      y: direction.y * 1.5,
      z: direction.z * 1.5,
    });
    player.dimension.playSound("random.bow", player.location, {
      volume: 0.5,
      pitch: 0.33 + Math.random() * 0.17,
    });

    if (durability.damage + 1 >= durability.maxDurability) {
      mainhand.setItem(undefined);
    } else {
      durability.damage += 1;
      mainhand.setItem(item);
    }
    lastThrowTick.set(player.id, now);
  } catch (error) {
    console.warn(`Bellity light throw failed: ${error}`);
  }
}

function randomPointInSphere(center, radius) {
  let x;
  let y;
  let z;
  do {
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
    z = Math.random() * 2 - 1;
  } while (x * x + y * y + z * z > 1);

  return {
    x: center.x + x * radius,
    y: center.y + y * radius,
    z: center.z + z * radius,
  };
}

function spawnFreezeParticles(zone) {
  for (let index = 0; index < FREEZE_PARTICLES_PER_BURST; index += 1) {
    zone.dimension.spawnParticle(
      FREEZE_PARTICLE_ID,
      randomPointInSphere(zone.center, FREEZE_RADIUS),
      getWhiteParticleVariables(),
    );
  }
}

function getFreezeTrembleLocation(frozen, tick) {
  const step = (tick + frozen.tremblePhase) % 4;
  const offsetX = step === 0 ? FREEZE_TREMBLE_DISTANCE : step === 2 ? -FREEZE_TREMBLE_DISTANCE : 0;
  const offsetZ = step === 1 ? FREEZE_TREMBLE_DISTANCE : step === 3 ? -FREEZE_TREMBLE_DISTANCE : 0;
  return {
    x: frozen.location.x + offsetX,
    y: frozen.location.y,
    z: frozen.location.z + offsetZ,
  };
}

function holdFrozenEntity(frozen, tick) {
  frozen.entity.teleport(getFreezeTrembleLocation(frozen, tick), {
    dimension: frozen.dimension,
    keepVelocity: false,
    rotation: frozen.rotation,
  });
  frozen.entity.setRotation(frozen.rotation);
  frozen.entity.clearVelocity();
}

function releaseFrozenEntity(frozen) {
  frozen.entity.teleport(frozen.location, {
    dimension: frozen.dimension,
    keepVelocity: false,
    rotation: frozen.rotation,
  });
  frozen.entity.setRotation(frozen.rotation);
  frozen.entity.clearVelocity();
}

function freezeNearbyEnemies(event) {
  const player = event.source;

  try {
    const equipment = player.getComponent("minecraft:equippable");
    const item = equipment?.getEquipmentSlot(EquipmentSlot.Mainhand)?.getItem();
    if (!item || item.typeId !== CREEPY_HORSE_EYE_ID) return;

    const center = { ...player.location };
    const dimension = player.dimension;
    const untilTick = system.currentTick + FREEZE_DURATION_TICKS;
    dimension.playSound(CREEPY_HORSE_EYE_ACTIVATE_SOUND, center);
    const enemies = dimension.getEntities({
      location: center,
      maxDistance: FREEZE_RADIUS,
      families: ["monster"],
    });

    for (const entity of enemies) {
      try {
        const existing = frozenEntities.get(entity.id);
        if (existing) {
          existing.untilTick = Math.max(existing.untilTick, untilTick);
          continue;
        }

        const frozen = {
          entity,
          dimension,
          location: { ...entity.location },
          rotation: entity.getRotation(),
          tremblePhase: Math.floor(Math.random() * 4),
          untilTick,
        };
        holdFrozenEntity(frozen, system.currentTick);
        frozenEntities.set(entity.id, frozen);
      } catch (error) {
        console.warn(`Creepy Horse Eye could not freeze ${entity.id}: ${error}`);
      }
    }

    const zone = { center, dimension, untilTick };
    freezeZones.push(zone);
    try {
      spawnFreezeParticles(zone);
    } catch (error) {
      freezeZones.pop();
      console.warn(`Creepy Horse Eye particles failed: ${error}`);
    }
  } catch (error) {
    console.warn(`Creepy Horse Eye activation failed: ${error}`);
  }
}

function updateCreepyHorseEyeEffects() {
  const now = system.currentTick;

  for (const [entityId, frozen] of frozenEntities) {
    if (!frozen.entity.isValid) {
      frozenEntities.delete(entityId);
      continue;
    }

    try {
      if (frozen.entity.dimension.id !== frozen.dimension.id) {
        frozenEntities.delete(entityId);
        continue;
      }
      if (now >= frozen.untilTick) {
        releaseFrozenEntity(frozen);
        frozenEntities.delete(entityId);
        continue;
      }
      holdFrozenEntity(frozen, now);
    } catch (error) {
      frozenEntities.delete(entityId);
      console.warn(`Creepy Horse Eye freeze failed for ${entityId}: ${error}`);
    }
  }

  for (let index = freezeZones.length - 1; index >= 0; index -= 1) {
    const zone = freezeZones[index];
    if (now >= zone.untilTick) {
      freezeZones.splice(index, 1);
      continue;
    }
    if (now % FREEZE_PARTICLE_INTERVAL_TICKS !== 0) continue;

    try {
      spawnFreezeParticles(zone);
    } catch (error) {
      freezeZones.splice(index, 1);
      console.warn(`Creepy Horse Eye particles failed: ${error}`);
    }
  }
}

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("bellity:random_drop_on_hit", {
    onHitEntity: dropRandomItem,
  });
  itemComponentRegistry.registerCustomComponent("bellity:double_knockback_on_hit", {
    onHitEntity: applyDoubleKnockback,
  });
  itemComponentRegistry.registerCustomComponent("bellity:throw_light", {
    onUse: throwLight,
  });
  itemComponentRegistry.registerCustomComponent("bellity:freeze_nearby_enemies", {
    onUse: freezeNearbyEnemies,
  });
});

system.runInterval(updateCreepyHorseEyeEffects, 1);
system.runInterval(updateConnectableTrains, 1);

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
  if (event.target.typeId !== CONNECTABLE_TRAIN_CART_ID || event.itemStack?.typeId !== "minecraft:chain") return;
  event.cancel = true;
  const player = event.player;
  const target = event.target;
  system.run(() => {
    try {
      handleTrainCartInteraction(player, target);
    } catch (error) {
      console.warn(`Connectable Train Cart interaction failed: ${error}`);
    }
  });
});

world.afterEvents.entityDie.subscribe((event) => {
  let deadId;
  try {
    deadId = event.deadEntity.id;
  } catch {
    return;
  }
  const cachedState = trainCartStates.get(deadId);
  if (cachedState) {
    handleTrainCartDeath(event.deadEntity, cachedState);
    return;
  }
  try {
    if (event.deadEntity.typeId === CONNECTABLE_TRAIN_CART_ID) handleTrainCartDeath(event.deadEntity);
  } catch {
    // An untracked entity that is already invalid cannot belong to a managed train.
  }
});

world.afterEvents.projectileHitEntity.subscribe((event) => {
  try {
    if (!lightProjectiles.delete(event.projectile.id)) return;
    const target = event.getEntityHit()?.entity;
    if (!target) return;
    target.applyDamage(10);
    target.setOnFire(5);
  } catch (error) {
    console.warn(`Bellity light impact failed: ${error}`);
  }
});

world.afterEvents.projectileHitBlock.subscribe((event) => {
  lightProjectiles.delete(event.projectile.id);
});
