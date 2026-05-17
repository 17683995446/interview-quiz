<template>
  <div class="min-h-screen bg-slate-950 text-slate-200">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <router-link to="/" class="text-slate-400 hover:text-white transition" aria-label="返回首页">← 返回</router-link>
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-sm">🧠</div>
          <h1 class="text-lg font-bold">技术文档</h1>
        </div>
        <div class="flex gap-2 text-xs">
          <span class="px-2 py-1 rounded bg-slate-800 text-slate-400">v1.0.0</span>
          <span class="px-2 py-1 rounded bg-green-900/50 text-green-400">117 tests ✅</span>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="hidden md:block fixed left-0 top-[53px] bottom-0 w-60 bg-slate-900/50 border-r border-slate-800 overflow-y-auto">
        <div class="p-4">
          <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">文档导航</h3>
          <nav class="space-y-0.5">
            <a
              v-for="item in navItems"
              :key="item.id"
              :href="'#' + item.id"
              :class="[
                'block px-3 py-2 rounded-lg text-sm transition',
                activeSection === item.id
                  ? 'bg-blue-600/20 text-blue-400 font-medium border-l-2 border-blue-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              ]"
              @click.prevent="scrollTo(item.id)"
            >
              {{ item.icon }} {{ item.label }}
            </a>
          </nav>

          <div class="mt-8 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <h4 class="text-xs font-semibold text-slate-400 mb-2">项目信息</h4>
            <div class="space-y-1.5 text-xs text-slate-500">
              <div class="flex justify-between">
                <span>题目总数</span>
                <span class="text-slate-300 font-mono">4,500</span>
              </div>
              <div class="flex justify-between">
                <span>分类数</span>
                <span class="text-slate-300 font-mono">10</span>
              </div>
              <div class="flex justify-between">
                <span>测试用例</span>
                <span class="text-slate-300 font-mono">117</span>
              </div>
              <div class="flex justify-between">
                <span>Vue组件</span>
                <span class="text-slate-300 font-mono">14</span>
              </div>
              <div class="flex justify-between">
                <span>Pinia Store</span>
                <span class="text-slate-300 font-mono">4</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 md:ml-60 p-4 md:p-8 max-w-5xl">

        <!-- ===== 1. 项目概览 ===== -->
        <section id="overview" class="mb-16">
          <h2 class="text-2xl md:text-3xl font-bold mb-6">
            <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">📋 项目概览</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div v-for="card in overviewCards" :key="card.title"
              class="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition">
              <div class="text-3xl mb-2">{{ card.icon }}</div>
              <h3 class="font-semibold mb-1">{{ card.title }}</h3>
              <p class="text-sm text-slate-400 leading-relaxed">{{ card.desc }}</p>
            </div>
          </div>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
            <h3 class="font-semibold mb-3">📁 项目结构</h3>
            <pre class="text-xs md:text-sm text-slate-300 overflow-x-auto leading-relaxed"><code>interview-quiz/
├── src/
│   ├── app/                  # 应用入口层
│   │   ├── App.vue           # 根组件 (布局+导航+主题)
│   │   ├── main.ts           # 入口 (Pinia+Router+Error Handler)
│   │   └── router.ts         # 路由配置 + 守卫
│   ├── components/           # 组件层
│   │   ├── common/           #   通用: AppCard, StatCard, ProgressCard, Toast
│   │   ├── question/         #   题目: QuestionListItem, QuestionDetailModal
│   │   └── stats/            #   图表: RadarChart, TrendChart, DailyCheckIn
│   ├── composables/          # 组合式函数
│   │   ├── use-theme.ts      #   主题切换 (dark/light/system)
│   │   ├── use-quiz-timer.ts #   计时器
│   │   ├── use-keyboard-shortcuts.ts  # 键盘快捷键
│   │   └── use-toast-notification.ts  # Toast通知
│   ├── config/               # 配置: categories.ts (10大分类)
│   ├── data/                 # 数据层
│   │   ├── question-bank.ts  #   题库引擎 (QuestionEngine)
│   │   └── questions-generated.ts  # 4500题数据 (代码分割)
│   ├── services/             # 服务层
│   │   ├── local-storage.ts  #   localStorage封装
│   │   ├── error-handler.ts  #   全局错误处理 + safeStorage
│   │   └── spaced-repetition.ts  # SM-2间隔重复算法
│   ├── stores/               # 状态管理 (4个模块化Store)
│   │   ├── quiz-session.ts   #   会话编排 (向后兼容的门面)
│   │   ├── records.ts        #   答题记录 + 每日统计
│   │   ├── bookmarks.ts      #   收藏管理
│   │   └── spaced-repetition.ts  # 间隔重复
│   ├── types/index.ts        # TypeScript类型定义
│   ├── styles/global.css     # Tailwind + 设计令牌
│   └── views/                # 5个页面视图
├── docs/                     # 技术文档
├── public/                   # 静态资源 (PWA icons)
└── scripts/                  # 题目生成脚本 (Python)</code></pre>
          </div>
        </section>

        <!-- ===== 2. 系统架构 ===== -->
        <section id="architecture" class="mb-16">
          <h2 class="text-2xl md:text-3xl font-bold mb-6">
            <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">🏗️ 系统架构</span>
          </h2>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 mb-6">
            <h3 class="font-semibold mb-4">整体分层架构</h3>
            <div class="mermaid">
graph TB
    subgraph UI["🎨 展示层 Presentation"]
        direction LR
        V["Vue 3 SFC 组件"]
        R["Vue Router<br/>Hash路由"]
        T["Tailwind CSS 4<br/>原子化样式"]
    end

    subgraph LOGIC["⚙️ 业务逻辑层 Business Logic"]
        direction LR
        S1["useQuizStore<br/>会话编排"]
        S2["useRecordsStore<br/>答题记录"]
        S3["useBookmarksStore<br/>收藏管理"]
        S4["useSpacedRepetitionStore<br/>间隔重复"]
        C["Composables<br/>主题/计时器/快捷键"]
    end

    subgraph DATA["💾 数据层 Data"]
        direction LR
        QE["QuestionEngine<br/>题库查询引擎"]
        SM["SM-2 Algorithm<br/>间隔重复算法"]
        QD["4500 Questions<br/>题目数据"]
    end

    subgraph SVC["🔧 服务层 Services"]
        direction LR
        LS["LocalStorage<br/>持久化"]
        EH["Error Handler<br/>全局错误处理"]
        SS["Safe Storage<br/>容错包装"]
    end

    subgraph INFRA["📦 基础设施 Infrastructure"]
        direction LR
        VT["Vite 8<br/>构建工具"]
        PW["PWA<br/>离线支持"]
        TS["TypeScript 5.8<br/>类型系统"]
        VT2["Vitest<br/>测试框架"]
    end

    V --> S1
    S1 --> S2
    S1 --> S3
    S1 --> S4
    S2 --> QE
    S3 --> QE
    S4 --> SM
    QE --> QD
    S2 --> LS
    S3 --> LS
    S4 --> LS
    LS --> SS
    V -.-> EH
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
              <h3 class="font-semibold mb-3 text-blue-400">设计模式</h3>
              <ul class="space-y-2 text-sm text-slate-300">
                <li><span class="text-amber-400 font-mono text-xs">Facade</span> <strong>门面模式</strong> — QuizStore编排子Store，对外统一接口</li>
                <li><span class="text-amber-400 font-mono text-xs">Repository</span> <strong>仓储模式</strong> — QuestionEngine封装数据查询</li>
                <li><span class="text-amber-400 font-mono text-xs">Observer</span> <strong>观察者模式</strong> — Pinia响应式状态自动同步UI</li>
                <li><span class="text-amber-400 font-mono text-xs">Strategy</span> <strong>策略模式</strong> — Composables封装可复用逻辑</li>
                <li><span class="text-amber-400 font-mono text-xs">Singleton</span> <strong>单例模式</strong> — Pinia Store全局唯一实例</li>
              </ul>
            </div>
            <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
              <h3 class="font-semibold mb-3 text-purple-400">核心设计决策</h3>
              <ul class="space-y-2 text-sm text-slate-300">
                <li>✅ <strong>客户端优先</strong> — 零后端，localStorage持久化</li>
                <li>✅ <strong>代码分割</strong> — 路由懒加载 + ECharts异步 + 数据分包</li>
                <li>✅ <strong>领域驱动</strong> — Store按业务领域拆分(Records/Bookmarks/SR)</li>
                <li>✅ <strong>渐进增强</strong> — PWA离线、键盘快捷键、ARIA无障碍</li>
                <li>✅ <strong>类型安全</strong> — 14个组件全部启用TypeScript</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- ===== 3. 数据流图 ===== -->
        <section id="dataflow" class="mb-16">
          <h2 class="text-2xl md:text-3xl font-bold mb-6">
            <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">🌊 数据流图</span>
          </h2>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 mb-6">
            <h3 class="font-semibold mb-4">核心答题数据流</h3>
            <div class="mermaid">
flowchart LR
    U["👤 用户"] -->|选择答案| UI["QuizSessionPage"]
    UI -->|selectAnswer| AS["store.answerCurrent"]
    AS -->|委托| RS["RecordsStore.recordAnswer"]
    AS -->|委托| SR["SpacedRepetitionStore.recordReview"]

    RS -->|更新| R1["records<br/>答题记录"]
    RS -->|更新| R2["dailyRecords<br/>每日统计"]
    SR -->|计算| Q1["calculateQuality<br/>质量评分0-5"]
    Q1 --> NR["calculateNextReview<br/>计算下次复习"]
    NR -->|更新| R3["cards[]<br/>间隔重复卡片"]

    R1 -->|save| LS["localStorage"]
    R2 -->|save| LS
    R3 -->|save| LS
    LS -->|触发| RX["响应式更新"]
    RX -->|自动| VUE["UI刷新"]
            </div>
          </div>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 mb-6">
            <h3 class="font-semibold mb-4">SM-2 间隔重复算法流程</h3>
            <div class="mermaid">
flowchart TD
    START["答题完成"] --> QUAL{"calculateQuality<br/>根据正确性+响应时间"}

    QUAL -->|"❌ 回答错误"| Q0["quality = 0"]
    QUAL -->|"✅ &lt; 3秒"| Q5["quality = 5<br/>完美"]
    QUAL -->|"✅ &lt; 8秒"| Q4["quality = 4<br/>良好"]
    QUAL -->|"✅ &lt; 15秒"| Q3["quality = 3<br/>一般"]
    QUAL -->|"✅ ≥ 15秒"| Q2["quality = 2<br/>困难"]

    Q0 --> NEXT{"calculateNextReview"}
    Q5 --> NEXT
    Q4 --> NEXT
    Q3 --> NEXT
    Q2 --> NEXT

    NEXT -->|"quality &lt; 3<br/>回答失败"| FAIL["重置: repetitions=0<br/>interval=1天<br/>easeFactor=2.5"]
    NEXT -->|"quality ≥ 3<br/>回答成功"| SUCC{"repetitions?"}

    SUCC -->|"= 0 → 1"| I1["interval = 1天"]
    SUCC -->|"= 1 → 2"| I2["interval = 6天"]
    SUCC -->|"> 2"| I3["interval = interval × easeFactor"]

    FAIL --> EF["更新 easeFactor"]
    I1 --> EF
    I2 --> EF
    I3 --> EF
    EF --> DATE["计算 nextReviewDate"]
    DATE --> SAVE["保存到 localStorage"]
            </div>
          </div>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
            <h3 class="font-semibold mb-4">题目筛选与加载流程</h3>
            <div class="mermaid">
flowchart TD
    U["用户选择分类/难度"] --> PAGE["QuestionBankPage"]
    PAGE -->|filter| QE["QuestionEngine.filter"]
    QE --> CAT{"category?"}
    CAT -->|"ai_basic/ml/dl..."| F1["按分类过滤"]
    CAT -->|"all"| F2["全部分类"]
    F1 --> DIFF{"difficulty?"}
    F2 --> DIFF
    DIFF -->|"easy/medium/hard"| F3["按难度过滤"]
    DIFF -->|"all"| F4["全部难度"]
    F3 --> LIST["返回 Question[]"]
    F4 --> LIST
    LIST --> RENDER["v-for 渲染列表"]
    RENDER --> CLICK["用户点击题目"]
    CLICK --> MODAL["QuestionDetailModal"]
            </div>
          </div>
        </section>

        <!-- ===== 4. 时序图 ===== -->
        <section id="sequence" class="mb-16">
          <h2 class="text-2xl md:text-3xl font-bold mb-6">
            <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">⏱️ 时序图</span>
          </h2>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 mb-6">
            <h3 class="font-semibold mb-4">刷题会话完整时序</h3>
            <div class="mermaid">
sequenceDiagram
    actor U as 👤 用户
    participant UI as QuizSessionPage
    participant QS as useQuizStore
    participant RS as RecordsStore
    participant SR as SpacedRepetitionStore
    participant LS as localStorage

    U->>UI: 选择分类+难度+数量
    UI->>QS: startSession(questions, config)
    QS-->>UI: session 初始化

    loop 每道题目
        UI->>U: 显示题目+选项
        U->>UI: 点击选项
        UI->>QS: answerCurrent(idx, responseTime)
        par 并行处理
            QS->>RS: recordAnswer(qid, correct, time)
            and QS->>SR: recordReview(qid, correct, time)
        end
        RS->>RS: 更新 records + dailyRecords
        SR->>SR: SM-2 calculateQuality → calculateNextReview
        RS->>LS: save()
        SR->>LS: save()
        QS-->>UI: { isCorrect, correctIdx }
        UI->>U: 显示正确/错误 + 解析
        U->>UI: 点击下一题
        UI->>QS: nextQuestion()
        QS-->>UI: current++
    end

    U->>UI: 查看结果
    UI->>QS: endSession()
    Note over UI,U: 显示得分、正确率、用时
            </div>
          </div>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 mb-6">
            <h3 class="font-semibold mb-4">收藏功能时序</h3>
            <div class="mermaid">
sequenceDiagram
    actor U as 👤 用户
    participant QI as QuestionListItem
    participant QS as useQuizStore
    participant BS as BookmarksStore
    participant QE as QuestionEngine
    participant LS as localStorage

    U->>QI: 点击 ⭐ 收藏按钮
    QI->>QS: toggleBookmark(questionId)
    QS->>BS: toggleBookmark(id)

    alt 未收藏 → 收藏
        BS->>BS: bookmarks.add(id)
    else 已收藏 → 取消
        BS->>BS: bookmarks.delete(id)
    end

    BS->>BS: new Set(bookmarks) 触发响应式
    BS->>LS: save()

    Note over BS: bookmarkedQuestions computed 触发
    BS->>QE: getById(id) × N
    QE-->>BS: Question[]
    BS-->>QS: 更新 computed
    QS-->>QI: 状态同步
    QI-->>U: ⭐ 图标更新
            </div>
          </div>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
            <h3 class="font-semibold mb-4">数据导入导出时序</h3>
            <div class="mermaid">
sequenceDiagram
    actor U as 👤 用户
    participant SP as StatisticsPage
    participant QS as useQuizStore
    participant RS as RecordsStore
    participant BS as BookmarksStore
    participant SR as SpacedRepetitionStore

    Note over U,SP: === 导出流程 ===
    U->>SP: 点击"导出数据"
    SP->>QS: exportData()
    QS->>RS: exportRecords()
    QS->>BS: exportBookmarks()
    QS->>SR: exportData()
    QS-->>SP: JSON 字符串
    SP->>SP: 创建 Blob + 下载链接
    SP-->>U: 下载 quiz-data.json

    Note over U,SP: === 导入流程 ===
    U->>SP: 选择文件上传
    SP->>SP: FileReader 读取
    SP->>QS: importData(json)
    QS->>RS: importRecords(data)
    QS->>BS: importBookmarks(data)
    QS->>SR: importData(data)
    QS-->>SP: 导入成功
    SP-->>U: Toast: "数据导入成功"
            </div>
          </div>
        </section>

        <!-- ===== 5. 模块关系 ===== -->
        <section id="modules" class="mb-16">
          <h2 class="text-2xl md:text-3xl font-bold mb-6">
            <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">📦 模块关系图</span>
          </h2>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 mb-6">
            <h3 class="font-semibold mb-4">Pinia Store 依赖关系</h3>
            <div class="mermaid">
graph TB
    subgraph STORES["🟦 Pinia Stores"]
        QS["useQuizStore<br/><i>会话编排 (Facade)</i>"]
        RS["useRecordsStore<br/><i>答题记录 + 每日统计</i>"]
        BS["useBookmarksStore<br/><i>收藏管理</i>"]
        SS["useSpacedRepetitionStore<br/><i>SM-2 间隔重复</i>"]
    end

    subgraph SERVICES["🟩 Services"]
        LS["local-storage<br/><i>storage.get/set</i>"]
        SM["spaced-repetition<br/><i>SM-2 纯函数</i>"]
        EH["error-handler<br/><i>全局错误处理</i>"]
    end

    subgraph DATA["🟨 Data Layer"]
        QE["question-bank<br/><i>QuestionEngine</i>"]
        QG["questions-generated<br/><i>4500题静态数据</i>"]
    end

    QS ==>|"uses"| RS
    QS ==>|"uses"| BS
    QS ==>|"uses"| SS

    RS -->|"uses"| QE
    RS -->|"uses"| LS
    BS -->|"uses"| QE
    BS -->|"uses"| LS
    SS -->|"uses"| SM
    SS -->|"uses"| LS

    QE -->|"reads"| QG

    QS -.->|"error"| EH
    RS -.->|"error"| EH
            </div>
          </div>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 mb-6">
            <h3 class="font-semibold mb-4">Vue 组件层级树</h3>
            <div class="mermaid">
graph TD
    APP["App.vue<br/><i>根布局 + 导航 + 主题</i>"]
    RV["RouterView"]

    APP --> RV
    RV --> HP["HomePage<br/><i>首页概览</i>"]
    RV --> QP["QuizSessionPage<br/><i>刷题主流程</i>"]
    RV --> BP["QuestionBankPage<br/><i>题库浏览</i>"]
    RV --> FP["FavoritesPage<br/><i>收藏列表</i>"]
    RV --> STP["StatisticsPage<br/><i>学习统计</i>"]
    RV --> DOC["DocsPage<br/><i>技术文档</i>"]

    HP --> SC["StatCard ×4"]
    HP --> PC["ProgressCard ×10"]
    HP --> QDM1["QuestionDetailModal"]

    QP --> TC["ToastContainer"]

    BP --> QLI["QuestionListItem ×N"]
    BP --> QDM2["QuestionDetailModal"]

    FP --> QLI2["QuestionListItem ×N"]
    FP --> QDM3["QuestionDetailModal"]

    STP --> CRC["CategoryRadarChart<br/><i>异步加载</i>"]
    STP --> LTC["LearningTrendChart<br/><i>异步加载</i>"]
    STP --> DCI["DailyCheckIn"]
    STP --> SC2["StatCard"]
            </div>
          </div>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
            <h3 class="font-semibold mb-4">模块职责一览</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left text-slate-400 border-b border-slate-700">
                    <th class="py-2 pr-4">模块</th>
                    <th class="py-2 pr-4">类型</th>
                    <th class="py-2 pr-4">职责</th>
                    <th class="py-2">持久化Key</th>
                  </tr>
                </thead>
                <tbody class="text-slate-300">
                  <tr class="border-b border-slate-800"><td class="py-2 pr-4 font-mono text-xs text-blue-400">useQuizStore</td><td class="pr-4">Store</td><td class="pr-4">会话状态编排，委托子Store</td><td class="font-mono text-xs">—</td></tr>
                  <tr class="border-b border-slate-800"><td class="py-2 pr-4 font-mono text-xs text-green-400">useRecordsStore</td><td class="pr-4">Store</td><td class="pr-4">答题记录、每日统计、全局/分类统计</td><td class="font-mono text-xs">records, dailyRecords</td></tr>
                  <tr class="border-b border-slate-800"><td class="py-2 pr-4 font-mono text-xs text-yellow-400">useBookmarksStore</td><td class="pr-4">Store</td><td class="pr-4">收藏切换、收藏列表查询</td><td class="font-mono text-xs">bookmarks</td></tr>
                  <tr class="border-b border-slate-800"><td class="py-2 pr-4 font-mono text-xs text-purple-400">useSpacedRepetitionStore</td><td class="pr-4">Store</td><td class="pr-4">SM-2算法调度、待复习查询</td><td class="font-mono text-xs">spacedRepetition</td></tr>
                  <tr class="border-b border-slate-800"><td class="py-2 pr-4 font-mono text-xs text-cyan-400">QuestionEngine</td><td class="pr-4">Service</td><td class="pr-4">题目CRUD、筛选、随机抽取、统计</td><td class="font-mono text-xs">—</td></tr>
                  <tr class="border-b border-slate-800"><td class="py-2 pr-4 font-mono text-xs text-red-400">error-handler</td><td class="pr-4">Service</td><td class="pr-4">全局错误捕获、分类、safeStorage</td><td class="font-mono text-xs">—</td></tr>
                  <tr><td class="py-2 pr-4 font-mono text-xs text-orange-400">spaced-repetition</td><td class="pr-4">Service</td><td class="pr-4">SM-2纯函数: quality/nextReview/createCard</td><td class="font-mono text-xs">—</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ===== 6. 数据模型 ===== -->
        <section id="database" class="mb-16">
          <h2 class="text-2xl md:text-3xl font-bold mb-6">
            <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">🗄️ 数据模型</span>
          </h2>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 mb-6">
            <h3 class="font-semibold mb-4">核心 TypeScript 类型</h3>
            <pre class="text-xs md:text-sm overflow-x-auto leading-relaxed"><code class="language-typescript">// ===== 题目 =====
interface Question {
  id: number                    // 唯一ID (1-4500)
  cat: CategoryId               // 分类: ai_basic | ml | dl | nlp | cv | algorithm | network | os | database | python
  diff: Difficulty              // 难度: easy | medium | hard
  type: QuestionType            // 类型: choice | truefalse
  q: string                     // 题目文本 (100%唯一)
  opts: string[]                // 选项 (choice: 4个, truefalse: 2个)
  ans: number                   // 正确答案索引
  exp: string                   // 解析说明 (含记忆口诀)
}

// ===== 答题记录 =====
type Records = Record&lt;number, 'correct' | 'wrong'&gt;

// ===== 间隔重复卡片 =====
interface SpacedRepetitionCard {
  questionId: number
  interval: number              // 复习间隔 (天)
  repetitions: number           // 连续正确次数
  easeFactor: number            // 简易度因子 (默认2.5, 最小1.3)
  lastReviewDate: string        // ISO 8601 日期
  nextReviewDate: string        // ISO 8601 日期
}

// ===== 刷题会话 =====
interface QuizSession {
  questions: Question[]
  current: number               // 当前题目索引
  score: number                 // 得分
  answered: boolean             // 当前题是否已答
  results: SessionResult[]      // 答题结果列表
  config: QuizConfig            // 会话配置
}</code></pre>
          </div>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 mb-6">
            <h3 class="font-semibold mb-4">LocalStorage 存储结构</h3>
            <div class="mermaid">
erDiagram
    LOCALSTORAGE {
        string records "Record number, correct-or-wrong"
        string bookmarks "number array of question IDs"
        string dailyRecords "Record date-string, count-and-correct"
        string spacedRepetition "SpacedRepetitionCard array"
    }
            </div>
          </div>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
            <h3 class="font-semibold mb-4">数据持久化策略</h3>
            <div class="mermaid">
flowchart LR
    subgraph WRITE["写入策略"]
        W1["recordAnswer()"] -->|立即| W2["storage.set"]
        W3["toggleBookmark()"] -->|立即| W2
        W4["recordReview()"] -->|立即| W2
    end

    subgraph READ["读取策略"]
        R1["Store 初始化"] -->|一次| R2["storage.get"]
        R3["页面刷新"] -->|N/A| R4["Pinia 内存中<br/>无需重新读取")
    end

    subgraph SYNC["同步机制"]
        S1["ref 修改"] -->|自动| S2["Vue 响应式"]
        S2 -->|watch| S3["UI 更新"]
    end
            </div>
          </div>
        </section>

        <!-- ===== 7. 技术栈 ===== -->
        <section id="techstack" class="mb-16">
          <h2 class="text-2xl md:text-3xl font-bold mb-6">
            <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">🛠️ 技术栈</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="tech in techStack" :key="tech.category"
              class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
              <h3 class="font-semibold mb-3 flex items-center gap-2">
                <span :class="tech.color">{{ tech.icon }}</span> {{ tech.category }}
              </h3>
              <ul class="space-y-1.5">
                <li v-for="item in tech.items" :key="item.name" class="text-sm text-slate-300">
                  <strong>{{ item.name }}</strong>
                  <span class="text-slate-500"> — {{ item.desc }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- ===== 8. 性能优化 ===== -->
        <section id="performance" class="mb-16">
          <h2 class="text-2xl md:text-3xl font-bold mb-6">
            <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">⚡ 性能优化</span>
          </h2>

          <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 mb-6">
            <h3 class="font-semibold mb-4">构建产物 (Vite Build)</h3>
            <pre class="text-xs overflow-x-auto"><code>┌─────────────────────────────┬──────────────┬──────────────┐
│ Chunk                       │ Size         │ Gzip         │
├─────────────────────────────┼──────────────┼──────────────┤
│ index (主入口)              │   16.08 kB   │    6.65 kB   │
│ vendor (第三方库)            │   43.78 kB   │   17.27 kB   │
│ echarts-vendor (图表库)     │  596.27 kB   │  202.73 kB   │ ← 异步加载
│ question-data (4500题)      │ 1987.48 kB   │  105.39 kB   │ ← 代码分割
│ QuizSessionPage             │   12.26 kB   │    4.41 kB   │ ← 路由懒加载
│ StatisticsPage              │   18.53 kB   │    6.21 kB   │ ← 路由懒加载
│ sw.js (Service Worker)      │   25 entries │  precached   │ ← PWA
└─────────────────────────────┴──────────────┴──────────────┘</code></pre>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
              <h3 class="font-semibold mb-3">🏗️ 构建时优化</h3>
              <ul class="space-y-1.5 text-sm text-slate-300">
                <li>✅ <strong>Manual Chunks</strong> — 题目数据/ECharts/Vendor 三级分包</li>
                <li>✅ <strong>Tree Shaking</strong> — ECharts按需引入 (Canvas+Radar+Line)</li>
                <li>✅ <strong>Route Lazy Load</strong> — 5个页面全部动态 import()</li>
                <li>✅ <strong>Async Component</strong> — ECharts图表 defineAsyncComponent</li>
                <li>✅ <strong>Build Target ES2020</strong> — 现代浏览器最优</li>
              </ul>
            </div>
            <div class="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
              <h3 class="font-semibold mb-3">🚀 运行时优化</h3>
              <ul class="space-y-1.5 text-sm text-slate-300">
                <li>✅ <strong>getById()</strong> — O(1)替代O(N)全量搜索</li>
                <li>✅ <strong>Computed缓存</strong> — 派生状态自动缓存</li>
                <li>✅ <strong>PWA Precache</strong> — Service Worker预缓存25个资源</li>
                <li>✅ <strong>Safe Storage</strong> — localStorage异常容错</li>
                <li>✅ <strong>Global Error Handler</strong> — 三级错误捕获不崩溃</li>
              </ul>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="text-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <div class="text-2xl font-bold text-green-400">4,500</div>
              <div class="text-xs text-slate-400 mt-1">题目 100%唯一</div>
            </div>
            <div class="text-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <div class="text-2xl font-bold text-blue-400">117</div>
              <div class="text-xs text-slate-400 mt-1">测试全部通过</div>
            </div>
            <div class="text-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <div class="text-2xl font-bold text-purple-400">0</div>
              <div class="text-xs text-slate-400 mt-1">TypeScript错误</div>
            </div>
            <div class="text-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <div class="text-2xl font-bold text-amber-400">1.66s</div>
              <div class="text-xs text-slate-400 mt-1">构建耗时</div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="text-center text-sm text-slate-600 py-8 border-t border-slate-800">
          面试刷题系统 v1.0.0 · Vue 3 + TypeScript + Pinia + ECharts + PWA
        </footer>
      </main>
    </div>

    <!-- Mobile Nav -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800">
      <div class="flex overflow-x-auto">
        <a v-for="item in navItems" :key="item.id"
          :href="'#' + item.id"
          :class="[
            'flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-2 text-[0.65rem] transition',
            activeSection === item.id ? 'text-blue-400' : 'text-slate-500'
          ]"
          @click.prevent="scrollTo(item.id)"
        >
          <span class="text-base">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('overview')

const navItems = [
  { id: 'overview', icon: '📋', label: '概览' },
  { id: 'architecture', icon: '🏗️', label: '架构' },
  { id: 'dataflow', icon: '🌊', label: '数据流' },
  { id: 'sequence', icon: '⏱️', label: '时序' },
  { id: 'modules', icon: '📦', label: '模块' },
  { id: 'database', icon: '🗄️', label: '数据' },
  { id: 'techstack', icon: '🛠️', label: '技术栈' },
  { id: 'performance', icon: '⚡', label: '性能' },
]

const overviewCards = [
  { icon: '🎯', title: '核心功能', desc: '4500+面试题、10大分类、SM-2间隔重复、智能错题本' },
  { icon: '⚡', title: '技术亮点', desc: 'Vue 3 + TypeScript、Pinia模块化、PWA离线、ECharts可视化' },
  { icon: '📊', title: '质量保障', desc: '117个测试用例、vue-tsc零错误、全局错误处理' },
  { icon: '🧩', title: '模块化设计', desc: '4个独立Store、14个Vue组件、3层架构分离' },
]

const techStack = [
  {
    icon: '●', color: 'text-green-400', category: '核心框架',
    items: [
      { name: 'Vue 3.5', desc: 'Composition API + SFC' },
      { name: 'TypeScript 5.8', desc: '全组件类型安全' },
      { name: 'Vite 8', desc: '极速HMR + 构建' },
      { name: 'Vue Router 4', desc: 'Hash路由 + 守卫' },
    ],
  },
  {
    icon: '●', color: 'text-yellow-400', category: '状态管理',
    items: [
      { name: 'Pinia 3', desc: 'Composition API风格' },
      { name: '4 Modular Stores', desc: '领域驱动拆分' },
      { name: 'Computed Derived', desc: '自动派生统计' },
      { name: 'Auto Persist', desc: 'localStorage同步' },
    ],
  },
  {
    icon: '●', color: 'text-blue-400', category: '样式方案',
    items: [
      { name: 'Tailwind CSS 4', desc: '原生CSS @theme' },
      { name: 'Dark/Light Mode', desc: '系统跟随+手动切换' },
      { name: 'Responsive', desc: '移动端底部导航' },
      { name: 'Animations', desc: '页面过渡+微交互' },
    ],
  },
  {
    icon: '●', color: 'text-purple-400', category: '可视化',
    items: [
      { name: 'ECharts 6', desc: '雷达图+折线图' },
      { name: 'Vue-ECharts 8', desc: 'Vue组件封装' },
      { name: 'Async Loading', desc: 'defineAsyncComponent' },
      { name: 'Tree Shaking', desc: '按需引入组件' },
    ],
  },
  {
    icon: '●', color: 'text-red-400', category: '测试',
    items: [
      { name: 'Vitest 4', desc: '117个用例全部通过' },
      { name: 'Vue Test Utils', desc: '组件挂载测试' },
      { name: 'Happy DOM', desc: '轻量DOM环境' },
      { name: 'V8 Coverage', desc: '覆盖率报告' },
    ],
  },
  {
    icon: '●', color: 'text-cyan-400', category: '工程化',
    items: [
      { name: 'ESLint 9 + Prettier', desc: '代码规范' },
      { name: 'Husky + lint-staged', desc: 'Git Hooks' },
      { name: 'PWA', desc: 'Service Worker离线' },
      { name: 'ARIA a11y', desc: '无障碍属性' },
    ],
  },
]

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeSection.value = id
  }
}

function handleScroll() {
  const sections = navItems.map(n => n.id)
  for (let i = sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(sections[i])
    if (el && el.getBoundingClientRect().top <= 120) {
      activeSection.value = sections[i]
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  // Handle hash on load
  if (window.location.hash) {
    const id = window.location.hash.slice(1)
    setTimeout(() => scrollTo(id), 300)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
