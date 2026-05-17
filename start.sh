#!/bin/bash
# 一键启动脚本 - 面试刷题应用
# 使用方法: ./start.sh

set -e

echo "🧠 AI/计算机面试刷题 - 一键启动"
echo "================================"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js 18+"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本过低 (当前: $(node -v))，需要 18+"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install --legacy-peer-deps
fi

# 启动开发服务器
echo "🚀 启动开发服务器..."
echo ""
echo "================================"
echo "  浏览器访问: http://localhost:5173"
echo "  按 Ctrl+C 停止服务"
echo "================================"
echo ""

npm run dev
