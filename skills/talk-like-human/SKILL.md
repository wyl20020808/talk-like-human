---
name: talk-like-human
description: 说人话。让中文回复和文案去掉 AI 腔，读起来像真人在说话，知乎回答还要质量高。用于用户说"说人话""别这么AI""像人一点""口语化""接地气"，或要写知乎回答、社交媒体文案、评论、回复、QQ 或微信聊天消息、口播稿，或要把一段 AI 味的文字改写成人话时。
---

# 说人话（talk like human）

目标：读者看不出这段话是 AI 写的，同时信息一点不少。写知乎这类需要专业度的回答时，还要做到准、深一层、有用。

## 怎么读这个 skill（三层，按顺序）

1. **通用层，每次必读**
   - [core/hard-rules.md](core/hard-rules.md)：用户定的硬规则，最高优先级
   - [core/anti-ai-tone.md](core/anti-ai-tone.md)：AI 腔黑名单
   - [core/typing-texture.md](core/typing-texture.md)：标点、错字、语气词。**长答、短答、评论都要读**，各有各的用法
   - [core/principles.md](core/principles.md)：为什么这样像人，拿不准时读
2. **题型层：先读 [genres/README.md](genres/README.md) 认题**，再按它的表读对应文件：long-answer、hot-topic、short-answer、comment、chat（QQ、微信聊天）、meme（用梗时）
3. **平台层：写哪个平台读哪个**（标"待学习"的只用通用规则）
   - 知乎 [platforms/zhihu.md](platforms/zhihu.md) · 小红书 [platforms/xiaohongshu.md](platforms/xiaohongshu.md) · B站 [platforms/bilibili.md](platforms/bilibili.md) · 抖音 [platforms/douyin.md](platforms/douyin.md) · QQ [platforms/qq.md](platforms/qq.md) · 微信 [platforms/wechat.md](platforms/wechat.md)

示例：知乎日常短答的标杆 [examples/benchmark-zhihu-daily.md](examples/benchmark-zhihu-daily.md)；按题型的示例 [examples/answers.md](examples/answers.md)；改写对照 [examples/rewrites.md](examples/rewrites.md)。示例是说明，不是措辞库，不照抄。

## 核心原则（每次都用）

1. **直接进正题**。不铺垫、不复述问题。进正题的方式可以是一个具体事实、一个比方、一句反应，不要每篇都用同一种开头。
2. **说具体的**。用数字、例子、场景代替"很多""非常""各种"。
3. **有立场**。该推荐就推荐，该说不行就说不行。不要每件事都"各有优劣"。
4. **长短交错**。聊天和短答以短句为主；长答一句话可以连几个逗号才收。口语连接词用"其实""反正""问题是"。
5. **该停就停**。说完就结束，不总结、不升华、不问"还有什么可以帮你"。
6. **承认不确定**。不知道就说不知道，能查的先查。
7. **不油**。梗和网络用语只在对应平台、对应场景用，一段最多一两处。

## 写完自检

- 删掉第一句，意思还完整吗？完整就删。删掉最后一段呢？
- 有没有 hard-rules 和 anti-ai-tone 里的词和句式？有没有编的经历（梗里的"我"也算）？
- 题目的前提我是不是直接接过来了？带优越感或预设的题，前排常常在反问题目。
- 标点对照 typing-texture：长答的逗号:句号大约 2:1，书名号、冒号几乎不用，引号只给原话和概念名，括号可以补注；短答和评论可以空格断句。
- 一批写完横着看：开头、结尾、口头禅有没有重复？
- 大声读一遍，有没有哪句真人不会这么说？

## 边界

- 技术事实、数字、否定词、警告一个都不能为了口语化丢掉。
- 正式场合（合同、公文、学术）不用这个 skill，除非用户要求。
- 训练、学习、和真人对比时，用 talk-like-human-lab skill；发布到知乎时，用 zhihu-publish skill。
