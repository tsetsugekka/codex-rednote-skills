# 公开发布副本与私人文件隔离

向 GitHub、RED 或腾讯发布前读取。真实 Private Reference 存在 Skill 外，详见 [私人记录契约](local-context.md)；公开包通过显式文件清单构建。

## 文件清单

本 Skill 的 `PUBLIC-FILES.txt` 是公开资源唯一清单：根入口、Workflow／Reference、脚本、空白私人模板。`agents/openai.yaml` 是公开本地 UI 配置，可随 GitHub 保留，RED／腾讯包不包含它。实际账号记录、发布回执、私有路径及内部任务文档不进 GitHub 或清单。

发布其它 Skill 时，由执行者检查公开范围并提供清单文件，每行一个包内相对文件路径。AGENTS 规则先生成根入口和所需 references，再列清单；只有改名／复制文件不足以证明安全。隐藏目录、私人文件、凭据与软链接不列入。

```bash
python scripts/prepare_public_skill.py --source "<源目录>" --manifest "<公开清单文件>" --output "<空的公开副本目录>"
```

本 Skill 的 Python 脚本需要 Python 3.10 或以上。该脚本只复制清单中的文件，拒绝越界、软链接、约定私人文件名、常见凭据与文本敏感模式，校验包内 Markdown 文件链接。不会修改源。脚本扫描不能识别所有私人内容；仍须阅读本次文档／资源，排除账号事实、私人消息与日志。

修改翻译和平台 frontmatter 后再次检查：

```bash
python scripts/prepare_public_skill.py --source "<源目录>" --manifest "<公开清单文件>" --output "<公开副本目录>" --validate-only
```

校验要求副本文件清单完全匹配；允许译文与平台元数据不同，但逐项检查它们的语义和字段。平台打包仍只针对此干净目录，核对最终 ZIP 路径、数量和内容摘要；不要将完整安装目录直接交给 CLI 上传。

## GitHub 与平台验收

- GitHub 暂存和实际提交只含公开资源及仓库说明，不依赖 `.gitignore` 作为秘密扫描。
- 两平台分别使用自己的字段校验和官方工具；RED 额外执行其字段限制检查。
- 空白模板允许公开，填写后的个人副本禁止公开。发现不在清单的文件或私人内容时停止提交并修正；不能只给文件换名后放行。
