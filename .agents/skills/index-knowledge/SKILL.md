---
name: index-knowledge
description: Generate hierarchical AGENTS.md knowledge base for a codebase. Creates root + complexity-scored subdirectory documentation. Use when onboarding agents, refreshing project docs, or after major refactors.
---

# index-knowledge

Generate hierarchical AGENTS.md files. Root + complexity-scored subdirectories.

## Usage

```
--create-new   # Read existing → remove all → regenerate from scratch
--max-depth=2  # Limit directory depth (default: 5)
```

Default: Update mode (modify existing + create new where warranted)

---

## Workflow (High-Level)

1. **Discovery + Analysis** (concurrent)
   - Launch parallel explore agents (multiple Task calls in one message)
   - Main session: bash structure + read existing AGENTS.md
2. **Score & Decide** - Determine AGENTS.md locations from merged findings
3. **Generate** - Root first, then subdirs in parallel
4. **Review** - Deduplicate, trim, validate

**TodoWrite ALL phases. Mark in_progress → completed in real-time.**

---

## Phase 1: Discovery + Analysis (Concurrent)

**Mark "discovery" as in_progress.**

### Launch Parallel Explore Agents

```
Task(description="project structure", subagent_type="explore",
  prompt="Project structure: PREDICT standard patterns for detected language → REPORT deviations only")

Task(description="entry points", subagent_type="explore",
  prompt="Entry points: FIND main files → REPORT non-standard organization")

Task(description="conventions", subagent_type="explore",
  prompt="Conventions: FIND config files (biome.json, package.json, AGENTS.md) → REPORT project-specific rules")

Task(description="anti-patterns", subagent_type="explore",
  prompt="Anti-patterns: FIND 'DO NOT', 'NEVER', 'ALWAYS', 'DEPRECATED' comments → LIST forbidden patterns")

Task(description="build/ci", subagent_type="explore",
  prompt="Build/CI: FIND .github/workflows → REPORT non-standard patterns")
```

### Main Session: Concurrent Analysis

```bash
# Directory depth + file counts
find . -type d -not -path '*/\.*' -not -path '*/node_modules/*' | awk -F/ '{print NF-1}' | sort -n | uniq -c

# Files per directory (top 30)
find . -type f -not -path '*/\.*' -not -path '*/node_modules/*' | sed 's|/[^/]*$||' | sort | uniq -c | sort -rn | head -30

# Existing AGENTS.md
find . -type f -name "AGENTS.md" -not -path '*/node_modules/*' 2>/dev/null
```

### Almach-specific locations (always consider)

| Path              | Why                                    |
| ----------------- | -------------------------------------- |
| `packages/ui/`    | Component library, `_styles.ts` tokens |
| `packages/forms/` | Form field patterns                    |
| `packages/query/` | Query/mutation factories               |
| `apps/docs/`      | Astro docs shell, demo pages           |

**Merge findings. Mark "discovery" completed.**

---

## Phase 2: Scoring & Location Decision

| Factor          | Weight | High Threshold       |
| --------------- | ------ | -------------------- |
| File count      | 3x     | >20                  |
| Subdir count    | 2x     | >5                   |
| Module boundary | 2x     | Has index.ts         |
| Unique patterns | 1x     | Own config/AGENTS.md |

| Score        | Action                    |
| ------------ | ------------------------- |
| **Root (.)** | ALWAYS create/update      |
| **>15**      | Create AGENTS.md          |
| **8-15**     | Create if distinct domain |
| **<8**       | Skip (parent covers)      |

---

## Phase 3: Generate AGENTS.md

### Root template

```markdown
# PROJECT KNOWLEDGE BASE

**Generated:** {TIMESTAMP}
**Commit:** {SHORT_SHA}

## OVERVIEW

{1-2 sentences: what + core stack}

## STRUCTURE

{tree with non-obvious dirs annotated}

## WHERE TO LOOK

| Task | Location | Notes |

## CONVENTIONS

{ONLY deviations from standard — Bun, Tailwind v4, React Aria}

## ANTI-PATTERNS (THIS PROJECT)

## COMMANDS

\`\`\`bash
bun install && bun run build && bun run lint
\`\`\`
```

**Quality gates**: 50-150 lines root, 30-80 lines subdirs, telegraphic style, no generic advice.

### Subdirectory AGENTS.md

One parallel Task per location. NEVER repeat parent content.

---

## Phase 4: Review & Deduplicate

- Remove generic advice
- Remove parent duplicates
- Trim to size limits
- Verify telegraphic style

---

## Anti-Patterns

- **Over-documenting**: Not every dir needs AGENTS.md
- **Redundancy**: Child never repeats parent
- **Generic content**: Remove anything that applies to ALL projects
- **Ignoring existing**: ALWAYS read existing first
