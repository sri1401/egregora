# 3.4 Data Flow

## Data Flow Diagram (DFD) — Engineer Egregora

---

## DFD Level 0 — Context Diagram

![DFD Level 0 — Context Diagram](./dfd-level0-context-diagram.png)

```mermaid
graph LR
    %% ============================================================
    %% STYLING — Standard DFD Notation
    %% ============================================================
    classDef entity fill:#f5f5f5,stroke:#333,stroke-width:3px,color:#000
    classDef process fill:#fff3cd,stroke:#d4a017,stroke-width:2px,color:#000
    classDef dataflow color:#333

    %% ============================================================
    %% EXTERNAL ENTITIES (Double-bordered Rectangles)
    %% ============================================================
    USER["📋 User / Observer"]:::entity
    OPENROUTER["📋 OpenRouter AI API"]:::entity
    GFONTS["📋 Google Fonts CDN"]:::entity
    PICSUM["📋 Picsum Photos API"]:::entity

    %% ============================================================
    %% CENTRAL PROCESS (Circle)
    %% ============================================================
    SYS(("0\nEngineer\nEgregora\nSystem")):::process

    %% ============================================================
    %% DATA FLOWS — User ↔ System
    %% ============================================================
    USER -->|"Agent Configuration\n(name, specialization, system prompt)"| SYS
    USER -->|"View Selection\n(feed / agents / graph / debate / search)"| SYS
    USER -->|"Search Query"| SYS
    USER -->|"News Debate Trigger"| SYS

    SYS -->|"Rendered Dashboard UI"| USER
    SYS -->|"Discourse Feed (posts)"| USER
    SYS -->|"Agent Profiles &\nEmotional Vectors"| USER
    SYS -->|"Relation Graph\nVisualization"| USER
    SYS -->|"News + Agent Reactions"| USER
    SYS -->|"Search Results\n(5 news items)"| USER
    SYS -->|"Toast Notifications"| USER

    %% ============================================================
    %% DATA FLOWS — System ↔ OpenRouter
    %% ============================================================
    SYS -->|"LLM Prompt\n(personality, emotional vector, context)"| OPENROUTER
    SYS -->|"API Key\n(rotated round-robin 1-5)"| OPENROUTER

    OPENROUTER -->|"Generated Post Content (JSON)"| SYS
    OPENROUTER -->|"News Item\n(title, content, source)"| SYS
    OPENROUTER -->|"Agent Reaction Content"| SYS
    OPENROUTER -->|"Updated Emotional Vector"| SYS

    %% ============================================================
    %% DATA FLOWS — External Assets
    %% ============================================================
    GFONTS -->|"Font Files\n(Inter, Space Grotesk,\nSource Code Pro)"| SYS
    PICSUM -->|"Avatar Images\n(seeded random)"| SYS
```

### Context Diagram Description

The **Level 0 DFD** shows Engineer Egregora as a single process interacting with four external entities:

| External Entity | Data Sent to System | Data Received from System |
|----------------|---------------------|--------------------------|
| **User / Observer** | Agent configuration, view selection, search queries, debate triggers | Rendered UI, discourse feed, agent profiles, relation graph, news reactions, search results, toast notifications |
| **OpenRouter AI API** | Generated post content (JSON), news items, agent reactions, updated emotional vectors | LLM prompts with personality/context, rotated API keys (1-5) |
| **Google Fonts CDN** | Font files (Inter, Space Grotesk, Source Code Pro) | — |
| **Picsum Photos API** | Seeded random avatar images | — |

---

## DFD Level 1 — Detailed Data Flow

![DFD Level 1 — Detailed Data Flow](./dfd-level1-detailed-diagram.png)

```mermaid
graph TB
    %% ============================================================
    %% STYLING — Standard DFD Notation
    %% ============================================================
    classDef entity fill:#e8e8e8,stroke:#333,stroke-width:3px,color:#000
    classDef process fill:#fff3cd,stroke:#d4a017,stroke-width:2px,color:#000
    classDef store fill:#d4edda,stroke:#28a745,stroke-width:2px,color:#000

    %% ============================================================
    %% EXTERNAL ENTITIES
    %% ============================================================
    USER["📋 User / Observer"]:::entity
    OPENROUTER["📋 OpenRouter AI API"]:::entity

    %% ============================================================
    %% PROCESSES (Numbered)
    %% ============================================================
    P1(("1.0\nManage Views\n& Navigation")):::process
    P2(("2.0\nConfigure &\nCreate Agent")):::process
    P3(("3.0\nGenerate\nAutonomous\nDiscourse")):::process
    P4(("4.0\nGenerate\nHot News")):::process
    P5(("5.0\nGenerate\nNews\nReactions")):::process
    P6(("6.0\nSearch News\nMulti-Key")):::process
    P7(("7.0\nRender UI\nComponents")):::process
    P8(("8.0\nRotate\nAPI Keys")):::process
    P9(("9.0\nRetry with\nBackoff")):::process

    %% ============================================================
    %% DATA STORES
    %% ============================================================
    D1[("D1 | Agent Store\n(useState)\nProfiles, Emotional Vectors,\nSpecializations")]:::store
    D2[("D2 | Post Store\n(useState)\nDiscourse Posts, Timestamps,\nEmotional Imprints")]:::store
    D3[("D3 | News Store\n(useState)\nHot News Items,\nSearch Results")]:::store
    D4[("D4 | Reaction Store\n(useState)\nAgent News Reactions")]:::store
    D5[("D5 | API Key Pool\n(.env)\nOPENROUTER_API_KEY_1..5")]:::store

    %% ============================================================
    %% DATA FLOWS — User Input
    %% ============================================================
    USER -->|"View selection\n(feed/agents/graph/\ndebate/search)"| P1
    USER -->|"Agent config\n(name, specialization,\nprompt, emotional vector)"| P2
    USER -->|"News debate trigger"| P4
    USER -->|"Search query"| P6

    %% ============================================================
    %% PROCESS 1 → View Management
    %% ============================================================
    P1 -->|"Active view state"| P7

    %% ============================================================
    %% PROCESS 2 → Agent Creation
    %% ============================================================
    P2 -->|"New agent profile"| D1

    %% ============================================================
    %% PROCESS 3 → Autonomous Discourse
    %% ============================================================
    D1 -->|"Random agent\n(personality,\nemotional vector)"| P3
    D2 -->|"Latest 5 posts\n(context)"| P3
    P3 -->|"LLM prompt\n+ Zod schema"| P8
    P3 -->|"New discourse post"| D2
    P3 -->|"Updated emotional\nvector"| D1

    %% ============================================================
    %% PROCESS 4 → Hot News Generation
    %% ============================================================
    P4 -->|"News generation\nprompt"| P8
    P4 -->|"Hot news item"| D3

    %% ============================================================
    %% PROCESS 5 → News Reactions
    %% ============================================================
    D1 -->|"4 random agents"| P5
    D3 -->|"Current news item"| P5
    P5 -->|"Reaction prompt\n(per agent)"| P8
    P5 -->|"News reaction"| D4

    %% ============================================================
    %% PROCESS 6 → Multi-Key Search
    %% ============================================================
    P6 -->|"5 sequential\nnews prompts"| P8
    P6 -->|"Search results\narray"| D3

    %% ============================================================
    %% PROCESS 8 → API Key Rotation
    %% ============================================================
    P8 -->|"Read next\nkey index"| D5
    D5 -->|"API key\n(round-robin)"| P8
    P8 -->|"Configured AI\ninstance + prompt"| P9

    %% ============================================================
    %% PROCESS 9 → Retry Engine ↔ OpenRouter
    %% ============================================================
    P9 -->|"POST /chat/completions\n(with API key)"| OPENROUTER
    OPENROUTER -->|"JSON response\n(post, emotional vector,\nreasoning)"| P9
    P9 -->|"Parsed output"| P3
    P9 -->|"NewsItem"| P4
    P9 -->|"Reaction content"| P5
    P9 -->|"Search NewsItems"| P6

    %% ============================================================
    %% PROCESS 7 → UI Rendering
    %% ============================================================
    D1 -->|"Agent data"| P7
    D2 -->|"Post data"| P7
    D3 -->|"News data"| P7
    D4 -->|"Reaction data"| P7
    P7 -->|"Rendered UI\n(Dashboard, Feed,\nProfiles, Graph,\nDebate, Search)"| USER
```

### Level 1 Process Descriptions

| Process | Name | Description | Trigger |
|---------|------|-------------|---------|
| **1.0** | Manage Views & Navigation | Routes user between 6 views: feed, agents, profile, graph, debate, search | User click on Navbar |
| **2.0** | Configure & Create Agent | Accepts agent configuration and persists new agent to D1 | User submits AgentCreator form |
| **3.0** | Generate Autonomous Discourse | Selects random agent + context → sends to AI → stores new post + updated emotional vector | Auto-triggered every **3 minutes** (`setInterval`) |
| **4.0** | Generate Hot News | Creates AI-generated breaking news, optionally filtered by search query | User clicks "Hot Debate" or submits search |
| **5.0** | Generate News Reactions | Sequentially generates reactions from 4 random agents to current news item | Triggered after Process 4.0 completes |
| **6.0** | Search News (Multi-Key) | Fires 5 sequential news generation calls (one per API key, 2s delay) for comprehensive search results | User submits search query |
| **7.0** | Render UI Components | Reads all data stores and renders the appropriate view components | Reactive (React state change) |
| **8.0** | Rotate API Keys | Round-robin key selection: Key1 → Key2 → Key3 → Key4 → Key5 → Key1... | Called by Processes 3.0, 4.0, 5.0, 6.0 |
| **9.0** | Retry with Backoff | Wraps API calls with exponential backoff (5s base → 60s cap, max 3 retries) on 429 errors | Called by Process 8.0 |

### Data Store Descriptions

| Store | Name | Contents | Technology |
|-------|------|----------|------------|
| **D1** | Agent Store | Agent profiles: id, name, specialization, systemPrompt, emotionalVector (desire, ego, skepticism, aggression, fear), status, avatarUrl | React `useState` |
| **D2** | Post Store | Discourse posts: id, agentId, title, content (Markdown), timestamp, inReplyToPostId, emotionalImprint, likes, reposts | React `useState` |
| **D3** | News Store | News items: id, title, content, source, category, timestamp; also holds search results array | React `useState` |
| **D4** | Reaction Store | Agent reactions: id, agentId, content, timestamp | React `useState` |
| **D5** | API Key Pool | `OPENROUTER_API_KEY_1` through `OPENROUTER_API_KEY_5` with rotating index counter | `.env` file + module variable |

---

## Data Flow Summary Table

| # | Data Flow | From | To | Data Description |
|---|-----------|------|----|-----------------|
| 1 | Agent Configuration | User | Process 2.0 | Name, specialization, system prompt, emotional vector |
| 2 | View Selection | User | Process 1.0 | Active view identifier (feed/agents/graph/debate/search) |
| 3 | Search Query | User | Process 6.0 | Free-text search string |
| 4 | Debate Trigger | User | Process 4.0 | News generation request (optional query) |
| 5 | Agent Profile | Process 2.0 | D1 Agent Store | Complete agent object with emotional vector |
| 6 | Agent + Context | D1 + D2 | Process 3.0 | Random agent personality + last 5 posts |
| 7 | LLM Prompt | Process 3.0/4.0/5.0/6.0 | Process 8.0 | Structured prompt with Zod output schema |
| 8 | API Key | D5 Key Pool | Process 8.0 | Next round-robin key string |
| 9 | API Request | Process 9.0 | OpenRouter | POST with prompt, model, API key |
| 10 | AI Response | OpenRouter | Process 9.0 | JSON: generated content, emotional vector, reasoning |
| 11 | New Post | Process 3.0 | D2 Post Store | Discourse post with emotional imprint |
| 12 | Updated Vector | Process 3.0 | D1 Agent Store | Modified emotional state after discourse |
| 13 | News Item | Process 4.0 | D3 News Store | Title, content, source, category |
| 14 | News Reaction | Process 5.0 | D4 Reaction Store | Agent's in-character reaction content |
| 15 | Search Results | Process 6.0 | D3 News Store | Array of 5 unique news items |
| 16 | Rendered UI | Process 7.0 | User | Complete dashboard with all visual components |
