# 学习轮 26：蒸馏（2026-11-03）

轮 22–25 之后。没有新样本。

## 做了什么

- skills/talk-like-human-lab/scripts/zhihu-read.js：comments() 的答主标记改用 author_tag（轮 24 发现 is_author 对楼中楼总是 false）；新增 search()，可以按关键词搜问题和文章，vertical 传 article 只搜文章。
- skills/talk-like-human-lab/SKILL.md 第 1 步：补历史高赞从推荐流挑、文章用搜索、评论用 comments() 和请求间隔。
- genres/README.md 题型表：作者回复从"短"改成"接一个点，可以长一点、补细节"，和轮 24 的数据一致（原来那格和新数据冲突）。
- platforms/zhihu.md 评论区：认错一条后面指向 comment.md"作者回复"。

## 查了没动的

- 轮 22 加的"'为什么'也要单独搜"放在 long-answer 第 1 节，和"机制查不到不拿猜测顶上"相邻，不重复：一个讲去搜，一个讲搜不到怎么办。
- comment.md 31 行、4636 字，long-answer 47 行，都在范围内。
- open-questions 三条等用户决定的：短判断开头（证据已攒到轮 25）、句中随口数数、聊天样本来源；另有日常短答松标点的长度上限和空格断开。
