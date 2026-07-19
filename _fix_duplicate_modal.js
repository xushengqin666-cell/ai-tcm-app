const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
const before = s.length;

// 问题：备用方案插入了错误的嵌套 wrapper，导致双重 id="profileEditModal"
// 需要删除第二个（错误的）profileEditModal 及其相关 wrapper
// 找到第二个 id="profileEditModal" 并删除它之前插入的错误内容

// 找到 <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"> 之前的内容
// 这是一个 <div> 开始标签，我插入了错误的外层 wrapper

// 定位问题：我在 <h3 id="profileEditTitle" 前插入了 wrapper，导致：
// 原来的结构: <div flex> <h3> 变成
// 错误结构:   <div flex> <div id="profileEditModal"> <div modal-content> <h3>
// 
// 修复：删除我插入的内容，恢复原始结构

// 找错误插入的起点: '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' 
// 之前紧邻着 '<!-- Profile 编辑 Modal -->'
const oldBadBlock = '<!-- Profile 编辑 Modal -->\n<div id="profileEditModal" class="modal" style="display:none">\n  <div class="modal-content" style="max-width:340px;padding:24px;background:var(--card-bg,#fff);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.2);position:relative">\n    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">\n      <div id="profileEditModal" class="modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;align-items:center;justify-content:center"><div class="modal-content" style="max-width:340px;padding:24px;background:var(--card-bg,#fff);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.2);position:relative;width:90%">';

const newGoodBlock = '<!-- Profile 编辑 Modal -->\n<div id="profileEditModal" class="modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;align-items:center;justify-content:center">\n  <div class="modal-content" style="max-width:340px;padding:24px;background:var(--card-bg,#fff);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.2);position:relative;width:90%">\n    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">\n      <h3 id="profileEditTitle" style="margin:0;font-size:18px;color:var(--text-primary)">✏️ 编辑资料</h3>';

if (s.indexOf(oldBadBlock) >= 0) {
  s = s.replace(oldBadBlock, newGoodBlock);
  console.log('✅ 重复 profileEditModal 已删除，正确结构已恢复');
} else {
  console.log('⚠️ 未找到错误锚点，尝试通用修复');
  
  // 找两个连续的 id="profileEditModal"
  let firstIdx = s.indexOf('id="profileEditModal"');
  if (firstIdx >= 0) {
    // 找第二个 id="profileEditModal" 位置
    const secondSearch = s.slice(firstIdx + 1);
    const secondIdx = firstIdx + 1 + secondSearch.indexOf('id="profileEditModal"');
    
    if (secondIdx > firstIdx) {
      console.log('找到两个 profileEditModal @', firstIdx, '和', secondIdx);
      // 删掉第二个之前插入的错误内容
      // 第一个到第二个之间的内容
      const between = s.slice(firstIdx, secondIdx);
      console.log('between length:', between.length);
      
      // 检查是否包含 "modal-content" 两次
      const modalContentCount = (between.match(/modal-content/g) || []).length;
      console.log('modal-content 出现次数:', modalContentCount);
      
      if (modalContentCount >= 2) {
        // 删除第一个 modal-content 到第二个 profileEditModal 之前的内容
        const firstModalContentEnd = firstIdx + between.indexOf('</div>') + 6;
        // 找第一个 modal-content 结束后的 div 开始
        const afterFirst = s.slice(firstModalContentEnd);
        // 第二个 profileEditModal 的位置
        const secondPos = firstModalContentEnd + afterFirst.indexOf('id="profileEditModal"');
        
        // 删除 firstModalContentEnd 到 secondPos 的内容
        const before = s.slice(0, firstModalContentEnd);
        const after = s.slice(secondPos);
        s = before + after;
        console.log('✅ 删除了重复结构, 新大小:', s.length);
      }
    }
  }
}

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length, '(diff:', s.length - before, ')');
console.log('profileEditModal count:', (s.match(/id="profileEditModal"/g) || []).length);
