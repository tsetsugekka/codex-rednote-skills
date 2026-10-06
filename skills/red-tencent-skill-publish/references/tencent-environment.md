# 腾讯发布环境配置与授权

初次配置、找不到 `skillhub`、CLI 陈旧或授权失效时读取。平台是 skillhub.cn，API 为官方 api.skillhub.cn；不复用 RED 凭据。

1. 检查 `skillhub --version`、`skillhub publish --help` 和 `skillhub auth --help`，复用已安装工具。官方入口见 [使用指南](https://skillhub.cn/tutorials#publish-via-cli)。工具不存在时，从当前指南取得 CLI-only 安装脚本，下载到临时目录、检查后按其 `--cli-only` 模式执行；不顺带安装预置 Skill。默认入口为用户可写的 `~/.local/bin`，优先使用完整路径或本进程 PATH，不无故修改全局配置。
2. 已有官方凭据时运行 `skillhub auth whoami`，核对账号与条目归属，只将必要定位信息写入本地 Private Reference。网页登录与 CLI 授权分开验证。
3. 首次账号、实名、API Token 的入口在个人中心。需要时让用户在官方页面完成对应认证；遵守当前环境对协议与身份信息的确认规则。缺少 Token 时采用隐藏输入与官方认证／存储流程，不把 key 放进命令参数、历史、日志、Markdown 或聊天。官方示例中的明文 `--key` 不作为本流程的输入方式。
4. 当前核验基线为 2026.8.5，个人凭据由官方 CLI 存在 `~/.skillhub/credentials.json`；后续以安装版实际位置为准，不自行迁移或复制。401 先核对凭据失效，403 核对账号权限或认证；不通过重建条目绕过所有权。
5. 配置成功以账号核验和本地发布预检分别验收；正式提交仍按 [腾讯流程](tencent-workflow.md) 或 [网页流程](tencent-web.md) 执行。更新 CLI 不删官方凭据目录，网络失败按当前环境有界重试规则处理。

环境记录仅含非凭据定位信息。工具版本、账号和访问能力需当次核验，旧记录不构成有效登录证明。
