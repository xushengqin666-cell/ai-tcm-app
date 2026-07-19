const Client = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');

async function deploy() {
  const sftp = new Client();
  try {
    await sftp.connect({
      host: '132.232.141.186',
      port: 22,
      username: 'xf',
      password: 'XF#admin@2026'
    });
    console.log('SSH connected');

    const localFile = path.join(__dirname, 'index.html');
    const size = fs.statSync(localFile).size;
    console.log('Uploading', size, 'bytes...');

    await sftp.put(localFile, '/home/xf/caiyun-app/public/index.html');
    console.log('Uploaded to /home/xf/caiyun-app/public/index.html');

    // Verify
    const stat = await sftp.stat('/home/xf/caiyun-app/public/index.html');
    console.log('Remote size:', stat.size);

    await sftp.end();
    console.log('Done ✅');
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

deploy();
