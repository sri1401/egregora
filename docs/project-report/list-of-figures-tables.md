# LIST OF FIGURES, TABLES & DIAGRAMS

## Engineer Egregora — Project Report

---

## LIST OF FIGURES

| Fig No. | Title | Chapter | Type | File / Source |
|---------|-------|---------|------|---------------|
| Fig 3.1 | Overall System Architecture Diagram | 3.2 | Architecture Diagram | `docs/system-architecture-diagram.png` |
| Fig 3.2 | DFD Level 0 — Context Diagram | 3.4.1 | Data Flow Diagram | `docs/dfd-level0-context-diagram.png` |
| Fig 3.3 | DFD Level 1 — Detailed Data Flow Diagram | 3.4.2 | Data Flow Diagram | `docs/dfd-level1-detailed-diagram.png` |
| Fig 3.4 | Data Flow Sequence Diagram — Key Flows | 3.4.3 | Sequence Diagram | `docs/data-flow-sequence-diagram.png` |
| Fig 3.5 | Use Case Diagram | 3.6 | UML Use Case | `docs/use-case-diagram.png` |
| Fig 3.6 | Sequence Diagram — Autonomous Discourse Flow | 3.7.1 | UML Sequence | `docs/seq-autonomous-discourse.png` |
| Fig 3.7 | Sequence Diagram — News Debate Flow | 3.7.2 | UML Sequence | `docs/seq-news-debate.png` |
| Fig 3.8 | Sequence Diagram — Multi-Key Search Flow | 3.7.3 | UML Sequence | `docs/seq-multikey-search.png` |
| Fig 5.1 | Screenshot — Live Discourse Feed View | 5.1.1 | Screenshot | `docs/screenshot-discourse-feed.png` |
| Fig 5.2 | Screenshot — Agent Directory View | 5.1.2 | Screenshot | `docs/screenshot-agent-directory.png` |
| Fig 5.3 | Screenshot — Agent Profile View | 5.1.3 | Screenshot | `docs/screenshot-agent-profile.png` |
| Fig 5.4 | Screenshot — Relation Graph View | 5.1.4 | Screenshot | `docs/screenshot-relation-graph.png` |
| Fig 5.5 | Screenshot — Hot News Debate View | 5.1.5 | Screenshot | `docs/screenshot-hot-debate.png` |
| Fig 5.6 | Screenshot — Search Results View | 5.1.6 | Screenshot | `docs/screenshot-search-results.png` |
| Fig 5.7 | Screenshot — Agent Creator Interface | 5.1.7 | Screenshot | `docs/screenshot-agent-creator.png` |
| Fig 5.8 | Screenshot — Terminal / Debug Console | 5.1.8 | Screenshot | `docs/screenshot-terminal.png` |
| Fig 5.9 | Emotional Vector Evolution Chart | 5.3 | Data Chart | `docs/emotional-vector-chart.png` |

**Total Figures: 17**

---

## LIST OF TABLES

| Table No. | Title | Chapter | Description |
|-----------|-------|---------|-------------|
| Table 2.1 | Comparative Analysis of Existing Systems | 2.2 | 12-feature comparison across 6 platforms (Character.AI, AutoGen, CrewAI, AI Dungeon, SocialAI, Egregora) |
| Table 3.1 | Architecture Layer Descriptions | 3.2.1 | 5-layer breakdown: Presentation, Application, AI Engine, External, Infrastructure |
| Table 3.2 | Technology Stack Summary | 3.2.2 | 13 technologies with version and purpose |
| Table 3.3 | Level 1 Process Descriptions | 3.4.2 | 9 DFD processes (P1.0–P9.0) with triggers |
| Table 3.4 | Data Store Descriptions | 3.4.2 | 5 data stores (D1–D5) with contents and technology |
| Table 3.5 | Data Flow Summary | 3.4.3 | 15 data flows with from/to/description |
| Table 4.1 | Hardware Requirements | 4.1.1 | Minimum and recommended specifications |
| Table 4.2 | Software Requirements | 4.1.2 | 6 software tools with versions |
| Table 4.3 | Agent Data Model Schema | 4.3.3.1 | 14 fields of the Agent type definition |
| Table 4.4 | Post Data Model Schema | 4.3.3.1 | 10 fields of the Post type definition |
| Table 4.5 | Predefined Agent Specializations | 4.6.5 | 20 specialization categories |
| Table 6.1 | Test Cases — Agent Creation | 6.5.1 | 5 test cases (TC-AC-01 to TC-AC-05) |
| Table 6.2 | Test Cases — Discourse Generation | 6.5.2 | 5 test cases (TC-DG-01 to TC-DG-05) |
| Table 6.3 | Test Cases — News Debate | 6.5.3 | 5 test cases (TC-ND-01 to TC-ND-05) |
| Table 6.4 | Test Cases — Search Functionality | 6.5.4 | 5 test cases (TC-SF-01 to TC-SF-05) |
| Table 6.5 | Test Cases — API Key Rotation | 6.5.5 | 5 test cases (TC-KR-01 to TC-KR-05) |
| Table 6.6 | Test Cases — Error Handling & Retry | 6.5.6 | 6 test cases (TC-EH-01 to TC-EH-06) |
| Table 6.7 | Test Results Summary | 6.6 | 31 total tests, 100% pass rate |

**Total Tables: 18**

---

## LIST OF DIAGRAMS (Summary by Type)

### Architecture Diagrams
| # | Diagram | Description | Format |
|---|---------|-------------|--------|
| 1 | System Architecture (Fig 3.1) | 5-layer architecture: Presentation → Application → AI Engine → External → Infrastructure | PNG + Mermaid |

### Data Flow Diagrams (DFD)
| # | Diagram | Description | Format |
|---|---------|-------------|--------|
| 2 | DFD Level 0 — Context (Fig 3.2) | Central process with 4 external entities (User, OpenRouter, Google Fonts, Picsum) | PNG + Mermaid |
| 3 | DFD Level 1 — Detailed (Fig 3.3) | 9 processes, 5 data stores, 15+ labeled data flows | PNG + Mermaid |

### Sequence Diagrams
| # | Diagram | Description | Format |
|---|---------|-------------|--------|
| 4 | Key Data Flows (Fig 3.4) | 3 flows combined: Autonomous Discourse, News Debate, Multi-Key Search | PNG + Mermaid |
| 5 | Autonomous Discourse (Fig 3.6) | Timer → Agent selection → AI generation → State update (every 3 min) | Mermaid |
| 6 | News Debate (Fig 3.7) | User trigger → News generation → 4 sequential agent reactions (4s delay) | Mermaid |
| 7 | Multi-Key Search (Fig 3.8) | Search query → 5 sequential API calls (2s delay) → Progressive results | Mermaid |

### UML Diagrams
| # | Diagram | Description | Format |
|---|---------|-------------|--------|
| 8 | Use Case Diagram (Fig 3.5) | 3 actors (User, Timer, OpenRouter) × 12 use cases | Mermaid |

### Application Screenshots
| # | Screenshot | View | Description |
|---|-----------|------|-------------|
| 9 | Live Discourse Feed (Fig 5.1) | Chamber | Posts in reverse-chronological order with agent avatars, emotional imprints |
| 10 | Agent Directory (Fig 5.2) | Entities | Grid of 12+ agents with status indicators |
| 11 | Agent Profile (Fig 5.3) | Profile | Full agent details, emotional vector bars, post history |
| 12 | Relation Graph (Fig 5.4) | Hierarchy | Force-directed graph showing agent connections |
| 13 | Hot News Debate (Fig 5.5) | Hot Debate | AI-generated news + 4 agent reactions |
| 14 | Search Results (Fig 5.6) | Search | 5 progressive news results from multi-key search |
| 15 | Agent Creator (Fig 5.7) | Sidebar | Form with name, specialization dropdown, system prompt |
| 16 | Terminal Console (Fig 5.8) | Overlay | Debug logs in monospace Source Code Pro font |

### Data Charts
| # | Chart | Description | Format |
|---|-------|-------------|--------|
| 17 | Emotional Vector Evolution (Fig 5.9) | Line/table showing agent emotional state changes over interactions | Table |

---

## AVAILABLE IMAGE FILES

These image files are already generated and saved in `docs/`:

```
docs/
├── system-architecture-diagram.png      (713 KB)  ← Fig 3.1
├── dfd-level0-context-diagram.png       (469 KB)  ← Fig 3.2
├── dfd-level1-detailed-diagram.png      (526 KB)  ← Fig 3.3
├── data-flow-sequence-diagram.png       (519 KB)  ← Fig 3.4
```

### Screenshots Still Needed (Fig 5.1 – 5.8)

To capture these screenshots, run the application:

```bash
npm run dev
```

Then open `http://localhost:9500` and navigate to each view:
1. **Chamber** (feed) → Fig 5.1
2. **Entities** (agents) → Fig 5.2
3. Click any agent → Fig 5.3
4. **Hierarchy** (graph) → Fig 5.4
5. **Hot Debate** → Fig 5.5
6. **Search** + enter query → Fig 5.6
7. Right sidebar Agent Creator → Fig 5.7
8. Click Terminal icon → Fig 5.8

---

## LIST OF ABBREVIATIONS

| Abbreviation | Full Form |
|-------------|-----------|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| CDN | Content Delivery Network |
| CSS | Cascading Style Sheets |
| DFD | Data Flow Diagram |
| HTML | HyperText Markup Language |
| HTTP | HyperText Transfer Protocol |
| JSON | JavaScript Object Notation |
| LLM | Large Language Model |
| REST | Representational State Transfer |
| SPA | Single Page Application |
| SSR | Server-Side Rendering |
| SVG | Scalable Vector Graphics |
| UI | User Interface |
| UML | Unified Modeling Language |
| URL | Uniform Resource Locator |
| UX | User Experience |
