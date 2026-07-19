const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = {'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json'};
const srv = http.createServer((req, res) => {
  let p = req.url.split('?')[0];
  if (p === '/') p = '/index.html';
  const f = path.join(__dirname, p);
  if (!fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
  const ext = path.extname(f);
  res.writeHead(200, {'Content-Type': mime[ext]||'text/plain'});
  fs.createReadStream(f).pipe(res);
});
srv.listen(18800, '127.0.0.1', () => console.log('up on 18800'));
setTimeout(() => { srv.close(); process.exit(0); }, 300000);
