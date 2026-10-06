# RED Skill 上传包规则

一个包只含一个 Skill，根目录为 `SKILL.md`；可选目录为 `scripts/`、`references/`、`assets/`，不存在时省略。

排除 `agents/`、`.git/`、`.env`／`.env.*`、缓存目录、`.DS_Store`、数据库（含 WAL／SHM）、日志、备份、凭据、cookie、私有截图和私有路径。公开资源逐项检查，不只按文件扩展名判断安全。

先按 [公开打包](public-package.md) 使用显式清单；实际 Private Reference 必须在 Skill 外，不能进入公开包。默认制作临时发布副本，不为适配平台修改源 Skill；若用户要求修改源文件则按授权同步。英文、日文说明先按 [中文发布副本](publishing-language.md) 翻译，不能只翻译页面简介而让包内说明仍为原语言。

预检：

1. 根 `SKILL.md` 和本次允许的资源齐全，内部引用可解析。
2. 无 `agents/` 与敏感文件。
3. 名称、简介和主说明符合 [字段限制](field-limits.md)。
4. 中文副本与源版本的规则、命令和脚本对应。
5. 官方工具生成的最终文件清单、字段、大小与摘要符合预期。

本文件专用于 RED。腾讯包要求见 [腾讯流程](tencent-workflow.md)，不要把两个平台的字段与 CLI 默认排除行为混用。
