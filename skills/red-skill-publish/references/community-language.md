# Community Language Rules

Default to English for general public Codex skill repositories. Use a non-English default README and repository description only when the skill is clearly built for a specific community whose primary language is not English.

| Target community or platform | Default GitHub README | GitHub repository description |
| --- | --- | --- |
| General open-source developer audience | English | English |
| RED / Xiaohongshu / 小红书 | Chinese | Chinese |
| Sakura Server / さくらインターネット | Japanese | Japanese |
| China finance or Chinese data workflows | Chinese | Chinese |
| Japan market or Japanese operations workflows | Japanese | Japanese |

Rules:

- The default GitHub `README.md` is English unless the target community strongly points to another language.
- For a clearly community-specific skill, the default GitHub `README.md` should match that community's primary language.
- Other languages can be provided as secondary files, such as `README.en.md`, `README.zh-CN.md`, or `README.ja.md`.
- Example prompts must be localized in each README.
- Repository description should use the same language as the default README.
- RED Skill listing text should be Chinese-first unless the user explicitly asks for another target audience.

Examples:

- A RED Skill publishing suite: `README.md` in Chinese, optional `README.en.md`; repository description in Chinese.
- A Sakura Server deployment skill suite: `README.md` in Japanese, optional Chinese/English README files; repository description in Japanese.
- A generic GitHub automation skill: `README.md` in English; repository description in English.
