# RED Skill Category Selection

Do not use a fixed default category. Choose categories from the skill content and explain the recommendation.

## Available Categories

- `效率工具`
- `内容创作`
- `学习成长`
- `职场办公`
- `编程开发`
- `生活决策`
- `金融理财`
- `其它`

## Selection Rules

Pick 1-2 categories that match the user's likely discovery path.

| Skill content | Recommended category |
| --- | --- |
| Code, GitHub, deployment, CLI, debugging, databases, APIs | `编程开发` |
| Automation, workflow cleanup, reminders, information management, personal productivity | `效率工具` |
| Writing, notes, social posts, captions, copywriting, content generation | `内容创作` |
| Tutorials, study plans, knowledge organization, language learning | `学习成长` |
| Meetings, email, HR, documents, spreadsheets, business processes | `职场办公` |
| Stocks, funds, market analysis, portfolio workflows | `金融理财` |
| Travel, shopping, daily planning, non-medical lifestyle decisions | `生活决策` |
| No clear fit | `其它` |

Implementation detail is not always the right category. A Python script that generates Xiaohongshu copy is `内容创作`, not necessarily `编程开发`.

## User-Facing Explanation

Before dry-run, say:

```text
我根据这个 skill 的用途推荐 RED Skill 分类：A、B。理由是……如果你想换成其它分类，我会按你的选择提交。
```

If uncertain, ask the user before submit.
