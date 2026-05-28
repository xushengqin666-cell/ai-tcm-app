/**
 * Vercel Serverless Function - /api/ask
 * 接 Groq 免费 Llama-3-70B 回答任意医学问题
 * 
 * 部署步骤:
 * 1. 拿到 Groq API Key: https://console.groq.com 免费注册
 * 2. vercel env add GROQ_API_KEY (粘贴你的Key)
 * 3. vercel --prod
 * 4. 把返回的 URL 填到 demo.html 的 API_BASE 里
 */

const https = require('https');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `你是中西医结合健康顾问。回答以下问题：

- 西医角度：症状、成因、检查、用药（注明"请在医生指导下使用"）
- 中医角度：体质分析、调理建议、食疗
- 实用建议：生活方式、预防、饮食禁忌
- 严重症状：明确建议"立即就医"

格式：用emoji分段，列表清晰，涉及用药必须提示就医。`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: '只支持POST' });

  const { question, history } = req.body || {};
  if (!question?.trim()) return res.status(400).json({ error: 'question必填' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'GROQ_API_KEY未设置，请去console.groq.com免费申请' });

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(Array.isArray(history) ? history.slice(-6) : []),
    { role: 'user', content: question.trim() }
  ];

  const body = JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  });

  return new Promise((resolve) => {
    const proxyReq = https.request(
      GROQ_API_URL,
      {
        hostname: 'api.groq.com',
        port: 443,
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Length': Buffer.byteLength(body),
        }
      },
      (proxyRes) => {
        if (proxyRes.statusCode !== 200) {
          let err = '';
          proxyRes.on('data', c => err += c);
          proxyRes.on('end', () => {
            res.status(proxyRes.statusCode || 502).json({ error: 'Groq API错误', detail: err });
            resolve();
          });
          return;
        }
        // 流式转发
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        proxyRes.pipe(res);
      }
    );

    proxyReq.on('error', e => res.status(502).json({ error: e.message }));
    proxyReq.write(body);
    proxyReq.end();

    setTimeout(() => {
      proxyReq.destroy();
      if (!res.headersSent) res.status(504).json({ error: '超时' });
      resolve();
    }, 25000);
  });
};