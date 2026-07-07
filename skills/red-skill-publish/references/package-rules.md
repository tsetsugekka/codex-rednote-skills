# RED Skill Package Rules

RED Skill upload should be a single-skill package.

## Supported Shape

```text
upload-dir/
  SKILL.md
  scripts/
  references/
  assets/
```

Only `SKILL.md` is required. Omit optional directories when absent.

## Unsupported Or Unsafe Files

Do not include:

- `agents/`
- `.git/`
- `.env`, `.env.*`
- `__pycache__/`, `.pytest_cache/`, `.mypy_cache/`
- `.DS_Store`
- `*.sqlite`, `*.sqlite-wal`, `*.sqlite-shm`, `*.db`
- `*.log`
- `*.backup`, `*.bak`
- private screenshots
- credential, token, cookie, or key files

## Source Package Policy

- Prefer generating an upload-only temporary directory.
- Do not alter the source skill unless the user explicitly asks to sync RED Skill copy changes back.
- For a GitHub-first skill whose `SKILL.md` is English, it is acceptable to create a Chinese-first RED Skill upload copy without changing the GitHub source.
- For skill suites, package one skill at a time.

## Preflight Checks

Before dry-run:

1. Confirm package contains exactly one `SKILL.md`.
2. Confirm no `agents/`.
3. Confirm no forbidden file names or extensions.
4. Confirm field lengths against `field-limits.md`.
5. Confirm description is Chinese-first when targeting RED Skill Chinese users.
