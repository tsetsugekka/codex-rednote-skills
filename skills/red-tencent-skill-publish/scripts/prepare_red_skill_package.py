#!/usr/bin/env python3
"""Prepare and validate a single-skill RED Skill upload package."""

from __future__ import annotations

import argparse
import os
import re
import shutil
import sys
from pathlib import Path


ALLOWED_DIRS = ("scripts", "references", "assets")
FORBIDDEN_DIRS = {
    ".git",
    "private",
    ".private",
    "agents",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
}
FORBIDDEN_SUFFIXES = (
    ".sqlite",
    ".sqlite-wal",
    ".sqlite-shm",
    ".db",
    ".log",
    ".backup",
    ".bak",
)
FORBIDDEN_NAMES = {
    ".env",
    "PRIVATE.md",
    "context.md",
    "credentials.json",
    ".DS_Store",
}
SECRET_PATTERNS = [
    re.compile(r"BEGIN [A-Z ]*PRIVATE KEY"),
    re.compile(r"(?i)(api[_-]?key|access[_-]?token|refresh[_-]?token|secret)\s*[:=]\s*['\"]?[A-Za-z0-9_\-]{16,}"),
]


def parse_skill_md(path: Path) -> tuple[dict[str, str], str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise ValueError("SKILL.md must start with YAML frontmatter")
    end = text.find("\n---\n", 4)
    if end == -1:
        raise ValueError("SKILL.md frontmatter closing marker not found")
    frontmatter_text = text[4:end]
    body = text[end + 5 :].lstrip("\n")
    metadata: dict[str, str] = {}
    for line in frontmatter_text.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if ":" not in line:
            raise ValueError(f"Unsupported frontmatter line: {line!r}")
        key, value = line.split(":", 1)
        metadata[key.strip()] = value.strip().strip("\"'")
    return metadata, body


def is_forbidden(path: Path) -> str | None:
    parts = set(path.parts)
    for dirname in FORBIDDEN_DIRS:
        if dirname in parts:
            return f"forbidden directory: {dirname}"
    name = path.name
    if name in FORBIDDEN_NAMES or name.startswith(".env."):
        return f"forbidden file name: {name}"
    lower = name.lower()
    if lower.endswith(".private.md") or (lower.startswith("private") and not lower.endswith(".template.md")):
        return "private record"
    for suffix in FORBIDDEN_SUFFIXES:
        if lower.endswith(suffix):
            return f"forbidden suffix: {suffix}"
    return None


def copy_allowed(source: Path, output: Path) -> None:
    if output.exists() and any(output.iterdir()):
        raise ValueError(f"output directory already exists and is not empty: {output}")
    output.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source / "SKILL.md", output / "SKILL.md")
    manifest = source / "PUBLIC-FILES.txt"
    if manifest.is_file():
        if manifest.is_symlink():
            raise ValueError("public manifest cannot be a symlink")
        shutil.copy2(manifest, output / manifest.name)
    for dirname in ALLOWED_DIRS:
        src_dir = source / dirname
        if src_dir.exists():
            if not src_dir.is_dir():
                raise ValueError(f"expected directory: {src_dir}")
            for candidate in src_dir.rglob("*"):
                rel = candidate.relative_to(source)
                if candidate.is_symlink() or is_forbidden(rel):
                    raise ValueError(f"not a public resource: {rel}")
            shutil.copytree(src_dir, output / dirname)


def scan_package(package: Path) -> list[str]:
    issues: list[str] = []
    for path in package.rglob("*"):
        reason = is_forbidden(path.relative_to(package))
        if reason:
            issues.append(f"{path.relative_to(package)}: {reason}")
        if path.is_file() and path.stat().st_size <= 2_000_000:
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            for pattern in SECRET_PATTERNS:
                if pattern.search(text):
                    issues.append(f"{path.relative_to(package)}: possible secret pattern")
    return issues


def validate_fields(package: Path, display_name: str) -> list[str]:
    metadata, body = parse_skill_md(package / "SKILL.md")
    issues: list[str] = []
    skill_id = metadata.get("name", "")
    description = metadata.get("description", "")
    if not skill_id:
        issues.append("SKILL.md frontmatter missing name")
    if not description:
        issues.append("SKILL.md frontmatter missing description")
    if len(display_name) > 15:
        issues.append(f"display name too long: {len(display_name)} > 15")
    if " " in display_name:
        issues.append("display name contains spaces; uploader may truncate it")
    if len(skill_id) > 128:
        issues.append(f"skill id too long: {len(skill_id)} > 128")
    if len(description) > 1000:
        issues.append(f"description too long: {len(description)} > 1000")
    if len(body) > 10000:
        issues.append(f"skill introduction too long: {len(body)} > 10000")
    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True, type=Path, help="Source single-skill directory containing SKILL.md")
    parser.add_argument("--output", required=True, type=Path, help="Empty output directory for RED Skill upload package")
    parser.add_argument("--display-name", required=True, help="RED Skill display name to validate")
    parser.add_argument("--validate-only", action="store_true", help="Validate output package without copying")
    args = parser.parse_args()

    source = args.source.expanduser().resolve()
    output = args.output.expanduser().resolve()

    if not args.validate_only:
        if not (source / "SKILL.md").is_file():
            print(f"ERROR: source SKILL.md not found: {source / 'SKILL.md'}", file=sys.stderr)
            return 2
        copy_allowed(source, output)
    elif not (output / "SKILL.md").is_file():
        print(f"ERROR: output SKILL.md not found: {output / 'SKILL.md'}", file=sys.stderr)
        return 2

    issues = scan_package(output)
    issues.extend(validate_fields(output, args.display_name))
    metadata, body = parse_skill_md(output / "SKILL.md")

    print(f"package={output}")
    print(f"skill_identifier={metadata.get('name', '')}")
    print(f"display_name={args.display_name}")
    print(f"description_chars={len(metadata.get('description', ''))}")
    print(f"skill_intro_chars={len(body)}")
    print("files:")
    for path in sorted(p for p in output.rglob("*") if p.is_file()):
        print(f"  {path.relative_to(output)}")

    if issues:
        print("issues:")
        for issue in issues:
            print(f"  - {issue}")
        return 1

    print("validation=ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
