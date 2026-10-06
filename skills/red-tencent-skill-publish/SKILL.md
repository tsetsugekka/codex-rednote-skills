---
name: red-tencent-skill-publish
description: 将本地 Skill 或 AGENTS.md 规则发布或更新到 GitHub、RED Skill（小红书）和腾讯 SkillHub（skillhub.cn）。支持 AGENTS 规则的 Skill 包装、中文发布、双平台环境配置、CLI／网页发布、图标上传与本地私人记录隔离。
---

# Skill 多平台发布助手

支持用户指定的 GitHub、RED、腾讯目标，分别执行对应 Workflow。历史本地 Skill 名称为 `red-tencent-skill-publish`；平台更新保留原条目 ID 和历史 identifier／slug，避免重复新建。只操作用户指定的平台；“SkillHub”指腾讯 skillhub.cn，“RED Skill”指小红书，不混用 CLI、凭据或条目 ID。

## 共用规则

- 以用户指定的本地目录或 GitHub 版本为源，完整读取源 `SKILL.md`／AGENTS 规则及本次会执行或发布的资源；本地已有源时先复用。比较最新版本时核对指定远端分支，不能把本地旧快照当作 GitHub 最新版。
- 源为 `AGENTS.md` 或其按需专题时，按 [AGENTS 规则包装](references/agents-wrapper.md) 制作带 `SKILL.md` 的平台副本；保留源规则形态与按需读取方式。
- RED 与腾讯均以中文发布。英文、日文源 Skill 的简介、主说明、发布说明和随包说明文档先完整翻译成中文；保留命令、参数、标识符、链接和规则含义。详见 [中文发布副本](references/publishing-language.md)。
- 账号、条目映射、本机配置和发布回执按 [私人记录契约](references/local-context.md) 存在 Skill 目录外；公开资源只含通用流程与空白模板。实际私人记录不提交 GitHub、不进入任一平台包，密钥仍由官方凭据存储管理。
- 默认在临时目录制作发布副本，保留源目录；用户要求修改 Skill 本身时才同步源文件。一个包只含一个 Skill；不上传凭据、私有路径、日志、数据库、备份和账号截图。
- 更新复用原条目身份：RED 数字 `skill_id` 和 `skill_identifier`，腾讯所有者及 `slug`。新版本递增，保留既有展示名、来源、分类和图标，除非用户要求更改。展示名可按各平台长度与用途分别设置，不改变 identifier／slug。翻译或增加包装不改变原创／转载归属。
- 使用当前官方工具。正常内容更新优先 CLI；RED 网页可用于查找官方工具、登录和核对条目。用户只授权通过网页修复 CLI 时，不转成网页提交。
- 正式提交前验证中文副本、文件清单和平台实际待提交字段。复用会话中已明确的来源、分类、版本和提交授权；仅缺失或实质变化时询问，不反复确认已有决定。
- 两个平台分别保存结果。一个成功、另一个失败时，只续做未完成项；提交超时先核对是否已创建版本，避免重复提交。

## 平台分流（按需读取）

| 当前任务 | 读取内容 |
| --- | --- |
| GitHub 环境核对与公开发布 | [GitHub Workflow](references/github-workflow.md) |
| 身份、原条目映射、本机配置或发布记录 | [私人记录契约](references/local-context.md)，只读本机对应私人文件 |
| 生成公开副本、排除私人资源 | [公开打包](references/public-package.md) |
| RED 初次配置／工具与授权恢复 | [RED 环境配置](references/red-cli-auth.md) |
| 腾讯初次配置／CLI 与凭据恢复 | [腾讯环境配置](references/tencent-environment.md) |
| AGENTS.md／按需规则专题作为发布源 | [AGENTS 规则包装](references/agents-wrapper.md) |
| RED 新建或已有版本更新 | [RED 发布流程](references/red-workflow.md)，以及其中引用的字段、分类和包规则 |
| 腾讯 CLI 新建／内容更新与入口选择 | [腾讯 SkillHub 流程](references/tencent-workflow.md) |
| 腾讯网页首发／更新／上传图标 | [腾讯网页流程](references/tencent-web.md) |
| 用户指定 RED 网页提交 | [RED 网页流程](references/red-web.md) |
| 腾讯图标设计、系列风格或仅改图标 | [腾讯图标规范](references/tencent-icons.md) |
| 英文／日文源、双平台翻译与内容对齐 | [中文发布副本](references/publishing-language.md) |
| RED 名称截断、包拒绝、ID 冲突、提交拒绝 | [RED 故障处理](references/troubleshooting.md) |
| 同时修改 GitHub README／仓库简介 | [社区语言选择](references/community-language.md) |

首次发布到腾讯且需要图标时走网页端；当前腾讯 CLI 不提供平台图标上传参数。后续内容更新优先 CLI，更换图标时再进入网页。把图片放进包内不等于设置平台图标。

## 验收与回报

先记录源版本／提交、发布副本的翻译范围、包摘要及各平台目标身份。提交后保存平台返回的条目 ID、版本 ID、审核单号（若有）、公开链接和状态。

区分“本地预检通过”“已上传”“已提交审核”和“已审核发布”。待审核时不能宣称与公开最新版本一致；只有公开版本、中文文案和文件内容回读匹配后才能确认同步完成。翻译后的文档以语义和规则对应关系核对，脚本与未翻译资源按文件摘要核对。
