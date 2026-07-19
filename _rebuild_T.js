const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 提取现有的 T.zh 和 T.en 内容（尽可能恢复）
const tStart = s.indexOf('var T = {');
const tEnd = s.indexOf('};', tStart) + 2;
const oldT = s.slice(tStart, tEnd);

// 构建正确的 T 对象
const newT = `var T = {
  zh: {
    title:'🌿 彩云智药',tabHome:'首页',tabInteract:'相互作用',tabChat:'智能问药',
    searchTitle:'🔍 智能搜索',searchPlaceholder:'输入药品、症状或问题,如:布洛芬能退烧吗、头痛吃什么...',searchBtn:'搜索',
    featureTitle:'📋 功能入口',featChat:'💬 智能问药',featSymptom:'🩺 症状咨询',featContra:'⚠️ 用药禁忌',featInteract:'💊 相互作用',
    interactTitle:'💊 药物相互作用关系网',drugAPlaceholder:'药物A,如:布洛芬',drugBPlaceholder:'药物B(可选)',interactBtn:'查询',
    legendDanger:'🔴 禁忌',legendCaution:'🟡 注意',legendGreen:'🟢 可联用',legendBlue:'🔵 中性',
    chatTitle:'💬 智能问药',chatPlaceholder:'输入药品或用药问题,如:布洛芬能和感冒药一起吃吗...',sendBtn:'🔍 查询',
    chatWelcome:'',
    statusReady:'准备就绪',statusSending:'发送中...',statusError:'网络错误',
    searching:'搜索中...',searchFail:'搜索失败,请稍后重试',typing:'AI 分析中',noData:'暂无相互作用数据',langBtn:'🇬🇧 EN',
    guideTitle:'📋 用药指南',guideTime:'⏰ 服药时间',guideFoodAvoid:'🍎 饮食禁忌',guideDrugAvoid:'💊 药物禁忌',guideNotes:'📝 注意事项',noGuideData:'暂无用药指南数据',relatedDrugs:'相关药物',interactions:'条相互作用',
    unionCheckTitle:'💊 联合用药审查',unionDrugPlaceholder:'药物',unionBtnAdd:'+ 添加药物',unionBtnCheck:'🔍 一键审查',unionResultSummary:'发现',unionResultFound:'条相互作用',unionContraindicated:'禁忌',unionCaution:'注意',unionSafe:'安全',unionNeutral:'无数据',unionDangerCount:'条禁忌',unionCautionCount:'条注意',unionHideDetail:'收起',unionShowDetail:'查看详情',
    navHome:'首页',navInsert:'说明书',navCabinet:'药箱',navMember:'家庭',navReminder:'提醒',
    configTitle:'🤖 AI 配置',configStatus:'状态:',configKeyPlaceholder:'sk-xxxxxxxx（密钥安全存储在本地，不会上传）',
    configSaveBtn:'💾 保存',configClearBtn:'🗑️ 清除',configGetKeyHint:'获取密钥',
    configNeedKey:'',
    statusConfigured:'已配置',statusNotConfigured:'未配置',statusLocalEngine:'📋 本地引擎(无Key)',statusSfReady:'🟢 硅基流动API已配置(优先)',
    manualTitle:'📋 药品说明书查询',manualCatLabel:'类别：',
    reportTitle:'📋 中医辨证报告',reportSubtitle:'基于症状、舌象、脉象生成个体化治疗方案',
    reportSymptomLabel:'症状（用逗号/空格分隔，如：口干、心烦、失眠）',
    reportGenerateBtn:'🔍 生成辨证报告',tabReport:'📋 辨证报告',
    manualIndication:'适应症:',manualDosage:'用法用量:',manualTime:'⏰ 服药时间:',
    manualNotes:'📝 注意事项:',manualContraindication:'🚫 禁忌:',manualFoodAvoid:'🍎 饮食禁忌:',
    manualDrugInteract:'💊 药物相互作用:',manualRemark:'📝 备注:',
    noManualData:'暂无详细说明书数据',manualHint:'提示:请输入药品通用名',manualSearchResult:'条搜索结果',noManualFound:'🔍 未找到「',manualCat:'📋 类别:',
    guideDrugName:'药品',guideDetailHint:'点击查看详细说明',
    netCenter:'中心',netEdgeCount:'条相互作用',noNetData:'无相互作用数据',moreText:'更多',
    unionChecked:'已检查',unionNoIssue:'未发现相互作用',
    statusLocal:'本地模式',statusSfReadyShort:'AI已就绪',statusSfNotConfig:'AI未配置',
    statusReplied:'已回复',statusFailed:'发送失败',
    deepThinkLabel:'🧠 深度思考',thinkingText:'思考中...',thinkProcessLabel:'🧠 思考过程',
    errorTimeout:'请求超时，请稍后重试',errorNetwork:'网络错误，请检查网络连接',localNoMatchHint:'未找到匹配结果，请尝试其他关键词',
    fallbackHint:'本地数据库回复',
    versionLabel:'版本',cabinetTab:'💊 药箱',
    homeSymptomTitle:'🩺 症状搜药',
    homeSymptomPlaceholder:'输入症状，如：头痛、发烧、咳嗽...',
    homeSymptomBtn:'搜索',
    manualPlaceholder:'输入药品名称，如：布洛芬、阿莫西林、二甲双胍...',
    manualBtn:'查询',
    cabAddTitle:'➕ 添加药品',
    cabNameLabel:'药品名称',
    cabNamePlaceholder:'如：布洛芬、阿莫西林',
    cabSpecLabel:'规格',
    cabSpecPlaceholder:'如：0.1g×20片',
    cabQtyLabel:'数量',
    cabQtyPlaceholder:'余量',
    cabExpiryLabel:'有效期至',
    cabMemberLabel:'所属成员',
    cabAddBtn:'加入药箱',
    cabStatOk:'正常',
    cabStatWarn:'临期',
    cabStatBad:'过期',
    tonguePlaceholder:'-- 选择舌象 --',
    pulsePlaceholder:'-- 选择脉象 --',
    cameraBtn:'拍照识别',
    manualInputBtn:'手动输入',
    cabMeOption:'我',
    cabMemberNoAssign:'（不指定）',
    authTitle:'彩云智药',authSub:'家庭 AI 药师 · 让用药更安全',authTabLogin:'登录',authTabRegister:'注册',authPhonePh:'手机号',authPwdPh:'密码（6 位以上）',authPwd2Ph:'确认密码',authSubmitBtn:'登 录',authSkipBtn:'先体验，跳过 →'
  },
  en: {
    title:'🌿 Caiyun Smart Pharmacy',tabHome:'Home',tabInteract:'Interactions',tabChat:'AI Chat',
    searchTitle:'🔍 Smart Search',searchPlaceholder:'Enter drug name or symptom, e.g.: Can ibuprofen reduce fever...',searchBtn:'Search',
    featureTitle:'📋 Quick Access',featChat:'💬 AI Chat',featSymptom:'🩺 Symptom Check',featContra:'⚠️ Contraindications',featInteract:'💊 Interactions',
    interactTitle:'💊 Drug Interaction Network',drugAPlaceholder:'Drug A, e.g.: Ibuprofen',drugBPlaceholder:'Drug B (optional)',interactBtn:'Check',
    legendDanger:'🔴 Contraindicated',legendCaution:'🟡 Caution',legendGreen:'🟢 Safe',legendBlue:'🔵 Neutral',
    chatTitle:'💬 AI Pharmacy Assistant',chatPlaceholder:'Ask about medications...',sendBtn:'🔍 Search',
    chatWelcome:'',
    statusReady:'Ready',statusSending:'Sending...',statusError:'Network error',
    searching:'Searching...',searchFail:'Search failed, please try again later',typing:'AI analyzing',noData:'No interaction data available',langBtn:'🇨🇳 中文',
    guideTitle:'📋 Medication Guide',guideTime:'⏰ Timing',guideFoodAvoid:'🍎 Food Avoid',guideDrugAvoid:'💊 Drug Avoid',guideNotes:'📝 Notes',noGuideData:'No guide data available',relatedDrugs:'Related drugs',interactions:'interactions',
    unionCheckTitle:'💊 Drug Interaction Check',unionDrugPlaceholder:'Drug',unionBtnAdd:'+ Add drug',unionBtnCheck:'🔍 Check all',unionResultSummary:'Found',unionResultFound:'interactions',unionContraindicated:'Contraindicated',unionCaution:'Caution',unionSafe:'Safe',unionNeutral:'No data',unionDangerCount:'contraindicated',unionCautionCount:'cautions',unionHideDetail:'Hide',unionShowDetail:'Details',
    navHome:'Home',navInsert:'Manual',navCabinet:'Cabinet',navMember:'Family',navReminder:'Reminder',
    configTitle:'🤖 AI Config',configStatus:'Status:',configKeyPlaceholder:'sk-xxxxxxxx (stored locally)',
    configSaveBtn:'💾 Save',configClearBtn:'🗑️ Clear',configGetKeyHint:'Get API key',
    configNeedKey:'',
    statusConfigured:'Configured',statusNotConfigured:'Not configured',statusLocalEngine:'📋 Local engine',statusSfReady:'🟢 SiliconFlow ready',
    manualTitle:'📋 Drug Manual Lookup',manualCatLabel:'Category:',
    reportTitle:'📋 TCM Diagnosis Report',reportSubtitle:'Personalized treatment based on symptoms, tongue & pulse',
    reportSymptomLabel:'Symptoms (comma-separated, e.g.: dry mouth, insomnia)',
    reportGenerateBtn:'🔍 Generate Diagnosis',tabReport:'📋 Diagnosis',
    manualIndication:'Indications:',manualDosage:'Dosage:',manualTime:'⏰ Timing:',
    manualNotes:'📝 Notes:',manualContraindication:'🚫 Contraindications:',manualFoodAvoid:'🍎 Food to avoid:',
    manualDrugInteract:'💊 Drug interactions:',manualRemark:'📝 Remarks:',
    noManualData:'No detailed manual available',manualHint:'Enter generic drug name',manualSearchResult:'results found',noManualFound:'🔍 Not found: ',manualCat:'📋 Category:',
    guideDrugName:'Drug',guideDetailHint:'Click for details',
    netCenter:'Center',netEdgeCount:'interactions',noNetData:'No data',moreText:'More',
    unionChecked:'Checked',unionNoIssue:'No interactions found',
    statusLocal:'Local mode',statusSfReadyShort:'AI ready',statusSfNotConfig:'AI not config',
    statusReplied:'Replied',statusFailed:'Failed',
    deepThinkLabel:'🧠 Deep Think',thinkingText:'Thinking...',thinkProcessLabel:'🧠 Thinking process',
    errorTimeout:'Request timeout, please retry',errorNetwork:'Network error, check connection',localNoMatchHint:'No match found, try other keywords',
    fallbackHint:'Local database reply',
    versionLabel:'Version',cabinetTab:'💊 Cabinet',
    homeSymptomTitle:'🩺 Symptom Search',
    homeSymptomPlaceholder:'Enter symptoms, e.g.: headache, fever, cough...',
    homeSymptomBtn:'Search',
    manualPlaceholder:'Enter drug name, e.g.: Ibuprofen, Amoxicillin...',
    manualBtn:'Search',
    cabAddTitle:'➕ Add Drug',
    cabNameLabel:'Drug Name',
    cabNamePlaceholder:'e.g.: Ibuprofen, Amoxicillin',
    cabSpecLabel:'Specification',
    cabSpecPlaceholder:'e.g.: 0.1g×20 tablets',
    cabQtyLabel:'Quantity',
    cabQtyPlaceholder:'Remaining',
    cabExpiryLabel:'Valid until',
    cabMemberLabel:'Member',
    cabAddBtn:'Add to Cabinet',
    cabStatOk:'Normal',
    cabStatWarn:'Expiring',
    cabStatBad:'Expired',
    tonguePlaceholder:'-- Select Tongue --',
    pulsePlaceholder:'-- Select Pulse --',
    cameraBtn:'Photo Scan',
    manualInputBtn:'Manual Input',
    cabMeOption:'Me',
    cabMemberNoAssign:'Not specified',
    authTitle:'Caiyun Smart Pharmacy',authSub:'Family AI Pharmacist · Safer Medication',authTabLogin:'Log in',authTabRegister:'Register',authPhonePh:'Phone number',authPwdPh:'Password (6+ digits)',authPwd2Ph:'Confirm password',authSubmitBtn:'Log in',authSkipBtn:'Skip for now →'
  }
};`;

// 替换旧的 T 对象
s = s.slice(0, tStart) + newT + s.slice(tEnd);

fs.writeFileSync('index.html', s, 'utf8');
console.log('✅ T 对象已重建');
console.log('文件大小:', s.length);

// 验证语法
try {
  require('vm').compileFunction(newT + '\nreturn T;', []);
  console.log('✅ T 对象语法检查通过');
} catch(e) {
  console.log('❌ 语法错误:', e.message);
}

process.exit(0);
