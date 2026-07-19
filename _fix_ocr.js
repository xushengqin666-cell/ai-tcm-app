const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');
const RN = '\r\n';

// ---- 1) 加 OCR_WORKER 常量（紧跟 AI_WORKER 行后） ----
const aiLine = s.indexOf('AI_WORKER');
const lineStart = s.lastIndexOf('\n', aiLine) + 1;
const lineEnd = s.indexOf('\n', aiLine);
s = s.slice(0, lineEnd) + RN + "var OCR_WORKER = 'https://ocr-pharmacy.xushengqin666.workers.dev';" + s.slice(lineEnd);

// ---- 2) 定位 runDrugOCR 函数边界 ----
const fs0 = s.indexOf('function runDrugOCR');
let d = 0, kb = s.indexOf('{', fs0);
let fnEnd = -1;
for (let e = kb; e < s.length; e++) {
  if (s[e] === '{') { if (!d) { d = 1; } else d++; }
  else if (s[e] === '}') { d--; if (!d) { fnEnd = e; break; } }
}
const fnText = s.slice(fs0, fnEnd + 1);

// 在原函数内找关键锚点
const tIdx = fnText.indexOf('Tesseract.recognize(');
const thenIdx = fnText.indexOf('.then(function(res)', tIdx);
const catchIdx = fnText.indexOf('.catch(function(err)', thenIdx);
const endCatch = fnText.indexOf('});', catchIdx) + 3;

const recognizeCall = fnText.slice(tIdx, thenIdx);          // Tesseract.recognize(... 含闭合 })
const thenBlock = fnText.slice(thenIdx, catchIdx);          // .then(function(res){ ... })
const catchBlock = fnText.slice(catchIdx, endCatch);        // .catch(function(err){ ... });

// then 内部 body（去掉 .then(function(res) { 前缀和结尾 })）
const thenOpenLen = '.then(function(res) {'.length;
const thenClose = fnText.lastIndexOf('})', catchIdx);
let thenBody = fnText.slice(thenIdx + thenOpenLen, thenClose);
// 去掉首行的 var text = (res.data.text || '').trim();
thenBody = thenBody.replace(/var text = \(res\.data\.text[\s\S]*?\)\.trim\(\);\s*/, '');

// ---- 3) 构造新函数群 ----
const newCode =
"function preprocessImage(dataUrl, maxW, cb) {" + RN +
"  var img = new Image();" + RN +
"  img.onload = function() {" + RN +
"    try {" + RN +
"      var w = img.width, h = img.height;" + RN +
"      var scale = Math.min(1, maxW / w);" + RN +
"      var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));" + RN +
"      var canvas = document.createElement('canvas');" + RN +
"      canvas.width = cw; canvas.height = ch;" + RN +
"      var ctx = canvas.getContext('2d');" + RN +
"      ctx.drawImage(img, 0, 0, cw, ch);" + RN +
"      var id = ctx.getImageData(0, 0, cw, ch), dd = id.data;" + RN +
"      for (var i = 0; i < dd.length; i += 4) {" + RN +
"        var g = dd[i]*0.299 + dd[i+1]*0.587 + dd[i+2]*0.114;" + RN +
"        var c = (g - 128) * 1.4 + 128;" + RN +
"        if (c < 0) c = 0; else if (c > 255) c = 255;" + RN +
"        dd[i] = dd[i+1] = dd[i+2] = c;" + RN +
"      }" + RN +
"      ctx.putImageData(id, 0, 0);" + RN +
"      cb(canvas.toDataURL('image/jpeg', 0.92));" + RN +
"    } catch (e) { cb(dataUrl); }" + RN +
"  };" + RN +
"  img.onerror = function() { cb(dataUrl); };" + RN +
"  img.src = dataUrl;" + RN +
"}" + RN + RN +

"function callCloudOCR(dataUrl, timeoutMs) {" + RN +
"  return new Promise(function(resolve, reject) {" + RN +
"    var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;" + RN +
"    var to = setTimeout(function(){ if (ctrl) ctrl.abort(); else reject(new Error('timeout')); }, timeoutMs || 12000);" + RN +
"    fetch(OCR_WORKER, {" + RN +
"      method: 'POST'," + RN +
"      headers: { 'Content-Type': 'application/json' }," + RN +
"      body: JSON.stringify({ image: dataUrl })," + RN +
"      signal: ctrl ? ctrl.signal : undefined" + RN +
"    }).then(function(r) {" + RN +
"      clearTimeout(to);" + RN +
"      if (!r.ok) return r.text().then(function(t){ throw new Error('OCR服务返回 ' + r.status); });" + RN +
"      return r.json();" + RN +
"    }).then(function(d) {" + RN +
"      if (d && d.error) throw new Error(d.error);" + RN +
"      resolve((d && d.text) ? d.text : '');" + RN +
"    }).catch(function(e) { clearTimeout(to); reject(e); });" + RN +
"  });" + RN +
"}" + RN + RN +

"function showOCRResult(text) {" + RN +
"  var loadingDiv = document.getElementById('ocrLoading');" + RN +
"  var resultDiv = document.getElementById('ocrResult');" + RN +
"  var contentDiv = document.getElementById('ocrResultContent');" + RN +
"  var matchedDiv = document.getElementById('ocrMatchedDrug');" + RN +
"  loadingDiv.style.display = 'none';" + RN +
"  resultDiv.style.display = 'block';" + RN +
thenBody + RN +
"}" + RN + RN +

"function runTesseract(dataUrl) {" + RN +
"  var loadingDiv = document.getElementById('ocrLoading');" + RN +
"  var resultDiv = document.getElementById('ocrResult');" + RN +
"  var contentDiv = document.getElementById('ocrResultContent');" + RN +
"  var matchedDiv = document.getElementById('ocrMatchedDrug');" + RN +
"  if (typeof Tesseract === 'undefined') {" + RN +
"    loadingDiv.style.display = 'none'; resultDiv.style.display = 'block';" + RN +
"    contentDiv.innerHTML = '<p style=\"color:#e53935;font-size:13px\">OCR库未加载，请在联网环境下使用拍照识别功能</p>';" + RN +
"    return;" + RN +
"  }" + RN +
recognizeCall.replace('imageDataUrl', 'dataUrl') +
".then(function(res) { showOCRResult((res.data.text || '').trim()); })" + RN +
catchBlock + RN +
"}" + RN + RN +

"function runDrugOCR(imageDataUrl) {" + RN +
"  var loadingDiv = document.getElementById('ocrLoading');" + RN +
"  var resultDiv = document.getElementById('ocrResult');" + RN +
"  var contentDiv = document.getElementById('ocrResultContent');" + RN +
"  var matchedDiv = document.getElementById('ocrMatchedDrug');" + RN +
"  loadingDiv.style.display = 'block';" + RN +
"  resultDiv.style.display = 'none';" + RN +
"  matchedDiv.innerHTML = '';" + RN +
"  matchedDiv.style.display = 'none';" + RN +
"  document.getElementById('ocrLoadingText').textContent = '📷 正在识别药品图片，请稍候...';" + RN +
"  preprocessImage(imageDataUrl, 2000, function(processed) {" + RN +
"    callCloudOCR(processed).then(function(text) {" + RN +
"      showOCRResult(text);" + RN +
"    }).catch(function() {" + RN +
"      runTesseract(processed);" + RN +
"    });" + RN +
"  });" + RN +
"}" + RN + RN;

// ---- 4) 替换原函数 ----
s = s.slice(0, fs0) + newCode + s.slice(fnEnd + 1);

fs.writeFileSync('index.html', s, 'utf8');
console.log('✅ OCR 改造写入完成。新函数群字节:', newCode.length);
console.log('recognizeCall 含 imageDataUrl?', recognizeCall.indexOf('imageDataUrl') >= 0);
console.log('newCode 含 callCloudOCR?', newCode.indexOf('callCloudOCR') >= 0);
console.log('newCode 含 showOCRResult?', newCode.indexOf('showOCRResult') >= 0);
console.log('newCode 含 preprocessImage?', newCode.indexOf('preprocessImage') >= 0);
console.log('OCR_WORKER 常量?', s.indexOf('OCR_WORKER') >= 0);
