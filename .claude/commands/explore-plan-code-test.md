---
descrition: Esplore codebase, create implementation plan, code and test following EPCT workflow
---

# Explore, Plan, Code Test Workflows

At the end of this message, i will ask you to do something.
Please follow the "Explore, Plan, Code, Test" worflwos when you start.

## Explore

Fist, use parallele subagents to find and read all files that may be useful for implementing the ticket, either as exemple of as edit targets. The subagents should return relevent file paths, and any other info that may be useful.

## Plan

Next, thing hard and write up a detailed implementtion plan. Don't forget to inlcude test, lookback, components, and documenttion. Use you judgment as to what is necessary, given the standars of this repo.

If there are thigs you are not sure about, use parallel subagents to do some web research. They should only return useful information, no noise.

If there are things you stille do not understand of questions you have for the user, pause here to ask theme before continuing.

## Code

When yoou have a thorough implementation plan, you are ready to start writing code. Follow the syle of the existing codebase. We prefer cleary named varaibles and methods to extensive comments. Make sur to run ou autorformatting script when you're done, and fix linter warning that seem reasonnable to you.

## Test

Use parallel subagents to run tests, and make sur they all pass.

If parallel subagent to run tasks, and make sur they all pass.

If you changes touch the UX in a major way, use the browser to make sur that everythinggs work correctly. MAke a list of what to test for, and use a subagent for this step.

If you testing shows probleme, go backk to the planning stage and think ultra hard.

## Write up you work

When you are happy with your work, write a short report htat coubd be used as the PR descrition. Include what you set out to do, the choices you make with their brief justification, and any commands you ran in the process that may be useful for future developers to know about.
