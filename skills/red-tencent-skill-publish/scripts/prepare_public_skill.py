#!/usr/bin/env python3
"""Copy an explicit public file manifest into an empty publishing directory."""

import argparse
import re
import shutil
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit


PRIVATE_DIRS = {"private", ".private", "agents", ".git", "__pycache__"}
PRIVATE_NAMES = {"private.md", "context.md", "credentials.json", ".ds_store", ".env"}
PRIVATE_SUFFIXES = (".private.md", ".sqlite", ".db", ".log", ".bak", ".backup")
SENSITIVE = (
    re.compile(r"BEGIN [A-Z ]*PRIVATE KEY"),
    re.compile(r"(?i)(?:access_token|refresh_token|api_key)\s*[:=]\s*['\"]?[A-Za-z0-9_-]{16,}"),
    re.compile(r"\bskh_[A-Za-z0-9]{16,}\b"),
    re.compile(r"/(?:Users|home)/[^/\s<>]+/"),
)


def allowed_name(rel):
    parts = [p.lower() for p in rel.parts]
    if any(p.startswith(".") or p in PRIVATE_DIRS for p in parts):
        raise ValueError(f"private or hidden path: {rel}")
    name = parts[-1]
    if name in PRIVATE_NAMES or name.endswith(PRIVATE_SUFFIXES):
        raise ValueError(f"private file: {rel}")
    # Topic names such as private-page-sharing-patterns.md are not personal records.
    # The explicit manifest and content review determine their public eligibility.


def manifest_files(manifest):
    files = []
    for line in manifest.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        rel = PurePosixPath(line)
        if rel.is_absolute() or ".." in rel.parts or "\\" in line:
            raise ValueError("manifest contains an unsafe path")
        allowed_name(rel)
        if rel.as_posix() in files:
            raise ValueError(f"duplicate manifest entry: {rel}")
        files.append(rel.as_posix())
    if "SKILL.md" not in files:
        raise ValueError("manifest must contain root SKILL.md")
    return files


def regular_file(root, rel):
    p = root
    for part in PurePosixPath(rel).parts:
        p = p / part
        if p.is_symlink():
            raise ValueError(f"symlink is not publishable: {rel}")
    if not p.is_file():
        raise ValueError(f"manifest file missing: {rel}")
    return p


def markdown_without_code(text):
    lines = []
    fence = None
    for line in text.splitlines():
        m = re.match(r"\s*(`{3,}|~{3,})", line)
        if m:
            if fence is None:
                fence = m.group(1)[0]
            elif m.group(1)[0] == fence:
                fence = None
            continue
        if fence is None:
            lines.append(line)
    return "\n".join(lines)


def validate(root, files):
    actual = set()
    for p in root.rglob("*"):
        if p.is_symlink():
            raise ValueError("output contains a symlink")
        if p.is_file():
            actual.add(p.relative_to(root).as_posix())
    if actual != set(files):
        raise ValueError("output file list differs from public manifest")
    for rel in files:
        p = regular_file(root, rel)
        try:
            text = p.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        if any(pattern.search(text) for pattern in SENSITIVE):
            raise ValueError(f"possible credential or personal absolute path in {rel}")
        if p.suffix.lower() != ".md":
            continue
        for target in re.findall(r"\]\(([^)]+)\)", markdown_without_code(text)):
            target = target.strip().strip("<>")
            parsed = urlsplit(target)
            if parsed.scheme or not parsed.path:
                continue
            dest = (p.parent / unquote(parsed.path)).resolve()
            if not dest.is_relative_to(root) or not dest.is_file():
                raise ValueError(f"missing or external local reference in {rel}")
    skill = (root / "SKILL.md").read_text(encoding="utf-8")
    if not skill.startswith("---\n") or "\n---\n" not in skill[4:]:
        raise ValueError("root SKILL.md requires frontmatter")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--manifest", type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()
    source = args.source.expanduser().resolve()
    output = args.output.expanduser().resolve()
    if output.is_relative_to(source) or source.is_relative_to(output):
        raise ValueError("source and output must be separate directories")
    manifest = args.manifest or source / "PUBLIC-FILES.txt"
    files = manifest_files(manifest)
    if not args.validate_only:
        if output.exists() and any(output.iterdir()):
            raise ValueError("output directory must be empty")
        # Validate the entire source selection before copying anything.
        paths = {rel: regular_file(source, rel) for rel in files}
        output.mkdir(parents=True, exist_ok=True)
        for rel, p in paths.items():
            dest = output / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(p, dest)
    validate(output, files)
    print(f"validation=ok; public_files={len(files)}")
    for rel in files:
        print(rel)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError) as error:
        raise SystemExit(f"ERROR: {error}")
