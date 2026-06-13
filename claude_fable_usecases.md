---
title: "8 Insane Claude Fable Use Cases"
type: video
source: https://www.youtube.com/watch?v=o7NLUk1wTUo
date: 2025-06-14
authors:
  - Samin Yasar
tags:
  - claude
  - anthropic
  - agentic-ai
  - automation
  - mcp
related_notes:
  - llm-wiki/knowledge/ai-agent-business
  - llm-wiki/knowledge/solo-agent-business
---

# 8 Insane Claude Fable Use Cases

**URL:** https://www.youtube.com/watch?v=o7NLUk1wTUo
**Channel:** Samin Yasar
**Duration:** ~38 min
**Date:** June 2025

## Core Thesis

Fable 5 is built for **long-running autonomous tasks** — hours or days without babysitting. The paradigm shift: stop treating AI as a *tool*, start treating it as an *employee on payroll*. Fable runs until the job is done, tests its own work, and keeps looping.

Three principles from Enthropic's Cloud Code team (Thark):
1. Give it **context** like a thought partner
2. Give it **goals + verification methods**
3. Be **more ambitious** — ask it to do things you've never tried

---

## 8 Use Cases

### Use Case 1: /goal — The Contractor That Never Leaves
**Command:** `/goal create me a complete Minecraft game`

With `/goal`, Fable loops indefinitely until the job is done. It went out, found libraries, and built the entire app — without stopping at 5pm like previous models.

> "It used to be when you're using other models, the contractor would just leave at 5:00 p.m. regardless. But with /goal, he does not leave until the job is done." — Samin

**Tools:** Claude Code, Fable Max, /goal

---

### Use Case 2: Subscription Bookkeeper — $1,500/month Saved
Samin saved $1,500/month by having Fable audit and cancel unnecessary subscriptions automatically.

**Step 1:** Connect bank via Era Context (free, any bank)
**Step 2:** Ask Fable to "break down my finances for the last month" → generates pie charts + tables
**Step 3:** Claude for Chrome + Fable computer vision → auto-navigates and cancels subscriptions, running on Mac Mini overnight

**Tools:** Era Context, Claude for Chrome

---

### Use Case 3: Marketing Agent (Hicksfield + Fable)
Marketing = 10 jobs at once. Fable has "eyes" (visual taste) + self-improving prompts.

Demo: Generated full ad campaign for Claude Club — scraped site, found scripts, created 60-second motion graphics + image ads in parallel, auto-rejected bad ones, organized into approved/rejected folders.

**Prompt:** "Set a goal to make a full set of ads, images, and videos. Use Hicksfield MCP. Do them all in parallel. Put approved/rejected in folders."

**Tools:** Hicksfield MCP, school.com, /goal, workflow

---

### Use Case 4: Stock Research Agent (Firecrawl + Debating Agents)
Fable spins up **parallel sub-agents** that each do deep research, then debate each other. Output: the answer that survives all challenges.

**Prompt pattern:** "I have a hunch Tesla bottoms at $360. Prove it or destroy it. Pull 2 years of price data, back-test, check politician trades, check hedge fund moves. Have agents challenge each other. I want the answer that survives all arguments."

Result: Fable found the hunch was **wrong** — buying dips underperformed just holding Tesla.

**Tools:** Firecrawl MCP, Parallel Agents, Back-testing, HTML Visualization

---

### Use Case 5: Video Editor (Hyperframes)
Fable edited parts of this very video. It parsed the script, found relevant clips, added chapter markers, overlays, and sound effects — all via natural language.

**Demo:** "Edit the first 2 minutes. Add graphics, find tweets, put overlays, add chapter titles with sound effects."

**Tools:** Hyperframes, Claude Code, /goal

---

### Use Case 6: Sales Outreach Agent (Clay + Researcher Agents)
Finding + researching + personalizing outreach for hundreds of prospects is the hardest part. Clay brings verified data (150+ providers), Fable handles the endurance work.

**Prompt:** "Use Clay to find 10 YouTube creators in my niche (10-200k subs). For each, spin up researcher agent, get verified email, draft 3-sentence personalized message referencing their content and naming a gap."

> "Clay can hand us 100 perfect contacts, but someone still has to research them and write each message — that's hundreds of tasks. That's exactly what Fable is good at."

**Tools:** Clay MCP, Parallel Researcher Agents, Verified Email Data

---

### Use Case 7: HTML Data Visualization
Fable's coding + visual understanding = beautiful interactive HTML graphics on demand. All charts in this video were made by Fable.

**Tools:** Claude Code, HTML, Computer Vision

---

### Use Case 8: One-Person AI Company
The meta-use case: combine all above to build a service business. Find clients (Clay), do the work (Fable agents), package knowledge, sell it.

---

## Key Quotes

> "The longer and more complex the task, the bigger Fable leads." — Enthropic

> "Stop giving it tasks like it's a tool and start giving it responsibilities like it's on your payroll." — Samin

> "My job is increasingly more about direction and setup, not supervision." — Thark (Enthropic Cloud Code)

> "It's a slot machine — prompt, pray, try again. But Fable has eyes. It looks at every image and catches the bad ones and keeps learning." — Samin

---

## MCP Connectors Used

| Connector | Purpose | Free? |
|---|---|---|
| Era Context | Connect any bank account | Yes |
| Claude for Chrome | Browser automation | Yes |
| Hicksfield | AI video generation | Has free tier |
| Firecrawl | Web scraping | Free account |
| Hyperframes | Video editing | Free |
| Clay | Lead enrichment, verified emails | Has free tier |

---

## Discussion Questions

1. Which of the 8 use cases is most relevant to your current work?
2. How would you combine multiple connectors (e.g., Clay + Fable + Hicksfield) for your specific use case?
3. What tasks do you currently do manually that could be converted to long-running /goal tasks?
