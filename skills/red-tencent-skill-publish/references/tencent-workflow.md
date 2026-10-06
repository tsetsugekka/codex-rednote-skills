# 腾讯 SkillHub 发布、更新与图标

平台为 `https://skillhub.cn`，CLI 为 `skillhub`；与小红书 `redskillhub-upload` 分开。执行前检查当前 `skillhub --version`、`skillhub publish --help`，不把旧版本能力写成永久限制。

## 选择入口

| 场景 | 入口 |
| --- | --- |
| 首次发布且需要平台图标 | 网页完成图标与 Skill 一起发布 |
| 首次发布，不需要图标 | CLI 或用户指定入口 |
| 已有条目，仅内容版本更新 | 优先 CLI，保留原图标与条目 |
| 修改平台图标 | 网页编辑已有条目，按当前页面能力操作 |

2026-10-06 核验的 CLI 2026.8.5 的 publish 参数与 payload 没有平台图标字段。包中的 `assets/icon.png` 或 `agents/openai.yaml` 图标不是 SkillHub 展示图标，不用它们假装完成上传。若用户需要新图标，先复用指定图或按用户要求生成，确认图像可用且元数据合规，再走网页；不额外制作未请求的图标。未来官方 CLI 增加图标能力时以实测为准。

## 准备与 CLI 提交

1. 定位所有者和已有 `slug`、当前公开／待审核版本，保留来源和平台元数据。不因为更新报 slug 冲突就另建相似条目；核对账号归属和审核状态。
2. 完成 [中文发布副本](publishing-language.md)。包根包含 `SKILL.md`；只纳入本次公开文件，显式检查文件清单，不仅依赖 CLI 默认排除规则。README 可随包，但不复制内部维护记录。
3. 在发布副本 frontmatter 中补齐当前 CLI 元数据。2026.8.5 必填 `slug`（kebab-case）、`version`（SemVer）、`displayName`；保留 Skill 本身的 `name` 与 `description`，再按需要填写 `summary`、`tags: [标签1, 标签2]`、`license`、`homepage`。展示文案中文；来源不是自动填 GitHub，许可证也不随意新增。
4. 先运行 `skillhub --skip-self-upgrade publish "<中文副本>" --version "<新版本>" --dry-run --json`。该版本 dry-run 仅验证元数据，不能证明上传、签名、图标或文件扫描通过；另行检查包内容、语言和所有待提交字段。
5. 用官方 `skillhub auth whoami` 核对授权。当前凭据由 CLI 保存在 `~/.skillhub/credentials.json`，使用其已保存凭据；不要把 token 放入 `--token` 或 `--key` 参数。失效时由用户在官方页面和可靠隐藏输入流程恢复，遵守当前环境凭据规则，不要求发到聊天。
6. 有本次明确发布授权后运行 `skillhub --skip-self-upgrade publish "<中文副本>" --version "<新版本>" --changelog "<中文更新说明>" --json`。该命令本身会提交，无交互确认门禁。
7. 保存 skillId、versionId（若返回）、status、publicUrl，核对审核与公开状态。401 恢复授权；403 检查权限；409 检查同一所有者／slug；429 或网络不稳定停止追加请求，遵守环境重试规则。

## 网页首发及图标验收

设计或更换图标前读取 [图标风格与仅改图标流程](tencent-icons.md)，复用已确认方案。

打开官方发布入口，使用获授权账号，填写与已核对中文副本一致的名称、简介、说明、来源、分类、版本；上传同一包及图标。先检查图标预览和完整字段，再按已有发布授权提交；出现需接受的新条款时遵守浏览器确认规则。

提交后核对原条目／新条目身份、版本状态和图标预览。只有公开页面实际显示图标才算图标生效；CLI 成功提交不证明图标已设置。后续 CLI 内容更新回读平台图标，意外变化时记录并通过网页恢复用户要求的图标，不重建条目。
