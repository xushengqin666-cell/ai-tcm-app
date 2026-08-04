/**
 * 岐黄药师 · 中医辨证引擎 v3.0 (家庭AI药师版)
 * 纯规则引擎，无外部依赖，UTF-8 编码
 * API:
 *   TCMEngine.comprehensiveAnalysis(syms, ton, pul) -> {pattern, baGang[], reason[]}
 *   TCMEngine.generateTreatmentPlan(analysis) -> {treatment, formula, herbs[], diet[], acupoints[]}
 */

const TCMEngine = (function () {
  'use strict';

  // ============ 症状同义词归一 ============
  const SYMPTOM_SYNONYMS = {
    '口干': '口干', '口渴': '口干', '嘴干': '口干',
    '心烦': '心烦', '烦躁': '心烦', '心神不宁': '心烦', '焦虑': '心烦',
    '失眠': '失眠', '睡不好': '失眠', '睡不着': '失眠', '多梦': '失眠', '易醒': '失眠',
    '乏力': '乏力', '疲倦': '乏力', '没劲': '乏力', '疲劳': '乏力', '体虚': '乏力',
    '畏寒': '畏寒', '怕冷': '畏寒', '手脚凉': '畏寒', '肢冷': '畏寒',
    '发热': '发热', '发烧': '发热', '低烧': '发热',
    '咳嗽': '咳嗽', '干咳': '咳嗽', '咳痰': '咳嗽',
    '头痛': '头痛', '头疼': '头痛',
    '咽痛': '咽痛', '喉咙痛': '咽痛', '嗓子疼': '咽痛',
    '鼻塞': '鼻塞', '流鼻涕': '鼻塞', '鼻堵': '鼻塞',
    '胃胀': '胃胀', '腹胀': '胃胀', '肚子胀': '胃胀',
    '腹泻': '腹泻', '拉肚子': '腹泻', '便溏': '腹泻',
    '便秘': '便秘', '大便干': '便秘',
    '腰酸': '腰酸', '腰痛': '腰酸', '腰疼': '腰酸',
    '耳鸣': '耳鸣', '听力下降': '耳鸣',
    '心悸': '心悸', '心慌': '心悸', '心跳快': '心悸',
    '气短': '气短', '喘不上气': '气短', '胸闷': '气短',
    '食欲不振': '食欲不振', '没胃口': '食欲不振', '厌食': '食欲不振',
    '盗汗': '盗汗', '夜间出汗': '盗汗',
    '自汗': '自汗', '一动就出汗': '自汗',
    '口干咽燥': '口干咽燥', '咽干': '口干咽燥',
    '目涩': '目涩', '眼睛干': '目涩',
    '头晕': '头晕', '头昏': '头晕', '眩晕': '头晕',
    '水肿': '水肿', '浮肿': '水肿', '脚肿': '水肿',
    '夜尿多': '夜尿多', '尿频': '夜尿多',
    '关节疼痛': '关节疼痛', '关节疼': '关节疼痛', '风湿': '关节疼痛',
    '手脚心热': '手脚心热', '五心烦热': '手脚心热',
    '面色萎黄': '面色萎黄', '脸色差': '面色萎黄',
    '月经不调': '月经不调', '痛经': '月经不调', '经期不准': '月经不调',
    '健忘': '健忘', '记性差': '健忘',
    '情绪低沉': '情绪低沉', '抑郁': '情绪低沉', '高兴不起来': '情绪低沉',
    '易怒': '易怒', '急躁': '易怒', '爱发火': '易怒',
    '食欲不振': '食欲不振', '消化不良': '胃胀'
  };

  // ============ 舌象/脉象 关键词 ============
  const TONGUE_MAP = {
    '红': '热', '绛': '热', '黄腻': '湿热', '白腻': '寒湿', '淡白': '虚',
    '紫暗': '瘀', '有齿痕': '虚', '胖大': '湿', '少苔': '阴虚', '无苔': '阴虚', '裂纹': '阴虚'
  };
  const PULSE_MAP = {
    '数': '热', '迟': '寒', '细': '虚', '弱': '虚', '滑': '湿/实', '弦': '肝/郁',
    '沉': '里', '浮': '表', '涩': '瘀', '洪': '热盛'
  };

  // ============ 证型规则库 ============
  // weight: 命中权重；kw: 触发症状；tongue/pulse: 提示征象
  const PATTERNS = [
    {
      key: '风寒感冒', weight: 3,
      kw: ['畏寒', '发热', '鼻塞', '头痛', '咽痛', '咳嗽'],
      tongue: ['淡白', '白腻'], pulse: ['浮', '紧'],
      baGang: ['表', '寒', '实'],
      treatment: '辛温解表，宣肺散寒',
      formula: '荆防败毒散 / 风寒感冒颗粒',
      herbs: ['荆芥', '防风', '紫苏叶', '生姜', '羌活', '柴胡'],
      diet: ['葱白姜汤', '热粥发汗', '忌生冷瓜果'],
      acupoints: ['大椎', '风池', '列缺', '合谷']
    },
    {
      key: '风热感冒', weight: 3,
      kw: ['发热', '咽痛', '鼻塞', '头痛', '咳嗽', '口干'],
      tongue: ['红', '黄腻'], pulse: ['浮', '数'],
      baGang: ['表', '热', '实'],
      treatment: '辛凉解表，清热解毒',
      formula: '银翘散 / 桑菊饮 / 连花清瘟',
      herbs: ['金银花', '连翘', '桑叶', '菊花', '薄荷', '牛蒡子'],
      diet: ['淡豆豉汤', '梨水', '忌辛辣油腻'],
      acupoints: ['曲池', '合谷', '大椎', '少商']
    },
    {
      key: '脾胃虚寒', weight: 3,
      kw: ['胃胀', '腹泻', '食欲不振', '畏寒', '乏力'],
      tongue: ['淡白', '白腻', '有齿痕'], pulse: ['沉', '细', '弱'],
      baGang: ['里', '寒', '虚'],
      treatment: '温中健脾，散寒和胃',
      formula: '理中丸 / 香砂养胃丸',
      herbs: ['干姜', '党参', '白术', '炙甘草', '砂仁', '木香'],
      diet: ['生姜红枣汤', '山药粥', '忌冰饮生冷'],
      acupoints: ['中脘', '足三里', '脾俞', '胃俞']
    },
    {
      key: '肝胃不和', weight: 3,
      kw: ['胃胀', '心烦', '易怒', '胸闷', '食欲不振'],
      tongue: ['红', '黄腻'], pulse: ['弦'],
      baGang: ['里', '实', '气滞'],
      treatment: '疏肝和胃，理气止痛',
      formula: '柴胡疏肝散 / 舒肝丸',
      herbs: ['柴胡', '白芍', '枳壳', '香附', '陈皮', '甘草'],
      diet: ['玫瑰花茶', '陈皮粥', '忌恼怒焦虑'],
      acupoints: ['太冲', '期门', '足三里', '内关']
    },
    {
      key: '心脾两虚', weight: 3,
      kw: ['失眠', '乏力', '心悸', '健忘', '食欲不振', '气短'],
      tongue: ['淡白', '有齿痕'], pulse: ['细', '弱'],
      baGang: ['里', '虚', '气血两虚'],
      treatment: '补益心脾，养血安神',
      formula: '归脾汤 / 归脾丸',
      herbs: ['黄芪', '党参', '白术', '当归', '酸枣仁', '龙眼肉'],
      diet: ['桂圆红枣汤', '小米粥', '忌浓茶咖啡'],
      acupoints: ['神门', '内关', '足三里', '三阴交']
    },
    {
      key: '阴虚火旺', weight: 3,
      kw: ['手脚心热', '盗汗', '失眠', '口干咽燥', '心烦', '头晕'],
      tongue: ['红', '少苔', '无苔', '裂纹'], pulse: ['细', '数'],
      baGang: ['里', '热', '虚'],
      treatment: '滋阴降火，养阴清热',
      formula: '知柏地黄丸 / 天王补心丹',
      herbs: ['生地', '麦冬', '知母', '黄柏', '玄参', '酸枣仁'],
      diet: ['银耳百合汤', '梨', '忌辛辣温燥'],
      acupoints: ['太溪', '三阴交', '涌泉', '照海']
    },
    {
      key: '肾阳虚', weight: 3,
      kw: ['畏寒', '腰酸', '乏力', '夜尿多', '水肿', '头晕'],
      tongue: ['淡白', '胖大'], pulse: ['沉', '细', '弱'],
      baGang: ['里', '寒', '虚'],
      treatment: '温补肾阳，固本培元',
      formula: '金匮肾气丸 / 右归丸',
      herbs: ['肉桂', '附子', '熟地', '山茱萸', '杜仲', '淫羊藿'],
      diet: ['羊肉汤', '核桃', '忌生冷'],
      acupoints: ['肾俞', '命门', '关元', '太溪']
    },
    {
      key: '湿热内蕴', weight: 3,
      kw: ['乏力', '胃胀', '腹泻', '头晕', '口苦'],
      tongue: ['红', '黄腻'], pulse: ['滑', '数'],
      baGang: ['里', '热', '实'],
      treatment: '清热利湿，和胃化浊',
      formula: '葛根芩连汤 / 三仁汤',
      herbs: ['黄芩', '黄连', '茯苓', '薏苡仁', '厚朴', '半夏'],
      diet: ['薏米红豆汤', '冬瓜', '忌肥甘厚味'],
      acupoints: ['阴陵泉', '足三里', '丰隆', '曲池']
    },
    {
      key: '痰湿内阻', weight: 3,
      kw: ['乏力', '头晕', '胸闷', '食欲不振', '水肿'],
      tongue: ['白腻', '胖大'], pulse: ['滑', '弦'],
      baGang: ['里', '实', '湿'],
      treatment: '健脾化痰，利湿和中',
      formula: '二陈汤 / 六君子汤',
      herbs: ['半夏', '陈皮', '茯苓', '白术', '苍术', '厚朴'],
      diet: ['陈皮茯苓粥', '萝卜', '忌甜腻生冷'],
      acupoints: ['丰隆', '阴陵泉', '中脘', '足三里']
    },
    {
      key: '气血两虚', weight: 3,
      kw: ['乏力', '面色萎黄', '头晕', '心悸', '气短', '月经不调'],
      tongue: ['淡白', '有齿痕'], pulse: ['细', '弱'],
      baGang: ['里', '虚', '气血两虚'],
      treatment: '益气养血，调和营卫',
      formula: '八珍汤 / 十全大补丸',
      herbs: ['黄芪', '当归', '党参', '白芍', '熟地', '川芎'],
      diet: ['当归生姜羊肉汤', '红枣', '忌劳累'],
      acupoints: ['足三里', '血海', '三阴交', '气海']
    },
    {
      key: '气滞血瘀', weight: 3,
      kw: ['胸闷', '月经不调', '头痛', '心烦', '易怒'],
      tongue: ['紫暗', '有瘀斑'], pulse: ['涩', '弦'],
      baGang: ['里', '实', '瘀'],
      treatment: '行气活血，化瘀通络',
      formula: '血府逐瘀汤 / 逍遥丸',
      herbs: ['桃仁', '红花', '当归', '川芎', '柴胡', '赤芍'],
      diet: ['山楂红糖水', '黑木耳', '忌久坐不动'],
      acupoints: ['血海', '太冲', '膈俞', '三阴交']
    },
    {
      key: '肺气虚', weight: 3,
      kw: ['气短', '乏力', '咳嗽', '自汗', '畏寒'],
      tongue: ['淡白'], pulse: ['细', '弱'],
      baGang: ['里', '虚', '气虚'],
      treatment: '补肺益气，固表止咳',
      formula: '玉屏风散 / 补肺汤',
      herbs: ['黄芪', '白术', '防风', '党参', '五味子', '紫菀'],
      diet: ['山药百合汤', '黄芪炖鸡', '忌受凉'],
      acupoints: ['肺俞', '太渊', '足三里', '膏肓']
    }
  ];

  // ============ 工具函数 ============
  function normalizeSymptom(raw) {
    raw = (raw || '').replace(/\s+/g, '');
    // 中英混排时按中文切分
    const segs = raw.split(/[，,、;；。./]+/).map(function (s) { return s.trim(); }).filter(Boolean);
    const out = [];
    segs.forEach(function (seg) {
      if (SYMPTOM_SYNONYMS[seg]) out.push(SYMPTOM_SYNONYMS[seg]);
      else {
        // 包含匹配：段中含某同义词则归一
        let matched = false;
        for (const k in SYMPTOM_SYNONYMS) {
          if (seg.indexOf(k) >= 0) { out.push(SYMPTOM_SYNONYMS[k]); matched = true; break; }
        }
        if (!matched) out.push(seg);
      }
    });
    return out;
  }

  function collectTongue(ton) {
    const hits = [];
    for (const k in TONGUE_MAP) { if ((ton || '').indexOf(k) >= 0) hits.push(TONGUE_MAP[k]); }
    return hits;
  }
  function collectPulse(pul) {
    const hits = [];
    for (const k in PULSE_MAP) { if ((pul || '').indexOf(k) >= 0) hits.push(PULSE_MAP[k]); }
    return hits;
  }

  // ============ 主入口 ============
  function comprehensiveAnalysis(syms, ton, pul) {
    syms = syms || ''; ton = ton || ''; pul = pul || '';
    const norm = normalizeSymptom(syms);
    const tongueHits = collectTongue(ton);
    const pulseHits = collectPulse(pul);

    // 计分匹配证型
    const scored = PATTERNS.map(function (p) {
      let score = 0;
      const reason = [];
      norm.forEach(function (s) {
        if (p.kw.indexOf(s) >= 0) { score += p.weight; reason.push('症状「' + s + '」'); }
      });
      tongueHits.forEach(function (t) {
        if (p.baGang.indexOf(t) >= 0 || p.tongue && p.tongue.indexOf(t) >= 0) {
          // 舌象与证型寒热属性一致则加权重
          if ((t === '热' && p.baGang.indexOf('热') >= 0) ||
              (t === '寒' && p.baGang.indexOf('寒') >= 0) ||
              (t === '虚' && p.baGang.indexOf('虚') >= 0) ||
              (t === '湿' && p.baGang.indexOf('湿') >= 0) ||
              (t === '瘀' && p.baGang.indexOf('瘀') >= 0) ||
              (t === '阴虚' && p.baGang.indexOf('虚') >= 0)) {
            score += 1; reason.push('舌象提示「' + t + '」');
          }
        }
      });
      pulseHits.forEach(function (pp) {
        const base = pp.split('/')[0];
        if (p.baGang.indexOf(base) >= 0) { score += 1; reason.push('脉象提示「' + pp + '」'); }
      });
      return { p: p, score: score, reason: reason };
    }).sort(function (a, b) { return b.score - a.score; });

    const best = scored[0];
    // 若无任何命中，给一个保守的"待辨证"提示
    if (!best || best.score === 0) {
      return {
        pattern: '待进一步辨证',
        baGang: [],
        reason: ['当前输入信息不足以明确证型，建议补充症状描述或舌脉信息'],
        raw: { norm: norm, tongue: tongueHits, pulse: pulseHits }
      };
    }

    // 取分数最高的 1~2 个证型做复合提示
    const top = scored.filter(function (x) { return x.score === best.score; });
    const patternName = top.length > 1
      ? top.map(function (x) { return x.p.key; }).join(' 合并 ')
      : best.p.key;

    const baGangSet = {};
    top.forEach(function (x) { x.p.baGang.forEach(function (g) { baGangSet[g] = true; }); });
    const baGang = Object.keys(baGangSet);

    const reason = [];
    top.forEach(function (x) { x.reason.forEach(function (r) { reason.push(x.p.key + '：' + r); }); });

    return {
      pattern: patternName,
      baGang: baGang,
      reason: reason,
      score: best.score,
      raw: { norm: norm, tongue: tongueHits, pulse: pulseHits }
    };
  }

  // ============ 治疗方案生成 ============
  function generateTreatmentPlan(analysis) {
    analysis = analysis || {};
    const patternName = analysis.pattern || '';
    // 在规则库里找对应证型（支持合并证型取第一个）
    const mainKey = patternName.split(' 合并 ')[0];
    const p = PATTERNS.filter(function (x) { return x.key === mainKey; })[0];

    if (!p) {
      return {
        treatment: '建议咨询执业中医师进行面诊辨证',
        formula: '—',
        herbs: [],
        diet: ['规律作息', '清淡饮食', '避免劳累'],
        acupoints: []
      };
    }

    return {
      treatment: p.treatment,
      formula: p.formula,
      herbs: p.herbs.slice(),
      diet: p.diet.slice(),
      acupoints: p.acupoints.slice()
    };
  }

  // 暴露 API
  return {
    comprehensiveAnalysis: comprehensiveAnalysis,
    generateTreatmentPlan: generateTreatmentPlan,
    normalizeSymptom: normalizeSymptom,
    PATTERNS: PATTERNS
  };
})();

// 浏览器环境挂载全局
if (typeof window !== 'undefined') { window.TCMEngine = TCMEngine; }
if (typeof module !== 'undefined' && module.exports) { module.exports = TCMEngine; }
