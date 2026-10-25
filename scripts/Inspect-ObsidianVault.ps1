#requires -Version 5.1
<#
.SYNOPSIS
    Inspect local Obsidian Git sync state and optionally validate a local ZIP backup.
.DESCRIPTION
    Does not fetch, pull, push, reset, clean, or modify files in the Vault.
    When -RestoreTest is supplied, extracts a backup to a NEW temporary folder,
    not to the original Vault. The temporary folder is intentionally retained.
.EXAMPLE
    .\scripts\Inspect-ObsidianVault.ps1
.EXAMPLE
    .\scripts\Inspect-ObsidianVault.ps1 -BackupDirectory (Join-Path $env:USERPROFILE 'ObsidianVaultBackups')
.EXAMPLE
    .\scripts\Inspect-ObsidianVault.ps1 -BackupDirectory (Join-Path $env:USERPROFILE 'ObsidianVaultBackups') -RestoreTest
#>
[CmdletBinding()]
param(
    [string]$VaultPath = (Join-Path $PSScriptRoot '..'),
    [string]$BackupDirectory = '',
    [switch]$RestoreTest
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if ($RestoreTest -and [string]::IsNullOrWhiteSpace($BackupDirectory)) {
    throw '-RestoreTest requires -BackupDirectory. No restoration was started.'
}

$source = (Resolve-Path -LiteralPath $VaultPath).ProviderPath
if (-not (Test-Path -LiteralPath (Join-Path $source '.obsidian/app.json') -PathType Leaf)) {
    throw "Not an Obsidian Vault: $source"
}

$gitRoot = & git -C $source rev-parse --show-toplevel 2>$null
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($gitRoot)) {
    throw 'Git is unavailable or the Vault is not a Git working tree.'
}
$gitRootNormalized = [System.IO.Path]::GetFullPath($gitRoot).TrimEnd([char[]]@('\', '/'))
$sourceNormalized = [System.IO.Path]::GetFullPath($source).TrimEnd([char[]]@('\', '/'))
if (-not $gitRootNormalized.Equals($sourceNormalized, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'Vault path and Git repository root differ; refusing to inspect another repository.'
}

$branch = & git -C $source symbolic-ref --quiet --short HEAD 2>$null
if ($LASTEXITCODE -ne 0) { $branch = '(detached HEAD)' }
$localSha = & git -C $source rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw 'Unable to read local HEAD.' }
$changes = @(& git -C $source status --porcelain=v1 --untracked-files=all)
if ($LASTEXITCODE -ne 0) { throw 'Unable to read Git working-tree status.' }
$changeCount = @($changes | Where-Object { $_ -ne '' }).Count

Write-Output "Vault: $source"
Write-Output "Branch: $branch"
Write-Output "Local HEAD: $localSha"
Write-Output "Local changed/untracked entries: $changeCount"

# ls-remote reads the actual remote ref without updating local remote-tracking refs.
# Disable terminal prompts during this probe; never print credential-bearing remote URLs.
$hadPrompt = Test-Path Env:GIT_TERMINAL_PROMPT
$previousPrompt = $env:GIT_TERMINAL_PROMPT
$hadGcm = Test-Path Env:GCM_INTERACTIVE
$previousGcm = $env:GCM_INTERACTIVE
try {
    $env:GIT_TERMINAL_PROMPT = '0'
    $env:GCM_INTERACTIVE = 'never'
    $remoteLines = @(& git -C $source ls-remote --heads origin main 2>$null)
    $remoteCode = $LASTEXITCODE
}
finally {
    if ($hadPrompt) { $env:GIT_TERMINAL_PROMPT = $previousPrompt }
    else { Remove-Item Env:GIT_TERMINAL_PROMPT -ErrorAction SilentlyContinue }
    if ($hadGcm) { $env:GCM_INTERACTIVE = $previousGcm }
    else { Remove-Item Env:GCM_INTERACTIVE -ErrorAction SilentlyContinue }
}

$syncState = 'UNVERIFIED'
if ($remoteCode -ne 0 -or $remoteLines.Count -ne 1 -or
    $remoteLines[0] -notmatch '^([a-fA-F0-9]{40})\s+refs/heads/main$') {
    Write-Output 'Remote main: unavailable (offline, authentication, or remote missing)'
}
else {
    $remoteSha = $Matches[1]
    Write-Output "Remote main HEAD: $remoteSha"
    if ($branch -ne 'main') {
        $syncState = 'WRONG_BRANCH'
    }
    elseif ($localSha -eq $remoteSha) {
        $syncState = if ($changeCount -eq 0) { 'SYNCED_CLEAN' } else { 'LOCAL_CHANGES' }
    }
    else {
        # Only compute a real ahead/behind comparison when the remote object
        # is already available locally. Never fetch automatically.
        & git -C $source cat-file -e "$remoteSha^{commit}" 2>$null
        if ($LASTEXITCODE -eq 0) {
            $counts = & git -C $source rev-list --left-right --count "HEAD...$remoteSha"
            if ($LASTEXITCODE -ne 0 -or $counts -notmatch '^\s*(\d+)\s+(\d+)\s*$') {
                throw 'Could not calculate commit divergence.'
            }
            $localOnly = [int]$Matches[1]
            $remoteOnly = [int]$Matches[2]
            Write-Output "Local-only commits: $localOnly"
            Write-Output "Remote-only commits: $remoteOnly"
            if ($localOnly -gt 0 -and $remoteOnly -gt 0) { $syncState = 'DIVERGED' }
            elseif ($localOnly -gt 0) { $syncState = 'AHEAD' }
            else { $syncState = 'BEHIND' }
        }
        else {
            $syncState = 'REMOTE_COMMIT_NOT_LOCAL'
        }
    }
}

Write-Output "Sync assessment: $syncState"
if ($changeCount -gt 0 -or $syncState -ne 'SYNCED_CLEAN') {
    Write-Output 'Do not reset, clean, force-push, or automatically overwrite local notes.'
}
Write-Output 'This report checks ONLY this PC. Run it separately on the other PC.'

if ([string]::IsNullOrWhiteSpace($BackupDirectory)) {
    Write-Output 'Backup check: not requested (supply -BackupDirectory).'
    return
}

$backupPath = (Resolve-Path -LiteralPath $BackupDirectory).ProviderPath
$latestZip = Get-ChildItem -LiteralPath $backupPath -Filter '*.zip' -File |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($null -eq $latestZip) { throw 'No ZIP backup was found. No files were changed.' }

$shaPath = $latestZip.FullName + '.sha256'
if (-not (Test-Path -LiteralPath $shaPath -PathType Leaf)) {
    throw "Checksum file missing for backup: $($latestZip.Name)"
}
$checksumLine = Get-Content -LiteralPath $shaPath -TotalCount 1
if ($checksumLine -notmatch '^([a-fA-F0-9]{64})\s+') {
    throw 'Checksum file format invalid; refusing to restore.'
}
$expectedHash = $Matches[1]
$actualHash = (Get-FileHash -LiteralPath $latestZip.FullName -Algorithm SHA256).Hash
if (-not $expectedHash.Equals($actualHash, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'SHA256 mismatch. Do not restore from this archive.'
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($latestZip.FullName)
try {
    $entryNames = @($zip.Entries | Where-Object { $_.Name -ne '' } |
        ForEach-Object { $_.FullName.Replace([char]92, [char]47) })
    if ($entryNames.Count -eq 0) { throw 'Empty ZIP archive.' }
    foreach ($entry in $entryNames) {
        if ($entry.StartsWith('/') -or $entry -match '(^|/)\.\.(/|$)' -or
            $entry -match '^[a-zA-Z]:') {
            throw 'ZIP contains an unsafe path; refusing to restore.'
        }
    }
    $hasConfig = @($entryNames | Where-Object {
        $_ -eq '.obsidian/app.json' -or $_.EndsWith('/.obsidian/app.json')
    }).Count -gt 0
    $hasGit = @($entryNames | Where-Object {
        $_ -eq '.git/HEAD' -or $_.EndsWith('/.git/HEAD')
    }).Count -gt 0
    if (-not $hasConfig -or -not $hasGit) {
        throw 'Backup is missing .obsidian/app.json or .git/HEAD.'
    }
    $fileCount = $entryNames.Count
}
finally {
    $zip.Dispose()
}

Write-Output "Backup SHA256: PASS ($($latestZip.Name))"
Write-Output "Backup ZIP file entries: $fileCount"
Write-Output 'Backup essential entries: PASS (.obsidian/app.json, .git/HEAD)'

if (-not $RestoreTest) {
    Write-Output 'Restore test: not requested (supply -RestoreTest).'
    return
}

# Never extract into or overwrite the source Vault.
$restoreTo = Join-Path $env:TEMP ('obsidian-restore-test-' + [guid]::NewGuid().ToString('N'))
$restoreFull = [System.IO.Path]::GetFullPath($restoreTo)
if ($restoreFull.Equals($sourceNormalized, [System.StringComparison]::OrdinalIgnoreCase) -or
    $restoreFull.StartsWith($sourceNormalized + [System.IO.Path]::DirectorySeparatorChar,
                           [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'Restore destination must be outside the Vault.'
}
if (Test-Path -LiteralPath $restoreTo) { throw 'Restore destination already exists.' }

New-Item -ItemType Directory -Path $restoreTo | Out-Null
Expand-Archive -LiteralPath $latestZip.FullName -DestinationPath $restoreTo -ErrorAction Stop
$restoredFiles = @(Get-ChildItem -LiteralPath $restoreTo -File -Recurse -Force)
if ($restoredFiles.Count -ne $fileCount) {
    throw "Restored file count mismatch: ZIP=$fileCount restored=$($restoredFiles.Count)"
}
$restoredConfig = @($restoredFiles | Where-Object {
    $_.Name -eq 'app.json' -and $_.Directory.Name -eq '.obsidian'
})
$restoredHead = @($restoredFiles | Where-Object {
    $_.Name -eq 'HEAD' -and $_.Directory.Name -eq '.git'
})
if ($restoredConfig.Count -eq 0 -or $restoredHead.Count -eq 0) {
    throw 'Restored Vault is missing essential settings or Git metadata.'
}
Write-Output "Restore test: PASS (files=$($restoredFiles.Count))"
Write-Output "Restore path (retained): $restoreTo"
Write-Output 'Do NOT open the restored Vault in Obsidian until Obsidian Git is disabled in that COPY.'
