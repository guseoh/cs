#requires -Version 5.1
<#
.SYNOPSIS
    Create a full, timestamped ZIP backup of an Obsidian Vault outside the Vault.
.DESCRIPTION
    Includes hidden folders such as .obsidian and .git. Does not alter the source
    Vault or any Git branch. Closes/removes incomplete archives on failure.
    Close Obsidian before running to avoid files changing mid-backup.
.EXAMPLE
    .\scripts\Backup-ObsidianVault.ps1 -DestinationDirectory (Join-Path $env:USERPROFILE 'ObsidianVaultBackups')
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$DestinationDirectory,

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$VaultPath = (Join-Path $PSScriptRoot '..')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$source = (Resolve-Path -LiteralPath $VaultPath).ProviderPath
if (-not (Test-Path -LiteralPath (Join-Path $source '.obsidian') -PathType Container)) {
    throw "Vault directory does not contain .obsidian: $source"
}
$appConfigPath = Join-Path (Join-Path $source '.obsidian') 'app.json'
if (-not (Test-Path -LiteralPath $appConfigPath -PathType Leaf)) {
    throw "Vault is missing its .obsidian/app.json configuration file: $appConfigPath"
}

$destination = [System.IO.Path]::GetFullPath($DestinationDirectory)
$trimCharacters = [char[]]@('\', '/')
$sourceCompare = $source.TrimEnd($trimCharacters)
$destinationCompare = $destination.TrimEnd($trimCharacters)
if ($destinationCompare.Equals($sourceCompare, [System.StringComparison]::OrdinalIgnoreCase) -or
    $destinationCompare.StartsWith($sourceCompare + [System.IO.Path]::DirectorySeparatorChar,
                                   [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'Destination must be outside the Vault to avoid recursive backups and Git tracking.'
}

if (-not (Test-Path -LiteralPath $destination -PathType Container)) {
    New-Item -ItemType Directory -Path $destination -Force | Out-Null
}

$vaultName = Split-Path -Path $source -Leaf
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmssfff'
$archivePath = Join-Path $destination ("{0}-{1}.zip" -f $vaultName, $timestamp)
$checksumPath = $archivePath + '.sha256'
if ((Test-Path -LiteralPath $archivePath) -or (Test-Path -LiteralPath $checksumPath)) {
    throw "Archive already exists: $archivePath"
}

try {
    # Compress-Archive in Windows PowerShell can skip hidden files; ZipFile does not.
    $expectedFiles = @(Get-ChildItem -LiteralPath $source -File -Recurse -Force).Count
    if ($expectedFiles -eq 0) { throw 'Vault is empty; refusing to create an empty backup.' }

    [System.IO.Compression.ZipFile]::CreateFromDirectory(
        $source, $archivePath,
        [System.IO.Compression.CompressionLevel]::Optimal,
        $true
    )

    $zip = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
    try {
        $filesInArchive = @($zip.Entries | Where-Object { $_.Name -ne '' }).Count
        # Windows/.NET Framework may put backslashes in ZIP entry names.
        # Normalize separators before checking the path, including the Vault root folder.
        $appConfigFound = @(
            $zip.Entries | Where-Object {
                $normalized = $_.FullName.Replace([char]92, [char]47).TrimStart([char]47)
                $normalized.Equals('.obsidian/app.json',
                                   [System.StringComparison]::OrdinalIgnoreCase) -or
                $normalized.EndsWith('/.obsidian/app.json',
                                     [System.StringComparison]::OrdinalIgnoreCase)
            }
        ).Count -gt 0
        $appConfigCandidates = @(
            $zip.Entries | Where-Object {
                $_.FullName -match 'app[.]json
    }
    finally {
        $zip.Dispose()
    }

    if ($filesInArchive -ne $expectedFiles) {
        throw "Archive file count mismatch: source=$expectedFiles, ZIP=$filesInArchive"
    }
    if (-not $appConfigFound) {
        $examples = if ($appConfigCandidates.Count -gt 0) {
            $appConfigCandidates -join '; '
        } else {
            'no app.json entries found'
        }
        throw "Backup validation failed: .obsidian/app.json was not found in ZIP. Matching candidates: $examples"
    }

    $hash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash
    $checksumContent = "{0}  {1}" -f $hash, [System.IO.Path]::GetFileName($archivePath)
    [System.IO.File]::WriteAllText($checksumPath, $checksumContent + [Environment]::NewLine,
                                  (New-Object System.Text.UTF8Encoding($false)))

    Write-Output "Backup: $archivePath"
    Write-Output "SHA256: $hash"
    Write-Output "Files: $filesInArchive"
    Write-Output "Checksum file: $checksumPath"
    Write-Output 'Copy this backup to a separate drive or storage location for independent protection.'
}
catch {
    if (Test-Path -LiteralPath $archivePath) {
        Remove-Item -LiteralPath $archivePath -Force
    }
    if (Test-Path -LiteralPath $checksumPath) {
        Remove-Item -LiteralPath $checksumPath -Force
    }
    throw
}

            } | Select-Object -First 5 -ExpandProperty FullName
        )
    }
    finally {
        $zip.Dispose()
    }

    if ($filesInArchive -ne $expectedFiles) {
        throw "Archive file count mismatch: source=$expectedFiles, ZIP=$filesInArchive"
    }
    if (-not $appConfigFound) {
        throw 'Backup validation failed: .obsidian/app.json is missing.'
    }

    $hash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash
    $checksumContent = "{0}  {1}" -f $hash, [System.IO.Path]::GetFileName($archivePath)
    [System.IO.File]::WriteAllText($checksumPath, $checksumContent + [Environment]::NewLine,
                                  (New-Object System.Text.UTF8Encoding($false)))

    Write-Output "Backup: $archivePath"
    Write-Output "SHA256: $hash"
    Write-Output "Files: $filesInArchive"
    Write-Output "Checksum file: $checksumPath"
    Write-Output 'Copy this backup to a separate drive or storage location for independent protection.'
}
catch {
    if (Test-Path -LiteralPath $archivePath) {
        Remove-Item -LiteralPath $archivePath -Force
    }
    if (Test-Path -LiteralPath $checksumPath) {
        Remove-Item -LiteralPath $checksumPath -Force
    }
    throw
}
