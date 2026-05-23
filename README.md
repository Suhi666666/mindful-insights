# 📚 Mindful Insights — 理论学习追踪器

> 专为大学生设计的跨学科理论学习与进度追踪平台
> A cross-disciplinary theory learning & progress tracking platform for university students

![Status](https://img.shields.io/badge/状态-开发中-yellow)
![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red)
![Language](https://img.shields.io/badge/语言-中英双语-blue)
![Built with](https://img.shields.io/badge/Built%20with-Lovable-purple)

---

## 🌟 项目简介 | About

**中文：**
Mindful Insights 是一个专为大学本科及以上学生设计的理论学习工具。
区别于传统的单学科学习平台，本项目整合了心理学、社会学、经济学、
哲学、教育学、管理学、传播学等多个学科的 500+ 核心理论，
提供教科书级别的学术解释，并配备累积进度追踪系统，
帮助学生系统性地建立跨学科理论知识体系。

**English：**
Mindful Insights is a theory learning tool designed for undergraduate 
and postgraduate students. Unlike single-discipline platforms, it integrates 
500+ core theories across psychology, sociology, economics, philosophy, 
education, management, communication studies and more — with textbook-level 
academic explanations and a cumulative progress tracking system.

---

## ✨ 功能特色 | Features

### 📖 核心功能
- **500+ 跨学科理论库** — 覆盖9大学科领域
- **累积进度追踪** — 可视化学习进度，数据本地保存
- **教科书级别解释** — 包含理论背景、核心机制、批判视角
- **中英双语术语对照** — 原文术语 + 中文解释
- **理论分类筛选** — 按学科、年代、关键词快速检索

### 🎓 内容深度
- 每个理论包含：提出者 + 年代 + 核心命题 + 关键概念 + 批判与局限 + 当代应用
- 语言风格：学术严谨但不晦涩，适合大学生阅读
- 批判性视角：不只介绍理论，同时呈现学界争议

### 📱 使用体验
- 响应式设计，手机/平板/电脑均可使用
- 深色/浅色模式切换
- 学习进度自动保存（localStorage）

---

## 🗂️ 理论覆盖范围 | Theory Coverage

| 学科领域 | 理论数量 | 代表理论 |
|---------|---------|---------|
| 🧠 心理学 | ~100 | 认知发展理论、依恋理论、认知失调理论 |
| 👥 社会学 | ~100 | 冲突理论、符号互动主义、功能主义 |
| 💰 经济学 | ~100 | 行为经济学、前景理论、比较优势理论 |
| 📚 教育学 | ~50  | 建构主义、多元智能理论、情境学习理论 |
| 🏛️ 哲学  | ~50  | 功利主义、存在主义、批判理论 |
| 🏢 管理学 | ~50  | 变革型领导理论、资源基础观、动态能力理论 |
| 📡 传播学 | ~50  | 议程设置理论、培养理论、框架理论 |
| 🔬 自然科学 | ~50 | 进化论、量子力学、混沌理论 |
| 🌐 跨学科 | ~55  | 批判种族理论、监控资本主义理论、行动者网络理论 |
| **总计** | **505+** | |

---

## 🛠️ 技术栈 | Tech Stack

```
前端框架：   React + TypeScript
样式：       Tailwind CSS
构建工具：   Vite + Bun
路由：       TanStack Router
数据存储：   localStorage（本地进度保存）
开发平台：   Lovable.dev
部署：       Cloudflare Workers
```

---

## 🚀 本地运行 | Local Development

```bash
# 克隆仓库
git clone https://github.com/Suhi666666/mindful-insights.git

# 进入项目目录
cd mindful-insights

# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 打开浏览器访问
http://localhost:3000
```

---

## 📄 页面结构 | Pages

```
/                 → 主页 + 累积进度追踪器
/theories         → 500+ 理论列表（分类浏览 + 搜索）
/theory/:id       → 单个理论详细解释页
```

---

## 🗺️ 开发路线图 | Roadmap

- [x] 基础页面框架
- [x] 进度追踪功能
- [x] 理论详情页
- [ ] 500+ 理论内容完善
- [ ] 搜索与筛选功能
- [ ] 理论关联图谱
- [ ] 理论时间轴（按年代）
- [ ] 数据云端同步
- [ ] PWA 支持（添加到主屏幕）
- [ ] iOS / Android App

---

## 👤 关于作者 | About

**Suhi** — 大学生，产品独立开发者
- 用 Lovable.dev 构建
- 如有建议或合作意向，欢迎联系

---

## ⚖️ 版权声明 | License

```
© 2026 Suhi. All Rights Reserved.

本项目代码与内容均受版权保护。
未经授权，不得复制、修改或用于商业用途。

All content and code in this repository are protected by copyright.
Unauthorized copying, modification, or commercial use is prohibited.
```

---

## 🌐 在线预览 | Live Demo

🔗 [点击查看 / View Live]https://id-preview-14a27186--3ae1aeae-f9cb-4b78-aa99-8f18d7f36d2f.lovable.app/

---

*Built with ❤️ using Lovable.dev*
