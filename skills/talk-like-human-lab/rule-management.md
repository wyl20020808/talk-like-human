# 规则怎么管

学到的东西越来越多，靠下面几条防止规则打架、越堆越乱。

## 一条规则只有一个家

| 规则类型 | 放哪（写作 skill 内） |
|---|---|
| 用户明确定下的、最高优先级的 | core/hard-rules.md |
| 跨平台、跨题型都成立的 AI 腔和改法 | core/anti-ai-tone.md |
| 标点、错字、语气词、表情 | core/typing-texture.md |
| 为什么像人、通用写法 | core/principles.md |
| 只对某类题成立的（长答、热点、短答、评论、聊天、梗题） | genres/ 对应文件；认题的总表在 genres/README.md |
| 只对某个平台成立的 | platforms/ 对应文件 |
| 发布操作 | zhihu-publish skill |
| 训练流程本身 | 本 skill 的 method.md |
| 还没定的、等用户决定的 | 本 skill 的 open-questions.md |

- 每轮的过程和证据留在项目根目录 evals/self-iteration/，规则文件里只写结论和一句出处（哪一轮、哪几题）。
- 不按轮次往文件后面追加"第 N 轮学到的"新节。先找这条规则该归哪个已有小节，放进去。
- 同一个差距至少在 2 题里出现才写成规则；只出现一次的放 open-questions.md。

## 写之前查冲突

新规则写进去之前，在写作 skill 里搜一遍关键词（`rg 关键词 skills/talk-like-human`）：
- 有没有已有规则说了相反的话？有就二选一，把旧的改掉，不能两条并存。
- 冲突涉及用户定的硬规则时，不自己改，写进 open-questions.md 等用户决定。
- 示例句不能和黑名单撞（2026-10-29 发现"说白了"一边被禁、一边在 SKILL.md 和 zhihu.md 里当推荐用法）。

## 定期蒸馏

每 3–5 轮学习做一次：
1. 合并重复的条目，删掉被新发现推翻的。
2. 每个规则文件控制在 100 行左右，超了就合并或拆到更细的 genres/ 文件。
3. 检查 SKILL.md 的读取顺序还对不对，新文件有没有挂上。
4. 在 notes/CHANGELOG.md 记一笔蒸馏改了什么。

## 能量化就量化

标点这类能数出来的，用 scripts/punct_stats.py 对比真人和自己的稿子，不靠感觉。
