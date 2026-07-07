---
name: red-skill-publish
description: 将本地 Codex skill 发布或更新到 RED Skill。适用于准备单个 skill 上传包、按内容选择 RED Skill 分类、校验名称/简介/介绍字数、正式提交前 dry-run、排除 agents 和私有文件、让 RED Skill 文案中文优先、处理登录过期/名称截断/Skill ID 已被占用，并在已有 skill_id 时覆盖更新已有 RED Skill 版本。
---

# RED Skill 发布

使用本 skill 将已有本地 Codex skill 发布到 **RED Skill**，或为已经存在的 RED Skill 提交新版本。本 skill 只负责打包、校验和提交，不负责创建 Codex skill 本身。

## 前置条件

- 当前环境已经安装 RED Skill 官方发布工具。
- 用户已经登录 RED Skill；如果工具返回 `NEED_LOGIN`，启动官方登录流程并让用户完成授权。
- 目标是单个 Codex skill 目录，且目录中有 `SKILL.md`。
- 如果是 skill suite，逐个 skill 分开发布。
- RED Skill 上传包不包含 `agents/`；只上传 `SKILL.md` 和公开安全的 `scripts/`、`references/`、`assets/`。
- 如果是更新已有 RED Skill，必须拿到已有的数字 `skill_id`。可以从历史成功提交结果、RED Skill 版本历史页面或用户那里确认。不要为了绕过 `Skill ID 已被占用` 而改一个新的 `skill_identifier`。

## 必须告诉用户的事

每个阶段开始前都要简短说明接下来做什么：

- 检查前：说明会读取本地 skill 元数据和公开资源。
- 打包前：说明会创建临时上传目录，不会修改源 skill，除非用户明确要求同步修改。
- dry-run 前：说明只验证字段和上传 payload，不正式提交。
- 提交前：说明这是新建发布还是已有 Skill 更新，并汇总展示名、Skill ID、已有 `skill_id`、简介、分类、来源类型和上传包内容。
- 需要登录时：说明 RED Skill 登录已过期，并启动官方登录流程。

## 工作流

1. 定位本地 skill 源目录。
   - 优先使用用户给出的本地路径。
   - 如果需要搜索，先搜索本地工作目录。
   - 本地文件已经存在时，不要从 GitHub 重新 clone。
2. 完整读取 `SKILL.md`。
3. 检查可选的 `scripts/`、`references/`、`assets/`。
4. 阅读 `references/field-limits.md`。
5. 如果任务也涉及 GitHub README 或仓库简介，阅读 `references/community-language.md`。
6. 阅读 `references/category-selection.md`，按 skill 内容推荐 1-2 个 RED Skill 分类。
7. 阅读 `references/package-rules.md`，创建单个 skill 的上传包。
8. 运行 `scripts/prepare_red_skill_package.py` 复制并校验上传包。
9. 判断是新建发布还是已有 Skill 更新。
   - 新建发布：没有已有 `skill_id`，用户也不是在更新已经提交过的 RED Skill。
   - 已有 Skill 更新：RED Skill 已存在、用户撤回了审核版本、用户要更新已发布/审核中的条目，或普通提交返回 `Skill ID 已被占用`。
   - 已有 Skill 更新必须保留原 `skill_identifier`，并用数字 `skill_id` 走更新 helper。
10. 运行 dry-run。
   - 新建发布：使用官方 RED Skill 工具的 `--dry-run`。
   - 已有 Skill 更新：使用 `scripts/submit_existing_red_skill.js --dry-run`，传入 `--skill-id`、`--identifier`、`--name`、来源、分类和上传包路径。
11. 检查 dry-run payload。
   - `skill_identifier` 是预期 Skill ID。
   - `name` 与展示名完全一致，没有被截断。
   - `description` 面向 RED Skill 时中文优先。
   - `skill_md_content` 完整且未超过 RED Skill 字数限制。
   - `content_tag_ids` 对应所选中文分类。
   - 已有 Skill 更新时，payload 必须包含数字 `skill_id`。
12. 使用用户已明确确认的来源类型、分类和提交意图继续。
13. 提交。
   - 新建发布：使用官方 RED Skill 工具提交。
   - 已有 Skill 更新：使用 `scripts/submit_existing_red_skill.js` 提交，让最终 payload 带上已有数字 `skill_id`。
14. 回报 `skill_id`、`version_id`、`audit_request_id`、展示状态和审核状态。不要把“已提交审核”说成“已审核通过”。

## RED Skill 字段限制

每次 dry-run 和提交后都要校验：

| 字段 | 限制 |
| --- | --- |
| Skill 展示名 | 最多 15 字 |
| Skill ID / `skill_identifier` | 最多 128 字 |
| 简介 / `description` | 最多 1000 字 |
| Skill 介绍 / `skill_md_content` | 最多 10000 字 |

计数按普通字符长度：英文字母、数字、标点、汉字、假名和空格都算 1 字。

展示名避免空格。已观察到上传器可能把 `Codex Skill GitHub发布` 这类带空格名称截断成 `Codex`。

## 来源和分类

- 来源类型必须明确：
  - 原创：使用官方工具的 original/source 选项。
  - 转载：提交前必须填写转载来源。
- 分类必须按 skill 内容选择，不要固定默认分类。
- 推荐分类时说明理由，并允许用户纠正。

## 上传包结构

上传包应为：

```text
upload-dir/
  SKILL.md
  scripts/
  references/
  assets/
```

没有的可选目录直接省略。不要包含 `.git`、`agents`、缓存、数据库、日志、备份、凭据、cookie 或私有截图。

## 官方工具用法

如果官方 RED Skill 工具以 Node CLI 暴露，用 `node path/to/index.mjs` 调用。

新建发布必须先 dry-run：

```bash
node path/to/red-skill-uploader/index.mjs publish /path/to/upload-dir --dry-run --agent --source original --tag 分类1,分类2 --name 展示名
```

payload 检查无误后再提交：

```bash
printf 'submit\n' | node path/to/red-skill-uploader/index.mjs publish /path/to/upload-dir --agent --source original --tag 分类1,分类2 --name 展示名
```

## 更新已有 RED Skill

官方 `publish` 命令可以用新的 `skill_identifier` 创建 RED Skill。更新已经存在的 RED Skill 时，普通提交可能因为 payload 没有数字 `skill_id` 而返回 `Skill ID 已被占用`。

这时使用更新 helper：

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

dry-run 检查无误后，去掉 `--dry-run` 再运行同一命令。

规则：

- 只在更新已有 RED Skill 且已知数字 `skill_id` 时使用。
- 保持原 `skill_identifier`，不要为了绕过唯一性创建相似的新 ID。
- 如果条目正在审核中，先让用户撤回或等审核结束，再提交更新。
- 不打印 RED Skill 登录 token。helper 读取官方上传器凭据，只输出状态、ID 和非敏感错误。

## 故障处理

以下情况阅读 `references/troubleshooting.md`：

- 工具返回 `NEED_LOGIN`。
- 展示名被截断或长度被拒绝。
- 上传包包含不支持文件。
- 提交返回 `SUBMIT_REJECTED`。
- RED Skill 页面出现英文优先文案。
- 更新已有 RED Skill 返回 `Skill ID 已被占用`。

## 安全规则

- 不上传 secret、凭据、cookie、私有本地路径、真实日志、数据库、备份或账号截图。
- 不打印登录 token 或刷新 token。
- 不为了适配 RED Skill 修改源 skill，除非用户明确要求把 RED Skill 版本同步回源仓库。
- 官方工具或 helper 返回 submitted 之前，不声称已提交。
- 结果只是提交或待审核时，不声称审核成功。
