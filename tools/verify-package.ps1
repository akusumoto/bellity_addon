$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$packagePath = Join-Path $projectRoot 'dist\bellity_addon.mcaddon'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($packagePath)
try {
  $expected = @{}
  foreach ($packName in @('behavior_pack', 'resource_pack')) {
    $packRoot = Join-Path $projectRoot $packName
    foreach ($file in Get-ChildItem -LiteralPath $packRoot -File -Recurse) {
      $relative = $file.FullName.Substring($packRoot.Length + 1).Replace('\', '/')
      $expected["$packName/$relative"] = $file.FullName
    }
  }
  if ($archive.Entries.Count -ne $expected.Count) { throw 'Package file count differs from source.' }
  $seen = @{}
  foreach ($entry in $archive.Entries) {
    if ($entry.FullName.Contains('\')) { throw "Invalid ZIP path separator: $($entry.FullName)" }
    if (!$expected.ContainsKey($entry.FullName) -or $seen.ContainsKey($entry.FullName)) {
      throw "Unexpected or duplicate package entry: $($entry.FullName)"
    }
    $seen[$entry.FullName] = $true
    $stream = $entry.Open()
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
      $actualHash = [BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-', '')
    } finally {
      $stream.Dispose()
      $sha.Dispose()
    }
    $sourceHash = (Get-FileHash -LiteralPath $expected[$entry.FullName] -Algorithm SHA256).Hash
    if ($actualHash -ne $sourceHash) { throw "Package entry differs from source: $($entry.FullName)" }
  }
  foreach ($packName in @('behavior_pack', 'resource_pack')) {
    $entry = $archive.GetEntry("$packName/manifest.json")
    $reader = [System.IO.StreamReader]::new($entry.Open())
    try { $manifest = $reader.ReadToEnd() | ConvertFrom-Json } finally { $reader.Dispose() }
    Write-Host "$packName version: $($manifest.header.version -join '.')"
  }
  Write-Host "Verified $($archive.Entries.Count) package files: forward-slash paths and SHA-256 match source."
} finally {
  $archive.Dispose()
}
