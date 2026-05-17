# 🧠 AI/计算机面试刷题

一个开箱即用的面试刷题平台，包含 **5400+ 道精选题目**，覆盖 AI、算法、网络、操作系统、数据库、Python 等热门技术领域。

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)

## ✨ 功能特性

- 📚 **5400+ 题目** - 10大分类，94.7%选择题，含记忆口诀
- 🎯 **智能刷题** - 随机刷题、分类刷题、错题重练
- ⭐ **收藏管理** - 重点题目收藏，随时复习
- 📊 **学习统计** - 掌握度雷达图、学习趋势、每日打卡
- 🔄 **间隔重复** - SM-2算法智能复习推荐
- 🌙 **主题切换** - 暗色/亮色模式自由切换
- ⌨️ **键盘快捷键** - 高效答题体验
- 💾 **本地存储** - 数据安全存储在本地，无需联网

## 🚀 一键启动

### 方式一：双击启动脚本

| 系统 | 操作 |
|------|------|
| **Windows** | 双击 `start.bat` |
| **macOS/Linux** | 终端运行 `./start.sh` |

### 方式二：命令行启动

```bash
# 1. 安装依赖（首次运行）
npm install

# 2. 启动开发服务器
npm run dev

# 3. 浏览器访问
# http://localhost:5173
```

## 📖 题库分类

| 分类 | 题数 | 内容 |
|------|------|------|
| 🤖 AI基础 | 520 | 遗传算法、RLHF、多模态AI、知识图谱、图神经网络 |
| 📊 机器学习 | 620 | K-Means、逻辑回归、PCA、决策树、随机森林、SVM |
| 🧠 深度学习 | 620 | CNN、ResNet、BatchNorm、Dropout、优化器、激活函数 |
| 💬 NLP | 520 | 文本摘要、机器翻译、BERT、Word2Vec、注意力机制 |
| 👁️ 计算机视觉 | 520 | 图像分类、目标检测、语义分割、图像增强 |
| 🔢 算法与数据结构 | 720 | 二分查找、排序、动态规划、BFS/DFS、哈希表、树 |
| 🌐 计算机网络 | 520 | TCP/IP、HTTP/HTTPS、DNS、UDP、NAT |
| 💻 操作系统 | 420 | 进程线程、死锁、虚拟内存、LRU、信号量 |
| 🗄️ 数据库 | 420 | SQL、索引、事务ACID、范式、Redis |
| 🐍 Python编程 | 520 | GIL、装饰器、生成器、闭包、异常处理 |

## ⌨️ 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `1` `2` `3` `4` | 选择对应选项 |
| `Enter` | 下一题 |
| `B` | 收藏/取消收藏 |
| `Esc` | 返回上一页 |

## 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite 8
- **状态管理**: Pinia
- **样式**: Tailwind CSS 4
- **图表**: ECharts
- **测试**: Vitest

## 📦 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

构建产物位于 `dist/` 目录，可直接部署到任何静态托管服务：
- Vercel
- Netlify
- GitHub Pages
- Nginx

## 📄 数据导入导出

在「统计」页面可以：
- 📤 **导出数据** - 导出学习记录和收藏
- 📥 **导入数据** - 恢复之前的学习进度

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📜 许可证

MIT License
