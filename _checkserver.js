const Client = require('ssh2-sftp-client');
async function main() {
  const sftp = new Client();
  try {
    await sftp.connect({ host:'132.232.141.186', port:22, username:'xf', password:'XF#admin@2026' });
    const list = await sftp.list('/home/xf/caiyun-app/public/');
    console.log('=== 服务器 public 目录 ===');
    list.forEach(f => console.log('  ' + f.name + '  ' + f.size));
    // 有 tcmengine.js 就下载
    const has = list.find(f => f.name === 'tcmengine.js');
    if (has) {
      await sftp.get('/home/xf/caiyun-app/public/tcmengine.js', 'tcmengine_server.js');
      const fs = require('fs');
      const s = fs.readFileSync('tcmengine_server.js', 'utf8');
      console.log('server tcmengine.js size:', s.length, 'has TCMEngine:', s.includes('TCMEngine'));
      console.log('前 200 字:', s.slice(0, 200));
    } else {
      console.log('服务器无 tcmengine.js');
    }
    await sftp.end();
  } catch (e) { console.error('ERR', e.message); }
}
main();
