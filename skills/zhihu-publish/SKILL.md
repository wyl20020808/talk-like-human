---
name: zhihu-publish
description: 把写好的稿子发到知乎。用于用户明确说"发布""发到知乎""再发一下试试"时：在浏览器面板的知乎写回答页贴正文、传自画图、设创作声明、点发布、读接口返回、发布后核对。只负责发布操作，写作用 talk-like-human。
---

# 知乎发布

工具：内置浏览器面板（mcp__Claude_Browser__*），用户已登录的知乎。辅助代码在 [scripts/zhihu-editor.js](scripts/zhihu-editor.js)。

## 先决条件（缺一条就不发）

- 用户在这一轮明确说了"发布"。之前的授权不延续到新稿子。
- 稿子已经给用户看过。
- 当前账号：`fetch('/api/v4/me')` 看名字，换号后要重新贴，草稿不跟账号走。

## 步骤

1. 打开 `https://www.zhihu.com/question/<问题ID>/write`。编辑器不是空的就停下，问用户。
2. 注入 scripts/zhihu-editor.js，图要在页面里用 `K.table` 或自己写 canvas 重画。
3. 按"文字段 → 图 → 文字段"顺序：`Z.paste(段)`，等 0.8 秒；`await Z.upload(canvas, 名字)`，等 5–6 秒再贴下一段。
4. 核对 `Z.check()`：块数等于稿子的段数加图数，图片全是 ok（UPLOADING 就再等），字数对得上。
5. 创作声明选 **"无声明"**（发布设置里，通常默认就是）。
6. 点"发布回答"**一次**。
7. **先读返回再做下一步**：`read_network_requests` 过滤 `api/v4/content/publish`，读响应体。
   - 页面跳到 `/answer/<id>`：发布成功。
   - `code: 103002`（"回答过于频繁，已达本日或本周上限"）：**停，不重试**，告诉用户草稿已保存。这个上限可能按周算。
   - 点击时工具报错（比如"策略检查失败"）：先确认 URL 还在 /write，网络记录里也没有新的 publish 请求，再点第二次。
8. 发布后核对：在回答页读 `.RichText`，段数加图数等于贴之前的块数，开头和结尾对得上，作者是当前账号。
9. 记录：链接、核对结果写进本轮的 evals 记录和 notes/CHANGELOG.md（项目根目录 /Users/apple/talk-like-human）。

## 不要做

- 不用别人的照片，只传自画的数据图和对照表。
- 不连点发布，不在没读返回的情况下重试。
- 不改账号设置，不替用户登录；没登录就请用户扫码。
