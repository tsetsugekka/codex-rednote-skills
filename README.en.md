<h1 align="center">Codex Skill Publishing Workflow</h1>

<p align="center">Publish or update local skills in Chinese on RED Skill (Xiaohongshu) and Tencent SkillHub.</p>
<p align="center"><a href="./README.md">中文</a> · <a href="./README.en.md">English</a></p>

## Included Skill

[`red-tencent-skill-publish`](skills/red-tencent-skill-publish/SKILL.md) unifies RED and Tencent publishing and supports either user-selected platform or both. Updates preserve existing platform identities.

- Translate English and Japanese instructions into a complete Chinese publishing copy, preserving rules, commands, and references. Keep the source repository language unless requested otherwise.
- Reuse existing IDs and slugs; prefer CLI content updates without creating duplicate listings.
- Use the current official production RED tool. Load CLI updates and expired authorization recovery only when needed; use the browser to obtain the official tool, authorize, and verify listings.
- Use the Tencent website for a first publication requiring a platform icon. Prefer CLI for subsequent content updates; use the website to change the icon. An image inside a bundle does not set the platform icon.
- Use light backgrounds and modern flat icons with few elements; keep each series consistent and functions distinct. For icon-only changes, reuse the current skill files on the website.
- Verify metadata, package content, and authorization. Report local validation, review submission, and public release separately for each platform.

## Use

Install `skills/red-tencent-skill-publish` in the Codex skills directory. It relies on official platform tools and does not include credentials.

```text
Use $red-tencent-skill-publish to translate this English skill into a Chinese publishing copy and update its existing RED Skill and Tencent SkillHub listings. Preserve their IDs, source attribution, categories, and icons.
```

```text
Use $red-tencent-skill-publish to restore expired RED CLI authorization, then update the existing skill through CLI. Use the website only for tool updates and authorization.
```

```text
Use $red-tencent-skill-publish for a first Tencent SkillHub publication with an icon; use the website.
```

## Resources

The main file contains shared rules and conditional entry points. Platform workflows, translation, RED CLI authorization recovery, field limits, and categories live in [references](skills/red-tencent-skill-publish/references). The two scripts validate RED publishing copies and update existing listings through official modules; they do not replace authorization or prove audit approval.

Exclude credentials, cookies, private logs, databases, backups, account screenshots, and private paths. RED bundles exclude `agents/`. Verify current official tool capabilities and versions for each run.

## License

No license is granted by default. Add a license only when explicitly requested.
