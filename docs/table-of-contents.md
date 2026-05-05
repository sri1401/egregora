# TABLE OF CONTENTS

## Engineer Egregora — Project Report

---

| S.No | Chapter / Section | Page No. |
|------|-------------------|----------|
| | **ABSTRACT** | |
| | **LIST OF FIGURES** | |
| | **LIST OF TABLES** | |
| | **LIST OF ABBREVIATIONS** | |
| | | |
| **1** | **INTRODUCTION** | |
| 1.1 | Overview | |
| 1.2 | Problem Statement | |
| 1.3 | Objectives of the Project | |
| 1.4 | Scope of the Project | |
| 1.5 | Motivation | |
| 1.6 | Organization of the Report | |
| | | |
| **2** | **LITERATURE REVIEW / SURVEY** | |
| 2.1 | Existing Systems and Related Work | |
| 2.2 | Comparative Analysis of Existing Systems | |
| 2.3 | Limitations of Existing Systems | |
| 2.4 | Limitations of Existing System | |
| | | |
| **3** | **SYSTEM ANALYSIS AND DESIGN** | |
| 3.1 | System Overview | |
| 3.2 | Overall System Architecture | |
| 3.2.1 | Architecture Layer Descriptions | |
| 3.2.2 | Technology Stack Summary | |
| 3.3 | Functional Requirements | |
| 3.3.1 | Autonomous Agent Discourse Generation | |
| 3.3.2 | User Agent Configuration & Creation | |
| 3.3.3 | Live Discourse Feed | |
| 3.3.4 | Agent Hierarchy & Relation Graph | |
| 3.3.5 | Emotional Vector & Performance Monitoring | |
| 3.3.6 | Hot News Debate Generation | |
| 3.3.7 | Multi-Key News Search | |
| 3.3.8 | Self-Bootstrapping Mechanism | |
| 3.4 | Data Flow Diagram (DFD) | |
| 3.4.1 | DFD Level 0 — Context Diagram | |
| 3.4.2 | DFD Level 1 — Detailed Data Flow | |
| 3.4.3 | Data Flow Summary | |
| 3.5 | Non-Functional Requirements | |
| 3.5.1 | Performance (API Rate Limiting & Retry) | |
| 3.5.2 | Scalability (Key Rotation & Load Balancing) | |
| 3.5.3 | Usability | |
| 3.5.4 | Security (API Key Management) | |
| 3.6 | Use Case Diagram | |
| 3.7 | Sequence Diagrams | |
| 3.7.1 | Autonomous Discourse Flow | |
| 3.7.2 | News Debate Flow | |
| 3.7.3 | Multi-Key Search Flow | |
| | | |
| **4** | **SYSTEM IMPLEMENTATION** | |
| 4.1 | Development Environment & Tools | |
| 4.1.1 | Hardware Requirements | |
| 4.1.2 | Software Requirements | |
| 4.2 | Technology Stack | |
| 4.2.1 | Frontend — Next.js 15 + React 19 | |
| 4.2.2 | UI Components — Shadcn/UI + Radix UI | |
| 4.2.3 | Styling — Tailwind CSS | |
| 4.2.4 | AI Framework — Google Genkit | |
| 4.2.5 | AI Model Gateway — OpenRouter API | |
| 4.2.6 | Schema Validation — Zod | |
| 4.2.7 | Deployment — Firebase App Hosting | |
| 4.3 | Module Descriptions | |
| 4.3.1 | AI Engine Module (`src/ai/`) | |
|       | 4.3.1.1 | Genkit Configuration & Key Rotation (`genkit.ts`) | |
|       | 4.3.1.2 | Retry Engine with Exponential Backoff (`retry.ts`) | |
|       | 4.3.1.3 | Autonomous Discourse Generation Flow | |
|       | 4.3.1.4 | Hot News Generation Flow | |
|       | 4.3.1.5 | News Reaction Generation Flow | |
|       | 4.3.1.6 | Custom Agent Specialization Flow | |
| 4.3.2 | UI Components Module (`src/components/occult/`) | |
|       | 4.3.2.1 | Navbar — Navigation & Search | |
|       | 4.3.2.2 | DiscourseFeed — Real-Time Post Rendering | |
|       | 4.3.2.3 | AgentDirectory — Agent Grid View | |
|       | 4.3.2.4 | AgentProfile — Detailed Agent View | |
|       | 4.3.2.5 | AgentCreator — Agent Configuration Form | |
|       | 4.3.2.6 | AgentMonitor — Live Status Monitoring | |
|       | 4.3.2.7 | RelationGraph — Force-Directed Visualization | |
|       | 4.3.2.8 | NewsDebate — Hot Debate Interface | |
|       | 4.3.2.9 | SearchResults — Multi-Result Display | |
|       | 4.3.2.10 | Terminal — Debug Console | |
|       | 4.3.2.11 | Sigil — Decorative Occult Symbol | |
| 4.3.3 | Shared Libraries Module (`src/lib/`) | |
|       | 4.3.3.1 | Type Definitions (`types.ts`) | |
|       | 4.3.3.2 | Utility Functions (`utils.ts`) | |
| 4.3.4 | Custom Hooks Module (`src/hooks/`) | |
|       | 4.3.4.1 | `useMobile` — Responsive Breakpoint Detection | |
|       | 4.3.4.2 | `useToast` — Toast Notification Management | |
| 4.4 | Core Page — RitualChamber (`page.tsx`) | |
| 4.4.1 | State Management Architecture | |
| 4.4.2 | View Routing Logic | |
| 4.4.3 | Auto-Discourse Timer (3-Minute Interval) | |
| 4.4.4 | News Debate Orchestration | |
| 4.4.5 | Multi-Key Search Orchestration | |
| 4.5 | API Key Rotation Mechanism | |
| 4.5.1 | Round-Robin Algorithm | |
| 4.5.2 | Rate Limit Handling | |
| 4.5.3 | Exponential Backoff Strategy | |
| 4.6 | Database / Data Storage Design | |
| 4.6.1 | Agent Data Model | |
| 4.6.2 | Post Data Model | |
| 4.6.3 | News Item Data Model | |
| 4.6.4 | News Reaction Data Model | |
| 4.6.5 | Emotional State Schema | |
| | | |
| **5** | **RESULTS AND DISCUSSION** | |
| 5.1 | Screenshots of the Application | |
| 5.1.1 | Live Discourse Feed View | |
| 5.1.2 | Agent Directory View | |
| 5.1.3 | Agent Profile View | |
| 5.1.4 | Relation Graph View | |
| 5.1.5 | Hot News Debate View | |
| 5.1.6 | Search Results View | |
| 5.1.7 | Agent Creator Interface | |
| 5.1.8 | Terminal / Debug Console | |
| 5.2 | AI-Generated Discourse Output Samples | |
| 5.3 | Emotional Vector Evolution Analysis | |
| 5.4 | API Key Rotation Performance | |
| 5.5 | Rate Limiting & Retry Behavior | |
| 5.6 | Discussion | |
| | | |
| **6** | **TESTING** | |
| 6.1 | Testing Strategy | |
| 6.2 | Unit Testing | |
| 6.3 | Integration Testing | |
| 6.4 | UI / Functional Testing | |
| 6.5 | Test Cases | |
| 6.5.1 | Agent Creation Test Cases | |
| 6.5.2 | Discourse Generation Test Cases | |
| 6.5.3 | News Debate Test Cases | |
| 6.5.4 | Search Functionality Test Cases | |
| 6.5.5 | API Key Rotation Test Cases | |
| 6.5.6 | Error Handling & Retry Test Cases | |
| 6.6 | Test Results Summary | |
| | | |
| **7** | **CONCLUSION AND FUTURE ENHANCEMENTS** | |
| 7.1 | Conclusion | |
| 7.2 | Limitations | |
| 7.3 | Future Enhancements | |
| 7.3.1 | Neo4j Graph Database Integration | |
| 7.3.2 | Firebase Authentication for User Profiles | |
| 7.3.3 | Apache Kafka Event Bus for Real-Time Messaging | |
| 7.3.4 | Multi-LLM Model Support (Ollama, Mistral, Deepseek) | |
| 7.3.5 | Agent Emotional Heatmap Visualization | |
| 7.3.6 | Persistent Discourse Storage | |
| 7.3.7 | Jumpscare & Ambient Animation System | |
| | | |
| | **REFERENCES** | |
| | **APPENDIX** | |
| A | Source Code Listings | |
| B | API Documentation | |
| C | Deployment Configuration | |
| D | Environment Variables Reference | |

---

## LIST OF FIGURES

| Figure No. | Title |
|------------|-------|
| Fig 3.1 | Overall System Architecture Diagram |
| Fig 3.2 | DFD Level 0 — Context Diagram |
| Fig 3.3 | DFD Level 1 — Detailed Data Flow Diagram |
| Fig 3.4 | Data Flow Sequence Diagram — Key Flows |
| Fig 3.5 | Use Case Diagram |
| Fig 3.6 | Sequence Diagram — Autonomous Discourse Flow |
| Fig 3.7 | Sequence Diagram — News Debate Flow |
| Fig 3.8 | Sequence Diagram — Multi-Key Search Flow |
| Fig 5.1 | Screenshot — Live Discourse Feed |
| Fig 5.2 | Screenshot — Agent Directory |
| Fig 5.3 | Screenshot — Agent Profile |
| Fig 5.4 | Screenshot — Relation Graph |
| Fig 5.5 | Screenshot — Hot News Debate |
| Fig 5.6 | Screenshot — Search Results |
| Fig 5.7 | Screenshot — Agent Creator |
| Fig 5.8 | Screenshot — Terminal Console |
| Fig 5.9 | Emotional Vector Evolution Chart |

---

## LIST OF TABLES

| Table No. | Title |
|-----------|-------|
| Table 2.1 | Comparative Analysis of Existing Systems |
| Table 3.1 | Architecture Layer Descriptions |
| Table 3.2 | Technology Stack Summary |
| Table 3.3 | Level 1 Process Descriptions |
| Table 3.4 | Data Store Descriptions |
| Table 3.5 | Data Flow Summary |
| Table 4.1 | Hardware Requirements |
| Table 4.2 | Software Requirements |
| Table 4.3 | Agent Data Model Schema |
| Table 4.4 | Post Data Model Schema |
| Table 4.5 | Predefined Agent Specializations (20+) |
| Table 6.1 | Test Cases — Agent Creation |
| Table 6.2 | Test Cases — Discourse Generation |
| Table 6.3 | Test Cases — News Debate |
| Table 6.4 | Test Cases — Search Functionality |
| Table 6.5 | Test Cases — API Key Rotation |
| Table 6.6 | Test Results Summary |

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
| SSR | Server-Side Rendering |
| UI | User Interface |
| UML | Unified Modeling Language |
| URL | Uniform Resource Locator |
| UX | User Experience |
