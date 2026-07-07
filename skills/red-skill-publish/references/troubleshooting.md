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
