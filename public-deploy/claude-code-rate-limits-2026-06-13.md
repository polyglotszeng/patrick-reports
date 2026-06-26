---
title: "3 Tips to Never Hit Claude Code Rate Limits Again"
author: "BridgeMind"
date: 2026-06-13
source: https://www.youtube.com/watch?v=jABu3QzPk98
duration: "9:55"
views: 12125
channel: BridgeMind
uploaded: "2026-05-28"
type: workflow
tags: [claude-code, rate-limits, productivity, vibe-coding]
---

# 3 Tips to Never Hit Claude Code Rate Limits Again

**Channel:** BridgeMind | **Duration:** 9:55 | **Views:** 12,125 | **Uploaded:** 2026-05-28

## Key Takeaways

| # | Tip | Action |
|---|-----|--------|
| 1 | Match effort level to task | Use Extra High for complex; Low/Medium for simple |
| 2 | Avoid sub-agents on $20 plan | 10 sub-agents = 100% in 5 min on Pro |
| 3 | One task per agent, then fresh context | Finish → Cmd+C → new window |

---

## Tip 1: Match Effort Level to Task

**Recommended: Extra High for most tasks**

| Effort | Benchmark Score | Hallucination | Best For |
|--------|----------------|---------------|----------|
| Max (reasoning) | 57.3 | High | Almost never |
| Extra High (non-reasoning) | 51.8 | Low | Complex PR reviews, architecture |
| High | — | Low-Medium | Most coding tasks |
| Medium | — | Low | Simple bugs, small changes |
| Low | — | Very Low | Centering a div |

> "Max is just complete overkill. Extra high will do just fine. And honestly, high or even medium will actually do fine for most tasks."

**Why Extra High > Max:** Non-reasoning model scores higher on coding benchmarks than the reasoning model, while hallucinating less.

---

## Tip 2: Avoid Sub-Agents on $20 Plan

**Live experiment:**
- 20 sub-agents launched simultaneously → **100% of $20 Pro plan used in 5 minutes**
- Same workflow on $200/20x plan → only 25% used in 5 hours

**Root cause:** Each sub-agent opens a fresh context window — context is expensive.

| Plan | Sub-Agent Strategy |
|------|-------------------|
| $200+ (20x Max) | Sub-agents are fine |
| $20 (Pro) | Avoid sub-agents; use sequential single-agent |

> "If you want to get the most out of your Claude subscription, you cannot be using sub agents on the $20 plan."

---

## Tip 3: One Task Per Agent, Then Fresh Context

**Correct workflow:**
1. Load project context (drag & drop folder into BridgeSpace / similar tool)
2. Give specific task prompt (e.g. "review security vulnerabilities in this API")
3. Agent completes task → **stop immediately**
4. Cmd+C / Ctrl+C — abandon the agent
5. Launch **fresh** agent for next task

**Why:**
- Long-running agent with "massive context window" consumes many more tokens per turn
- Fresh context = better signal, less hallucination
- Each task gets its own clean context

> "Once you finish a task, be done with it. Command C, control C. Be done with working with that Claude Code agent. Start a fresh window."

---

## Transcript Sections


### [0:00] Section 1

Claude code rate limits are finally fixed. And in this video, I'm going to be giving you three tips to make sure that you don't hit your cloud code rate limits. Yesterday, I was live for 9 hours for day 183 of vibe coding an app until I make a million dollars. And in a 5hour window, you can see that I was basically 4 hours into this session and I had only used 25% of my Claude 20X Max plan. Just a few months ago, this was literally getting rate limited within an hour. You were pretty much guaranteed to hit your 5h hour rate limit, especially during that peak hour period. But as you guys know, Anthropic signed a Compute deal with Space X. And ever since this deal, the rate limits have completely changed. So, for the purpose of this video, I'm going to be using a pro account, a $20 a month account, and I'm going to be putting this through my normal Vibe Coding workflow. and we're going to see how fast I hit my pro limits using my normal vibe coding workflow because I know that with the 20x plan, this is what it looks like. Okay, I'm able to launch dozens of sub agents over a 5 hour period and I have no problem with rate limits. But what does this look like on a $20 plan? We're going to figure that out today. And while I'm doing this, I'm going to be giving you the tips so that you don't hit your Claude code rate limits because a lot of people, they can't afford the $100 plan or the $200 plan, so they're stuck with this $20 plan. So, we're going to test this $20 plan. We're going to see how much usage we get. And while I'm doing that, I'm going to be giving you the tips so that you don't hit your Claude code rate limits. So, with that being said, I do have a like goal of 200 likes on this video. If you have not already liked, subscribed, and joined the Bridgemind Discord community, the home of the vibe coding movement, there's going to be a link in the description down below as as well as the pinned comment. And with that being said, let's get right into testing out the new Claude Code rate limits. All right, so the first tip that I'm going to give you guys is to make sure that you have your effort level set to the


### [2:02] Section 2

correct model. So you guys can see that I use Claude Opus 4.7 with extra high effort. And you have the ability to change this to max effort, extra high effort, high effort, medium effort, low effort. And I typically will keep this on extra high because max is just complete overkill. And let me show you why. If you look at artificial analysis, you'll see that Claude Opus 4.7 Max scores a 52.5 on the artificial analysis coding index. and Claude Opus 4.7 the higheffort non-reasoning model actually scores higher than the max reasoning model and there's a reason for this it's because the model will actually hallucinate more now in intelligence it does perform worse in intelligence you can see that the intelligence of max is 57.3 whereas the non-reasoning is only 51.8 eight. So, there is a difference there. But ultimately, I would just recommend that you use extra high. I think that for most things, if you have it in max, it's going to use way more usage, like way more. And it's also just overkill. Extra high will do just fine. And honestly, high or even medium will actually do fine for most tasks. With that said, let's now test this. Note that we're in Claude Opus 4.7 with extra high effort. And this is the Claude Pro plan. I currently have 0% used and we're just going to see how fast I hit the limits here. I need you to launch 10 deep dive agents and do a thorough review of all of our local changes that we have not yet shipped to GitHub. Review the code for any breaking changes and identify any issues with these changes before we ship this code to production. Okay, so I am going to submit this here and this is going to launch 10 deep dive agents and this is the next tip that I can give you guys and we'll actually see based off of this usage how much this singular prompt actually uses of the $20 plan. But this is my typical workflow. I'll launch a bunch of deep dive agents. Let's do the


### [4:04] Section 3

same thing. I'm just going to drop in bridge voice here. And I'm going to do the literally the same prompt. I'm going to post the same prompt uh into this agent down here, but for BridgeVoice, since we haven't shipped that code, let's just go over to BridgeVoice here. And I am just going to copy the same exact prompts here, and I'm going to submit them in. So, let's submit this. So, that's another 10 deep dive agents. So, 10 deep dive agents, 10 deep dive agents. And I have to say, when you're using this in a max plan, this is what got me to 25% used in only 5 hours. So, this is my typical workflow. If you launch these sub agents, they do get you better results because it launches a new context window with a fresh agent. So for example, agent one is reviewing the Rust main RS changes. This is this one is reviewing the Rust MCP changes. This one is reviewing the terminal render RS changes. So each of these agents are reviewing a different part of the codebase with a fresh context window. So it's less prone to hallucination when you do that. It works with the orchestrator agent at the top. And this is my typical vibe coding workflow. But what I'm mostly interested in seeing here is how much of this $20 plan is this going to use. All right, guys. So, it's been 5 minutes since I launched these sub aents. And I just got a little thing here. Stop and wait for limit to reset. So, let's X out here and check that usage again. And look at that. 100% used in 5 minutes on a clawed pro plan. I knew that this would happen. And the reason that I launched all of these sub aents was to actually prove my next point, which is that if you want to get the most out of your Claude subscription, you cannot be using sub agents. Sub agents are great and I use them constantly, but that's because I have a $200 20x plan. I can afford to launch sub agents. But if you are on this $20 plan, there's just no way that


### [6:05] Section 4

you can use sub agents. As you guys can see, that's the fastest way to hit your rate limit is just launch a bunch of sub aents. This goes for any plan that you're on. It doesn't matter what plan that you're on. It's just that on the 20x max plan, I don't have that issue where all of a sudden if I use sub agents, I'll be at my usage limit already. That does not happen if you guys are curious about that. So, that's going to now bring me to my third tip. So, we've talked about what to do, what not to do, and now I'm going to give you guys a little bit about what you should be doing. What should your workflow look like so that you don't have that happen to you, so that you don't hit your rate limits. First thing that you need to do is you need to make sure that you're following that first tip, which is to set your effort level for the task at hand. So, make sure that you change your effort level to whatever intelligence is needed for your task. If you're just centering a div, probably low effort is going to be good for you. Okay, medium effort is good as well. High effort is good as well. Honestly, you can do most tasks with high effort. Now, you need to make sure that you are using multiple claents at once with the correct effort level and that you are only using one claude code agent per task. So, let me show you what this looks like. If you guys use Bridgepace, which is the agent development environment that I'm using in this video, you can go check it out at bridgemind.ai. But I have Bridgeboard and you can see that I have different tasks and for each task I have all of the knowledge that's needed to complete that task. Okay. So, if we go over to Claude, you guys can see that I will typically be working with six to 12 Claude Code agents at once. But I only use one Claude agent to finish one task at a time. So for example, this agent here was working on debugging bridge swarms on codeex windows. Okay. So once you finish this task, don't keep working. Don't make the mistake of continuing to work in the same cloud code agent that has a massive context window that's using a ton of tokens to


### [8:07] Section 5

finish the next task. So once you finish a task, you can just do command C and launch a fresh context window. Okay? Just launch a fresh agent. Don't keep working with the same cloud code agent once you finish a task. Just make sure that hey, once you finish a task, drop in the context of whatever file or whatever folder you're working on. For example, if I'm using Bridgepace, I'll go over here and let's say that I was working inside of the BridgeMind API. I would just go over to BridgeMind API here and I would just drag and drop that folder and I would say, "Hey, here's the context." And I would just give it a prompt. I need you to review any security vulnerabilities in the API. And I would just give it that simple prompt. I would have it review it. And then I would be done with it. Once it finishes the task at hand, you shouldn't be continuing to work in the same cloud code window. Only use one cla code window per task. And once you're finished with the task, be done with it. Command C, control C. Be done with it. Be done with working with that Cloud Code agent. start a fresh window so that you're not using the same clawed code agent that has a massive context window. It's going to use up your tokens. So, it also does cause it to hallucinate more. So, that's a good tip for rate limits and hallucination just in general. But that's it, guys. Follow those three tips. You're going to see a massive improvement. If this video was helpful for you, make sure that you drop a like and subscribe to Bridgemind and join the Bridgemind Discord community, the home of the vibe coding movement. and let me know if I missed anything. There's a lot more ways that you can improve your token usage and make sure that you don't hit rate limits, but from my experience those three are the top three to make sure that you don't hit your rate limits. So with that being said, I will see you guys in the future.


---
**Source:** https://www.youtube.com/watch?v=jABu3QzPk98
