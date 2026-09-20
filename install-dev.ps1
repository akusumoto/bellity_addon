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
if ((Test-Path -LiteralPath $bpTarget) -or (Test-Path -LiteralPath $rpTarget)) {
  throw 'Bellity development pack folders already exist. Remove or back them up before installing.'
}

Copy-Item -LiteralPath (Join-Path $projectRoot 'behavior_pack') -Destination $bpTarget -Recurse
Copy-Item -LiteralPath (Join-Path $projectRoot 'resource_pack') -Destination $rpTarget -Recurse
Write-Host "Installed $bpTarget"
Write-Host "Installed $rpTarget"
