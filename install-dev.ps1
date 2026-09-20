param([switch]$Update)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$comMojang = Join-Path $env:APPDATA 'Minecraft Bedrock\Users\Shared\games\com.mojang'
$bpParent = Join-Path $comMojang 'development_behavior_packs'
$rpParent = Join-Path $comMojang 'development_resource_packs'
$bpTarget = Join-Path $bpParent 'Bellity_BP'
$rpTarget = Join-Path $rpParent 'Bellity_RP'

if (!(Test-Path -LiteralPath $bpParent -PathType Container) -or !(Test-Path -LiteralPath $rpParent -PathType Container)) {
  throw 'Minecraft Bedrock development pack folders were not found.'
}
if ($Update) {
  foreach ($pack in @(@($bpTarget, (Join-Path $projectRoot 'behavior_pack')), @($rpTarget, (Join-Path $projectRoot 'resource_pack')))) {
    $target, $source = $pack
    if (!(Test-Path -LiteralPath $target -PathType Container)) {
      throw "Cannot update missing development pack: $target"
    }
    $installed = Get-Content -LiteralPath (Join-Path $target 'manifest.json') -Raw | ConvertFrom-Json
    $current = Get-Content -LiteralPath (Join-Path $source 'manifest.json') -Raw | ConvertFrom-Json
    if ($installed.header.uuid -ne $current.header.uuid) {
      throw "Development pack UUID does not match source: $target"
    }
  }

  Copy-Item -Path (Join-Path $projectRoot 'behavior_pack\*') -Destination $bpTarget -Recurse -Force
  Copy-Item -Path (Join-Path $projectRoot 'resource_pack\*') -Destination $rpTarget -Recurse -Force
  Write-Host "Updated $bpTarget"
  Write-Host "Updated $rpTarget"
  return
}

if ((Test-Path -LiteralPath $bpTarget) -or (Test-Path -LiteralPath $rpTarget)) {
  throw 'Bellity development pack folders already exist. Use -Update to refresh them.'
}

Copy-Item -LiteralPath (Join-Path $projectRoot 'behavior_pack') -Destination $bpTarget -Recurse
Copy-Item -LiteralPath (Join-Path $projectRoot 'resource_pack') -Destination $rpTarget -Recurse
Write-Host "Installed $bpTarget"
Write-Host "Installed $rpTarget"
