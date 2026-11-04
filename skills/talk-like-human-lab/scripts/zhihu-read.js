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

// 评论：回答下按热度的一层评论 + 每条的前 20 条楼中楼。只读，表情图转成 [文字]。
// 请求要慢（每次间隔 1 秒以上）。连发几十个会被 403 或 10003（请求参数异常）；
// 这时停下，在面板里打开任意一个回答页、点开评论，再接着采就恢复了（2026-11-03）。
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clean = h => (h || '').replace(/<img[^>]*alt="([^"]*)"[^>]*>/g, '$1').replace(/<a [^>]*>([\s\S]*?)<\/a>/g, '$1')
  .replace(/<br\/?>/g, '\n').replace(/<\/p><p>/g, '\n').replace(/<[^>]+>/g, '').replace(/&#34;|&quot;/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
async function getJSON(u) {
  await sleep(900 + Math.random() * 700);
  const r = await fetch(u, { credentials: 'include' });
  if (r.status !== 200) throw new Error('HTTP ' + r.status + ' ' + u);
  return r.json();
}
// 返回 [{lvl:1|2, root, t, like, kids, author}]，不存用户名。
// 答主标记在 author_tag（type=content_author），is_author 字段对楼中楼总是 false（2026-11-03 轮 24）。
const isAuthor = c => (c.author_tag || []).some(t => t.type === 'content_author');
async function comments(answerId, pages = 1) {
  const out = [];
  let url = `/api/v4/comment_v5/answers/${answerId}/root_comment?order_by=score&limit=20&offset=`;
  for (let i = 0; i < pages && url; i++) {
    const r = await getJSON(url);
    for (const c of r.data || []) {
      out.push({ lvl: 1, root: c.id, t: clean(c.content), like: c.like_count, kids: c.child_comment_count, author: isAuthor(c) });
      if (!c.child_comment_count) continue;
      const k = await getJSON(`/api/v4/comment_v5/comment/${c.id}/child_comment?order_by=score&limit=20&offset=`);
      for (const x of k.data || []) out.push({ lvl: 2, root: c.id, t: clean(x.content), like: x.like_count, author: isAuthor(x) });
    }
    url = r.paging?.is_end ? null : (r.paging?.next || '').replace('https://www.zhihu.com', '');
  }
  return out;
}

// 搜索：返回问题、文章的标题和赞数。vertical 传 'article' 只搜文章（2026-11-03 轮 19、25 可用）。
// 推荐流里的文章几乎全是软广，找文章用这个。
async function search(q, { vertical = '', offset = 0 } = {}) {
  const r = await getJSON(`/api/v4/search_v3?gk_version=gz-gaokao&t=general&q=${encodeURIComponent(q)}&correction=1&offset=${offset}&limit=20${vertical ? '&vertical=' + vertical : ''}&lc_idx=0&show_all_topics=0&search_source=Normal`);
  const strip = h => (h || '').replace(/<[^>]+>/g, '');
  return (r.data || []).map(x => x.object).filter(o => o && (o.type === 'answer' || o.type === 'article')).map(o => ({
    type: o.type, id: o.id, title: strip(o.title || o.question?.name), questionId: o.question?.id,
    votes: o.voteup_count, comments: o.comment_count, created: new Date((o.created_time || o.created) * 1000).toISOString().slice(0, 10) }));
}

// 选题时先只看题面：question(id) 后只读 title/detail，盲写完再读 answers。
window.ZR = { hot, question, comments, search };
