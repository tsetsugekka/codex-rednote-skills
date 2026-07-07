<h1 align="center">Codex RED Note Skills</h1>

<p align="center">
  面向 RED Skill 发布和未来小红书内容工作流的公开安全 Codex skill suite。
</p>

<p align="center">
  <a href="./README.md">中文</a>
  ·
  <a href="./README.en.md">English</a>
</p>

<p align="center">
  <img alt="Codex" src="https://img.shields.io/badge/Codex-Skills-111827?style=for-the-badge">
  <img alt="RED Skill" src="https://img.shields.io/badge/RED%20Skill-Publishing-dc2626?style=for-the-badge">
  <img alt="Public Safe" src="https://img.shields.io/badge/Public--Safe-No%20Secrets-0f766e?style=for-the-badge">
</p>

---

## 这是什么

这个仓库是更宽泛的 RED/小红书相关 Codex skill suite。当前先包含 RED Skill 发布流程；仓库名刻意保留扩展空间，后续可以继续加入自动发布小红书图文、自动生成小红书信息图等 skill。

## 当前包含的 Skill

| Skill | 用途 |
| --- | --- |
| `red-skill-publish` | 将本地单个 Codex skill 发布到 RED Skill，包含字段限制检查、分类推荐、dry-run 校验、安全上传包生成、新建提交、已有 Skill 覆盖更新和提交结果回报 |

## `red-skill-publish`

当 Codex 需要把已有本地 Codex skill 发布到 **RED Skill** 时使用。

核心行为：

- 要求已安装 RED Skill 官方发布工具。
- 生成单个 skill 的上传包。
- 排除 `agents/`、缓存、日志、数据库、备份、凭据和私有文件。
- 检查 RED Skill 字段限制：Skill 名称 15 字、Skill ID 128 字、简介 1000 字、介绍 10000 字。
- 根据 skill 内容推荐 RED Skill 分类，不固定默认分类。
- 正式提交前必须 dry-run，并检查返回 payload。
- 支持已有 RED Skill 更新：当普通提交返回 `Skill ID 已被占用` 时，使用已有数字 `skill_id` 提交新版本，而不是改一个新 ID 重新发布。
- 提交后报告 `skill_id`、`version_id`、`audit_request_id` 和审核状态。

## 推荐结构

```text
skills/
  red-skill-publish/
    SKILL.md
    agents/
      openai.yaml
    references/
      category-selection.md
      field-limits.md
      package-rules.md
      troubleshooting.md
    scripts/
      prepare_red_skill_package.py
      submit_existing_red_skill.js
```

## 示例请求

```text
使用 $red-skill-publish 把这个本地 Codex skill 发布到 RED Skill。请根据 skill 内容推荐分类，先 dry-run，确认 payload 正确后再提交。
```

```text
使用 $red-skill-publish 更新我已经发布过的 RED Skill。已有 skill_id 是 1234，请保持原 Skill ID，不要重新创建一个新条目。
```

## 安全规则

- 不上传凭据、cookie、token、`.env`、私有本地路径、日志、数据库、备份或私有截图。
- RED Skill 上传包不包含 `agents/`。
- 官方 RED Skill 工具返回 submitted 之前，不声称已提交成功。
- RED Skill 明确显示审核通过之前，不声称审核成功。

## 许可证

默认不授予许可证。只有用户明确要求时才添加 license。
