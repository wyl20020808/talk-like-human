---
name: talk-like-human-lab
description: 说人话项目的训练流程。用户说"继续学习""训练""迭代""和真人对比""看看高赞怎么写""沉淀到规则里"时用：选题、先盲写、拆前排高赞、对比、量化统计、把结论按规则管理办法写进 talk-like-human skill。平时写回答不用。
---

# 说人话训练（lab）

项目根目录：/Users/apple/talk-like-human。被训练的是写作 skill：skills/talk-like-human/（下称"写作 skill"）。

## 一轮训练怎么做

完整步骤见 [method.md](method.md)。最近几轮固定下来的顺序：

1. **选题**：用 [scripts/zhihu-read.js](scripts/zhihu-read.js) 在浏览器面板（已登录知乎）拉热榜。按"热度 × 回答数"挑，近期热榜和历史高热（几百万浏览的老题）都要有；跳过敏感时政、要亲身经历才能答的题、绕过平台限制类的题。历史高赞题从推荐流（`/api/v3/feed/topstory/recommend`）里挑赞数几千以上的回答；专栏文章用 `ZR.search(关键词, {vertical:'article'})`，推荐流里的文章几乎全是软广。评论用 `ZR.comments()`，请求间隔 1 秒以上。B 站评论不用登录，用 [scripts/bili-fetch.py](scripts/bili-fetch.py) 拉到 .private/，先只读它产出的 blind.md 盲写，再看 raw.json。
2. **盲写**：只读题面，按写作 skill 当前版本写完，存档，再看任何回答。守硬规则：不编经历。
3. **拆前排**：读前 5 篇，记字数、段数、图数、加粗、角度、情绪；没出处的说法单独列。高赞先判断是不是人话，营销腔、AI 腔、鸡汤不学。
4. **对比**：每个差距分成"我不知道 / 我没想到 / 我没写好"。标点用 [scripts/punct_stats.py](scripts/punct_stats.py) 量，不靠感觉。
5. **沉淀**：按 [rule-management.md](rule-management.md) 写进写作 skill 的对应文件，先查冲突；没定的写进 [open-questions.md](open-questions.md)。
6. **记录**：过程写进 evals/self-iteration/YYYY-MM-DD-*.md，notes/CHANGELOG.md 记一笔。
7. **汇报**：告诉用户学到了什么、改了哪些文件、哪些等他决定。

仿写热榜长答（要发布的那种）在第 2 步之后加：核实事实、算账、画图（只画数据图和对照表，matplotlib，存 evals/hot-images/），写初稿，对比前排改出终稿。发布交给 zhihu-publish skill，**用户说"发布"才发**。

## 记住的教训

- 规则学了要用：写长答时 typing-texture 照样要读（2026-10-29：第 3 轮整份跳过，被用户指出"标点太规矩"）。
- 矫枉过正也是问题：长答用空格断句同样假，按真人统计值来。
- 每 3–5 轮做一次蒸馏，见 rule-management.md。
- 开头最容易犯规（学习轮 13、14、15、17 每轮都有）：禁了"能，但……"，就换成"X 和 Y 是两回事""因为……""最大的区别是……"。盲写存档前把每篇第一句单独拎出来，对照 hard-rules 第 2、3 条过一遍。
