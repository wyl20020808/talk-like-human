// 在知乎"写回答"页（https://www.zhihu.com/question/<id>/write）用 javascript_tool 执行。
// 页面一跳转就丢失，每个题都要重新注入。

window.Z = {
  ed() { return document.querySelector('.public-DraftEditor-content'); },
  focusEnd() { const e = this.ed(); e.focus(); const s = getSelection(); s.selectAllChildren(e); s.collapseToEnd(); },
  // 贴一段文字：每行一个 <p>，以 ** 开头的行变成加粗小标题。用合成 paste 事件，Draft.js 会保留段落和加粗。
  paste(text) {
    this.focusEnd();
    const paras = text.split('\n').map(s => s.trim()).filter(Boolean);
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const html = paras.map(p => p.startsWith('**') ? `<p><strong>${esc(p.replace(/\*\*/g, ''))}</strong></p>` : `<p>${esc(p)}</p>`).join('');
    const dt = new DataTransfer(); dt.setData('text/html', html); dt.setData('text/plain', paras.join('\n'));
    this.ed().dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
    return paras.length;
  },
  // 传一张图：canvas → File → 编辑器的图片 input，知乎自己上传并插在光标处。
  async upload(canvas, name) {
    this.focusEnd();
    const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
    const input = [...document.querySelectorAll('input[type=file]')].find(i => i.accept.startsWith('image'));
    const dt = new DataTransfer(); dt.items.add(new File([blob], name, { type: 'image/png' }));
    input.files = dt.files; input.dispatchEvent(new Event('change', { bubbles: true }));
  },
  // 按块核对：文字块显示开头几个字，图片显示 [IMG]，加粗前面带 **。
  blocks() {
    return [...this.ed().querySelectorAll('[data-block=true]')].map(b => b.querySelector('img') ? '[IMG]'
      : (b.querySelector('strong,span[style*="bold"]') ? '**' : '') + b.innerText.trim().slice(0, 10));
  },
  // 发布前检查：图片都已上传（不是 blob:）、字数、创作声明。
  check() {
    const label = document.evaluate("//label[contains(.,'创作声明')]", document, null, 9, null).singleNodeValue;
    return {
      blocks: this.blocks().length,
      images: [...this.ed().querySelectorAll('img')].map(i => i.src.startsWith('blob:') ? 'UPLOADING' : 'ok'),
      count: [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /^字数/.test(e.innerText || '')).map(e => e.innerText)[0],
      declaration: label?.parentElement.parentElement.innerText.split('\n').filter(Boolean)[2],
    };
  },
};

// canvas 画图的小工具。本机图片文件传不进浏览器面板，只能在页面里按同样的设计重画。
const FONT = '"PingFang SC","Hiragino Sans GB",sans-serif';
window.K = {
  INK: '#222', MUTED: '#888', ACCENT: '#d9822b',
  cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.textBaseline = 'middle'; return [c, x]; },
  t(x, s, X, Y, size, color, align, weight) { x.font = `${weight || 'normal'} ${size}px ${FONT}`; x.fillStyle = color || this.INK; x.textAlign = align || 'left'; x.fillText(s, X, Y); },
  // 对照表：cols 表头，rows 二维数组（单元格内 \n 换行），opt.colW 列宽（总宽约 1140），opt.hl 高亮行号，opt.note 底注。
  table(title, cols, rows, opt = {}) {
    const W = 1200, colW = opt.colW || cols.map(() => 1140 / cols.length), rh = opt.rh || 80, top = 110;
    const H = top + rh * (rows.length + 1) + (opt.note ? 70 : 40);
    const [c, x] = this.cv(W, H); this.t(x, title, 30, 45, 30);
    let y = top;
    [cols, ...rows].forEach((r, ri) => {
      let X = 30;
      r.forEach((cell, ci) => {
        const w = colW[ci];
        x.fillStyle = ri === 0 ? '#f3f3f3' : (opt.hl && opt.hl.includes(ri) ? '#fbe9d7' : '#fff');
        x.fillRect(X, y, w, rh); x.strokeStyle = '#ddd'; x.lineWidth = 2; x.strokeRect(X, y, w, rh);
        const ls = String(cell).split('\n');
        ls.forEach((l, li) => this.t(x, l, X + w / 2, y + rh / 2 + (li - (ls.length - 1) / 2) * 30, 24, this.INK, 'center', ri === 0 || ci === 0 ? 'bold' : 'normal'));
        X += w;
      });
      y += rh;
    });
    if (opt.note) this.t(x, opt.note, 20, H - 30, 18, this.MUTED);
    return c;
  },
};
