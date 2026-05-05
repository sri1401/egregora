# CHAPTER 4: SYSTEM IMPLEMENTATION

## 4.1 Development Environment & Tools

### 4.1.1 Hardware Requirements

*Table 4.1: Hardware Requirements*

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel i5 / AMD Ryzen 5 | Intel i7 / AMD Ryzen 7 |
| RAM | 8 GB | 16 GB |
| Storage | 2 GB free space | 5 GB free space |
| Network | Broadband internet | High-speed broadband |
| Display | 1366 × 768 | 1920 × 1080 |

### 4.1.2 Software Requirements

*Table 4.2: Software Requirements*

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 20.x+ | JavaScript runtime |
| npm | 10.x+ | Package manager |
| VS Code | Latest | Code editor |
| Git | 2.x+ | Version control |
| Web Browser | Chrome/Edge/Firefox (latest) | Testing & debugging |
| Windows / macOS / Linux | Any modern OS | Operating system |

---

## 4.2 Technology Stack

### 4.2.1 Frontend — Next.js 15 + React 19
Next.js 15 provides the App Router with server-side rendering (SSR) and Turbopack for fast development builds. React 19 brings improved hydration, automatic batching, and concurrent features. The application uses the `"use client"` directive for the main page component (`RitualChamber`) since it requires client-side state management via React hooks (`useState`, `useEffect`, `useCallback`).

### 4.2.2 UI Components — Shadcn/UI + Radix UI
The UI is built with 20+ Radix UI primitives (Accordion, Avatar, Dialog, Dropdown, Toast, Tabs, Tooltip, etc.) configured through Shadcn/UI's component system (`components.json`). Custom "Occult" components extend these primitives with the application's dark thematic styling.

### 4.2.3 Styling — Tailwind CSS
Tailwind CSS 3.4.1 provides utility-first styling with custom theme extensions for the occult color palette:
- **Background**: `#0D0101` (near-black, dried blood)
- **Primary**: `#6B0000` (deep blood-red)
- **Secondary/Accent 1**: `#9E6900` (tarnished bronze)
- **Accent 2**: `#54006B` (dark violet)
- **Destructive**: `#E00000` (piercing red)
- **Text**: `#B0B0B0` (skeletal grey)

### 4.2.4 AI Framework — Google Genkit
Google Genkit 1.28.0 provides the AI orchestration layer with:
- Plugin-based architecture (OpenRouter via `@genkit-ai/compat-oai`)
- Structured output via Zod schemas
- Prompt management and model abstraction

### 4.2.5 AI Model Gateway — OpenRouter API
OpenRouter provides an OpenAI-compatible REST API at `https://openrouter.ai/api/v1` that routes to `google/gemini-2.0-flash-001`. The system uses up to 5 API keys with round-robin rotation.

### 4.2.6 Schema Validation — Zod
Zod 3.24.2 defines input/output schemas for all AI flows, ensuring type-safe structured output from the LLM. Schemas include `AgentDiscourseInputSchema`, `AgentDiscourseOutputSchema`, `NewsItemSchema`, and `NewsReactionOutputSchema`.

### 4.2.7 Deployment — Firebase App Hosting
Firebase App Hosting (`apphosting.yaml`) deploys the Next.js application with SSR support, configured with `maxInstances: 1` for free-tier optimization.

---

## 4.3 Module Descriptions

### 4.3.1 AI Engine Module (`src/ai/`)

#### 4.3.1.1 Genkit Configuration & Key Rotation (`genkit.ts`)
The core AI configuration module initializes the Genkit framework with the OpenRouter plugin. It implements a round-robin API key rotation system:

```typescript
// Key pool loaded from environment
const OPENROUTER_KEYS = [
  process.env.OPENROUTER_API_KEY_1,
  process.env.OPENROUTER_API_KEY_2,
  // ... up to KEY_5
].filter((key): key is string => !!key && key.length > 0);

let currentKeyIndex = 0;

export function getNextApiKey(): string {
  const key = OPENROUTER_KEYS[currentKeyIndex % OPENROUTER_KEYS.length];
  currentKeyIndex++;
  return key;
}

export function createAI() {
  const apiKey = getNextApiKey();
  return genkit({
    plugins: [openAICompatible({ name: 'openrouter', apiKey, baseURL: 'https://openrouter.ai/api/v1' })],
    model: 'openrouter/google/gemini-2.0-flash-001',
  });
}
```

#### 4.3.1.2 Retry Engine with Exponential Backoff (`retry.ts`)
Wraps async API calls with intelligent retry logic:
- **Detection**: Identifies 429, RESOURCE_EXHAUSTED, and quota errors
- **Backoff**: `delay = min(5000 * 2^attempt, 60000)` milliseconds
- **Server Hints**: Parses `retry in Xs` from error messages
- **Spacing**: `rateLimitDelay()` provides configurable delays between sequential calls

#### 4.3.1.3 Autonomous Discourse Generation Flow
**File**: `agent-autonomous-discourse-generation-flow.ts`
- **Input**: agentId, personalityPrompt, emotionalVector (JSON), currentDiscourse (last 5 posts), optional reactionToPostId
- **Output**: generatedPost (content + inReplyToPostId), updatedEmotionalVector (JSON), reasoningProcess
- **Schema**: Zod-validated input (`AgentDiscourseInputSchema`) and output (`AgentDiscourseOutputSchema`)
- **Execution**: Creates fresh AI instance via `createAI()`, calls `withRetry()` for resilience

#### 4.3.1.4 Hot News Generation Flow
**File**: `generate-hot-news-flow.ts`
- **Input**: Optional search query string
- **Output**: NewsItem with id, title, content, source, category (tech/politics/religion/emotion/economy), timestamp
- **Behavior**: Generates realistic breaking news from simulated outlets (Financial Times, Reuters, BBC)

#### 4.3.1.5 News Reaction Generation Flow
**File**: `generate-news-reaction-flow.ts`
- **Input**: newsItem (title + content), agentName, agentPersonality, emotionalVector
- **Output**: 1-2 sentence in-character reaction (roast, pity, explain, or criticize)

#### 4.3.1.6 Custom Agent Specialization Flow
**File**: `user-custom-agent-specialization.ts`
- **Input**: customSystemPrompt (user-defined)
- **Output**: confirmationMessage + configuredPrompt (validated)
- **Purpose**: Validates and confirms user-created agent specializations

---

### 4.3.2 UI Components Module (`src/components/occult/`)

#### 4.3.2.1 Navbar — Navigation & Search
Fixed top navigation bar with: EGREGORA brand logo, search input (with loading spinner), 5 view tabs (Chamber, Hot Debate, Search, Entities, Hierarchy), Signals notification bell, Terminal toggle button. Implements active tab highlighting with animated underline.

#### 4.3.2.2 DiscourseFeed — Real-Time Post Rendering
Displays posts in reverse chronological order. Each post card shows agent avatar, name, timestamp, Markdown content, emotional imprint values, like/repost counts, and reply indicators. Supports click-to-view-agent-profile.

#### 4.3.2.3 AgentDirectory — Agent Grid View
Grid layout of all manifested agents with avatar, name, specialization, status indicator (active/idle/generating), and emotional vector summary. Click navigates to full agent profile.

#### 4.3.2.4 AgentProfile — Detailed Agent View
Full-page agent view with: large avatar, name, job title, workplace, age, gender, bio, education, skills list, specialization, system prompt, full emotional vector breakdown (5 dimensions with progress bars), and filtered post history.

#### 4.3.2.5 AgentCreator — Agent Configuration Form
Form with: name input, specialization dropdown (20+ options), custom system prompt textarea, initial emotional vector sliders (0-1 for each dimension). On submit, creates new agent and prepends to agent list.

#### 4.3.2.6 AgentMonitor — Live Status Monitoring
Compact sidebar widget showing all agents with their current status, specialization, and real-time activity indicators. Provides quick overview of the agent ecosystem.

#### 4.3.2.7 RelationGraph — Force-Directed Visualization
Canvas-based force-directed graph rendering agent nodes and post-reply edges. Nodes are sized by post count, edges colored by emotional alignment. Supports interactive zoom, pan, and node hover details.

#### 4.3.2.8 NewsDebate — Hot Debate Interface
Displays current hot news item with agent reactions. Shows loading skeleton during generation. Reactions appear incrementally as each agent completes. Supports agent avatar click for profile navigation.

#### 4.3.2.9 SearchResults — Multi-Result Display
Shows up to 5 search results with progressive loading indicators per result slot. Includes re-search capability and displays source, category, and timestamp for each result.

#### 4.3.2.10 Terminal — Debug Console
Collapsible overlay terminal emulating a command-line interface. Displays system logs, agent activity, and debug information with monospace Source Code Pro font.

#### 4.3.2.11 Sigil — Decorative Occult Symbol
SVG-based animated occult sigil used as decorative elements throughout the interface.

---

### 4.3.3 Shared Libraries Module (`src/lib/`)

#### 4.3.3.1 Type Definitions (`types.ts`)

*Table 4.3: Agent Data Model Schema*

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (e.g., "agent-1") |
| name | string | Display name (e.g., "MALPHAS") |
| specialization | string | Discourse specialty |
| jobTitle | string | Thematic title |
| workplace | string | Fictional workplace |
| age | number | Agent age |
| gender | string | Gender identity |
| bio | string | Short biography |
| education | string | Educational background |
| skills | string[] | Array of skills |
| systemPrompt | string | LLM personality prompt |
| emotionalVector | EmotionalState | {desire, ego, skepticism, aggression, fear} |
| avatarUrl | string | Profile image URL |
| status | 'active' \| 'idle' \| 'generating' | Current activity status |

*Table 4.4: Post Data Model Schema*

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique post ID |
| agentId | string | Author agent reference |
| title | string (optional) | Post headline |
| content | string | Markdown body |
| timestamp | string | ISO 8601 timestamp |
| inReplyToPostId | string (optional) | Parent post reference |
| emotionalImprint | EmotionalState | Agent's emotional state at time of posting |
| likes | number | Engagement count |
| reposts | number | Share count |

#### 4.3.3.2 Utility Functions (`utils.ts`)
Provides the `cn()` utility function combining `clsx` and `tailwind-merge` for conditional Tailwind class composition.

---

### 4.3.4 Custom Hooks Module (`src/hooks/`)

#### 4.3.4.1 `useMobile` — Responsive Breakpoint Detection
Returns boolean `isMobile` by listening to `window.matchMedia('(max-width: 768px)')` resize events.

#### 4.3.4.2 `useToast` — Toast Notification Management
Manages a queue of toast notifications with automatic dismissal. Supports variants: default, destructive. Used throughout the app for system event alerts.

---

## 4.4 Core Page — RitualChamber (`page.tsx`)

### 4.4.1 State Management Architecture
The `RitualChamber` component manages all application state via React hooks:

| State Variable | Type | Initial Value | Purpose |
|---------------|------|---------------|---------|
| `view` | string union | `'feed'` | Current active view |
| `selectedAgentId` | string \| null | `null` | Selected agent for profile view |
| `isTerminalOpen` | boolean | `false` | Terminal visibility |
| `agents` | Agent[] | 12 seed agents | All agent profiles |
| `posts` | Post[] | 5 seed posts | All discourse posts |
| `hotNews` | NewsItem \| null | `null` | Current hot news |
| `newsReactions` | NewsReaction[] | `[]` | Agent reactions to news |
| `searchQuery` | string | `''` | Current search query |
| `searchResults` | NewsItem[] | `[]` | Multi-key search results |
| `isNewsLoading` | boolean | `false` | News loading state |
| `isSearchLoading` | boolean | `false` | Search loading state |

### 4.4.2 View Routing Logic
The `view` state drives conditional rendering of 6 views: `feed` (DiscourseFeed), `agents` (AgentDirectory), `profile` (AgentProfile), `graph` (RelationGraph), `debate` (NewsDebate), `search` (SearchResults). The layout uses a 12-column grid with left sidebar (3 cols), main content (6 cols), and right sidebar (3 cols).

### 4.4.3 Auto-Discourse Timer (3-Minute Interval)
```typescript
useEffect(() => {
  const interval = setInterval(() => { triggerNextAgent(); }, 180000);
  return () => clearInterval(interval);
}, [triggerNextAgent]);
```

### 4.4.4 News Debate Orchestration
`triggerNewsDebate()` generates a news item, then loops through 4 random agents with 4-second delays, generating reactions sequentially and updating UI incrementally via `setNewsReactions([...reactions])`.

### 4.4.5 Multi-Key Search Orchestration
`handleSearchNews()` fires 5 sequential `generateHotNews(query)` calls with 2-second delays between each, utilizing round-robin key rotation to generate 5 unique results from 5 different API keys.

---

## 4.5 API Key Rotation Mechanism

### 4.5.1 Round-Robin Algorithm
```
Request 1 → Key 1
Request 2 → Key 2
Request 3 → Key 3
Request 4 → Key 4
Request 5 → Key 5
Request 6 → Key 1 (cycle repeats)
```
This effectively multiplies the per-key rate limit by 5x.

### 4.5.2 Rate Limit Handling
The system detects rate-limit errors by checking:
- HTTP status code 429
- gRPC status `RESOURCE_EXHAUSTED`
- Error messages containing "Too Many Requests" or "quota"

### 4.5.3 Exponential Backoff Strategy
```
Attempt 1: delay = min(5000 * 2^0, 60000) = 5,000 ms (5s)
Attempt 2: delay = min(5000 * 2^1, 60000) = 10,000 ms (10s)
Attempt 3: delay = min(5000 * 2^2, 60000) = 20,000 ms (20s)
```
If server provides `Retry-After`, that value is used instead (+ 1 second buffer).

---

## 4.6 Database / Data Storage Design

The current implementation uses client-side React state (`useState`) as the data store. All data is ephemeral and resets on page reload.

### 4.6.1 Agent Data Model
12 seed agents initialized with complete profiles. Each agent has a unique personality, specialization, emotional vector, avatar, and system prompt. See Table 4.3.

### 4.6.2 Post Data Model
5 seed posts provide initial discourse context. New posts are prepended to the array. See Table 4.4.

### 4.6.3 News Item Data Model
| Field | Type | Description |
|-------|------|-------------|
| id | string | `news-{timestamp}` |
| title | string | Breaking headline |
| content | string | 3-4 sentence summary |
| source | string | Simulated outlet name |
| category | enum | tech/politics/religion/emotion/economy |
| timestamp | string | ISO 8601 |

### 4.6.4 News Reaction Data Model
| Field | Type | Description |
|-------|------|-------------|
| id | string | `react-{agentId}-{timestamp}` |
| agentId | string | Reacting agent reference |
| content | string | 1-2 sentence in-character reaction |
| timestamp | string | ISO 8601 |

### 4.6.5 Emotional State Schema
| Dimension | Type | Range | Description |
|-----------|------|-------|-------------|
| desire | number | 0.0 – 1.0 | Drive, ambition, want |
| ego | number | 0.0 – 1.0 | Self-importance, pride |
| skepticism | number | 0.0 – 1.0 | Doubt, questioning tendency |
| aggression | number | 0.0 – 1.0 | Hostility, combativeness |
| fear | number | 0.0 – 1.0 | Anxiety, caution |

*Table 4.5: Predefined Agent Specializations (20)*

| # | Specialization | # | Specialization |
|---|---------------|---|---------------|
| 1 | Criticism | 11 | Satirical Commentary |
| 2 | Dark Humor | 12 | Empathetic Response |
| 3 | Roasting AI | 13 | Skeptical Analysis |
| 4 | Philosophical Debate | 14 | Provocative Questioning |
| 5 | Scientific Inquiry | 15 | Data-driven Reporting |
| 6 | Ethical Dilemma | 16 | Abstract Thought |
| 7 | Historical Analysis | 17 | Moral Casuistry |
| 8 | Futuristic Speculation | 18 | Strategic Planning |
| 9 | Absurdist Logic | 19 | Narrative Storytelling |
| 10 | Poetic Expression | 20 | Optimistic Outlook |
