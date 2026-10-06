# RED Skill 发布与版本更新

只操作用户指定的单个 Skill；suite 逐项处理。使用当前官方生产 CLI，每条命令显式 `--env prod`。工具或授权有问题时先读 [CLI 与授权恢复](red-cli-auth.md)。

1. 读取 [字段限制](field-limits.md)、[分类选择](category-selection.md)、[包规则](package-rules.md)，按主规则完成中文发布副本。保留原 Skill ID 和展示名；原创／转载及分类用会话中已明确的值，缺失时一次询问。
2. 新建与更新先区分。更新必须取得已有数字 `skill_id`：历史成功回执、官方版本历史或用户提供。不能用新 identifier 绕过“Skill ID 已被占用”。审核中是否允许更新以平台实际状态为准；需要撤回时先确认用户意图，不自动撤回。
3. 官方工具打包校验；可用 `scripts/prepare_red_skill_package.py --source "<源>" --output "<空目录>" --display-name "<名称>"` 制作公开副本，再翻译并执行 `--validate-only`。该脚本只验证 RED 字段及常见敏感文件，不证明翻译或全部资源安全。
4. 新建：运行官方 `redskillhub-upload publish "<中文副本>" --agent --source original --tag "<分类>" --name "<展示名>" --identifier "<ID>" --version "<版本>" --env prod`，在等待 `PROMPT.type=confirm` 的同一进程中核对 payload。当前官方流程优先以确认提示作为预提交检查；若本次官方流程支持／要求 dry-run，按其说明执行，不假定所有版本输出相同。
5. 已有更新：先核实安装版 CLI 是否原生支持数字 `skill_id`。1.0.3 的普通 publish payload 未包含该字段；此时使用本 Skill 的 `scripts/submit_existing_red_skill.js`，调用官方模块构造带数字 ID 的更新。先 `--dry-run`，通过后才正式执行：

```bash
node scripts/submit_existing_red_skill.js --uploader-root "<redskillhub-upload 安装目录>" --package "<中文副本>" --skill-id 1234 --identifier "existing-id" --name "展示名" --source original --tag "编程开发,效率工具" --version 1.0.2 --env prod --dry-run
```

6. 核对实际字段：`skill_id`（更新）、`skill_identifier`、版本、完整名称、中文 description／skill_md_content、来源、分类 ID、包大小与摘要。payload 文案与随包 `SKILL.md` 保持一致；只修改 CLI 的展示字段并不会翻译包内说明。
7. 在用户已经明确授权本次提交时继续；新建向仍在等待的官方进程写 `submit`，helper 更新去掉 `--dry-run`。无授权时展示具体可审阅内容后再请求；不要因工具新会话重复确认未变化的决定。
8. 保存返回 ID、版本、审核单号和展示状态，核对原条目版本历史。待审核与公开生效分别记录；网络超时先查是否已经提交，避免重发。

helper 仅用于当前已核验官方模块接口；模块变更导致不兼容时停止并检查官方更新能力，不降级到过期令牌或修改 ID 新建条目。更多拒绝原因见 [故障处理](troubleshooting.md)。
