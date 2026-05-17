@echo off
chcp 65001 >nul
REM 一键启动脚本 - 面试刷题应用
REM 使用方法: 双击运行 start.bat

echo 🧠 AI/计算机面试刷题 - 一键启动
echo ================================

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Node.js，请先安装 Node.js 18+
    echo    下载地址: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1 delims=v" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%

REM 检查依赖
if not exist "node_modules" (
    echo 📦 首次运行，正在安装依赖...
    call npm install --legacy-peer-deps
)

REM 启动开发服务器
echo 🚀 启动开发服务器...
echo.
echo ================================
echo   浏览器访问: http://localhost:5173
echo   按 Ctrl+C 停止服务
echo ================================
echo.

call npm run dev
pause
