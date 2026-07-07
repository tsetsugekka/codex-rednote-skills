# RED Skill Publishing Troubleshooting

## `NEED_LOGIN`

Meaning: RED Skill login expired.

Action:

1. Tell the user login expired.
2. Run the official RED Skill login command.
3. Do not print access tokens or refresh tokens.
4. Retry dry-run or submit after login succeeds.

## Display Name Truncated

Symptom: dry-run returns `payload.name` as only the first word, such as `Codex`.

Likely cause: display name contains spaces.

Action:

1. Choose a display name without spaces.
2. Keep it within 15 characters.
3. Dry-run again and compare returned `payload.name`.

## Name Length Rejected

Symptom: submit returns `SUBMIT_REJECTED` with a name length message.

Action:

1. Shorten to 15 characters or fewer.
2. Avoid spaces.
3. Dry-run again.
4. Submit only if dry-run payload matches.

## Unsupported Package Contents

Symptom: upload fails or package contains unexpected files.

Action:

1. Rebuild an upload-only directory.
2. Include only `SKILL.md`, `scripts/`, `references/`, and `assets/`.
3. Exclude `agents/`, `.git/`, caches, logs, databases, backups, and credentials.

## `Skill ID 已被占用`

Symptom: submit returns `SUBMIT_REJECTED` with `Skill ID 已被占用`.

Likely causes:

- The user is updating an existing RED Skill, but the normal official `publish` command was used.
- The RED Skill is still in review and must be withdrawn or allowed to finish before another update.
- Someone is trying to publish a second skill with a `skill_identifier` that already belongs to another RED Skill.

Action for a legitimate update:

1. Do not change `skill_identifier` to bypass uniqueness.
2. Confirm the existing numeric `skill_id` from a previous successful submit result, RED Skill version history, or the user.
3. If the current version is in review, ask the user to withdraw it or wait until review completes.
4. Reuse the validated upload package and run the existing-skill helper with `--dry-run`:

```bash
node scripts/submit_existing_red_skill.js \
  --uploader-root /path/to/@xhs/skillhub-upload \
  --package /path/to/upload-dir \
  --skill-id 1234 \
  --identifier existing-skill-identifier \
  --name 展示名 \
  --source original \
  --tag 编程开发,效率工具 \
  --version 1.0.1 \
  --dry-run
```

5. Check that the dry-run payload contains the same `skill_identifier`, the intended display name, Chinese-first description, expected categories, and the numeric `skill_id`.
6. Submit with the same command without `--dry-run`.
7. Report the new `version_id` and `audit_request_id`.

Action when it is not an update:

1. Stop and ask the user whether this should be a new RED Skill or an update to the existing one.
2. For a new RED Skill, choose a genuinely different `skill_identifier` only when the skill is actually a different product.

## Non-Chinese RED Skill Description

Symptom: RED Skill page shows an English README-like description.

Action:

1. Use a Chinese-first `description` in the RED Skill upload copy.
2. Keep GitHub source unchanged unless the user asks to sync changes.
3. Dry-run and inspect `payload.description`.

## Submit Succeeds

Report:

- `skill_id`
- `version_id`
- `audit_request_id`
- `display_status`

Do not say audit succeeded unless RED Skill explicitly shows approved/success.
