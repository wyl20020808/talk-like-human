// 在已登录的知乎页面里用 javascript_tool 执行（浏览器面板，任意 zhihu.com 页面）。
// 只读：拉热榜、读问题详情和前排回答。回答 v4 接口要签名，这里改为解析问题页的 #js-initialData。

// 热榜：返回 [序号, 标题, 回答数, 关注数, 热度, 问题 ID]。
// 问题 ID 超过 JS 安全整数，必须从 url 字符串里取，不能用 target.id。
async function hot(limit = 50) {
  const r = await fetch(`/api/v3/feed/topstory/hot-lists/total?limit=${limit}&desktop=true`, { credentials: 'include' }).then(r => r.json());
  if (r.error) return r.error;  // code 101 = 没登录，请用户扫码
  return r.data.map((d, i) => [i + 1, d.target.title, d.target.answer_count, d.target.follower_count, d.detail_text, (d.target.url || '').match(/\d{10,}/)?.[0]]);
}

// 问题页的初始数据：问题详情 + 前排约 5 个回答（按赞排序）。
async function question(id) {
  const html = await fetch('/question/' + id, { credentials: 'include' }).then(r => r.text());
  const data = JSON.parse(new DOMParser().parseFromString(html, 'text/html').querySelector('#js-initialData').textContent);
  const ents = data.initialState.entities;
  const q = ents.questions[id];
  const toText = c => c.replace(/<\/p>/g, '\n').replace(/<br\/?>/g, '\n').replace(/<figure[\s\S]*?<\/figure>/g, '[图]\n')
    .replace(/<(b|strong)>/g, '**').replace(/<\/(b|strong)>/g, '**').replace(/<[^>]+>/g, '').replace(/&#34;|&quot;/g, '"');
  const answers = Object.values(ents.answers || {}).sort((a, b) => b.voteupCount - a.voteupCount).map(a => {
    const text = toText(a.content);
    return { author: a.author.name, votes: a.voteupCount, comments: a.commentCount, chars: text.replace(/\s/g, '').length,
      paras: (a.content.match(/<p/g) || []).length, images: (a.content.match(/<figure/g) || []).length,
      bold: (a.content.match(/<b>|<strong>/g) || []).length, text };
  });
  return { title: q.title, detail: toText(q.detail || ''), answerCount: q.answerCount, followers: q.followerCount, visits: q.visitCount, answers };
}

// 选题时先只看题面：question(id) 后只读 title/detail，盲写完再读 answers。
window.ZR = { hot, question };
