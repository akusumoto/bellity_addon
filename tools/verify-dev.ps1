$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$comMojang = Join-Path $env:APPDATA 'Minecraft Bedrock\Users\Shared\games\com.mojang'

foreach ($pack in @(
  @('behavior_pack', 'development_behavior_packs\Bellity_BP'),
  @('resource_pack', 'development_resource_packs\Bellity_RP')
)) {
  $source = Join-Path $projectRoot $pack[0]
  $target = Join-Path $comMojang $pack[1]
  $sourceFiles = @(Get-ChildItem -LiteralPath $source -File -Recurse)
  $targetFiles = @(Get-ChildItem -LiteralPath $target -File -Recurse)
  if ($sourceFiles.Count -ne $targetFiles.Count) {
    throw "File count differs for $target"
  }
  foreach ($file in $sourceFiles) {
    $relative = $file.FullName.Substring($source.Length + 1)
    $installedFile = Join-Path $target $relative
    if (!(Test-Path -LiteralPath $installedFile -PathType Leaf)) {
      throw "Missing installed file: $installedFile"
    }
    if ((Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash -ne
        (Get-FileHash -LiteralPath $installedFile -Algorithm SHA256).Hash) {
      throw "Installed file differs: $installedFile"
    }
  }
  Write-Host "Verified $($sourceFiles.Count) files in $target"
}
