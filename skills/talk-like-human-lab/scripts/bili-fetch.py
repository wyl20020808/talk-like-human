#!/usr/bin/env python3
"""不登录拉 B 站热门视频的评论：每视频前 3 条热评 + 楼中楼 + 按时间的普通评论。
用法：python3 bili-fetch.py OUT_DIR（OUT_DIR 放 .private/ 下，原始评论不进仓库）
产出：OUT_DIR/raw.json（全部），OUT_DIR/blind.md（只有标题、简介、一层热评，盲写用）

不登录的限制（2026-11-08 实测）：热评只给前 3 条；楼中楼每条只拿到第 1 页 20 条；
按时间排的每页只给 3 条。不带 buvid3 游客 cookie 请求几十次就返回 -352，带上并隔 2 秒能跑完 8 个视频。
回复里的 "@昵称" 在 raw.json 里只把开头的"回复 @x:"抹成"回复@某人:"，正文里的 @ 用前再抹。
"""
import json, sys, time, urllib.request, urllib.parse, re

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
SKIP_AID = set()                          # 已经看过的视频 aid，免得盲写前就见过回复
SKIP_TNAME = {'社科·法律·心理', '仿妆cos'}  # 时政擦边、个人生活照

def _buvid():
    req = urllib.request.Request('https://api.bilibili.com/x/frontend/finger/spi', headers={'User-Agent': UA})
    d = json.load(urllib.request.urlopen(req, timeout=15))['data']
    return f"buvid3={d['b_3']}; buvid4={urllib.parse.quote(d['b_4'])}"
COOKIE = _buvid()  # 游客标识，不是登录态

def get(path, **q):
    time.sleep(2)
    url = 'https://api.bilibili.com' + path + '?' + urllib.parse.urlencode(q)
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Referer': 'https://www.bilibili.com', 'Cookie': COOKIE})
    with urllib.request.urlopen(req, timeout=15) as r:
        d = json.load(r)
    if d.get('code') != 0:
        print('ERR', path, q, d.get('code'), d.get('message'), file=sys.stderr)
        return {}
    return d.get('data') or {}

def slim(x):
    msg = re.sub(r'^回复 @[^:：]+\s*[:：]', '回复@某人:', x['content']['message'])
    return {'rpid': x['rpid'], 'like': x['like'], 'rcount': x.get('rcount', 0),
            'ctime': x['ctime'], 'msg': msg, 'is_up': x.get('mid') == x.get('up_mid')}

out = sys.argv[1]
vids = []
for pn in (1, 2):
    vids += get('/x/web-interface/popular', ps=20, pn=pn).get('list', [])
vids = [v for v in vids if v['aid'] not in SKIP_AID and v['tname'] not in SKIP_TNAME and v['stat']['reply'] >= 800]
vids.sort(key=lambda v: -v['stat']['reply'])
picked, seen = [], set()
for v in vids:
    if v['tname'] in seen:
        continue
    seen.add(v['tname']); picked.append(v)
    if len(picked) == 8:
        break

data = []
for v in picked:
    aid = v['aid']
    hot = [slim(x) for x in (get('/x/v2/reply', type=1, oid=aid, sort=1, pn=1, ps=20).get('replies') or [])]
    for h in hot:
        subs = []
        for pn in (1, 2, 3):
            r = get('/x/v2/reply/reply', type=1, oid=aid, root=h['rpid'], ps=20, pn=pn).get('replies') or []
            subs += [slim(x) for x in r]
            if len(r) < 20:
                break
        h['subs'] = subs
    latest, nxt = [], 0
    for _ in range(2):
        d = get('/x/v2/reply/main', type=1, oid=aid, mode=2, next=nxt, ps=20)
        latest += [slim(x) for x in (d.get('replies') or [])]
        nxt = (d.get('cursor') or {}).get('next')
        if not nxt:
            break
    data.append({'aid': aid, 'tname': v['tname'], 'title': v['title'], 'desc': v.get('desc', ''),
                 'reply': v['stat']['reply'], 'hot': hot, 'latest': latest})
    print(v['tname'], v['title'], len(hot), [len(h['subs']) for h in hot], len(latest), file=sys.stderr)

json.dump(data, open(out + '/raw.json', 'w'), ensure_ascii=False, indent=1)
with open(out + '/blind.md', 'w') as f:
    for i, v in enumerate(data, 1):
        f.write(f"## V{i} [{v['tname']}] {v['title']}\n简介：{v['desc'][:200]}\n\n")
        for j, h in enumerate(v['hot'], 1):
            f.write(f"- H{i}.{j}（{h['like']} 赞，{h['rcount']} 回复）{h['msg']}\n")
        f.write('\n')
