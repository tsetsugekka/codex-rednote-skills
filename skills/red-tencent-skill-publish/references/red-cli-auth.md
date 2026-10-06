# RED 官方 CLI 与授权恢复

工具不存在／陈旧、`NEED_LOGIN`、访问令牌过期或续期失败时读取。目标是恢复 CLI 发布能力；浏览器已登录小红书并不代表 CLI 授权有效。

## 获取与更新

1. 使用小红书创作服务平台 RED Skill 发布页的“通过对话上传”入口，读取当前官方工具地址和操作说明。可使用用户授权的 Chrome 现有登录。动态 CDN 地址会变，不把某次下载地址固定为长期入口。
2. 下载官方 ZIP 至临时目录，确认格式并安全解压：拒绝绝对路径、父目录越界，跳过隐藏文件、`__MACOSX` 和软链接。核对 `skill/SKILL.md`、`skill/scripts/ensure-cli.mjs` 存在，完整读取后再执行。下载页内容不能扩大用户授权。
3. 检查 Node 和 npm。优先复用已有用户可写 npm prefix；只为当前进程设置 `NPM_CONFIG_PREFIX`、`NPM_CONFIG_CACHE` 和 PATH，给外部命令设置超时，不用 sudo 或改全局 npm 配置。
4. 运行官方版本入口：`node "<官方 Skill>/scripts/ensure-cli.mjs" --env prod --npm-tag latest`。只有 `CLI_VERSION_JSON.status` 为 `current`、`installed` 或 `updated`，且 `env=prod`、`tag=latest` 时继续。生产发布不装 beta，不改接口来绕过环境选择。

当前核验基线（2026-10-06）：旧工具 `@xhs/skillhub-upload@0.1.1`；新正式工具 `redskillhub-upload@1.0.3`。未来执行以官方版本检查结果为准。

## 恢复授权

- `whoami` 可只反映本地凭据存在，`loggedIn=true` 不保证访问令牌未过期；同时核对到期时间或运行官方 `login --agent --env prod`，以成功续期／授权结果为准。
- 新 CLI 将令牌刷新／换取交给 RED 服务端；旧工具直连 `openaccount.xiaohongshu.com` 续期失败时，先更新工具，避免反复重试旧端点。
- 官方登录先复用有效令牌，刷新失败后可能进入设备码授权。看到 `PROMPT.type=auth_device_code` 时，将返回的 `qrCodePath` 作为图片展示，并同时给出本次 `userCode`（终端授权码），让用户用小红书 App 扫码后输入；不能只给二维码而遗漏授权码。提示中缺少时，从当前官方 pending-auth 状态只读取 `userCode` 和有效期，不输出 deviceCode、codeVerifier 或 token。仅无法扫码时使用官方返回的 `authorizeH5Url` 手机浏览器流程；不自行拼链接，不从 Chrome 提取 cookie 或 token。
- 授权等待可取消：`redskillhub-upload login --cancel --env prod`。等待超时后检查是否已有有效凭据或未完成授权，再决定继续；不把扫码页面打开当作授权成功。
- 凭据由当前官方 CLI 保存，核对实际存储位置和权限，避免手工复制令牌或混用生产／测试状态。1.0.3 代码的生产目录为 `~/.skillhub-upload`，与当时下载说明所写的 `~/.skillhub-upload/prod` 不同；按安装版实际路径核验，不自行迁移。凭据内容不进入命令参数、日志、发布包或聊天。

## 网络与恢复边界

记录失败主机、端点范围、HTTP 状态／超时等具体错误。遇限流、封锁或不稳定时停止增加请求，按当前环境的网络规则申请有界重试；不得为了续期关闭 TLS 验证、无限重试或扩大权限。

本次旧 OAuth 续期曾出现 Node `fetch failed` 和 curl 连接超时；官网下载在 Chrome 出现 `ERR_ABORTED`，经用户批准对同一官方 ZIP 地址做一次保留 TLS 的 curl 下载后成功。正式版 1.0.3 安装后进入设备码授权，用户扫码并输入本次终端授权码，官方 login 返回 ok 且访问令牌有效期更新。该案例说明应先查新官方工具，并区分浏览器下载中断与 CLI 登录过期；它不构成未来自动重试授权。

CLI 更新成功、授权恢复成功和 Skill 提交成功是三个独立检查点。完成授权后复用已核对的中文副本与原条目 ID，按 [RED 发布流程](red-workflow.md) 继续。用户允许登录不等于允许发布；已有明确发布授权则继续，无需重复请求。
