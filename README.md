# 说人话（talk like human）项目

这个目录是一个长期学习项目，里面放着三个 Claude Code skill（2026-10-29 重组，按"什么时候用"拆分）：

| skill | 什么时候用 | `~/.claude/skills/` 下的链接 |
|---|---|---|
| `skills/talk-like-human` | 写任何东西时 | talk-like-human |
| `skills/talk-like-human-lab` | 学习、训练、和真人对比时 | talk-like-human-lab |
| `skills/zhihu-publish` | 用户说"发布"时 | zhihu-publish |

## 目标

| 阶段 | 目标 | 状态 |
|---|---|---|
| 第一阶段 | 去掉 AI 腔，读起来像真人写的 | 2026-10-27 起，学了小红书、知乎，做了 4 轮自我迭代 |
| 第二阶段 | **知乎高质量回答：人味足，同时质量高**。读者看完觉得"这人懂行，而且说得明白"，愿意点赞、收藏 | 2026-10-28 开始。同日用户判断"拟人这关还没过"：专业题的回答讲课腔重、冷门细节太多，所以**先回到拟人，专业性往后放** |

目前的标杆案例是 `skills/talk-like-human/examples/benchmark-zhihu-daily.md`（说人话第 5 轮，10 条知乎日常短答，用户认可）。

第二阶段说的"质量"，具体标准见 `skills/talk-like-human/genres/long-answer.md`。这份标准会跟着每轮学习修订。

## 学习方式（第二阶段）

把知乎上的问题当成用户真的来问我：
1. 用最专业的办法去解决（查资料、核实、算账、找机制）。
2. 写出 v1。
3. 和这个问题下的高赞回答逐条对比，反思差在哪。
4. 改出 v2，把反复出现的差距写进规则。

详细步骤见 `skills/talk-like-human-lab/`（SKILL.md 和 method.md）。

## 目录

- `skills/talk-like-human/`：写作 skill。
  - `SKILL.md`：入口，说明三层怎么读。
  - `core/`：通用层，每次必读，包括硬规则、AI 腔黑名单、打字质感、通用原则。
  - `genres/`：题型层。先读 `README.md` 认题，再读对应的长答、热点、短答、评论、聊天文件。
  - `platforms/`：平台层，知乎、小红书、B站、抖音、QQ、微信。
  - `examples/`：示例和标杆。
- `skills/talk-like-human-lab/`：训练 skill。
  - `method.md`：训练流程。
  - `rule-management.md`：规则怎么管。
  - `open-questions.md`：待定和待验证。
  - `scripts/`：标点统计、知乎读取。
- `skills/zhihu-publish/`：发布 skill，包括步骤和编辑器辅助代码。
- `evals/`：测试题、盲评结果、每轮迭代记录（`self-iteration/`）、自画图（`hot-images/`）。
- `notes/`：原始观察和 `CHANGELOG.md`，skill 不读。

2026-10-29 之前的记录里写的 `references/xxx.md`、根目录 `SKILL.md`，现在分别对应 `skills/talk-like-human/core|genres|platforms/`、`skills/talk-like-human/SKILL.md`。

## 许可证

MIT，见 [LICENSE](LICENSE)。
