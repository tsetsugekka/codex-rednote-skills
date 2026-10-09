<h1 align="center">Skill Multi-Platform Publishing Assistant</h1>

<p align="center">Publish local skills or AGENTS rules to GitHub, and publish or update Chinese platform copies on RED Skill (Xiaohongshu) and Tencent SkillHub.</p>
<p align="center"><a href="./README.md">中文</a> · <a href="./README.en.md">English</a></p>

## Included Skill

The repository and Skill share the identifier [`red-tencent-skill-publish`](skills/red-tencent-skill-publish/SKILL.md). It covers GitHub, RED, and Tencent publishing for one or more user-selected platforms. Updates preserve existing platform identities.

- Preserve AGENTS rule sources and conditional topic documents. Add a short root `SKILL.md` in the platform copy and keep complete rules in references; do not automatically modify global AGENTS or enable hooks.
- Use platform-specific display names: “Skill多平台发布助手” on both platforms, preserving IDs and slugs.
- Use complete Chinese publishing copies of README, SKILL.md, and publishing instructions for RED, Tencent SkillHub, and AI Hub, preserving rules, commands, and references. Do not translate installed originals or GitHub source files solely for publishing; reuse existing Chinese content. After verifying the outcome, remove temporary Chinese copies and bundles created only for publishing, including failed or cancelled attempts.
- Reuse existing IDs and slugs; prefer CLI content updates without creating duplicate listings.
- Use the current official production RED tool. Load CLI updates and expired authorization recovery only when needed; use the browser to obtain the official tool, authorize, and verify listings.
- Use the Tencent website for a first publication requiring a platform icon. Prefer CLI for subsequent content updates; use the website to change the icon. An image inside a bundle does not set the platform icon.
- Use light backgrounds and modern flat icons with few elements. The [icon reference](skills/red-tencent-skill-publish/references/tencent-icons.md) includes color values, composition proportions, a Markdown prompt template, and written examples. Preserve each series' background and outline while distinguishing functions. For icon-only changes, reuse the current skill files on the website.
- Separate conditional workflows cover RED and Tencent setup, CLI publishing, and website publishing. Credentials remain in their official stores.
- Store actual Private References outside the installed skill; share only a blank template. Build platform copies from an explicit public file manifest, excluding personal records and internal receipts.
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

The main file contains shared rules and conditional entry points. Platform workflows, translation, RED CLI authorization recovery, field limits, and categories live in [references](skills/red-tencent-skill-publish/references). The three scripts build public copies from an explicit manifest, validate RED fields, and update existing listings through official modules; they do not replace authorization or prove audit approval.

Exclude credentials, cookies, private logs, databases, backups, account screenshots, and private paths. RED bundles exclude `agents/`. Verify current official tool capabilities and versions for each run.

## License

No license is granted by default. Add a license only when explicitly requested.
