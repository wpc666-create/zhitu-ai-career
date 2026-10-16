$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules/vite/bin/vite.js'))) {
    Write-Host '请先在项目目录运行 npm ci 安装依赖。'
    exit 1
}
Write-Host '智途 AI 预览正在启动；按 Ctrl+C 停止。'
& node (Join-Path $PSScriptRoot 'node_modules/vite/bin/vite.js') --host 127.0.0.1 --port 5173
