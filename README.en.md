<h1 align="center">Codex RED Note Skills</h1>

<p align="center">
  A public-safe Codex skill suite for RED Skill publishing and future RED/Xiaohongshu content workflows.
</p>

<p align="center">
  <a href="./README.md">中文</a>
  ·
  <a href="./README.en.md">English</a>
</p>

<p align="center">
  <img alt="Codex" src="https://img.shields.io/badge/Codex-Skills-111827?style=for-the-badge">
  <img alt="RED Skill" src="https://img.shields.io/badge/RED%20Skill-Publishing-dc2626?style=for-the-badge">
  <img alt="Public Safe" src="https://img.shields.io/badge/Public--Safe-No%20Secrets-0f766e?style=for-the-badge">
</p>

---

## What This Is

This repository is a broader Codex skill suite for RED/Xiaohongshu workflows. It starts with RED Skill publishing, and is intentionally named broadly enough to later include skills for publishing Xiaohongshu posts and generating Xiaohongshu-style infographics.

## Included Skills

| Skill | Purpose |
| --- | --- |
| `red-skill-publish` | Publish or update a local single Codex skill on RED Skill with field-limit checks, category selection, dry-run validation, safe upload packaging, existing-skill version updates, and submission reporting |

## `red-skill-publish`

Use this skill when Codex needs to publish an existing local Codex skill to **RED Skill**, or submit a new version for an existing RED Skill.

Key behavior:

- Requires the official RED Skill publishing tool.
- Builds a single-skill upload package.
- Excludes `agents/`, caches, logs, databases, backups, credentials, and private files.
- Checks RED Skill limits: 15-character display name, 128-character skill ID, 1000-character description, and 10000-character introduction.
- Chooses RED Skill categories from the skill content instead of using a fixed default.
- Runs dry-run before submit and verifies the returned payload.
- Supports existing RED Skill updates: when a normal submit returns `Skill ID 已被占用`, it uses the known numeric `skill_id` to submit a new version instead of changing the skill identifier and creating a duplicate.
- Reports `skill_id`, `version_id`, `audit_request_id`, and review state after submission.

## Recommended Layout

```text
skills/
  red-skill-publish/
    SKILL.md
    agents/
      openai.yaml
    references/
      category-selection.md
      field-limits.md
      package-rules.md
      troubleshooting.md
    scripts/
      prepare_red_skill_package.py
      submit_existing_red_skill.js
```

## Example Prompt

```text
Use $red-skill-publish to publish this local Codex skill to RED Skill. Recommend categories from the skill content, run dry-run first, and only submit after the payload is correct.
```

```text
Use $red-skill-publish to update an existing RED Skill. The existing skill_id is 1234; keep the original Skill ID and do not create a duplicate entry.
```

## Security Rules

- Do not upload credentials, cookies, tokens, `.env` files, private local paths, logs, database files, backups, or private screenshots.
- Do not include `agents/` in RED Skill upload packages.
- Do not claim submission succeeded until the official RED Skill tool returns a submitted response.
- Do not claim audit approval unless RED Skill explicitly shows approval.

## License

No license is granted by default. Add a license only when explicitly requested.
