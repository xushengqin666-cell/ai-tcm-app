/* ============================================================
 * tcmengine.js — 家庭药师 · 中医辨证参考引擎 v1.0
 * ------------------------------------------------------------
 * 提供:
 *   TCMEngine.comprehensiveAnalysis(symptoms, tongue, pulse)
 *     -> { pattern, baGang[], confidence, matchedSymptoms[] }
 *   TCMEngine.generateTreatmentPlan(analysis)
 *     -> { treatment, formula, herbs[], diet[], acupoints[], note }
 *
 * ⚠️ 本引擎为「健康参考/科普用途」的规则系统，输出内容仅供
 *    用户了解中医辨证思路，不构成医疗诊断或治疗建议。
 *    真实诊疗请前往正规医疗机构。
 * ============================================================ */
(function (global) {
  'use strict';

  /* ---------------- 证型知识库 ---------------- */
  var SYNDROMES = {
    '风寒感冒': {
      baGang: ['表证', '寒证', '实证'],
      treatment: '辛温解表，宣肺散寒',
      formula: '荆防败毒散 / 麻黄汤加减',
      herbs: ['荆芥', '防风', '羌活', '紫苏叶', '生姜', '葱白'],
      diet: ['生姜红糖水', '葱白粥', '热汤热饮，避生冷'],
      acupoints: ['风池', '大椎', '列缺', '合谷']
    },
    '风热感冒': {
      baGang: ['表证', '热证', '实证'],
      treatment: '辛凉解表，清热解毒',
      formula: '银翘散 / 桑菊饮加减',
      herbs: ['金银花', '连翘', '薄荷', '牛蒡子', '桑叶', '菊花'],
      diet: ['金银花茶', '绿豆汤', '多饮水，忌辛辣燥热'],
      acupoints: ['大椎', '曲池', '合谷', '外关']
    },
    '肝气郁结': {
      baGang: ['里证', '实证', '气滞'],
      treatment: '疏肝解郁，理气畅中',
      formula: '逍遥散 / 柴胡疏肝散加减',
      herbs: ['柴胡', '白芍', '当归', '薄荷', '香附', '郁金'],
      diet: ['玫瑰花茶', '佛手茶', '少食油腻，适量运动'],
      acupoints: ['太冲', '期门', '膻中', '阳陵泉']
    },
    '肝火旺盛': {
      baGang: ['里证', '热证', '实证'],
      treatment: '清肝泻火，平肝潜阳',
      formula: '龙胆泻肝汤 / 丹栀逍遥散加减',
      herbs: ['龙胆草', '栀子', '黄芩', '夏枯草', '菊花', '决明子'],
      diet: ['菊花决明子茶', '苦瓜', '芹菜汁', '忌辛辣油炸'],
      acupoints: ['太冲', '行间', '风池', '肝俞']
    },
    '心火亢盛': {
      baGang: ['里证', '热证', '实证'],
      treatment: '清心泻火，宁心安神',
      formula: '导赤散 / 泻心汤加减',
      herbs: ['黄连', '莲子心', '竹叶', '生地黄', '灯心草', '栀子'],
      diet: ['莲子心茶', '苦丁茶', '绿豆汤', '忌辛辣'],
      acupoints: ['少府', '神门', '劳宫', '心俞']
    },
    '阴虚火旺': {
      baGang: ['里证', '虚证', '热证', '阴虚'],
      treatment: '滋阴降火，清热安神',
      formula: '知柏地黄丸 / 六味地黄丸加减',
      herbs: ['生地黄', '山茱萸', '牡丹皮', '知母', '黄柏', '玄参', '麦冬'],
      diet: ['百合银耳羹', '枸杞菊花茶', '莲子粥', '忌辛辣温燥'],
      acupoints: ['太溪', '三阴交', '涌泉', '肾俞']
    },
    '气血两虚': {
      baGang: ['里证', '虚证', '气血虚'],
      treatment: '益气养血，健脾补心',
      formula: '八珍汤 / 归脾汤加减',
      herbs: ['党参', '黄芪', '白术', '当归', '熟地黄', '白芍', '龙眼肉'],
      diet: ['红枣桂圆茶', '山药粥', '黄芪炖鸡', '忌生冷过度'],
      acupoints: ['足三里', '气海', '关元', '脾俞', '血海']
    },
    '脾气虚': {
      baGang: ['里证', '虚证', '气虚'],
      treatment: '健脾益气，和胃化湿',
      formula: '四君子汤 / 参苓白术散加减',
      herbs: ['党参', '白术', '茯苓', '山药', '白扁豆', '陈皮'],
      diet: ['山药薏米粥', '小米粥', '南瓜', '少食生冷甜腻'],
      acupoints: ['足三里', '脾俞', '中脘', '关元']
    },
    '脾胃虚寒': {
      baGang: ['里证', '虚证', '寒证'],
      treatment: '温中健脾，散寒止痛',
      formula: '理中丸 / 小建中汤加减',
      herbs: ['干姜', '党参', '白术', '炙甘草', '桂枝', '白芍'],
      diet: ['生姜大枣茶', '羊肉汤', '桂圆红枣粥', '忌生冷寒凉'],
      acupoints: ['中脘', '足三里', '神阙', '胃俞']
    },
    '湿热内蕴': {
      baGang: ['里证', '实证', '热证', '湿证'],
      treatment: '清热利湿，化浊和中',
      formula: '龙胆泻肝汤 / 三仁汤加减',
      herbs: ['薏苡仁', '茯苓', '泽泻', '车前子', '黄芩', '栀子', '滑石'],
      diet: ['赤小豆薏米汤', '冬瓜汤', '绿豆粥', '忌肥甘厚腻酒类'],
      acupoints: ['阴陵泉', '丰隆', '曲池', '足三里']
    },
    '痰湿内阻': {
      baGang: ['里证', '实证', '湿证'],
      treatment: '燥湿化痰，理气和中',
      formula: '二陈汤 / 温胆汤加减',
      herbs: ['陈皮', '半夏', '茯苓', '甘草', '枳实', '竹茹'],
      diet: ['陈皮薏米粥', '冬瓜海带汤', '忌甜腻生冷'],
      acupoints: ['丰隆', '阴陵泉', '中脘', '足三里']
    },
    '肾阳虚': {
      baGang: ['里证', '虚证', '寒证', '阳虚'],
      treatment: '温补肾阳，填精益髓',
      formula: '金匮肾气丸 / 右归丸加减',
      herbs: ['附子', '肉桂', '熟地黄', '山茱萸', '山药', '杜仲', '菟丝子'],
      diet: ['核桃黑芝麻糊', '羊肉生姜汤', '韭菜', '忌生冷'],
      acupoints: ['关元', '命门', '肾俞', '涌泉']
    },
    '肾阴虚': {
      baGang: ['里证', '虚证', '阴虚'],
      treatment: '滋阴补肾，填精益髓',
      formula: '六味地黄丸 / 左归丸加减',
      herbs: ['熟地黄', '山茱萸', '山药', '枸杞子', '女贞子', '墨旱莲'],
      diet: ['枸杞黑豆汤', '银耳百合羹', '桑葚', '忌辛辣熬夜'],
      acupoints: ['太溪', '肾俞', '三阴交', '涌泉']
    },
    '血瘀证': {
      baGang: ['里证', '实证', '血瘀'],
      treatment: '活血化瘀，通络止痛',
      formula: '血府逐瘀汤 / 桃红四物汤加减',
      herbs: ['桃仁', '红花', '当归', '川芎', '赤芍', '丹参'],
      diet: ['山楂红糖水', '黑木耳', '玫瑰花茶', '适当活动'],
      acupoints: ['血海', '膈俞', '合谷', '三阴交']
    },
    '心血不足': {
      baGang: ['里证', '虚证', '血虚'],
      treatment: '补血养心，益气安神',
      formula: '归脾汤 / 养心汤加减',
      herbs: ['当归', '熟地黄', '白芍', '龙眼肉', '酸枣仁', '柏子仁'],
      diet: ['红枣桂圆粥', '猪肝菠菜汤', '黑芝麻', '忌熬夜'],
      acupoints: ['神门', '心俞', '血海', '足三里']
    },
    '心神不宁': {
      baGang: ['里证', '虚实夹杂'],
      treatment: '养心安神，镇惊定志',
      formula: '天王补心丹 / 甘麦大枣汤加减',
      herbs: ['酸枣仁', '柏子仁', '远志', '茯苓', '百合', '小麦'],
      diet: ['百合莲子粥', '酸枣仁茶', '牛奶', '睡前放松'],
      acupoints: ['神门', '内关', '安眠穴', '心俞']
    },
    '肺气虚': {
      baGang: ['里证', '虚证', '气虚'],
      treatment: '补肺益气，固表止汗',
      formula: '玉屏风散 / 补肺汤加减',
      herbs: ['黄芪', '白术', '防风', '党参', '五味子', '山药'],
      diet: ['黄芪山药粥', '百合炖梨', '银耳羹', '避风寒'],
      acupoints: ['肺俞', '足三里', '膏肓', '太渊']
    },
    '燥邪伤肺': {
      baGang: ['表证', '实证', '燥证'],
      treatment: '清肺润燥，生津止咳',
      formula: '桑杏汤 / 清燥救肺汤加减',
      herbs: ['桑叶', '杏仁', '麦冬', '沙参', '百合', '川贝母'],
      diet: ['冰糖雪梨', '百合银耳羹', '蜂蜜水', '忌辛辣干燥'],
      acupoints: ['肺俞', '太渊', '列缺', '尺泽']
    },
    '心脾两虚': {
      baGang: ['里证', '虚证', '气血虚'],
      treatment: '健脾养心，益气补血',
      formula: '归脾汤加减',
      herbs: ['党参', '黄芪', '白术', '当归', '龙眼肉', '酸枣仁', '茯神'],
      diet: ['红枣桂圆粥', '山药莲子羹', '忌思虑过度'],
      acupoints: ['心俞', '脾俞', '神门', '足三里']
    },
    '肝胃不和': {
      baGang: ['里证', '实证', '气滞'],
      treatment: '疏肝和胃，降逆止呕',
      formula: '柴胡疏肝散合左金丸加减',
      herbs: ['柴胡', '香附', '陈皮', '白芍', '黄连', '吴茱萸'],
      diet: ['佛手茶', '陈皮茶', '少食多餐，忌情绪波动'],
      acupoints: ['太冲', '中脘', '足三里', '内关']
    },
    '肾气不固': {
      baGang: ['里证', '虚证', '气虚'],
      treatment: '补肾固摄，缩尿止遗',
      formula: '金锁固精丸 / 缩泉丸加减',
      herbs: ['山茱萸', '菟丝子', '芡实', '金樱子', '覆盆子', '益智仁'],
      diet: ['山药芡实粥', '核桃', '黑豆汤', '忌过度劳累'],
      acupoints: ['关元', '肾俞', '太溪', '三阴交']
    }
  };

  /* ---------------- 症状关键词 → 证型映射（权重） ---------------- */
  var SYMPTOM_RULES = [
    // 寒热与表里
    { keys: ['恶寒', '怕冷', '畏寒', '发热轻', '无汗', '身痛', '鼻塞', '流清涕', '咳嗽痰白', '风寒'], w: 3, s: '风寒感冒' },
    { keys: ['发热重', '恶风', '有汗', '咽喉痛', '咽痛', '黄痰', '流黄涕', '风热', '口渴喜饮'], w: 3, s: '风热感冒' },
    // 肝系
    { keys: ['情绪低落', '易怒', '烦躁', '胸胁胀满', '胁痛', '胸闷善太息', '叹气', '情志'], w: 3, s: '肝气郁结' },
    { keys: ['口苦', '目赤', '头痛胀', '急躁易怒', '胁肋灼痛', '面红', '肝火'], w: 3, s: '肝火旺盛' },
    { keys: ['嗳气', '反酸', '胃脘胀痛', '恶心', '两胁胀痛', '呃逆'], w: 2, s: '肝胃不和' },
    // 心系
    { keys: ['心烦', '失眠', '口舌生疮', '舌尖红', '小便短赤', '口渴'], w: 3, s: '心火亢盛' },
    { keys: ['心悸', '健忘', '多梦', '面色萎黄', '头晕目眩', '唇甲色淡'], w: 3, s: '心血不足' },
    { keys: ['失眠多梦', '易惊', '心神不宁', '健忘', '心烦'], w: 2, s: '心神不宁' },
    // 脾系
    { keys: ['食欲不振', '腹胀', '便溏', '乏力', '倦怠', '面色萎黄', '消瘦', '食少'], w: 3, s: '脾气虚' },
    { keys: ['胃脘冷痛', '喜温喜按', '遇冷加重', '大便稀溏', '四肢不温', '口淡不渴'], w: 3, s: '脾胃虚寒' },
    { keys: ['身重困倦', '口黏', '大便黏腻', '舌苔黄腻', '小便黄', '湿热', '口苦口臭'], w: 3, s: '湿热内蕴' },
    { keys: ['头重如裹', '痰多', '胸闷', '肢体困重', '苔白腻', '肥胖', '痰湿'], w: 3, s: '痰湿内阻' },
    { keys: ['食后腹胀', '气短', '神疲乏力', '舌边齿痕'], w: 2, s: '脾气虚' },
    // 肾系
    { keys: ['腰膝酸软', '畏寒肢冷', '夜尿多', '小便清长', '阳痿', '五更泄泻', '精神萎靡'], w: 3, s: '肾阳虚' },
    { keys: ['腰膝酸软', '五心烦热', '潮热盗汗', '耳鸣', '头晕', '咽干', '遗精'], w: 3, s: '肾阴虚' },
    { keys: ['小便频数', '遗尿', '夜尿多', '滑精', '腰膝酸软'], w: 2, s: '肾气不固' },
    // 气血
    { keys: ['神疲乏力', '气短懒言', '面色苍白', '头晕目眩', '心悸', '失眠健忘', '月经量少'], w: 3, s: '气血两虚' },
    { keys: ['面色晦暗', '刺痛', '痛处固定', '舌质紫暗', '瘀斑', '唇甲青紫', '经色紫暗有块'], w: 3, s: '血瘀证' },
    // 肺系
    { keys: ['气短', '自汗', '易感冒', '声低气怯', '咳喘无力', '肺气虚'], w: 3, s: '肺气虚' },
    { keys: ['干咳少痰', '咽干鼻燥', '痰中带血', '口干', '燥咳', '皮肤干燥'], w: 3, s: '燥邪伤肺' },
    // 心脾两虚 / 阴虚火旺 复合
    { keys: ['心悸怔忡', '失眠多梦', '食欲不振', '腹胀便溏', '倦怠乏力'], w: 2, s: '心脾两虚' },
    { keys: ['五心烦热', '潮热', '盗汗', '口干咽燥', '颧红', '舌红少苔', '失眠'], w: 3, s: '阴虚火旺' }
  ];

  /* ---------------- 舌象证据 ---------------- */
  var TONGUE_EVIDENCE = {
    '红舌': { heat: 2, deficiency: 0, syndrome: '阴虚火旺', note: '舌红提示热象，多为阴虚或实热' },
    '淡红': { heat: 0, deficiency: 0, syndrome: '', note: '淡红舌为正常舌象或平人' },
    '淡白': { cold: 2, deficiency: 2, syndrome: '气血两虚', note: '淡白舌主虚证、寒证，多为气血不足' },
    '暗红': { stasis: 2, heat: 1, syndrome: '血瘀证', note: '暗红舌多为血瘀或热入营血' },
    '绛红': { heat: 3, deficiency: 1, syndrome: '阴虚火旺', note: '绛舌为热盛伤阴或热入营血' },
    '青紫': { stasis: 3, cold: 1, syndrome: '血瘀证', note: '青紫舌主血瘀，兼寒或兼热' }
  };

  /* ---------------- 脉象证据 ---------------- */
  var PULSE_EVIDENCE = {
    '数脉': { heat: 2, note: '数脉主热证' },
    '缓脉': { normal: 1, damp: 1, note: '缓脉可见于湿证或平人' },
    '弦脉': { stagnation: 2, note: '弦脉主肝胆病、气滞、痛证' },
    '滑脉': { damp: 2, note: '滑脉主痰湿、食积、实热' },
    '细脉': { deficiency: 2, note: '细脉主气血两虚、诸虚劳损' },
    '沉脉': { interior: 2, note: '沉脉主里证' },
    '浮脉': { exterior: 2, note: '浮脉主表证' },
    '弱脉': { deficiency: 3, note: '弱脉主气血不足、阳气虚衰' }
  };

  /* ---------------- 综合分析 ---------------- */
  function comprehensiveAnalysis(symptoms, tongue, pulse) {
    symptoms = (symptoms || '').trim();
    tongue = (tongue || '').trim();
    pulse = (pulse || '').trim();

    var score = {};
    var matched = {};

    // 1) 症状评分
    var symList = symptoms.split(/[,，、;\s]+/).filter(Boolean);
    SYMPTOM_RULES.forEach(function (rule) {
      var hit = 0;
      rule.keys.forEach(function (k) {
        if (symptoms.indexOf(k) !== -1) hit++;
        symList.forEach(function (s) {
          if (s === k) hit++;
        });
      });
      if (hit > 0) {
        score[rule.s] = (score[rule.s] || 0) + rule.w * hit;
        matched[rule.s] = matched[rule.s] || [];
        matched[rule.s].push(rule.keys[0]);
      }
    });

    // 2) 舌象证据
    var tong = TONGUE_EVIDENCE[tongue];
    if (tong && tong.syndrome) {
      score[tong.syndrome] = (score[tong.syndrome] || 0) + 2;
      matched[tong.syndrome] = matched[tong.syndrome] || [];
      matched[tong.syndrome].push('舌象：' + tongue);
    }

    // 3) 脉象辅助修正
    var pulE = PULSE_EVIDENCE[pulse];
    if (pulE && pulE.exterior && score['风寒感冒'] == null && score['风热感冒'] == null) {
      // 浮脉提示表证：若无症状匹配，不强行判断
    }

    // 4) 结果排序
    var ranked = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; });
    var pattern = ranked[0] || '';
    var baGang = [];
    if (pattern && SYNDROMES[pattern]) baGang = SYNDROMES[pattern].baGang.slice();

    // 5) 空输入兜底
    if (!pattern) {
      if (tongue) pattern = (TONGUE_EVIDENCE[tongue] && TONGUE_EVIDENCE[tongue].syndrome) || '';
      if (!pattern && pulse) {
        if (PULSE_EVIDENCE[pulse].deficiency) pattern = '气血两虚';
        else if (PULSE_EVIDENCE[pulse].heat) pattern = '阴虚火旺';
        else if (PULSE_EVIDENCE[pulse].damp) pattern = '痰湿内阻';
        else if (PULSE_EVIDENCE[pulse].stagnation) pattern = '肝气郁结';
      }
      if (!pattern) {
        pattern = '证候待辨';
        baGang = ['需结合更多信息'];
      } else {
        baGang = SYNDROMES[pattern] ? SYNDROMES[pattern].baGang.slice() : [];
      }
    }

    var confidence = pattern && score[pattern] ? Math.min(95, 40 + score[pattern] * 12) : 30;
    return {
      pattern: pattern,
      baGang: baGang,
      confidence: confidence,
      matchedSymptoms: matched[pattern] || [],
      score: score
    };
  }

  /* ---------------- 治疗方案 ---------------- */
  function generateTreatmentPlan(analysis) {
    var p = (analysis && analysis.pattern) || '';
    var k = SYNDROMES[p];
    if (!k) {
      return {
        treatment: '建议完善四诊信息后咨询专业中医师',
        formula: '',
        herbs: [],
        diet: ['规律作息', '清淡饮食', '保持心情舒畅'],
        acupoints: ['足三里', '合谷'],
        note: '当前信息不足，无法给出具体辨证方案'
      };
    }
    return {
      treatment: k.treatment,
      formula: k.formula,
      herbs: k.herbs.slice(),
      diet: k.diet.slice(),
      acupoints: k.acupoints.slice(),
      note: '本方案为中医科普参考，请遵医嘱使用'
    };
  }

  /* ---------------- 导出 ---------------- */
  var TCMEngine = {
    version: '1.0.0',
    comprehensiveAnalysis: comprehensiveAnalysis,
    generateTreatmentPlan: generateTreatmentPlan,
    _syndromes: Object.keys(SYNDROMES),
    _info: '中医辨证参考引擎（科普用途，非医疗诊断）'
  };

  global.TCMEngine = TCMEngine;
})(typeof window !== 'undefined' ? window : this);
