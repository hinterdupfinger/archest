---
sidebar_position: 3
---

# AI Agent Skills

Archest embraces the AI-native development workflow. We provide an official **Agent Skill** compatible with the [Vercel Labs Skills ecosystem](https://github.com/vercel-labs/skills).

By installing this skill, you give AI coding agents (such as Claude Code, Cursor, Windsurf, and Antigravity) the explicit context and instructions needed to write, update, and maintain architecture tests using `@archest/vitest`.

## Installation

You can install the skill directly from the Archest GitHub repository using the `skills` CLI:

```bash
npx skills add github.com/hinterdupfinger/archest/tree/main/skills/archest
```

> If you are working locally within the Archest monorepo, you can also install it via local path:
> `npx skills add ./skills/archest`

## What does the skill do?

The skill file (`SKILL.md`) contains a highly optimized prompt designed specifically for Large Language Models. When an agent is asked to "write an architecture test" or "enforce a boundary", the skill is activated, providing the agent with:

1. **Setup Instructions**: How to import `parseProject` and `setupMatchers`.
2. **Query API**: Examples of how to locate files, classes, and functions using options like `inFolder`, `withDecorator`, and `isTopLevel`.
3. **Matcher Reference**: A complete list of all custom matchers (e.g., `.toResideInFolder`, `.toBeFreeOfCycles`, `.toMatchNamePattern`).
4. **Architectural Patterns**: Reference implementations for `layeredArchitecture()` and macro-domain cycle detection.

With this skill installed, your agents will stop guessing how to use the framework and start writing perfect, native Vitest architecture rules on the first try!
