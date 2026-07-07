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

Because Xiaohongshu is a Chinese community, the default GitHub README for this repository is Chinese. The GitHub repository description should also be Chinese.

## Included Skills

| Skill | Purpose |
| --- | --- |
| `red-skill-publish` | Publish a local single Codex skill to RED Skill with field-limit checks, category selection, dry-run validation, safe upload packaging, and submission reporting |

## `red-skill-publish`

Use this skill when Codex needs to publish an existing local Codex skill to **RED Skill**.

Key behavior:

- Requires the official RED Skill publishing tool.
- Builds a single-skill upload package.
- Excludes `agents/`, caches, logs, databases, backups, credentials, and private files.
- Checks RED Skill limits: 15-character display name, 128-character skill ID, 1000-character description, and 10000-character introduction.
- Chooses RED Skill categories from the skill content instead of using a fixed default.
- Runs dry-run before submit and verifies the returned payload.
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
```

## Example Prompt

```text
Use $red-skill-publish to publish this local Codex skill to RED Skill. Recommend categories from the skill content, run dry-run first, and only submit after the payload is correct.
```

## Future Scope

Planned companion skills can live in the same suite, for example:

- publishing image-and-text content to Xiaohongshu,
- generating Xiaohongshu information graphics,
- preparing localized RED Skill listing copy,
- checking RED/Xiaohongshu content packages for secrets and private data.

## Security Rules

- Do not upload credentials, cookies, tokens, `.env` files, private local paths, logs, database files, backups, or private screenshots.
- Do not include `agents/` in RED Skill upload packages.
- Do not claim submission succeeded until the official RED Skill tool returns a submitted response.
- Do not claim audit approval unless RED Skill explicitly shows approval.

## License

No license is granted by default. Add a license only when explicitly requested.
