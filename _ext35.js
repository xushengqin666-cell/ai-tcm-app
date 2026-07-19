const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// AI_WORKER 定义
const ai = s.search(/var\s+AI_WORKER|let\s+AI_WORKER|const\s+AI_WORKER|AI_WORKER\s*=/);
console.log('AI_WORKER 定义:', ai >= 0 ? s.slice(ai, ai + 120) : '未找到');
// WORKER_URL 定义
const wu = s.indexOf('WORKER_URL');
console.log('WORKER_URL 定义:', wu >= 0 ? s.slice(wu, wu + 90) : '未找到');
// callWorker 里用的变量
const cw = s.indexOf('function callWorker');
console.log('\ncallWorker fetch 行:', s.slice(s.indexOf('fetch(AI_WORKER', cw), s.indexOf('fetch(AI_WORKER', cw) + 60));
