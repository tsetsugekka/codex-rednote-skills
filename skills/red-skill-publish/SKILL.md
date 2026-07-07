---
name: red-skill-publish
description: Publish a local Codex skill to RED Skill using the official RED Skill publishing tool. Use when a user wants Codex to prepare a single-skill upload package, choose RED Skill categories from the skill content, validate RED Skill field limits, run dry-run before submit, avoid unsupported agents directories, keep descriptions Chinese-first for RED Skill, handle login/name-length/upload errors, and report skill_id/version_id/audit status after submission.
---

# RED Skill Publish

Use this skill to publish an existing local Codex skill to **RED Skill**. This is a packaging and submission workflow; it does not create the skill itself.

## Preconditions

- The official RED Skill publishing tool is installed and available in this Codex environment.
- The user is logged in to RED Skill, or is available to complete login if the tool reports `NEED_LOGIN`.
- The target is a single Codex skill directory containing `SKILL.md`.
- For a skill suite, publish each skill separately.
- Do not upload `agents/`; RED Skill upload packages should contain only `SKILL.md` and supported public resources.

## Required User-Facing Updates

Before each phase, tell the user what will happen:

- Before inspection: say you will read local skill metadata and public resources.
- Before packaging: say you will create a temporary upload directory and will not modify the source skill unless explicitly requested.
- Before dry-run: say you will validate RED Skill fields and upload payload without submitting.
- Before submit: summarize display name, identifier, description, categories, source type, and bundle contents.
- If login is needed: tell the user RED Skill login expired and start the official login flow.

## Workflow

1. Locate the local skill source.
   - Prefer the user-provided local path.
   - If searching, search local working directories first.
   - Do not clone from GitHub when the local skill already exists.
2. Read `SKILL.md` completely.
3. Inspect optional `scripts/`, `references/`, and `assets/`.
4. Read `references/field-limits.md`.
5. Read `references/community-language.md` when the task also involves GitHub README or repository metadata.
6. Read `references/category-selection.md` and recommend 1-2 RED Skill categories from the skill content.
7. Read `references/package-rules.md` and create a single-skill upload package.
8. Run `scripts/prepare_red_skill_package.py` to copy and validate the package.
9. Run the official RED Skill publishing tool with `--dry-run`.
10. Inspect the dry-run payload:
   - `skill_identifier` is the expected skill id.
   - `name` exactly matches the intended display name and was not truncated.
   - `description` is Chinese-first when publishing for RED Skill.
   - `skill_md_content` is complete and under the RED Skill limit.
   - `content_tag_ids` match the selected categories.
11. Ask for or use the user's explicit confirmation for source type, categories, and final submit.
12. Submit with the official RED Skill tool.
13. Report `skill_id`, `version_id`, `audit_request_id`, display status, and any review state.

## RED Skill Field Limits

Enforce these limits before dry-run and again after dry-run:

| Field | Limit |
| --- | --- |
| Skill display name | 15 characters max |
| Skill ID / `skill_identifier` | 128 characters max |
| Description | 1000 characters max |
| Skill introduction / `skill_md_content` | 10000 characters max |

Count characters with normal string length: one English letter, number, punctuation mark, CJK character, kana, or space all count as 1.

Avoid spaces in the display name. In observed uploader behavior, a name such as `Codex Skill GitHub发布` may be truncated to `Codex`.

## Source And Categories

- Source type must be explicit:
  - Original: use the official tool's original/source option.
  - Repost: require source attribution before submitting.
- Categories must be selected from the skill content, not hard-coded.
- Explain the category recommendation and let the user correct it when uncertain.

## Package Shape

The upload package should look like:

```text
upload-dir/
  SKILL.md
  scripts/
  references/
  assets/
```

Omit missing optional directories. Do not include `.git`, `agents`, caches, databases, logs, backups, credentials, cookies, or private screenshots.

## Official Tool Usage

Use the official RED Skill publishing tool available in the environment. If it is exposed as a Node CLI, invoke it with `node path/to/index.mjs`.

Always dry-run first. A typical command shape is:

```bash
node path/to/red-skill-uploader/index.mjs publish /path/to/upload-dir --dry-run --agent --source original --tag 分类1,分类2 --name 展示名
```

Then submit only after the payload is checked:

```bash
printf 'submit\n' | node path/to/red-skill-uploader/index.mjs publish /path/to/upload-dir --agent --source original --tag 分类1,分类2 --name 展示名
```

## Troubleshooting

Read `references/troubleshooting.md` when:

- The tool reports `NEED_LOGIN`.
- The display name is rejected or truncated.
- The upload package includes unsupported files.
- Submit returns `SUBMIT_REJECTED`.
- The uploaded content is not Chinese-first where expected.

## Safety Rules

- Do not upload secrets, credentials, cookies, private local paths, real private logs, database files, backups, or account screenshots.
- Do not print live tokens from login or credential files.
- Do not mutate the source skill just to fit RED Skill unless the user explicitly asks to sync the RED Skill copy back to the source repository.
- Do not claim the skill is submitted until the official tool returns a submitted response.
- Do not claim audit success when the result only says submitted or pending review.
