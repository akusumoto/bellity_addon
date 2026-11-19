import { EquipmentSlot } from "@minecraft/server";

// Stable Script API 2.0 does not expose the native knockback-resistance
// attribute. Use explicit vanilla values rather than guessing from velocity.
// Verified from Mojang's bedrock-samples/main behavior_pack/entities/*.json:
// https://github.com/Mojang/bedrock-samples/tree/main/behavior_pack/entities
// Values are compatibility data, not runtime attribute introspection. Another
// pack can override vanilla definitions, and custom mob/state resistance is
// not generally readable through this API.
const VANILLA_RESISTANCE = Object.freeze({
  "minecraft:armor_stand": 1,
  "minecraft:ender_dragon": 1, // Native JSON value 100 is full immunity.
  "minecraft:iron_golem": 1,
  "minecraft:warden": 1,
  "minecraft:ravager": 0.75,
  "minecraft:hoglin": 0.6,
  "minecraft:zoglin": 0.6,
});

const ARMOR = [
  [EquipmentSlot.Head, "minecraft:netherite_helmet"],
  [EquipmentSlot.Chest, "minecraft:netherite_chestplate"],
  [EquipmentSlot.Legs, "minecraft:netherite_leggings"],
  [EquipmentSlot.Feet, "minecraft:netherite_boots"],
];

// Netherite armor contributes resistance to equipped living entities, not just
// players. Its presence is read at each hit so swapping gear takes effect.
// https://www.minecraft.net/en-us/article/taking-inventory--chestplate
// Native armor/equipment interaction still requires device verification.
export function getKnockbackScale(target) {
  let resistance = VANILLA_RESISTANCE[target.typeId] ?? 0;
  if (resistance >= 1) return 0;
  const equipment = target.getComponent("minecraft:equippable");
  if (equipment) {
    for (const [slot, expectedId] of ARMOR) {
      if (equipment.getEquipment(slot)?.typeId === expectedId) resistance += 0.1;
    }
  }
  return Math.max(0, 1 - resistance);
}
