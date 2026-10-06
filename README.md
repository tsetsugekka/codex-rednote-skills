<h1 align="center">Codex Skill 发布工作流</h1>

<p align="center">将本地 Skill 或 AGENTS 规则发布到 GitHub，并以中文发布或更新到 RED Skill（小红书）和腾讯 SkillHub。</p>
<p align="center"><a href="./README.md">中文</a> · <a href="./README.en.md">English</a></p>

## 当前 Skill

[`red-tencent-skill-publish`](skills/red-tencent-skill-publish/SKILL.md) 提供 GitHub、RED 与腾讯发布工作流，支持用户指定的单个或多个平台；更新仍复用平台原条目身份。

- AGENTS 规则保留底稿与按需专题，在平台副本增加简短 `SKILL.md`，完整正文放入 references；不自动改写全局 AGENTS 或启用钩子。
- 展示名按平台设置：两平台均为“Skill多平台发布助手”；原 ID／slug 不变。
- 英文、日文源说明先完整翻译成中文发布副本，保留规则、命令和资源引用；默认不改变源仓库语言。
- 更新复用原条目 ID／slug，内容更新优先 CLI，避免创建重复条目。
- RED 使用当前官方生产工具；工具更新与授权过期恢复是按需流程，浏览器用于查找官方工具、授权和核对。
- 腾讯首次发布且需要图标时使用网页；后续内容更新优先 CLI，换图标再用网页。包内图片不等于平台展示图标。
- 腾讯图标采用浅底、现代扁平风格，控制元素数量；同系列统一、不同功能可辨识。仅改图标时网页复用当前 Skill 文件。
- RED／腾讯环境配置、CLI 发布与网页发布有独立按需 Workflow；官方凭据继续由各自工具管理。
- Private Reference 存在安装目录外，公开版提供空白模板；显式公开清单生成平台副本，排除个人记录、账号事实和内部回执。
- 平台元数据、包内容与授权逐项核对；分别报告预检、提交审核和公开发布状态。

## 使用

将 `skills/red-tencent-skill-publish` 目录安装到 Codex 的 Skill 目录；该 Skill 依赖对应平台的官方工具，不附带或复制登录凭据。

```text
使用 $red-tencent-skill-publish 将这个英文 Skill 翻译成中文发布副本，更新到 RED Skill 和腾讯 SkillHub 的原条目。保留原 ID、来源、分类和图标。
```

```text
使用 $red-tencent-skill-publish 恢复 RED CLI 的过期授权，然后通过 CLI 更新已有 Skill。网页仅用于工具更新和授权。
```

```text
使用 $red-tencent-skill-publish 首次发布到腾讯 SkillHub，需要上传图标，请走网页端。
```

## 按需资源

主文件只放共用规则和调用入口。平台流程、中文翻译、RED CLI 授权恢复、字段与分类要求位于 [references](skills/red-tencent-skill-publish/references)。三个脚本负责显式清单公开打包、RED 字段预检和调用官方模块更新已有条目；不会代替用户授权，也不证明审核通过。

排除凭据、cookie、私有日志、数据库、备份、账号截图及私有路径。RED 上传包不包含 `agents/`。工具能力与版本以当次官方核验为准。

## 许可证

默认不授予许可证。只有用户明确要求时才添加 license。
