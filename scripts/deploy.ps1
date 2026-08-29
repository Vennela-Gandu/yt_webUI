# Build, verify and (optionally) upload the frontend.
#
#   npm run deploy:check   -> build + verify + local smoke test, uploads NOTHING
#   npm run deploy         -> the same, then upload
#
# Uploading is deliberately opt-in: running this script by accident cannot touch
# the live site.
#
# Why the verify step exists: browser/ and server/ must come from the SAME build.
# The SSR bundle renders HTML referencing hashed client filenames, so deploying
# one folder without the other leaves the browser hydrating new markup with old
# JavaScript - the page renders, then goes blank. That happened once; this script
# refuses to upload a package where that could recur.

[CmdletBinding()]
param(
  # Actually upload. Without it the script stops after verification.
  [switch]$Push,
  # Skip the production build and use the existing dist/ (faster re-runs).
  [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$stage = Join-Path $root 'deploy-package'

function Say([string]$msg) { Write-Host "  $msg" }
function Step([string]$msg) { Write-Host ""; Write-Host "== $msg" -ForegroundColor Cyan }
function Fail([string]$msg) { Write-Host ""; Write-Host "FAILED: $msg" -ForegroundColor Red; exit 1 }

# ---------------------------------------------------------------- 1. build
if ($SkipBuild) {
  Step "Build skipped (-SkipBuild); using the existing dist/"
} else {
  Step "Building (production)"
  # A stale dev build in dist/ has unhashed filenames and would ship the wrong
  # thing, so start clean.
  if (Test-Path 'dist') { Remove-Item 'dist' -Recurse -Force }
  & npx ng build
  if ($LASTEXITCODE -ne 0) { Fail "ng build returned $LASTEXITCODE" }
  & node 'scripts/copy-dist-package.js'
}

if (-not (Test-Path 'dist/Frontend/browser')) { Fail 'dist/Frontend/browser is missing' }
if (-not (Test-Path 'dist/Frontend/server'))  { Fail 'dist/Frontend/server is missing' }

# ---------------------------------------------------------------- 2. stage
Step "Staging deploy-package/"
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory $stage | Out-Null
Copy-Item 'dist/Frontend/browser' (Join-Path $stage 'browser') -Recurse
Copy-Item 'dist/Frontend/server'  (Join-Path $stage 'server')  -Recurse
if (Test-Path 'plesk-web.config') { Copy-Item 'plesk-web.config' (Join-Path $stage 'web.config') }
if (Test-Path 'dist/package.json') { Copy-Item 'dist/package.json' (Join-Path $stage 'package.json') }
Say ("files: " + (Get-ChildItem $stage -Recurse -File).Count)

# ------------------------------------------------- 3. the matched-pair gate
Step "Verifying browser/ and server/ are from one build"
$csr = Join-Path $stage 'browser/index.csr.html'
if (-not (Test-Path $csr)) { Fail 'browser/index.csr.html is missing' }

$html = Get-Content $csr -Raw
$refs = [regex]::Matches($html, '(?:main|polyfills|styles|chunk)-[A-Z0-9]+\.(?:js|css)') |
        ForEach-Object { $_.Value } | Sort-Object -Unique
if ($refs.Count -eq 0) { Fail 'no hashed bundle references found in index.csr.html' }

foreach ($r in $refs) {
  if (Test-Path (Join-Path $stage "browser/$r")) {
    Say "ok      $r"
  } else {
    Fail "index.csr.html references $r but that file is not in browser/ - do not deploy this."
  }
}
if (-not (Test-Path (Join-Path $stage 'server/server.mjs'))) { Fail 'server/server.mjs is missing' }
Say 'ok      server/server.mjs'

# --------------------------------------------------- 4. local smoke test
Step "Smoke testing the staged package"
$port = 3187
# Start-Process has no -Environment on PowerShell 5.1, so the SSR server reads
# these from the session instead.
$env:PORT = "$port"
$env:BROWSER_DIST = 'browser'
$env:SERVER_DIST = 'server'
$proc = Start-Process -FilePath 'node' -ArgumentList 'server/server.mjs' -WorkingDirectory $stage -PassThru -WindowStyle Hidden

try {
  $up = $false
  foreach ($i in 1..30) {
    Start-Sleep -Milliseconds 700
    try {
      Invoke-WebRequest "http://localhost:$port/" -TimeoutSec 5 -UseBasicParsing | Out-Null
      $up = $true; break
    } catch { }
  }
  if (-not $up) { Fail 'the staged SSR server did not start' }

  $bad = 0
  foreach ($path in @('/', '/blog', '/equipment', '/author', '/admin/login')) {
    try {
      $r = Invoke-WebRequest "http://localhost:$port$path" -TimeoutSec 40 -UseBasicParsing
      Say ("{0,-16} {1}" -f $path, $r.StatusCode)
      if ($r.StatusCode -ne 200) { $bad++ }
    } catch {
      Say ("{0,-16} FAILED" -f $path); $bad++
    }
  }
  # Content, not just a 200: these pages are empty if the API/DB is unreachable.
  foreach ($check in @(@{ p = '/blog'; needle = 'post-title' }, @{ p = '/equipment'; needle = 'equipment-title' })) {
    $body = (Invoke-WebRequest "http://localhost:$port$($check.p)" -TimeoutSec 40 -UseBasicParsing).Content
    $n = ([regex]::Matches($body, [regex]::Escape($check.needle))).Count
    Say ("{0,-16} {1} x {2}" -f $check.p, $n, $check.needle)
    if ($n -eq 0) { Write-Host "  WARNING: $($check.p) rendered no items - the API may be unreachable from here." -ForegroundColor Yellow }
  }
  if ($bad -gt 0) { Fail "$bad route(s) did not return 200" }
}
finally {
  if ($proc -and -not $proc.HasExited) { Stop-Process -Id $proc.Id -Force }
  Remove-Item Env:PORT, Env:BROWSER_DIST, Env:SERVER_DIST -ErrorAction SilentlyContinue
}

# ---------------------------------------------------------------- 5. upload
if (-not $Push) {
  Step "Verified. Nothing uploaded (pass -Push to deploy)"
  Say "package ready: $stage"
  exit 0
}

$cfgPath = Join-Path $root 'deploy.config.json'
if (-not (Test-Path $cfgPath)) {
  Fail "deploy.config.json not found. Copy deploy.config.example.json to deploy.config.json and fill it in."
}
$cfg = Get-Content $cfgPath -Raw | ConvertFrom-Json

foreach ($k in @('protocol', 'host', 'user', 'remoteBrowserPath', 'remoteServerPath')) {
  if (-not $cfg.$k) { Fail "deploy.config.json is missing '$k'" }
}

Step "Uploading to $($cfg.user)@$($cfg.host) over $($cfg.protocol)"
Say "browser -> $($cfg.remoteBrowserPath)"
Say "server  -> $($cfg.remoteServerPath)"

$winscp = @(
  "${env:ProgramFiles(x86)}\WinSCP\WinSCP.com",
  "$env:ProgramFiles\WinSCP\WinSCP.com"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($winscp) {
  # WinSCP syncs a whole tree in one session and can clear files the build no
  # longer produces - which is how stale main-*.js hashes get removed.
  $open = "open $($cfg.protocol)://$([uri]::EscapeDataString($cfg.user))"
  if ($cfg.password) { $open += ":$([uri]::EscapeDataString($cfg.password))" }
  $open += "@$($cfg.host)"
  if ($cfg.port) { $open += ":$($cfg.port)" }
  if ($cfg.privateKeyPath) { $open += " -privatekey=`"$($cfg.privateKeyPath)`"" }
  if ($cfg.hostKeyFingerprint) { $open += " -hostkey=`"$($cfg.hostKeyFingerprint)`"" }
  elseif ($cfg.protocol -eq 'sftp') { $open += ' -hostkey=*' }

  $mode = 'synchronize remote'
  if (-not $cfg.removeStale) { $mode += ' -nodelete' }

  $script = @()
  $script += 'option batch abort'
  $script += 'option confirm off'
  $script += $open
  # Client bundle first: the new JS must exist before the new SSR references it.
  $script += "$mode `"$stage\browser`" `"$($cfg.remoteBrowserPath)`""
  $script += "$mode `"$stage\server`" `"$($cfg.remoteServerPath)`""
  if ($cfg.remoteWebConfigPath) {
    $script += "put `"$stage\web.config`" `"$($cfg.remoteWebConfigPath)`""
  }
  $script += 'exit'

  $tmp = Join-Path $env:TEMP "ytc-deploy-$PID.txt"
  $script | Set-Content $tmp -Encoding utf8
  try {
    & $winscp /ini=nul /script="$tmp"
    if ($LASTEXITCODE -ne 0) { Fail "WinSCP exited with $LASTEXITCODE" }
  } finally {
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  }
} else {
  # No WinSCP: fall back to curl, one file at a time. Slower, and it cannot
  # remove stale remote files.
  Say 'WinSCP not found - falling back to curl (per-file upload)'
  $base = "$($cfg.protocol)://$($cfg.host)"
  if ($cfg.port) { $base += ":$($cfg.port)" }

  foreach ($pair in @(@{ local = 'browser'; remote = $cfg.remoteBrowserPath }, @{ local = 'server'; remote = $cfg.remoteServerPath })) {
    $localRoot = Join-Path $stage $pair.local
    Get-ChildItem $localRoot -Recurse -File | ForEach-Object {
      $rel = $_.FullName.Substring($localRoot.Length).TrimStart('\').Replace('\', '/')
      $url = "$base$($pair.remote)/$rel"
      & curl.exe --silent --show-error --fail --ftp-create-dirs -u "$($cfg.user):$($cfg.password)" --upload-file $_.FullName $url
      if ($LASTEXITCODE -ne 0) { Fail "upload failed: $rel" }
    }
    Say "uploaded $($pair.local)/"
  }
  if ($cfg.remoteWebConfigPath) {
    & curl.exe --silent --show-error --fail -u "$($cfg.user):$($cfg.password)" --upload-file (Join-Path $stage 'web.config') "$base$($cfg.remoteWebConfigPath)"
    if ($LASTEXITCODE -ne 0) { Fail 'upload failed: web.config' }
    Say 'uploaded web.config'
  }
}

Step 'Uploaded'
Say 'Restart the Node app (Plesk: Node.js -> Restart App) so the new SSR bundle loads.'
if (-not $cfg.removeStale) {
  Say 'Stale files were left in place ("removeStale": false). Old main-*.js may still be on the server.'
}
