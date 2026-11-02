#!/usr/bin/env python3
"""统计中文文本的标点分布（每千字次数），用来对比真人回答和自己的稿子。

用法：
  python3 punct_stats.py 文件1.txt 文件2.md ...
  cat 稿子.txt | python3 punct_stats.py -

文件里用 "## 标题" 分节时，每节单独统计。"[图...]" 行和 ** 加粗符号不计入。
参考值（2026-10-29，23 篇知乎前排长答中位数）：逗号:句号约 2:1，引号、书名号、冒号约 0，句内空格约 0。专业长答（学习轮 5，9 篇）引号中位约 6、括号多数 >1.5，书名号仍是 0。
"""
import re
import sys

ENDS = r'[。！？!?…~～）)”」\]]$'


def stat(text):
    paras = [p.strip().replace('**', '') for p in text.split('\n')
             if p.strip() and not p.strip().startswith('[图')]
    body = ''.join(paras)
    n = len(re.sub(r'\s', '', body)) or 1
    per_k = lambda pattern: round(len(re.findall(pattern, body)) * 1000 / n, 1)
    comma, period = per_k('，'), per_k('。')
    return {
        '字数': n,
        '逗号': comma,
        '句号': period,
        '逗号:句号': round(comma / period, 1) if period else None,
        '引号': per_k('[“”"「」]'),
        '书名号': per_k('[《》]'),
        '冒号': per_k('[：:]'),
        '括号': per_k('[（）()]'),
        '问号': per_k('[？?]'),
        '叠用': per_k(r'。。|！！|？？|……|~|～'),
        '句内空格': per_k(r'[一-龥] [一-龥]'),
        '段末无标点%': round(100 * sum(not re.search(ENDS, p) for p in paras) / max(len(paras), 1)),
    }


def sections(name, text):
    parts = re.split(r'^## (.+)$', text, flags=re.M)
    if len(parts) == 1:
        return [(name, text)]
    return [(f'{name} / {parts[i]}', parts[i + 1]) for i in range(1, len(parts), 2)]


def main(paths):
    for path in paths:
        text = sys.stdin.read() if path == '-' else open(path, encoding='utf-8').read()
        for title, body in sections(path, text):
            print(title, stat(body))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1:])
