# RED Skill Field Limits

Use these limits for every RED Skill dry-run and submit.

| Field | Limit | Notes |
| --- | --- | --- |
| Skill display name | 15 characters max | One English character, number, punctuation mark, CJK character, kana, or space counts as 1 |
| Skill ID / `skill_identifier` | 128 characters max | Usually comes from `SKILL.md` frontmatter `name` |
| Description | 1000 characters max | Usually comes from `SKILL.md` frontmatter `description` |
| Skill introduction / `skill_md_content` | 10000 characters max | Usually the `SKILL.md` body after frontmatter is removed |

Validation rules:

- Count with normal string length, not byte length.
- Avoid spaces in the display name because the uploader may truncate at the first space.
- Before dry-run, check the source package.
- After dry-run, check the returned payload. The returned `payload.name` must exactly match the intended display name.

Short-name guidance:

| Bad | Better |
| --- | --- |
| `Codex Skill GitHub发布` | `Skill发GitHub` |
| `Codex硬盘高频写入Bug修复` | `Codex硬盘写入修复` |
| `Codex Quota Lens额度查询` | `额度透视` |

If a value is too long:

- Shorten the display name first.
- For description, keep: what it does, when to use it, and the core workflow.
- For skill introduction, keep execution rules, workflow, safety boundaries, and references.
