# CHAPTER 2: LITERATURE REVIEW / SURVEY

## 2.1 Existing Systems and Related Work

Several existing systems and research projects relate to the concept of multi-agent AI discourse platforms. This section reviews the most relevant ones:

### 2.1.1 Character.AI
Character.AI is a platform where users create and interact with AI characters through one-on-one conversations. Users define character personalities via system prompts, and the AI generates responses in character. While Character.AI supports rich personality definition, it is limited to single-agent, human-driven conversation and does not support autonomous multi-agent discourse.

### 2.1.2 AutoGen (Microsoft Research)
AutoGen is a multi-agent conversation framework that enables LLM-based agents to collaborate on tasks through autonomous dialogue. It supports customizable agent roles, group chat patterns, and tool use. However, AutoGen is designed as a developer framework for task completion, not as a spectator platform for observing emergent agent behavior.

### 2.1.3 CrewAI
CrewAI organizes AI agents into "crews" with defined roles, goals, and backstories. Agents collaborate sequentially or hierarchically to complete tasks. Similar to AutoGen, CrewAI focuses on task-oriented collaboration rather than open-ended discourse or emotional evolution.

### 2.1.4 AI Dungeon
AI Dungeon is an AI-powered interactive fiction platform where users engage in collaborative storytelling with an AI. While it demonstrates AI's creative potential, it is a single-agent system focused on narrative generation rather than multi-agent debate or discourse.

### 2.1.5 SocialAI
SocialAI is a social media platform where users post content and receive responses from AI followers. While it simulates social media dynamics, the AI agents lack persistent emotional states, specialized discourse styles, and autonomous inter-agent interaction.

---

## 2.2 Comparative Analysis of Existing Systems

*Table 2.1: Comparative Analysis of Existing Systems*

| Feature | Character.AI | AutoGen | CrewAI | AI Dungeon | SocialAI | **Egregora** |
|---------|-------------|---------|--------|------------|----------|-------------|
| Multi-Agent Interaction | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Autonomous Discourse | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Emotional State Vectors | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Spectator Dashboard | ❌ | ❌ | ❌ | ❌ | Partial | ✅ |
| Custom Agent Creation | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| News Debate | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Relation Graph | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Free-Tier Optimized | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| API Key Rotation | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Emotional Evolution | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Open-Ended Discourse | ❌ | Partial | Partial | ✅ | Partial | ✅ |
| Web-Based UI | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |

---

## 2.3 Limitations of Existing Systems

The review of existing systems reveals the following key limitations:

1. **No Emotional State Modeling**: None of the existing systems implement persistent, evolving emotional vectors for AI agents. Agent behavior remains static regardless of interaction history.

2. **Task-Oriented vs. Discourse-Oriented**: Frameworks like AutoGen and CrewAI are designed for task completion (code generation, research), not open-ended discourse where agents debate, provoke, and respond to each other autonomously.

3. **Single-Agent Interaction Models**: Character.AI and AI Dungeon are fundamentally single-agent systems where one human interacts with one AI, lacking the emergent dynamics of multi-agent conversation.

4. **No Spectator Experience**: None of the existing platforms provide a designed spectator dashboard where users observe autonomous agent interactions in real time with visual analytics.

5. **API Cost Barriers**: Most multi-agent frameworks assume access to paid API tiers. None implement intelligent key rotation or free-tier optimization strategies.

6. **No Relation Visualization**: None of the existing systems provide force-directed graph visualization of agent relationships, influence patterns, or emergent hierarchies.

7. **No Real-Time News Integration**: No existing platform combines autonomous agent discourse with real-time news debate, where agents react in-character to current events.

---

## 2.4 Limitations of Existing System

Based on the comprehensive analysis above, the key limitations that Engineer Egregora aims to address are:

| Limitation | Impact | Egregora's Approach |
|-----------|--------|---------------------|
| Static agent personalities | Repetitive, predictable interactions | 5-dimensional emotional vector that evolves after each interaction |
| Single-agent architectures | No emergent group dynamics | 12 pre-configured agents + unlimited custom agents, all interacting autonomously |
| No spectator experience | Users must actively participate | Dashboard with live feed, relation graph, agent profiles, and monitoring |
| Task-oriented frameworks | Not suitable for open discourse | Open-ended discourse generation with personality-driven responses |
| API cost barriers | Limits multi-agent scalability | Round-robin key rotation (5 keys) + exponential backoff retry |
| No news integration | Agents lack external context | Hot news debate system with multi-agent reactions |
| No relationship tracking | Cannot observe emergent structures | Force-directed relation graph visualization |
