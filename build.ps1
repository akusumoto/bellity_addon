$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $projectRoot

foreach ($script in Get-ChildItem -LiteralPath (Join-Path $projectRoot 'behavior_pack\scripts') -Filter '*.js' -File) {
  node --check $script.FullName
  if ($LASTEXITCODE -ne 0) { throw "Script syntax check failed: $($script.Name)" }
}
node tools/validate.mjs
if ($LASTEXITCODE -ne 0) { throw 'Pack validation failed.' }

$dist = Join-Path $projectRoot 'dist'
New-Item -ItemType Directory -Path $dist -Force | Out-Null
$zip = Join-Path $dist 'bellity_addon.zip'
$addon = Join-Path $dist 'bellity_addon.mcaddon'
Remove-Item -LiteralPath $zip, $addon -Force -ErrorAction SilentlyContinue
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::Open($zip, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($packName in @('behavior_pack', 'resource_pack')) {
    $packRoot = Join-Path $projectRoot $packName
    foreach ($file in Get-ChildItem -LiteralPath $packRoot -File -Recurse) {
      $relative = $file.FullName.Substring($packRoot.Length + 1).Replace('\', '/')
      $entryName = "$packName/$relative"
      [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
        $archive, $file.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal
      ) | Out-Null
    }
  }
} finally {
  $archive.Dispose()
}
Move-Item -LiteralPath $zip -Destination $addon
& (Join-Path $projectRoot 'tools\verify-package.ps1')
Write-Host "Created $addon"
