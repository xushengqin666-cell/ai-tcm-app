
// ========== Knowledge Base ==========
var KB=[{t:"加载中",c:"正在加载知识库...",kw:["加载"]}];

// ===== Remote KB Loading System =====
var KB_VERSION_KEY='qhy_kb_version';
var KB_DATA_KEY='qhy_kb_data';
var KB_TIME_KEY='qhy_kb_time';
var KB_URL='https://xushengqin666-cell.github.io/ai-tcm-app/kb.json';
var KB_CHECK_INTERVAL=30*60*1000;

function loadKB(){
  var cached=localStorage.getItem(KB_DATA_KEY);
  if(cached){
    try{KB=JSON.parse(cached);showKBStatus('本地缓存 ('+KB.length+'条)',true);}
    catch(e){localStorage.removeItem(KB_DATA_KEY);}
  }
  fetchRemoteKB();
  setInterval(fetchRemoteKB,KB_CHECK_INTERVAL);
}

function fetchRemoteKB(){
  var v=localStorage.getItem(KB_VERSION_KEY)||'0';
  fetch(KB_URL+'?v='+Date.now(),{cache:'no-store'})
    .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
    .then(function(data){
      if(!Array.isArray(data)||data.length===0)return;
      var newV=String(data.length)+'_'+data.slice(0,3).map(function(e){return e.t}).join('');
      if(newV!==v||!localStorage.getItem(KB_DATA_KEY)){
        KB=data;
        try{localStorage.setItem(KB_DATA_KEY,JSON.stringify(data));localStorage.setItem(KB_VERSION_KEY,newV);localStorage.setItem(KB_TIME_KEY,new Date().toISOString());}
        catch(e){}
        showKBStatus('已更新 ('+KB.length+'条)',true);_searchIdx=null;
      }else{showKBStatus('最新 ('+KB.length+'条)',true);}
    })
    .catch(function(e){
      if(KB.length===0)showKBStatus('离线模式 (无数据)',false);
      else{showKBStatus('离线缓存 ('+KB.length+'条)',true);_searchIdx=null;}
    });
}

function showKBStatus(text,ok){
  var tEl=document.getElementById('kbUpdateTime');
  if(tEl){var lt=localStorage.getItem(KB_TIME_KEY);tEl.textContent=lt?new Date(lt).toLocaleString():'--';}
  var el=document.getElementById('kbStatus');
  if(el){el.textContent=text;el.style.color=ok?'#4db8a4':'#ff8f00';}
}
function forceUpdateKB(){localStorage.removeItem(KB_VERSION_KEY);showKBStatus('更新中...',false);fetchRemoteKB();}

// ========== Models ==========
var MODELS={
groq_llama:{name:'LLaMA 3.1',icon:'🦙',base:'https://api.groq.com/openai/v1/chat/completions',keyField:'groqKey',model:'llama-3.1-8b-instant',think:false},
groq_mixtral:{name:'Mixtral',icon:'🔮',base:'https://api.groq.com/openai/v1/chat/completions',keyField:'groqKey',model:'mixtral-8x7b-32768',think:false},
ds_r1:{name:'DeepSeek-R1',icon:'🧠',base:'https://api.deepseek.com/chat/completions',keyField:'dsKey',model:'deepseek-reasoner',think:true},
ds_v3:{name:'DeepSeek-V3',icon:'⚡',base:'https://api.deepseek.com/chat/completions',keyField:'dsKey',model:'deepseek-chat',think:false},
local:{name:'本地AI',icon:'🏠',base:'http://127.0.0.1:28789/v1/chat/completions',keyField:null,model:'gpt-3.5-turbo',think:false}
};
var curModel=localStorage.getItem('curModel')||'local';

function renderModelBar(){
  var bar=document.getElementById('modelBar');bar.innerHTML='';
  for(var k in MODELS){
    var m=MODELS[k],b=document.createElement('button');
    b.textContent=m.icon+' '+m.name;b.className=k===curModel?'active':'';
    b.onclick=(function(kk){return function(){curModel=kk;localStorage.setItem('curModel',kk);renderModelBar();}})(k);
    bar.appendChild(b);
  }
}
renderModelBar();

// ========== KB Search ==========
var _searchIdx=null;
function buildSearchIdx(){
  _searchIdx={};
  for(var i=0;i<KB.length;i++){
    var e=KB[i];if(!e||!e.kw)continue;
    var terms=[e.t.toLowerCase()].concat(e.kw.map(function(k){return k.toLowerCase();}));
    for(var j=0;j<terms.length;j++){var t=terms[j];if(!_searchIdx[t])_searchIdx[t]=[];if(_searchIdx[t].indexOf(i)<0)_searchIdx[t].push(i);}
  }
}
function searchKB(q){
  q=q.toLowerCase().trim();if(!_searchIdx)buildSearchIdx();
  var scores={};var keys=Object.keys(_searchIdx);
  for(var k=0;k<keys.length;k++){
    var term=keys[k],w=0;
    if(term===q)w=50;else if(term.includes(q))w=10;else if(q.includes(term))w=15;
    else{for(var p=1;p<=Math.min(q.length,3);p++){if(term.includes(q.substring(0,p))){w=Math.max(w,1);break;}}}
    if(w>0){var idxs=_searchIdx[term];for(var j=0;j<idxs.length;j++)scores[idxs[j]]=(scores[idxs[j]]||0)+w;}
  }
  var best=null,bestScore=0;
  for(var idx in scores){var s=scores[idx];if(KB[idx].c&&KB[idx].c.toLowerCase().includes(q))s+=3;if(s>bestScore){bestScore=s;best=KB[idx];}}
  return bestScore>=5?best:null;
}
function findSimilar(q){
  q=q.toLowerCase().trim();if(!_searchIdx)buildSearchIdx();
  var scores={};var keys=Object.keys(_searchIdx);
  for(var k=0;k<keys.length;k++){var term=keys[k],w=0;if(term.includes(q)||q.includes(term))w+=10;else{for(var p=0;p<q.length;p++){if(term.includes(q[p]))w+=1;}}if(w>0){var idxs=_searchIdx[term];for(var j=0;j<idxs.length;j++)scores[idxs[j]]=(scores[idxs[j]]||0)+w;}}
  var results=[];for(var idx in scores)results.push({t:KB[idx].t,s:scores[idx]});
  results.sort(function(a,b){return b.s-a.s;});
  return results.slice(0,5).map(function(r){return r.t;});
}

// ========== Patient Profile & State Machine ==========
// Phase: 'profile' -> 'quiz' -> 'consult'
var phase='profile'; // current phase
var profile={gender:'',age:'',chronicDisease:'',currentMeds:''};
var quizResult=null; // constitution type after quiz
var consultState='init'; // 'init' | 'asking_allergy' | 'ready'
var consultKB=null;
var consultAllergy='';
var historyIdx=0;

var PROFILE_QUESTIONS=[
  {field:'gender',q:'请问您的性别是？',opts:['男','女','其他']},
  {field:'age',q:'请问您的年龄？',opts:['18岁以下','18-30岁','31-45岁','46-60岁','60岁以上']},
  {field:'chronicDisease',q:'您有没有慢性疾病？（如高血压、糖尿病、心脏病等，没有请选"无"）',opts:['无','高血压','糖尿病','心脏病','肝病','肾病','哮喘','其他']},
  {field:'currentMeds',q:'您目前有在服用什么药物或保健品吗？（没有请选"无"）',opts:['无','降压药','降糖药','心脏药','中药/中成药','保健品','其他']}
];

var ALLERGY_QUESTION={field:'allergy',q:'请问您有没有药物过敏史？对哪些药物过敏？（没有请说"无"）'};

var QS=[
"你容易疲乏无力吗？","你容易气短懒言吗？","你容易手脚发凉吗？",
"你容易口干咽燥吗？","你体型偏胖腹部肥满吗？","你面部油光易生痤疮吗？",
"你面色晦暗易有瘀斑吗？","你容易忧郁多虑吗？","你容易过敏打喷嚏吗？",
"你容易怕冷吗？","你容易出汗吗？","你睡眠质量如何？",
"你容易烦躁不安吗？","你胃口如何？","你大便情况如何？",
"你小便颜色如何？","你容易感冒吗？","你四肢感觉如何？"
];
var QZ_TYPES=['平和质','气虚质','阳虚质','阴虚质','痰湿质','湿热质','血瘀质','气郁质','特禀质'];
var quizIdx=0,quizAns=[];

function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML;}

// ========== Chat UI ==========
var chatArea=document.getElementById('chatArea');

function addMsg(cls,html){
  var d=document.createElement('div');d.className='msg '+cls;d.innerHTML=html;
  chatArea.appendChild(d);chatArea.scrollTop=99999;
  while(chatArea.children.length>100)chatArea.removeChild(chatArea.firstChild);
  return d;
}

function showPhaseWelcome(){
  chatArea.innerHTML='';
  if(phase==='profile'){
    addMsg('ai','<div style="text-align:center"><div style="font-size:42px;margin-bottom:10px;animation:float 3s ease-in-out infinite">\ud83c\udfe7</div><h2 style="color:var(--pri-d);margin-bottom:6px">欢迎使用岐黄智医</h2><p style="color:var(--txt2);line-height:1.8">AI中西医结合健康助手<br>为了给您提供精准的个性化建议<br>请先告诉我一些基本信息</p></div>');
    setTimeout(function(){askProfileQuestion(0);},600);
  }else if(phase==='quiz'){
    addMsg('ai','<div class="section"><div class="section-title">\ud83c\udfe7 基本信息已记录</div><p>性别：'+esc(profile.gender)+' | 年龄：'+esc(profile.age)+'<br>慢性病：'+esc(profile.chronicDisease)+' | 用药：'+esc(profile.currentMeds)+'</p></div>');
    addMsg('ai','<div style="text-align:center;margin-top:10px"><p style="color:var(--txt2)">接下来进行<b>中医体质辨识</b>，共18道题</p></div>');
    setTimeout(function(){renderQuizQ();},500);
  }else if(phase==='consult'){
    var qzInfo=quizResult?'您的体质：<b>'+esc(quizResult.type)+'</b>':'';
    addMsg('ai','<div style="text-align:center"><div style="font-size:36px;margin-bottom:8px">\u2728</div><h3 style="color:var(--pri-d)">信息收集完成！</h3><p style="color:var(--txt2);line-height:1.8">'+qzInfo+'<br>现在请告诉我您今天哪里不舒服？</p><div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center"></div></div>');
    document.getElementById('quickBtns').style.display='flex';
    document.getElementById('inp').placeholder='描述您的症状...（如：头痛、胃痛、失眠）';
  }
}

// ========== Phase 1: Profile Collection ==========
function askProfileQuestion(idx){
  if(idx>=PROFILE_QUESTIONS.length){
    // Profile complete, move to quiz phase
    phase='quiz';
    showPhaseWelcome();
    return;
  }
  var pq=PROFILE_QUESTIONS[idx];
  var h='<div class="section"><div class="section-title">\ud83d\udc64 第'+(idx+1)+'步 / 共'+PROFILE_QUESTIONS.length+'步 — '+esc(pq.q)+'</div>';
  h+='<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">';
  for(var i=0;i<pq.opts.length;i++){
    h+='<button onclick="answerProfile('+idx+',\''+esc(pq.opts[i])+'\')" style="background:var(--pri);color:#fff;border:none;border-radius:20px;padding:8px 20px;font-size:14px;cursor:pointer;font-weight:500;transition:.2s">'+esc(pq.opts[i])+'</button>';
  }
  h+='</div></div>';
  addMsg('ai',h);
}

function answerProfile(idx,val){
  var field=PROFILE_QUESTIONS[idx].field;
  profile[field]=val;
  // Show user's choice as user message
  addMsg('user',val);
  askProfileQuestion(idx+1);
}

// ========== Phase 2: Constitution Quiz ==========
function renderQuizQ(){
  var w=document.getElementById('chatArea'); // render in chat area now
  if(quizIdx>=QS.length){renderQuizResult();return;}
  var q=QS[quizIdx];
  var h='<div class="section"><div class="section-title">\ud83e\ude7a 体质辨识 第'+(quizIdx+1)+'题 / '+QS.length+'</div><p style="font-size:15px;line-height:1.6;margin-top:8px">'+esc(q)+'</p>';
  h+='<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">';
  var opts=['没有','很少','有时','经常','总是'];
  for(var i=0;i<opts.length;i++){
    h+='<button onclick="answerQuiz('+i+')" style="border:2px solid var(--border);border-radius:12px;background:var(--card);padding:8px 24px;font-size:14px;cursor:pointer;color:var(--txt2);transition:.2s">'+esc(opts[i])+'</button>';
  }
  h+='</div></div>';
  addMsg('ai',h);
}

function answerQuiz(v){
  quizAns.push(v);addMsg('user',['没有','很少','有时','经常','总是'][v]);
  quizIdx++;renderQuizQ();
}

function renderQuizResult(){
  var typeMap=[1,1,2,3,4,5,6,7,8,2,1,3,5,4,4,5,1,2];
  var scores=[0,0,0,0,0,0,0,0,0];
  for(var i=0;i<quizAns.length;i++){var tm=typeMap[i]||0;scores[tm]+=(quizAns[i]+1);}
  var maxS=0,maxI=0,totalS=0;
  for(var i=1;i<9;i++){totalS+=scores[i];if(scores[i]>maxS){maxS=scores[i];maxI=i;}}
  var type=totalS<20?QZ_TYPES[0]:QZ_TYPES[maxI];
  quizResult={type:type,scores:scores};

  var descs={'平和质':'阴阳气血调和，体形匀称，面色润泽。','气虚质':'元气不足，疲乏气短，易感冒。','阳虚质':'阳气不足，手足不温，畏寒怕冷。','阴虚质':'阴液亏少，口燥咽干，手足心热。','痰湿质':'痰湿凝聚，体形肥胖腹满。','湿热质':'湿热内蕴，面垢油光，口苦苔黄。','血瘀质':'血行不畅，肤色晦暗易瘀斑。','气郁质':'气机郁滞，神情抑郁多虑。','特禀质':'先天禀赋异常，过敏体质。'};

  var h='<div class="section"><div class="section-title">\ud83c\udfaf 您的中医体质：'+esc(type)+'</div>';
  h+='<p style="margin-top:8px;color:var(--txt2)">'+descs[type]+'</p>';
  h+='<p style="margin-top:6px;font-size:13px;color:var(--txt2)">该体质将在后续问诊中作为辨证参考。</p></div>';
  addMsg('ai',h);

  // Move to consultation phase
  phase='consult';
  setTimeout(function(){showPhaseWelcome();},800);
}

// ========== Phase 3: Consultation ==========
function quickAsk(symptom){
  if(phase!=='consult'){return;}
  inp.focus();chatArea.scrollTop=0;
  document.getElementById('inp').value=symptom;
  send();
}

async function send(){
  var inp=document.getElementById('inp'),q=inp.value.trim();
  if(!q)return;

  // If not in consult phase, ignore or redirect
  if(phase==='profile'||phase==='quiz'){
    addMsg('user',esc(q));
    addMsg('ai','<span style="color:var(--txt2)">请先完成信息收集和体质辨识 \u21aa</span>');
    return;
  }

  addMsg('user',esc(q));inp.value='';

  // Route by state
  if(consultState==='asking_allergy'){
    handleAllergyReply(q);return;
  }

  // Search KB
  var kb=searchKB(q);
  if(kb){
    consultKB=kb;consultState='asking_allergy';consultAllergy='';
    var intro='<b>\ud83d\udccb 初步判断：'+esc(kb.t)+'</b><br><br>'+kb.c+'<br><br><b>\ud83d\udcea 为了给您更精准的建议：</b><br>';
    intro+='<div class="section"><div class="section-title">\ud83d\udc8a '+esc(ALLERGY_QUESTION.q)+'</div></div>';
    addMsg('ai',intro+'<div style="margin-top:8px"><button onclick="skipAllergy()" style="background:var(--pri);color:#fff;border:none;border-radius:8px;padding:6px 16px;font-size:13px;cursor:pointer">\u23ef 跳过</button></div><span class="disclaimer">\u26a0\ufe0f AI辅助诊疗仅供参考，不能替代医生诊断</span>');
    return;
  }

  // No match
  var suggestions=findSimilar(q);
  var ld=document.createElement('div');ld.className='msg loading';ld.innerHTML='<div class="spinner"></div>';
  chatArea.appendChild(ld);chatArea.scrollTop=99999;
  while(chatArea.children.length>100)chatArea.removeChild(chatArea.firstChild);

  try{
    await callAIWithProfile(q);
    chatArea.removeChild(ld);
  }catch(e){
    chatArea.removeChild(ld);
    var errMsg='\ud83d\ude41 暂时无法连接AI服务<br><br>\ud83d\udccb 知识库暂未收录「'+esc(q)+'」';
    if(suggestions.length>0){
      errMsg+='<br><br>\ud83e\dd14 您是不是想问：<br>';
      suggestions.forEach(function(s){errMsg+='<span class="tag" style="cursor:pointer;margin:2px" onclick="quickAsk(\''+esc(s)+'\')">'+esc(s)+'</span>';});
    }
    addMsg('ai',errMsg);
  }
}

function handleAllergyReply(reply){
  consultAllergy=reply;
  generateAdvice();
}

function skipAllergy(){
  consultAllergy='未提供';
  generateAdvice();
}

async function generateAdvice(){
  var kb=consultKB;
  var ld=document.createElement('div');ld.className='msg loading';
  ld.innerHTML='<div class="spinner"></div>\u6b63\u5728\u6839\u636e\u60a8\u7684\u60c5\u51b5\u751f\u6210\u4e2a\u6027\u5316\u65b9\u6848\u2026';
  chatArea.appendChild(ld);chatArea.scrollTop=99999;
  while(chatArea.children.length>100)chatArea.removeChild(chatArea.firstChild);

  try{
    var adviceDiv=addMsg('ai','');
    var prompt='你扮演岐黄智医AI健康助手。用户已自述症状并回答了以下问题，请生成完整的个性化健康方案。\n\n【患者档案】\n- 性别：'+profile.gender+'\n- 年龄：'+profile.age+'\n- 慢性病史：'+profile.chronicDisease+'\n- 当前用药：'+profile.currentMeds+'\n- 中医体质：'+(quizResult?quizResult.type:'未知')+'\n- 症状/疾病：'+kb.t+'\n- 过敏史：'+consultAllergy+'\n\n请分两大部分回复：\n\n## \ud83c\udf4f 食疗方案\n1.【中医辨证分型】结合患者体质判断最可能的证型\n2.【药膳推荐】3-5款家常药膳（注意根据过敏史和慢病史调整）\n3.【饮食禁忌】需要避免的食物和原因\n4.【药物-食物相互作用提醒】\n\n## \ud83d\udc8a 用药建议\n1.【常用药物】（西药+中成药），括号内注明注意事项\n2.【药物相互作用】\n3.【就医指征】出现哪些情况必须立即就医\n\n注意事项：结合患者体质和病史给出个性化调整；涉及慢性病用药时提醒遵医嘱；总字数控制在600字以内。\n\n参考知识：\n'+kb.c+(kb.d?'\n\n'+kb.d:'')+(kb.m?'\n\n'+kb.m:'');
    await callAI_Once(prompt, adviceDiv);
    chatArea.removeChild(ld);
    if(adviceDiv&&!adviceDiv.innerHTML.includes('disclaimer')){
      adviceDiv.innerHTML+='<span class="disclaimer">\u26a0\ufe0f 以上内容仅供参考，如有不适请及时就医。</span>';
    }
    consultState='init';consultKB=null;
  }catch(e){
    chatArea.removeChild(ld);
    var fallback='<b>\ud83d\udccb '+esc(kb.t)+'</b><br><br>'+kb.c+'<br><br>';
    if(consultAllergy&&consultAllergy!=='未提供'){
      fallback+='<div class="section"><div class="section-title">\u26a0\ufe0f 注意您的过敏史</div><p>您提到对'+esc(consultAllergy)+'过敏，请在就医时告知医生。</p></div>';
    }
    if(kb.d)fallback+='<b>\ud83c\udf4f 饮食建议：</b><br>'+kb.d+'<br><br>';
    if(kb.m)fallback+='<b>\ud83d\udc8a 常用药物：</b><br>'+kb.m+'<br><br>';
    fallback+='<span class="disclaimer">\u26a0\ufe0f 仅供参考，如有不适请及时就医</span>';
    addMsg('ai',fallback);
    consultState='init';consultKB=null;
  }
}

// ========== Typewriter Effect ==========
function formatMD(text){
  var codeBlocks=[];
  text=text.replace(/```([\s\S]*?)```/g,function(m,c){codeBlocks.push('<pre style="background:#f5f5f5;padding:8px;border-radius:8px;font-size:13px;overflow-x:auto">'+esc(c.trim())+'</pre>');return '\x00CB'+(codeBlocks.length-1)+'\x00';});
  text=text.replace(/`([^`]+)`/g,'<code style="background:#f0f0f0;padding:2px 6px;border-radius:4px;font-size:13px">$1</code>');
  text.replace(/^### (.+)$/gm,'<h4 style="margin:8px 0 4px;color:var(--pri)">$1</h4>');
  text=text.replace(/^## (.+)$/gm,'<h3 style="margin:10px 0 4px;color:var(--pri-d)">$1</h3>');
  text=text.replace(/^# (.+)$/gm,'<h2 style="margin:10px 0 4px;color:var(--pri-d)">$2</h2>');
  text=text.replace(/\*\*(.*?)\*\*/g,'<b>$1</b>');
  text=text.replace(/^[-*] /gm,'\u2022 ');
  text=text.replace(/^(\d+)\. /gm,'$1. ');
  for(var i=0;i<codeBlocks.length;i++)text=text.replace('\x00CB'+i+'\x00',codeBlocks[i]);
  text=text.replace(/\n/g,'<br>');
  return text;
}

function typewriter(msgDiv, fullText, prefixHTML){
  return new Promise(function(resolve){
    msgDiv.innerHTML = prefixHTML + '<span id="tw-text"></span><span id="tw-cursor" class="tw-cursor"></span>';
    var i = 0,speed = 22,textEl = document.getElementById('tw-text');
    function tick(){
      if(i < fullText.length){
        if(textEl){textEl.textContent = fullText.substring(0, i+1);i++;chatArea.scrollTop = 99999;setTimeout(tick, speed);}
        else {msgDiv.innerHTML = prefixHTML + '<span>' + formatMD(fullText) + '</span>';resolve();}
      } else {
        var cursor = document.getElementById('tw-cursor');if(cursor) cursor.remove();
        var te = document.getElementById('tw-text');if(te) te.innerHTML = formatMD(fullText);
        resolve();
      }
    }
    tick();
  });
}

// ========== AI Call ==========
async function _fetchAI(sysPrompt, userMsg, opts){
  opts=opts||{};var onThinking=opts.onThinking||null;
  var cfg=MODELS[curModel];
  var key=cfg.keyField?localStorage.getItem(cfg.keyField):null;
  if(!key)key=document.getElementById(cfg.keyField).value||null;
  var headers={'Content-Type':'application/json'};
  if(key)headers['Authorization']='Bearer '+key;
  var body=JSON.stringify({model:cfg.model,messages:[{role:'system',content:sysPrompt},{role:'user',content:userMsg}],stream:true});
  var resp=await Promise.race([fetch(cfg.base,{method:'POST',headers:headers,body:body}),new Promise(function(_,rej){setTimeout(function(){rej(new Error('\u8bf7\u6c42\u8d85\u65f6(15s)'));},15000);})]);
  if(!resp.ok){try{await resp.text();}catch(e){}
    if(resp.status===401)throw new Error('API Key\u65e0\u6548\uff0c\u8bf7\u68c0\u67e5\u8bbe\u7f6e');
    if(resp.status===402)throw new Error('API\u4f59\u989d\u4e0d\u8db3');
    if(resp.status===429)throw new Error('\u8bf7\u6c42\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5');
    throw new Error('HTTP '+resp.status);
  }
  var reader=resp.body.getReader(),decoder=new TextDecoder(),full='',thinking='';
  while(true){
    var result=await reader.read();if(result.done)break;
    var chunk=decoder.decode(result.value,{stream:true});var lines=chunk.split('\n');
    for(var i=0;i<lines.length;i++){
      var line=lines[i];if(!line.startsWith('data: '))continue;
      var data=line.slice(6).trim();if(data==='[DONE]')continue;
      try{var json=JSON.parse(data);var delta=json.choices&&json.choices[0]&&json.choices[0].delta;if(!delta)continue;if(cfg.think&&delta.reasoning_content){thinking+=delta.reasoning_content;if(onThinking)onThinking(thinking);continue;}if(delta.content)full+=delta.content;}catch(e){}
    }
  }
  return {full:full,thinking:thinking,cfg:cfg};
}

async function callAIWithProfile(q){
  var msgDiv=addMsg('ai',''),cfg=MODELS[curModel];
  var profileInfo='\n【患者档案】性别:'+profile.gender+' 年龄:'+profile.age+' 慢性病:'+profile.chronicDisease+' 用药:'+profile.currentMeds+' 体质:'+(quizResult?quizResult.type:'未知');
  var thinkDiv=null;
  if(cfg.think){
    thinkDiv=document.createElement('div');
    thinkDiv.style.cssText='background:var(--chat-bg);border:1px solid var(--border);border-radius:10px;padding:10px 14px;margin-bottom:8px;font-size:13px;color:var(--txt2);line-height:1.6;max-height:300px;overflow-y:auto;display:none';
    msgDiv.appendChild(thinkDiv);
  }
  var onThink=function(txt){
    if(!thinkDiv)return;
    thinkDiv.style.display='block';
    thinkDiv.innerHTML='<div style="font-weight:600;color:var(--pri);margin-bottom:6px">🧠 思考中... <span style="font-size:11px;color:var(--txt2)">('+Math.round(txt.length/2)+'字)</span></div>'+esc(txt).replace(/\n/g,'<br>');
    chatArea.scrollTop=99999;
  };
  var r=await _fetchAI('你是岐黄智医，一个专业的AI中西医结合健康助手。回答要求：1)简洁易懂 2)结合中西医双重视角 3)给出饮食和生活建议 4)提醒严重情况需就医 5)不要过度诊断'+profileInfo,q,{onThinking:onThink});
  if(thinkDiv&&r.thinking){
    thinkDiv.style.display='block';
    thinkDiv.innerHTML='<details open><summary style="cursor:pointer;font-weight:600;color:var(--pri);margin-bottom:6px">🧠 思考过程 ('+Math.round(r.thinking.length/2)+'字)</summary><div style="margin-top:6px">'+esc(r.thinking).replace(/\n/g,'<br>')+'</div></details>';
  }
  await typewriter(msgDiv, r.full, thinkDiv&&r.thinking?'':'');
  var disc=document.createElement('span');disc.className='disclaimer';disc.textContent='⚠️ AI生成内容仅供参考，如有不适请及时就医';msgDiv.appendChild(disc);
}

async function callAI_Once(prompt, msgDiv){
  var cfg=MODELS[curModel];
  var thinkDiv=null;
  if(msgDiv&&cfg.think){
    thinkDiv=document.createElement('div');
    thinkDiv.style.cssText='background:var(--chat-bg);border:1px solid var(--border);border-radius:10px;padding:10px 14px;margin-bottom:8px;font-size:13px;color:var(--txt2);line-height:1.6;max-height:300px;overflow-y:auto;display:none';
    msgDiv.appendChild(thinkDiv);
  }else if(msgDiv){
    msgDiv.innerHTML='<div style="color:var(--txt2);font-size:13px;padding:8px">⏳ 正在生成个性化方案...</div>';
  }
  var onThink=function(txt){
    if(!thinkDiv)return;
    thinkDiv.style.display='block';
    thinkDiv.innerHTML='<div style="font-weight:600;color:var(--pri);margin-bottom:6px">🧠 辨证分析中... <span style="font-size:11px;color:var(--txt2)">('+Math.round(txt.length/2)+'字)</span></div>'+esc(txt).replace(/\n/g,'<br>');
    chatArea.scrollTop=99999;
  };
  var r=await _fetchAI('你是岐黄智医，中西医结合健康助手。回答时分两大部分：【食疗方案】和【用药建议】，简洁分点，600字以内。',prompt,{onThinking:onThink});
  if(thinkDiv&&r.thinking){
    thinkDiv.style.display='block';
    thinkDiv.innerHTML='<details open><summary style="cursor:pointer;font-weight:600;color:var(--pri);margin-bottom:6px">🧠 辨证思考过程 ('+Math.round(r.thinking.length/2)+'字)</summary><div style="margin-top:6px">'+esc(r.thinking).replace(/\n/g,'<br>')+'</div></details>';
  }
  if(msgDiv){await typewriter(msgDiv, r.full, thinkDiv&&r.thinking?'':'');return null;}
  return r.full.replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
}

// ========== Panel Switch ==========
function showPanel(p){
  ['chat','quiz','settings'].forEach(function(x){
    document.getElementById('p-'+x).className='panel'+(x===p?' active':'');
    document.getElementById('t-'+x).className=x===p?'active':'';
  });
  if(p==='settings')loadKeys();
  // Quiz tab now redirects to chat since quiz is integrated into flow
  if(p==='quiz'){showPanel('chat');return;}
}

function clearChat(){
  chatArea.innerHTML='';
  phase='profile';
  profile={gender:'',age:'',chronicDisease:'',currentMeds:''};
  quizResult=null;consultState='init';consultKB=null;consultAllergy='';historyIdx=0;
  quizIdx=0;quizAns=[];
  document.getElementById('quickBtns').style.display='none';
  showPhaseWelcome();
}

// ========== Settings ==========
function loadKeys(){
  document.getElementById('groqKey').value=localStorage.getItem('groqKey')||'';
  document.getElementById('dsKey').value=localStorage.getItem('dsKey')||'';
}
function saveKeys(){
  localStorage.setItem('groqKey',document.getElementById('groqKey').value);
  localStorage.setItem('dsKey',document.getElementById('dsKey').value);
  addMsg('ai','\u2705 设置已保存');
  showPanel('chat');
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', function(){
  loadKB();
  var lt=localStorage.getItem('qhy_kb_time');
  var tEl=document.getElementById('kbUpdateTime');
  if(tEl&&lt) tEl.textContent=new Date(lt).toLocaleString();
  // Hide quick buttons initially (shown only in consult phase)
  document.getElementById('quickBtns').style.display='none';
  // Disable input during profile/quiz phases - actually let it work but route properly
  document.getElementById('inp').placeholder='请先完成信息收集...';
  inp.addEventListener('keydown',function(e){if(e.key==='Escape')showPanel('chat');});
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(function(){});
  // Start the flow!
  showPhaseWelcome();
});

// Enter key handler
document.getElementById('inp').addEventListener('keypress',function(e){
  if(e.key==='Enter'){e.preventDefault();send();}
});
