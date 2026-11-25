#requires -Version 5.1
[CmdletBinding()]
param(
    [string]$VaultPath = (Join-Path $PSScriptRoot '..'),
    [ValidateRange(1, 10)][int]$Samples = 3
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath $VaultPath).ProviderPath
if (-not (Test-Path -LiteralPath (Join-Path $root '.obsidian/community-plugins.json') -PathType Leaf)) {
    throw 'Obsidian Vault not found.'
}
$gitRoot = & git -C $root rev-parse --show-toplevel
if ($LASTEXITCODE -ne 0 -or -not $gitRoot) { throw 'Git repository not found.' }
if (-not [IO.Path]::GetFullPath($root).TrimEnd([char[]]@('\','/')).Equals([IO.Path]::GetFullPath($gitRoot).TrimEnd([char[]]@('\','/')), [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Vault and Git root differ.'
}
$ids = @(Get-Content -LiteralPath (Join-Path $root '.obsidian/community-plugins.json') -Raw | ConvertFrom-Json)
Write-Host "Enabled community plugins: $($ids.Count)"
$plugins = foreach ($id in $ids) {
    if ($id -notmatch '^[a-zA-Z0-9_-]+$') { continue }
    $dir = Join-Path $root ('.obsidian/plugins/' + $id)
    $main = Join-Path $dir 'main.js'
    if (Test-Path -LiteralPath $main -PathType Leaf) {
        [pscustomobject]@{ Plugin = $id; BundleKB = [math]::Round((Get-Item -LiteralPath $main).Length / 1KB, 1) }
    }
}
$plugins | Sort-Object BundleKB -Descending | Format-Table -AutoSize
Write-Host 'Git status timings (local, no remote requests):'
$times = @()
$previous = $env:GIT_OPTIONAL_LOCKS
try {
    $env:GIT_OPTIONAL_LOCKS = '0'
    for ($i = 1; $i -le $Samples; $i++) {
        $watch = [Diagnostics.Stopwatch]::StartNew()
        $entries = @(& git -C $root status --porcelain=v1 --untracked-files=all)
        $exit = $LASTEXITCODE
        $watch.Stop()
        if ($exit -ne 0) { throw "Git status failed: $exit" }
        $ms = [math]::Round($watch.Elapsed.TotalMilliseconds, 1)
        $times += $ms
        Write-Host "Sample ${i}: ${ms} ms; changed entries: $($entries.Count)"
    }
} finally {
    $env:GIT_OPTIONAL_LOCKS = $previous
}
$sorted = @($times | Sort-Object)
$middle = [int][math]::Floor($sorted.Count / 2)
$median = if ($sorted.Count % 2) { $sorted[$middle] } else { ($sorted[$middle-1] + $sorted[$middle]) / 2 }
Write-Host "Median Git status: $median ms"
Write-Host 'Bundle size is not plugin startup time. Use Obsidian Settings > General > Advanced > Startup time for actual startup timings.'
