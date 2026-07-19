const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');
const RN = '\r\n';

// ===== 1) HTML: 加 ID =====
const htmlEdits = [
  { o: '<span class="card-title">🩺 症状搜药</span>', n: '<span class="card-title" id="homeSymptomTitle">🩺 症状搜药</span>' },
  { o: 'onclick="searchBySymptom()"', n: 'id="homeSymptomBtn" onclick="searchBySymptom()"' },
  { o: '<h3>➕ 添加药品</h3>', n: '<h3 id="cabAddTitle">➕ 添加药品</h3>' },
  { o: '><label>药品名称</label><input id="cabName"', n: '><label id="cabNameLabel">药品名称</label><input id="cabName"' },
  { o: '><label>规格</label><input id="cabSpec"', n: '><label id="cabSpecLabel">规格</label><input id="cabSpec"' },
  { o: '><label>数量</label><input id="cabQty"', n: '><label id="cabQtyLabel">数量</label><input id="cabQty"' },
  { o: '><label>有效期至</label><input id="cabExpiry"', n: '><label id="cabExpiryLabel">有效期至</label><input id="cabExpiry"' },
  { o: '><label>所属成员</label><select id="cabMember">', n: '><label id="cabMemberLabel">所属成员</label><select id="cabMember">' },
  { o: 'onclick="addCabinetDrug()">加入药箱', n: 'onclick="addCabinetDrug()" id="cabAddBtn">加入药箱' },
  { o: 'id="cabOk">0</div><div class="lbl">正常</div>', n: 'id="cabOk">0</div><div class="lbl" id="cabStatOk">正常</div>' },
  { o: 'id="cabWarn">0</div><div class="lbl">临期</div>', n: 'id="cabWarn">0</div><div class="lbl" id="cabStatWarn">临期</div>' },
  { o: 'id="cabBad">0</div><div class="lbl">过期</div>', n: 'id="cabBad">0</div><div class="lbl" id="cabStatBad">过期</div>' },
  { o: '<span>手动输入</span>', n: '<span id="manualInputBtn">手动输入</span>' },
];
for (const e of htmlEdits) {
  const cnt = s.split(e.o).length - 1;
  if (cnt !== 1) { console.log('❌ HTML 锚点非唯一(' + cnt + '): ' + e.o.slice(0, 60)); process.exit(1); }
  s = s.replace(e.o, e.n);
}
console.log('✅ HTML 加 ID 完成 (' + htmlEdits.length + ' 处)');

// ===== 2) T 对象：加新键 =====
const varT = s.indexOf('var T =');
if (varT < 0) { console.log('❌ 找不到 var T ='); process.exit(1); }
const zhKey = s.indexOf('zh:', varT);
const enKey = s.indexOf('en:', zhKey + 1);
function matchingClose(str, openIdx) {
  let dd = 0;
  for (let i = openIdx; i < str.length; i++) {
    if (str[i] === '{') dd++;
    else if (str[i] === '}') { dd--; if (!dd) return i; }
  }
  return -1;
}
const zhOpen = s.indexOf('{', zhKey);
const zhClose = matchingClose(s, zhOpen);
const enOpen = s.indexOf('{', enKey);
const enClose = matchingClose(s, enOpen);
console.log('T.zh @' + zhOpen + '~' + zhClose + '  T.en @' + enOpen + '~' + enClose);

const newZhKeys =
  "tabCabinet:'💊 药箱'," + RN +
  "homeSymptomTitle:'🩺 症状搜药'," + RN +
  "homeSymptomPlaceholder:'输入症状，如：头痛、发烧、咳嗽...'," + RN +
  "homeSymptomBtn:'搜索'," + RN +
  "manualPlaceholder:'输入药品名称，如：布洛芬、阿莫西林、二甲双胍...'," + RN +
  "manualBtn:'查询'," + RN +
  "cabAddTitle:'➕ 添加药品'," + RN +
  "cabNameLabel:'药品名称'," + RN +
  "cabNamePlaceholder:'如：布洛芬、阿莫西林'," + RN +
  "cabSpecLabel:'规格'," + RN +
  "cabSpecPlaceholder:'如：0.1g×20片'," + RN +
  "cabQtyLabel:'数量'," + RN +
  "cabQtyPlaceholder:'余量'," + RN +
  "cabExpiryLabel:'有效期至'," + RN +
  "cabMemberLabel:'所属成员'," + RN +
  "cabAddBtn:'加入药箱'," + RN +
  "cabStatOk:'正常'," + RN +
  "cabStatWarn:'临期'," + RN +
  "cabStatBad:'过期'," + RN +
  "tonguePlaceholder:'-- 选择舌象 --'," + RN +
  "pulsePlaceholder:'-- 选择脉象 --'," + RN +
  "cameraBtn:'拍照识别'," + RN +
  "manualInputBtn:'手动输入'," + RN +
  "cabMeOption:'我'," + RN +
  "cabMemberNoAssign:'（不指定）',";

const newEnKeys =
  "tabCabinet:'💊 Cabinet'," + RN +
  "homeSymptomTitle:'🩺 Symptom Search'," + RN +
  "homeSymptomPlaceholder:'Enter symptoms, e.g.: headache, fever, cough...'," + RN +
  "homeSymptomBtn:'Search'," + RN +
  "manualPlaceholder:'Enter drug name, e.g.: Ibuprofen, Amoxicillin, Metformin...'," + RN +
  "manualBtn:'Lookup'," + RN +
  "cabAddTitle:'➕ Add Drug'," + RN +
  "cabNameLabel:'Drug Name'," + RN +
  "cabNamePlaceholder:'e.g.: Ibuprofen, Amoxicillin'," + RN +
  "cabSpecLabel:'Specification'," + RN +
  "cabSpecPlaceholder:'e.g.: 0.1g × 20 tablets'," + RN +
  "cabQtyLabel:'Quantity'," + RN +
  "cabQtyPlaceholder:'Remaining'," + RN +
  "cabExpiryLabel:'Expiry Date'," + RN +
  "cabMemberLabel:'Member'," + RN +
  "cabAddBtn:'Add to Cabinet'," + RN +
  "cabStatOk:'Normal'," + RN +
  "cabStatWarn:'Expiring'," + RN +
  "cabStatBad:'Expired'," + RN +
  "tonguePlaceholder:'-- Select Tongue --'," + RN +
  "pulsePlaceholder:'-- Select Pulse --'," + RN +
  "cameraBtn:'Photo Scan'," + RN +
  "manualInputBtn:'Manual Input'," + RN +
  "cabMeOption:'Me'," + RN +
  "cabMemberNoAssign:'Not specified',";

const beforeZh = s[zhClose - 1];
const zhIns = (beforeZh === ',' || beforeZh === '{' ? RN : ',' + RN) + newZhKeys;
s = s.slice(0, zhClose) + zhIns + s.slice(zhClose);
const enCloseNew = enClose + zhIns.length;
const beforeEn = s[enCloseNew - 1];
const enIns = (beforeEn === ',' || beforeEn === '{' ? RN : ',' + RN) + newEnKeys;
s = s.slice(0, enCloseNew) + enIns + s.slice(enCloseNew);
console.log('✅ T 对象注入新键 (' + 25 + ' 个/zh+en)');

// ===== 3) applyLang 扩展（插在 DONE 日志前） =====
const afStart = s.indexOf('function applyLang');
const afBrace = s.indexOf('{', afStart);
const afEnd = matchingClose(s, afBrace);
const doneLog = s.indexOf("console.log('applyLang: DONE");
if (doneLog < 0) { console.log('❌ 找不到 DONE 日志'); process.exit(1); }
const newApplyLines =
  "  // ===== i18n 扩展：未翻译元素 =====" + RN +
  "  if(el=document.getElementById('tabCabinetBtn')) el.textContent = t.tabCabinet;" + RN +
  "  if(el=document.getElementById('homeSymptomTitle')) el.textContent = t.homeSymptomTitle;" + RN +
  "  if(el=document.getElementById('symptomInput')) el.placeholder = t.homeSymptomPlaceholder;" + RN +
  "  if(el=document.getElementById('homeSymptomBtn')) el.textContent = t.homeSymptomBtn;" + RN +
  "  if(el=document.getElementById('manualCardTitle')) el.textContent = t.manualTitle;" + RN +
  "  if(el=document.getElementById('drugManualInput')) el.placeholder = t.manualPlaceholder;" + RN +
  "  if(el=document.getElementById('drugManualBtn')) el.textContent = t.manualBtn;" + RN +
  "  if(el=document.getElementById('cabAddTitle')) el.textContent = t.cabAddTitle;" + RN +
  "  if(el=document.getElementById('cabNameLabel')) el.textContent = t.cabNameLabel;" + RN +
  "  if(el=document.getElementById('cabName')) el.placeholder = t.cabNamePlaceholder;" + RN +
  "  if(el=document.getElementById('cabSpecLabel')) el.textContent = t.cabSpecLabel;" + RN +
  "  if(el=document.getElementById('cabSpec')) el.placeholder = t.cabSpecPlaceholder;" + RN +
  "  if(el=document.getElementById('cabQtyLabel')) el.textContent = t.cabQtyLabel;" + RN +
  "  if(el=document.getElementById('cabQty')) el.placeholder = t.cabQtyPlaceholder;" + RN +
  "  if(el=document.getElementById('cabExpiryLabel')) el.textContent = t.cabExpiryLabel;" + RN +
  "  if(el=document.getElementById('cabMemberLabel')) el.textContent = t.cabMemberLabel;" + RN +
  "  if(el=document.getElementById('cabAddBtn')) el.textContent = t.cabAddBtn;" + RN +
  "  if(el=document.getElementById('cabStatOk')) el.textContent = t.cabStatOk;" + RN +
  "  if(el=document.getElementById('cabStatWarn')) el.textContent = t.cabStatWarn;" + RN +
  "  if(el=document.getElementById('cabStatBad')) el.textContent = t.cabStatBad;" + RN +
  "  if(el=document.getElementById('cameraBtnLabel')) el.textContent = t.cameraBtn;" + RN +
  "  if(el=document.getElementById('manualInputBtn')) el.textContent = t.manualInputBtn;" + RN +
  "  var _rt = document.getElementById('reportTongue'); if(_rt && _rt.options[0]) _rt.options[0].text = t.tonguePlaceholder;" + RN +
  "  var _rp = document.getElementById('reportPulse'); if(_rp && _rp.options[0]) _rp.options[0].text = t.pulsePlaceholder;" + RN +
  "  var _cm = document.getElementById('cabMember'); if(_cm){ for(var _ci=0; _ci<_cm.options.length; _ci++){ var _opt=_cm.options[_ci]; if(_opt.text==='我') _opt.text=t.cabMeOption; if(_opt.text==='（不指定）') _opt.text=t.cabMemberNoAssign; } }" + RN;
s = s.slice(0, doneLog) + newApplyLines + s.slice(doneLog);
console.log('✅ applyLang 扩展完成（25 个新更新）');

fs.writeFileSync('index.html', s, 'utf8');
console.log('🎉 i18n 完整修复写入完毕。文件大小:', s.length);
