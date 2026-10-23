// PW Shop — demo app for the Playwright 1.64 lesson.
// Zero dependencies: node demo-app/server.js  →  http://localhost:3164
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3164);
const PUBLIC = path.join(__dirname, 'public');

const PRODUCTS = [
  { id: 1, name: 'Apple', category: 'Fruit', price: 5 },
  { id: 2, name: 'Banana', category: 'Fruit', price: 7.5 },
  { id: 3, name: 'Cherry', category: 'Fruit', price: 12.5 },
];

// Shared, in-memory server state. Tests that touch it can step on each other —
// exactly what --shuffle and test locks are about.
const state = {
  cart: [],
  settings: { theme: 'light' },
};

function sendJson(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
    });
  });
}

function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(c => {
    const [k, ...v] = c.trim().split('=');
    return [k, decodeURIComponent(v.join('='))];
  }));
}

function cartSummary() {
  const totalItems = state.cart.reduce((n, i) => n + i.quantity, 0);
  const totalPrice = state.cart.reduce((n, i) => n + i.quantity * PRODUCTS.find(p => p.id === i.productId).price, 0);
  return { items: state.cart, totalItems, totalPrice };
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const route = `${req.method} ${url.pathname}`;

  // ---- API ----
  if (route === 'GET /api/products') {
    const q = (url.searchParams.get('q') || '').toLowerCase();
    return sendJson(res, 200, PRODUCTS.filter(p => p.name.toLowerCase().includes(q)));
  }
  if (route === 'GET /api/cart') return sendJson(res, 200, cartSummary());
  if (route === 'POST /api/cart') {
    const { productId, quantity = 1 } = await readBody(req);
    if (!PRODUCTS.some(p => p.id === productId)) return sendJson(res, 400, { error: 'unknown product' });
    const line = state.cart.find(i => i.productId === productId);
    if (line) line.quantity += quantity; else state.cart.push({ productId, quantity });
    return sendJson(res, 200, cartSummary());
  }
  if (route === 'DELETE /api/cart') { state.cart = []; return sendJson(res, 200, cartSummary()); }

  if (route === 'GET /api/settings') return sendJson(res, 200, state.settings);
  if (route === 'PUT /api/settings') {
    Object.assign(state.settings, await readBody(req));
    return sendJson(res, 200, state.settings);
  }

  if (route === 'POST /api/login') {
    const { user } = await readBody(req);
    return sendJson(res, 200, { ok: true }, { 'Set-Cookie': `session-id=${encodeURIComponent(user || 'guest')}; Path=/` });
  }
  if (route === 'GET /api/whoami') {
    const session = parseCookies(req)['session-id'];
    return session ? sendJson(res, 200, { user: session }) : sendJson(res, 401, { error: 'not logged in' });
  }

  // ---- Static pages ----
  let file = url.pathname === '/' ? '/index.html' : url.pathname;
  if (!path.extname(file)) file += '.html';
  const full = path.join(PUBLIC, path.normalize(file));
  if (!full.startsWith(PUBLIC) || !fs.existsSync(full)) {
    res.writeHead(404); return res.end('Not found');
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(full)] || 'text/plain' });
  fs.createReadStream(full).pipe(res);
});

server.listen(PORT, () => console.log(`PW Shop running at http://localhost:${PORT}`));
