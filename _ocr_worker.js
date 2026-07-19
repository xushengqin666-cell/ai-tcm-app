// 腾讯云 OCR 代理 Worker（零密钥：密钥仅存于 Worker 环境变量）
// 部署：Cloudflare Dashboard 新建 Worker（名称 ocr-pharmacy）→ 粘贴本代码
//         → Settings → Variables → 添加环境变量 TENCENT_SECRET_ID / TENCENT_SECRET_KEY
// 前端 POST { image: "data:image/jpeg;base64,...." }  →  { text: "识别文字" }

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function hmacSign(keyBuf, msgStr) {
  const key = await crypto.subtle.importKey('raw', keyBuf, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msgStr));
  return new Uint8Array(sig);
}
function bufToHex(buf) {
  return [...buf].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function tc3Sign(secretKey, date, service, payloadStr) {
  const hashedPayload = await sha256Hex(payloadStr);
  const credentialScope = date + '/' + service + '/tc3_request';
  const canonicalHeaders = 'content-type:application/json; charset=utf-8\nhost:ocr.tencentcloudapi.com\n';
  const signedHeaders = 'content-type;host';
  const canonicalRequest = 'POST\n/\n\n' + canonicalHeaders + '\n' + signedHeaders + '\n' + hashedPayload;
  const secretDate = await hmacSign(new TextEncoder().encode('TC3' + secretKey), date);
  const secretService = await hmacSign(secretDate, service);
  const secretSigning = await hmacSign(secretService, 'tc3_request');
  const stringToSign = 'TC3-HMAC-SHA256\n' + String(Math.floor(Date.now() / 1000)) + '\n' + credentialScope + '\n' + await sha256Hex(canonicalRequest);
  const signature = bufToHex(await hmacSign(secretSigning, stringToSign));
  return 'TC3-HMAC-SHA256 Credential=' + TENCENT_SECRET_ID + '/' + credentialScope + ', SignedHeaders=' + signedHeaders + ', Signature=' + signature;
}
async function tencentOCR(base64, secretId, secretKey) {
  const service = 'ocr';
  const action = 'GeneralBasicOCR';     // 通用印刷体；高精度换 GeneralAccurateOCR
  const version = '2018-11-19';
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
  const payload = JSON.stringify({ ImageBase64: base64 });
  const authorization = await tc3Sign(secretKey, date, service, payload);
  const resp = await fetch('https://ocr.tencentcloudapi.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Host': 'ocr.tencentcloudapi.com',
      'X-TC-Action': action,
      'X-TC-Version': version,
      'X-TC-Timestamp': String(timestamp),
      'Authorization': authorization
    },
    body: payload
  });
  const data = await resp.json();
  if (data.Response && data.Response.Error) throw new Error(data.Response.Error.Code + ': ' + data.Response.Error.Message);
  if (!data.Response || !data.Response.TextDetections) return '';
  return data.Response.TextDetections.map(t => (t.DetectedText || '').replace(/\s+/g, '')).join('\n');
}
export default {
  async fetch(request, env) {
    const SECRET_ID = env.TENCENT_SECRET_ID;
    const SECRET_KEY = env.TENCENT_SECRET_KEY;
    if (!SECRET_ID || !SECRET_KEY) {
      return new Response(JSON.stringify({ error: 'Worker 未配置腾讯云密钥（请在环境变量设置 TENCENT_SECRET_ID / TENCENT_SECRET_KEY）' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    if (request.method !== 'POST') return new Response('彩云智药 OCR 代理', { status: 200 });
    try {
      const body = await request.json();
      let img = body.image || '';
      const comma = img.indexOf(',');
      if (comma >= 0) img = img.slice(comma + 1);
      if (!img) return new Response(JSON.stringify({ error: '缺少图片数据' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      const text = await tencentOCR(img, SECRET_ID, SECRET_KEY);
      return new Response(JSON.stringify({ text }), { headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message || '识别失败' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }
  }
};
