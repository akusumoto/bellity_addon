$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $projectRoot

node --check behavior_pack/scripts/main.js
if ($LASTEXITCODE -ne 0) { throw 'Script syntax check failed.' }
node tools/validate.mjs
if ($LASTEXITCODE -ne 0) { throw 'Pack validation failed.' }

$dist = Join-Path $projectRoot 'dist'
New-Item -ItemType Directory -Path $dist -Force | Out-Null
$zip = Join-Path $dist 'bellity_addon.zip'
$addon = Join-Path $dist 'bellity_addon.mcaddon'
Remove-Item -LiteralPath $zip, $addon -Force -ErrorAction SilentlyContinue
Compress-Archive -LiteralPath (Join-Path $projectRoot 'behavior_pack'), (Join-Path $projectRoot 'resource_pack') -DestinationPath $zip
Move-Item -LiteralPath $zip -Destination $addon
Write-Host "Created $addon"
