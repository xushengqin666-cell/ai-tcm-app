const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 在 T.zh 和 T.en 中添加舌象脉象翻译
const zhTongueMap = `tongueMap:{'红舌':'红舌','淡红':'淡红舌','淡白':'淡白舌','暗红':'暗红舌','绛红':'绛红舌','青紫':'青紫舌','紫暗':'紫暗舌','胖大':'胖大舌','瘦薄':'瘦薄舌','裂纹':'裂纹舌','齿痕':'齿痕舌','芒刺':'芒刺舌','瘀点':'瘀点舌'},`;
const zhPulseMap = `pulseMap:{'浮':'浮脉','沉':'沉脉','迟':'迟脉','数':'数脉','滑':'滑脉','涩':'涩脉','虚':'虚脉','实':'实脉','弦':'弦脉','紧':'紧脉','濡':'濡脉','洪':'洪脉','细':'细脉','弱':'弱脉','结':'结脉','代':'代脉','促':'促脉'},`;

const enTongueMap = `tongueMap:{'红舌':'Red tongue','淡红':'Light red','淡白':'Pale','暗红':'Dark red','绛红':'Crimson','青紫':'Bluish purple','紫暗':'Purple dark','胖大':'Swollen','瘦薄':'Thin','裂纹':'Cracked','齿痕':'Tooth-marked','芒刺':'Prickly','瘀点':'Petechiae'},`;
const enPulseMap = `pulseMap:{'浮':'Floating','沉':'Deep','迟':'Slow','数':'Rapid','滑':'Slippery','涩':'Choppy','虚':'Deficient','实':'Excess','弦':'Wiry','紧':'Tight','濡':'Soggy','洪':'Flooding','细':'Thin','弱':'Weak','结':'Knotted','代':'Intermittent','促':'Hasty'},`;

// 在 T.zh 的 cabMemberNoAssign 后面插入舌象脉象映射
const zhInsertPattern = "cabMemberNoAssign:'（不指定）',";
const zhInsertPos = s.indexOf(zhInsertPattern);
if (zhInsertPos > 0) {
  s = s.slice(0, zhInsertPos + zhInsertPattern.length) + '\n    ' + zhTongueMap + '\n    ' + zhPulseMap + s.slice(zhInsertPos + zhInsertPattern.length);
  console.log('✅ T.zh 舌象脉象映射已添加');
} else {
  console.log('⚠️ 未找到 T.zh 插入点');
}

// 在 T.en 的 cabMemberNoAssign 后面插入
const enInsertPattern = "cabMemberNoAssign:'Not specified',";
const enInsertPos = s.indexOf(enInsertPattern);
if (enInsertPos > 0) {
  s = s.slice(0, enInsertPos + enInsertPattern.length) + '\n    ' + enTongueMap + '\n    ' + enPulseMap + s.slice(enInsertPos + enInsertPattern.length);
  console.log('✅ T.en 舌象脉象映射已添加');
} else {
  console.log('⚠️ 未找到 T.en 插入点');
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
