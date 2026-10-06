# GitHub 配置与发布 Workflow

用户指定 GitHub 发布时读取。GitHub 可以保留 Skill 或 AGENTS 的原生形态；需要另外发布 RED／腾讯时再制作带根 `SKILL.md` 的平台副本。

1. 核对指定本地仓库、远端、目标分支及私人记录中的定位线索。使用 `git remote -v`、`git branch --show-current`、`git status --short`、`git diff --cached` 确认范围，保留用户无关改动和暂存状态。复用配置好的 Git／gh 授权；缺失时用官方登录流程，凭据不放进私人 Markdown 或命令参数。
2. 用户只给本地文件且没有目标仓库时先准备可审阅公开文件，再确认仓库目标；未经要求不新建仓库、改可见性或另开分支。已有目标默认按其既定分支发布。
3. 按 [公开打包](public-package.md) 检查公开资源与私人文件边界。Skill 的实际 Private Reference 留在仓库外；公开 UI metadata 与空白模板可提交。AGENTS 规则源按用户指定主题保留底稿形态，不为 GitHub 强制增加 Skill 包装，不混入其它私人全局规则。
4. README／仓库简介按 [社区语言规则](community-language.md) 与用户要求同步；不擅自新增许可证或把原创登记成转载。修改后运行适当验证与 `git diff --check`，核对实际暂存文件；只提交本次内容。
5. 已获本次发布授权时 commit、push 到既定目标，核对远端提交与实际公开文件。GitHub 成功与 RED／腾讯提交独立登记，不能用某处成功代替其它平台。

公开文件含私人信息或分支冲突不能安全隔离时停止该目标提交，具体说明范围。网络失败遵守环境重试规则，未知结果先查远端是否已经收到提交再决定是否重做。
