/**
 * 宀愰粍鏅哄尰 v2.0 - 涓尰杈ㄨ瘉寮曟搸
 * 瀹炵幇鍏翰杈ㄨ瘉銆佽剰鑵戣鲸璇併€佹皵琛€娲ユ恫杈ㄨ瘉
 * 鏀寔澶氳疆闂瘖銆佷釜浣撳寲娌荤枟鏂规銆佺粨鏋勫寲鐥呭巻
 */

const TCMEngine = (function() {
  'use strict';

  // ==================== 鐥囩姸鏍囧噯鍖?====================
  const SYMPTOM_NORMALIZE = {
      '鑵扮棝': '鑵拌啙閰歌蒋',       '澶存檿': '鐪╂檿',       '鍠?: '姘斿枠',
      '鎷夎倸瀛?: '鑵规郴',       '娌¤儍鍙?: '绾冲憜',       '鑲氬瓙鐤?: '鑵圭棝',
      '蹇冩厡': '蹇冩偢',       '鍙ｅ共': '鍙ｆ复',       '灏块': '灏忎究棰戞暟',
      '鎵嬭剼鍐板噳': '鐣忓瘨鑲㈠喎',       '鎬曞喎': '鐣忓瘨鑲㈠喎',       '闈㈣壊鍙戠櫧': '闈㈣壊鑻嶇櫧',
      '鐫＄湢涓嶅ソ': '澶辩湢',       '瀹规槗鍑烘睏': '鑷睏',       '鐥板': '鐥板',
      '鍡撳瓙鐤?: '鍜界棝',       '鑳搁儴闂?: '鑳搁椃',       '渚跨涓嶉€?: '渚跨',
      '灏块粍': '灏忎究榛勮丹',       '鎬曢': '鎭跺瘨',       '鐪肩潧骞?: '鐩订',
      '韬綋娌夐噸': '鑲綋鍥伴噸',       '璁板繂鍔涘樊': '鍋ュ繕',       '鎯呯华鎶戦儊': '鎯呭織鎶戦儊',
      '鑳歌儊鐥?: '鑳歌儊鑳€鐥?,       '鍙规皵': '鍠勫お鎭?,       '鑳佽倠鐥?: '鑳歌儊鑳€鐥?,
      '灏忚吂鐥?: '鑵圭棝',       '澶存檿鐩湬': '鐪╂檿',       '鍜?: '鍜冲椊',
      '鍙戠儳': '鍙戠儹',       '鎭跺績': '鎭跺績鍛曞悙',       '灏忎究榛?: '灏忎究榛勮丹',
      '鍙ｅ共鑸岀嚗': '鍙ｆ复',       '澶т究骞茬粨': '渚跨',       '渚挎簭': '鑵规郴',
      '鐤插€?: '涔忓姏',       '闅句互鍏ョ潯': '澶辩湢',       '鐧藉ぉ鍑烘睏澶?: '鑷睏',
      '鑸岃嫈鐧?: '鑻旂櫧',       '鑴夋诞': '娴剦',       '鑴夊鸡': '寮﹁剦',
      '涓よ儊鑳€鐥?: '鑳歌儊鑳€鐥?,       '蹇冩儏鎶戦儊': '鎯呭織鎶戦儊',       '鎯呯华浣庤惤': '鎯呭織鎶戦儊',
      '鑳佽倠鑳€鐥?: '鑳歌儊鑳€鐥?,       '鑳佺棝': '鑳歌儊鑳€鐥?,       '鐖卞徆姘?: '鍠勫お鎭?,
      '鑴愯吂鐥?: '鑵圭棝',       '澶存槒鐪艰姳': '鐪╂檿',       '骞插挸': '鍜冲椊',
      '鍜冲椊鐥板': '鍜冲椊',       '楂樼儹': '鍙戠儹',       '浣庣儹': '鍙戠儹',
      '鍛曞悙': '鎭跺績鍛曞悙',       '鍙嶈儍': '鎭跺績鍛曞悙',       '灏胯丹': '灏忎究榛勮丹',
      '鍙ｅ共娆查ギ': '鍙ｆ复',       '鎺掍究鍥伴毦': '渚跨',       '澶т究绋€': '鑵规郴',
      '鐤叉儷': '涔忓姏',       '娌＄簿绁?: '涔忓姏',       '鏃╅啋': '澶辩湢',
      '鏄撻啋': '澶辩湢',       '蹇冭烦蹇?: '蹇冩偢',       '蹇冩偢鎬斿俊': '蹇冩偢',
      '澶滈棿鍑烘睏': '鐩楁睏',       '鑸岃嫈榛?: '鑻旈粍',       '鑸岃嫈鍘?: '鑻斿帤',
      '鑴夋矇': '娌夎剦',       '鑴夋暟': '鏁拌剦',       '鑴夎繜': '杩熻剦',
      '鑴夋粦': '婊戣剦',       '鑴夋订': '娑╄剦'
    };


  // ==================== 鐥囩姸鏉冮噸琛?====================
  const SYMPTOM_WEIGHTS = {
    // 瀵掕瘉
    '鐣忓瘨': { category: '瀵?, weight: 8 },
    '鑲㈠喎': { category: '瀵?, weight: 8 },
    '鑵圭棝鍠滄俯': { category: '瀵?, weight: 7 },
    '澶т究婧忚杽': { category: '瀵?, weight: 6 },
    '灏忎究娓呴暱': { category: '瀵?, weight: 6 },

    // 鐑瘉
    '鍙戠儹': { category: '鐑?, weight: 8 },
    '鍙ｆ复': { category: '鐑?, weight: 7 },
    '闈㈢孩': { category: '鐑?, weight: 6 },
    '渚跨': { category: '鐑?, weight: 6 },
    '灏忎究榛勮丹': { category: '鐑?, weight: 6 },

    // 铏氳瘉
    '涔忓姏': { category: '铏?, weight: 7 },
    '姘旂煭': { category: '铏?, weight: 7 },
    '鑷睏': { category: '铏?, weight: 6 },
    '鐩楁睏': { category: '铏?, weight: 6 },
    '鑴夌粏寮?: { category: '铏?, weight: 8 },

    // 瀹炶瘉
    '鑳€鐥?: { category: '瀹?, weight: 7 },
    '鍙ｈ嫤': { category: '瀹?, weight: 6 },
    '鑸岃嫈榛勮吇': { category: '瀹?, weight: 8 },
    '鑴夋粦鏁?: { category: '瀹?, weight: 8 },

    // 琛ㄨ瘉
    '鎭跺瘨': { category: '琛?, weight: 9 },
    '鍙戠儹鎭跺瘨骞惰': { category: '琛?, weight: 10 },
    '榧诲娴佹稌': { category: '琛?, weight: 7 },

    // 閲岃瘉
    '浣嗙儹涓嶅瘨': { category: '閲?, weight: 9 },
    '鑵圭棝鎷掓寜': { category: '閲?, weight: 8 },
    '渚跨': { category: '閲?, weight: 7 },

    // 闃磋瘉
    '闈㈣壊鑻嶇櫧': { category: '闃?, weight: 7 },
    '绮剧钀庨潯': { category: '闃?, weight: 6 },
    '鑸屾贰鑳?: { category: '闃?, weight: 8 },

    // 闃宠瘉
    '闈㈢孩鐩丹': { category: '闃?, weight: 7 },
    '鐑﹁簛': { category: '闃?, weight: 6 },
    '鑸岀孩鑻旈粍': { category: '闃?, weight: 8 },

    // === 琛ュ厖甯歌鐥囩姸鍚屼箟璇?(v2 patch) ===
    // 瀵掕瘉琛ュ厖
    '鎬曞喎': { category: '瀵?, weight: 8 },
    '鎵嬭剼鍐板噳': { category: '瀵?, weight: 8 },
    '鍥涜偄鍐板噳': { category: '瀵?, weight: 8 },
    '鐣忓瘨鑲㈠喎': { category: '瀵?, weight: 8 },
    '鑵拌啙閰稿喎': { category: '瀵?, weight: 7 },
    '鍠滄俯': { category: '瀵?, weight: 5 },
    '鍐锋睏': { category: '瀵?, weight: 6 },
    // 鐑瘉琛ュ厖
    '鍙戠儳': { category: '鐑?, weight: 8 },
    '鍙ｅ共': { category: '鐑?, weight: 6 },
    '鍜界棝': { category: '鐑?, weight: 6 },
    '鍙ｆ复澶氶ギ': { category: '鐑?, weight: 7 },
    '灏忎究鐭丹': { category: '鐑?, weight: 6 },
    '韬儹': { category: '鐑?, weight: 7 },
    // 铏氳瘉琛ュ厖
    '鐤蹭箯': { category: '铏?, weight: 6 },
    '鐤插€?: { category: '铏?, weight: 6 },
    '鍊︽€?: { category: '铏?, weight: 6 },
    '澶存檿': { category: '铏?, weight: 5 },
    '鑰抽福': { category: '铏?, weight: 6 },
    '鑵伴吀': { category: '铏?, weight: 6 },
    '鑵拌啙閰歌蒋': { category: '铏?, weight: 7 },
    '璁板繂鍔涘噺閫€': { category: '铏?, weight: 5 },
    '闈㈣壊钀庨粍': { category: '铏?, weight: 6 },
    '澶辩湢': { category: '铏?, weight: 5 },
    '蹇冩厡': { category: '铏?, weight: 6 },
    '蹇冩偢': { category: '铏?, weight: 6 },
    // 瀹炶瘉琛ュ厖
    '鑵硅儉': { category: '瀹?, weight: 6 },
    '鑵圭棝': { category: '瀹?, weight: 6 },
    '渚跨涓嶉€?: { category: '瀹?, weight: 7 },
    '鐥板': { category: '瀹?, weight: 6 },
    '鑳搁椃': { category: '瀹?, weight: 6 },
    '澶寸棝鍓х儓': { category: '瀹?, weight: 7 },
    // 琛ㄨ瘉琛ュ厖
    '鎬曢': { category: '琛?, weight: 7 },
    '鍠峰殢': { category: '琛?, weight: 6 },
    '鍜冲椊': { category: '琛?, weight: 5 },
    '鍜藉枆鐥?: { category: '琛?, weight: 5 },
    // 閲岃瘉琛ュ厖
    '鑵圭棝鑵硅儉': { category: '閲?, weight: 7 },
    '鍛曞悙': { category: '閲?, weight: 6 },
    '鑵规郴': { category: '閲?, weight: 6 },
    '绾冲樊': { category: '閲?, weight: 5 },
    // 闃磋瘉琛ュ厖
    '鐣忓瘨鍠滄殩': { category: '闃?, weight: 7 },
    '璇０浣庡井': { category: '闃?, weight: 5 },
    '鍠滈潤': { category: '闃?, weight: 4 },
    // 闃宠瘉琛ュ厖
    '鍙ｆ复鍠滈ギ': { category: '闃?, weight: 6 },
    '韬儹姹楀嚭': { category: '闃?, weight: 7 },
    '璇０娲寒': { category: '闃?, weight: 5 },
    '鍠滃姩': { category: '闃?, weight: 4 }
  };

  // ==================== 鑸岃薄杈ㄨ瘉瑙勫垯 ====================
  const TONGUE_PATTERNS = {
    '娣＄櫧鑸?: {
      description: '鑸岃壊娣′簬姝ｅ父锛岃垖浣撹儢瀚╋紝澶氬睘姘旇涓よ櫄銆侀槼铏?,
      patterns: ['姘旇涓よ櫄', '闃宠櫄姘存硾', '鑴捐儍铏氬急'],
      treatment: '鐩婃皵鍏昏銆佹俯闃冲仴鑴?,
      herbs: ['褰撳綊', '榛勮姫', '鍏氬弬', '鐧芥湳'],
      diet: ['绾㈡灒', '妗傚渾', '灞辫嵂', '灏忕背']
    },
    '绾㈣垖': {
      description: '鑸岃壊椴滅孩锛屽灞炵儹璇?,
      patterns: ['瀹炵儹璇?, '闃磋櫄鐏椇', '蹇冪伀浜㈢洓'],
      treatment: '娓呯儹娉荤伀銆佹粙闃撮檷鐏?,
      herbs: ['榛勮繛', '榛勮姪', '鐢熷湴', '涓圭毊'],
      diet: ['鑾插瓙蹇?, '鑻︾摐', '姊?, '缁胯眴']
    },
    '缁涜垖': {
      description: '鑸岃壊娣辩孩锛屽灞炵儹鍏ヨ惀琛€銆侀槾铏氱伀鏃?,
      patterns: ['鐑叆钀ヨ', '闃磋櫄鐏椇'],
      treatment: '娓呯儹鍑夎銆佸吇闃撮€忕儹',
      herbs: ['鐘€瑙掞紙绂佺敤锛?, '鐢熷湴', '鐜勫弬', '涓瑰弬'],
      diet: ['鑾插瓙蹇?, '鑿婅姳', '姊?, '鐧惧悎']
    },
    '绱垖': {
      description: '鑸岃壊闈掔传锛屽灞炶鐦€璇併€佸瘨鍑濊鐦€',
      patterns: ['姘旀粸琛€鐦€', '瀵掑嚌琛€鐦€', '姘旇鐦€婊?],
      treatment: '娲昏鍖栫榾銆佹俯缁忔暎瀵?,
      herbs: ['涓瑰弬', '宸濊妿', '璧よ妽', '妗冧粊'],
      diet: ['榛戞湪鑰?, '灞辨', '娲嬭懕', '绾㈢硸']
    },
    '娣¤儢鑸?: {
      description: '鑸屾贰鑰岃垖浣撹儢澶э紝杈规湁榻跨棔锛屽灞炶劸铏氭箍鐩涖€侀槼铏氭按娉?,
      patterns: ['鑴捐櫄婀垮洶', '闃宠櫄姘存硾', '姘旇櫄婀跨洓'],
      treatment: '鍋ヨ劸绁涙箍銆佹俯闃冲寲姘?,
      herbs: ['鑼嫇', '鐧芥湳', '钖忚嫛浠?, '娉芥郴'],
      diet: ['鍐摐', '钖忕背', '灞辫嵂', '鑺″疄']
    },
    '榻跨棔鑸?: {
      description: '鑸屼綋杈圭紭鏈夐娇鐥曪紝澶氬睘鑴捐櫄婀跨洓',
      patterns: ['鑴捐櫄婀垮洶', '姘旇櫄婀跨洓', '婀跨儹鍐呰暣'],
      treatment: '鍋ヨ劸绁涙箍',
      herbs: ['鍏氬弬', '鐧芥湳', '鑼嫇', '鐢樿崏'],
      diet: ['灞辫嵂', '鑾插瓙', '钖忕背', '鍐摐']
    },
    '瑁傜汗鑸?: {
      description: '鑸岄潰鏈夎绾癸紝澶氬睘闃磋櫄銆佽铏氥€佽劸铏?,
      patterns: ['闃磋櫄鐏椇', '琛€铏氬け鍏?, '鑴捐櫄婀挎蹈'],
      treatment: '婊嬮槾鍏昏銆佸仴鑴剧婀?,
      herbs: ['楹﹀啲', '鐜夌', '褰撳綊', '鐔熷湴'],
      diet: ['閾惰€?, '鐧惧悎', '鏋告潪', '榛戣姖楹?]
    },
    '鐧借嫈': {
      description: '鑻旂櫧鑰岃杽锛屽灞炶〃璇併€佸瘨璇?,
      patterns: ['椋庡瘨琛ㄨ瘉', '瀵掓箍鍐呯洓', '姝ｅ父'],
      treatment: '鐤忛鏁ｅ瘨銆佹俯閲屾暎瀵?,
      herbs: ['鐢熷', '钁辩櫧', '妗傛灊', '鐧借姺'],
      diet: ['鐢熷', '绾㈢硸', '缇婅倝', '妗傚渾']
    },
    '榛勮嫈': {
      description: '鑻旈粍锛屽灞炵儹璇?,
      patterns: ['瀹炵儹璇?, '婀跨儹鍐呰暣', '閲岀儹璇?],
      treatment: '娓呯儹鐕ユ箍銆佹郴鐏В姣?,
      herbs: ['榛勮繛', '榛勮姪', '榛勬煆', '鏍€瀛?],
      diet: ['鑻︾摐', '鍐摐', '缁胯眴', '鑾插瓙蹇?]
    },
    '鑵昏嫈': {
      description: '鑻斿帤鑵绘粦锛屽灞炴箍娴娿€佺棸楗€侀绉?,
      patterns: ['婀挎祳涓樆', '鐥版箍鍐呯洓', '椋熺Н鍋滄粸'],
      treatment: '鐕ユ箍鍖栫棸銆佹秷绉婊?,
      herbs: ['鑻嶆湳', '鍘氭湸', '闄堢毊', '鍗婂'],
      diet: ['灞辨', '楹﹁娊', '钀濆崪', '鏅幢鑼?]
    },
    '灏戣嫈/鍓ヨ嫈': {
      description: '鑸岃嫈灏戞垨鍓ヨ惤锛屽灞為槾铏氥€佽儍姘旇櫄',
      patterns: ['鑳冮槾涓嶈冻', '姘旈槾涓よ櫄', '闃磋櫄鐏椇'],
      treatment: '鍏婚槾鐩婅儍銆佹皵闃村弻琛?,
      herbs: ['娌欏弬', '楹﹀啲', '鐜夌', '鐭虫枦'],
      diet: ['姊?, '閾惰€?, '鐧惧悎', '铚傝湝']
    }
  };

  // ==================== 鑴夎薄杈ㄨ瘉瑙勫垯 ====================
  const PULSE_PATTERNS = {
    '娴剦': {
      description: '杞诲彇鍗冲緱锛岄噸鎸夌◢鍑忥紝澶氬睘琛ㄨ瘉',
      syndrome: '琛ㄨ瘉锛堝鎰熺梾鍒濇湡锛?,
      patterns: ['椋庡瘨琛ㄨ瘉', '椋庣儹琛ㄨ瘉', '琛ㄨ櫄璇?],
      treatment: '鐤忛瑙ｈ〃',
      herbs: ['楹婚粍', '妗傛灊', '鑽嗚姤', '闃查'],
      diet: ['鐢熷钁辩櫧姹?, '绱嫃鑼?]
    },
    '娌夎剦': {
      description: '杞诲彇涓嶅簲锛岄噸鎸変箖寰楋紝澶氬睘閲岃瘉',
      syndrome: '閲岃瘉锛堣剰鑵戠梾锛?,
      patterns: ['閲屽瘨璇?, '閲岀儹璇?, '姘旀粸琛€鐦€'],
      treatment: '杈ㄨ瘉鏂芥不',
      herbs: ['鏍规嵁鍏蜂綋杈ㄨ瘉'],
      diet: ['鏍规嵁浣撹川璋冩暣']
    },
    '杩熻剦': {
      description: '鑴夋潵杩熸參锛屼竴鎭笉瓒冲洓鑷筹紝澶氬睘瀵掕瘉',
      syndrome: '瀵掕瘉锛堥槼铏氬唴瀵掞級',
      patterns: ['闃宠櫄瀵掑嚌', '瀵掑嚌缁忚剦'],
      treatment: '娓╅槼鏁ｅ瘨',
      herbs: ['闄勫瓙', '鑲夋', '骞插', '鍚磋尡钀?],
      diet: ['缇婅倝', '闊彍', '妗傚渾', '鏍告']
    },
    '鏁拌剦': {
      description: '鑴夋潵鎬ヤ績锛屼竴鎭簲鑷充互涓婏紝澶氬睘鐑瘉',
      syndrome: '鐑瘉锛堝疄鐑垨铏氱儹锛?,
      patterns: ['瀹炵儹璇?, '闃磋櫄鐏椇', '蹇冪伀浜㈢洓'],
      treatment: '娓呯儹娉荤伀/婊嬮槾闄嶇伀',
      herbs: ['榛勮繛', '榛勮姪', '鏍€瀛?, '鐭ユ瘝'],
      diet: ['鑻︾摐', '鑿婅姳鑼?, '姊?, '缁胯眴']
    },
    '婊戣剦': {
      description: '寰€鏉ユ祦鍒╋紝濡傜彔璧扮洏锛屽灞炵棸婀裤€侀绉€佸疄鐑?,
      syndrome: '鐥版箍璇?椋熺Н璇?瀹炵儹璇?,
      patterns: ['鐥版箍鍐呯洓', '椋熺Н鍋滄粸', '瀹炵儹澹呯洓'],
      treatment: '鍖栫棸绁涙箍/娑堥瀵兼粸/娓呯儹',
      herbs: ['鍗婂', '鑼嫇', '灞辨', '绁炴洸'],
      diet: ['钀濆崪', '灞辨', '鏅幢鑼?, '钖忕背']
    },
    '娑╄剦': {
      description: '寰€鏉ヨ壈娑╋紝濡傝交鍒€鍒锛屽灞炶鐦€銆佹皵婊炪€佷激娲?,
      syndrome: '琛€鐦€璇?姘旀粸璇?,
      patterns: ['姘旀粸琛€鐦€', '绮句簭琛€灏?, '娲ユ恫鑰椾激'],
      treatment: '娲昏鍖栫榾/琛屾皵瀵兼粸',
      herbs: ['涓瑰弬', '宸濊妿', '妗冧粊', '绾㈣姳'],
      diet: ['榛戞湪鑰?, '灞辨', '娲嬭懕', '绾㈢硸']
    },
    '铏氳剦': {
      description: '涓夐儴鑴変妇鎸夌殕鏃犲姏锛屽灞炶櫄璇?,
      syndrome: '姘旇涓よ櫄/闃撮槼涓よ櫄',
      patterns: ['姘旇櫄璇?, '琛€铏氳瘉', '闃撮槼涓よ櫄'],
      treatment: '鐩婃皵鍏昏/婊嬮槾娓╅槼',
      herbs: ['浜哄弬', '榛勮姫', '褰撳綊', '鐔熷湴'],
      diet: ['绾㈡灒', '妗傚渾', '灞辫嵂', '鏋告潪']
    },
    '瀹炶剦': {
      description: '涓夐儴鑴変妇鎸夌殕鏈夊姏锛屽灞炲疄璇?,
      syndrome: '瀹炶瘉锛堥偑姘旂洓瀹烇級',
      patterns: ['瀹炵儹璇?, '姘旀粸琛€鐦€', '鐥版箍澹呯洓'],
      treatment: '娉诲疄鏀婚偑',
      herbs: ['澶ч粍', '鑺掔', '鏋冲疄', '鍘氭湸'],
      diet: ['娓呮贰涓轰富锛屽繉杈涜荆娌硅吇']
    },
    '寮﹁剦': {
      description: '绔洿浠ラ暱锛屽鎸夌惔寮︼紝澶氬睘鑲濊儐鐥呫€佺棝璇併€佺棸楗?,
      syndrome: '鑲濇皵閮佺粨/鐥涜瘉/鐥伴ギ璇?,
      patterns: ['鑲濇皵閮佺粨', '鑲濋槼涓婁孩', '鐥伴ギ鍐呭仠'],
      treatment: '鐤忚倽瑙ｉ儊/骞宠倽娼滈槼/鍖栫棸閫愰ギ',
      herbs: ['鏌磋儭', '棣欓檮', '閮侀噾', '鐧借妽'],
      diet: ['鐜懓鑺辫尪', '灞辨', '闄堢毊', '浣涙墜']
    },
    '绱ц剦': {
      description: '鑴夋潵缁锋€ワ紝濡傝浆缁崇储锛屽灞炲瘨璇併€佺棝璇?,
      syndrome: '瀵掑嚌鐥涜瘉',
      patterns: ['瀵掗偑鍑濇粸', '鍓х棝'],
      treatment: '娓╃粡鏁ｅ瘨銆佺紦鎬ユ鐥?,
      herbs: ['闄勫瓙', '鑲夋', '骞插', '缁嗚緵'],
      diet: ['鐢熷', '缇婅倝', '鑺辨', '妗傜毊']
    },
    '婵¤剦锛堣蒋鑴夛級': {
      description: '娴€岀粏杞紝澶氬睘姘旇铏氥€佹箍璇?,
      syndrome: '姘旇涓よ櫄/婀块偑鍐呭洶',
      patterns: ['姘旇櫄婀跨洓', '鑴捐櫄婀垮洶', '婀挎俯鐥?],
      treatment: '鍋ヨ劸绁涙箍銆佺泭姘斿吇琛€',
      herbs: ['鍏氬弬', '鐧芥湳', '鑼嫇', '钖忚嫛浠?],
      diet: ['灞辫嵂', '钖忕背', '鑾插瓙', '鍐摐']
    },
    '缁嗚剦': {
      description: '鑴夌粏濡傜嚎锛屽灞炴皵琛€涓よ櫄銆侀槾铏?,
      syndrome: '姘旇涓よ櫄/闃磋櫄璇?,
      patterns: ['琛€铏氳瘉', '闃磋櫄璇?, '蹇冭劸涓よ櫄'],
      treatment: '鍏昏婊嬮槾銆佸仴鑴惧吇蹇?,
      herbs: ['褰撳綊', '鐔熷湴', '闃胯兌', '鏋告潪'],
      diet: ['绾㈡灒', '妗傚渾', '妗戞す', '榛戣姖楹?]
    },
    '娲剦': {
      description: '鑴夋潵娲ぇ锛屾潵鐩涘幓琛帮紝澶氬睘闃崇洓鐑瘉',
      syndrome: '闃虫槑缁忚瘉/瀹炵儹璇?,
      patterns: ['闃虫槑缁忕儹鐩?, '姘斿垎鐑洓'],
      treatment: '娓呯儹娉荤伀銆佹竻姘斿垎鐑?,
      herbs: ['鐭宠啅', '鐭ユ瘝', '榛勮繛', '鏍€瀛?],
      diet: ['瑗跨摐', '缁胯眴', '鑻︾摐', '鑾插瓙蹇?]
    },
    '寮辫剦': {
      description: '鏋佽蒋鑰屾矇缁嗭紝澶氬睘姘旇涓よ櫄銆侀槼铏?,
      syndrome: '姘旇涓よ櫄/闃宠櫄璇?,
      patterns: ['闃虫皵铏氳“', '姘旇涓よ櫄', '鑴捐偩闃宠櫄'],
      treatment: '娓╄ˉ闃虫皵銆佺泭姘斿吇琛€',
      herbs: ['浜哄弬', '榛勮姫', '闄勫瓙', '鑲夋'],
      diet: ['缇婅倝', '浜哄弬', '妗傚渾', '鏍告']
    },
    '寰剦': {
      description: '鏋佺粏鏋佽蒋锛屼技鏈変技鏃狅紝澶氬睘闃撮槼姘旇铏氭瀬',
      syndrome: '闃虫皵琛板井/姘旇涓よ櫄',
      patterns: ['闃虫皵琛板井', '浜￠槼璇?, '姘旇涓よ櫄'],
      treatment: '鍥為槼鏁戦€嗐€佺泭姘斿吇琛€',
      herbs: ['闄勫瓙', '骞插', '浜哄弬', '鐐欑敇鑽?],
      diet: ['浜哄弬姹?, '缇婅倝姹?, '绾㈠弬鑼?, '妗傚渾']
    }
  };

  // ==================== 鑴忚厬杈ㄨ瘉瑙勫垯 ====================
  const ZANGFU_RULES = {
    '蹇?: {
      symptoms: ['蹇冩偢', '澶辩湢', '澶氭ⅵ', '鍋ュ繕', '蹇冪儲', '鍙ｈ垖鐢熺柈'],
      patterns: {
        '蹇冩皵铏?: { symptoms: ['蹇冩偢', '姘旂煭', '鑷睏', '涔忓姏'], treatment: '琛ョ泭蹇冩皵', formula: '鍏诲績姹? },
        '蹇冮槼铏?: { symptoms: ['蹇冩偢', '鐣忓瘨', '鑲㈠喎', '闈㈣壊鑻嶇櫧'], treatment: '娓╄ˉ蹇冮槼', formula: '妗傛灊鐢樿崏姹? },
        '蹇冭铏?: { symptoms: ['蹇冩偢', '澶辩湢', '澶氭ⅵ', '鍋ュ繕', '闈㈣壊鏃犲崕'], treatment: '鍏昏瀹夌', formula: '鍥涚墿姹? },
        '蹇冪伀浜㈢洓': { symptoms: ['蹇冪儲', '鍙ｆ复', '鍙ｈ垖鐢熺柈', '灏忎究鐭丹'], treatment: '娓呭績娉荤伀', formula: '瀵艰丹鏁?, herbs: ['鐢熷湴', '鏈ㄩ€?, '绔瑰彾', '鐢樿崏', '榛勮繛', '杩炵繕'], diet: ['鑾插瓙蹇冭尪', '缁胯眴姹?, '鑻︾摐', '姊?, '蹇岃緵杈ｇ嚗鐑?] }
      }
    },
    '鑲?: {
      symptoms: ['澶寸棝', '鐪╂檿', '鐩订', '鎯呭織鎶戦儊', '鑳歌儊鑳€鐥?],
      patterns: {
        '鑲濇皵閮佺粨': { symptoms: ['鎯呭織鎶戦儊', '鑳歌儊鑳€鐥?, '鍠勫お鎭?], treatment: '鐤忚倽瑙ｉ儊', formula: '鏌磋儭鐤忚倽鏁? },
        '鑲濈伀涓婄値': { symptoms: ['澶寸棝', '鐪╂檿', '闈㈢孩鐩丹', '鍙ｈ嫤'], treatment: '娓呰倽娉荤伀', formula: '榫欒儐娉昏倽姹? },
        '鑲濊铏?: { symptoms: ['鐪╂檿', '鐩订', '鑲綋楹绘湪', '鏈堢粡閲忓皯'], treatment: '琛ヨ鍏昏倽', formula: '鍥涚墿姹? },
        '鑲濋槼涓婁孩': { symptoms: ['澶寸棝', '鐪╂檿', '鑰抽福', '鐑﹁簛'], treatment: '骞宠倽娼滈槼', formula: '澶╅夯閽╄棨楗? }
      }
    },
    '鑴?: {
      symptoms: ['鑵硅儉', '绾冲憜', '渚挎簭', '涔忓姏', '闈㈣壊钀庨粍'],
      patterns: {
        '鑴炬皵铏?: { symptoms: ['鑵硅儉', '绾冲憜', '涔忓姏', '姘旂煭'], treatment: '鍋ヨ劸鐩婃皵', formula: '琛ヤ腑鐩婃皵姹? },
        '鑴鹃槼铏?: { symptoms: ['鑵硅儉', '鑵圭棝鍠滄俯', '澶т究婧忚杽', '鐣忓瘨'], treatment: '娓╀腑鍋ヨ劸', formula: '鐞嗕腑姹? },
        '鑴捐櫄婀垮洶': { symptoms: ['鑵硅儉', '绾冲憜', '渚挎簭', '鑲綋鍥伴噸'], treatment: '鍋ヨ劸绁涙箍', formula: '鍙傝嫇鐧芥湳鏁? }
      }
    },
    '鑲?: {
      symptoms: ['鍜冲椊', '姘斿枠', '鍜界棝', '榧诲', '鑷睏'],
      patterns: {
        '鑲烘皵铏?: { symptoms: ['鍜冲椊鏃犲姏', '姘旂煭', '鑷睏', '鏄撴劅鍐?], treatment: '琛ョ泭鑲烘皵', formula: '鐜夊睆椋庢暎' },
        '鑲洪槾铏?: { symptoms: ['骞插挸灏戠棸', '娼儹鐩楁睏', '鍙ｅ共鍜界嚗'], treatment: '婊嬮槾娑﹁偤', formula: '娌欏弬楹﹀啲姹? },
        '椋庡瘨鏉熻偤': { symptoms: ['鍜冲椊', '鐥扮█鐧?, '鎭跺瘨', '榧诲娴佹竻娑?], treatment: '鐤忛鏁ｅ瘨', formula: '楹婚粍姹? },
        '椋庣儹鐘偤': { symptoms: ['鍜冲椊', '鐥伴粍绋?, '鍙戠儹', '鍜界棝'], treatment: '鐤忛娓呯儹', formula: '妗戣強楗? }
      }
    },
    '鑲?: {
      symptoms: ['鑵拌啙閰歌蒋', '鑰抽福', '閬楃簿', '姘磋偪', '鐣忓瘨鑲㈠喎'],
      patterns: {
        '鑲鹃槼铏?: { symptoms: ['鑵拌啙閰歌蒋', '鐣忓瘨鑲㈠喎', '闃崇椏', '姘磋偪'], treatment: '娓╄ˉ鑲鹃槼', formula: '閲戝尞鑲炬皵涓? },
        '鑲鹃槾铏?: { symptoms: ['鑵拌啙閰歌蒋', '鐪╂檿', '娼儹鐩楁睏', '閬楃簿'], treatment: '婊嬭ˉ鑲鹃槾', formula: '鍏懗鍦伴粍涓? },
        '鑲剧簿涓嶈冻': { symptoms: ['鑵拌啙閰歌蒋', '鑰抽福', '鏃╄“', '鍙戣偛杩熺紦'], treatment: '琛ヨ偩濉簿', formula: '浜斿瓙琛嶅畻涓? }
      }
    }
  };

  // ==================== 闂瘖鐘舵€佹満 ====================
  const ConsultationState = {
    INITIAL: 'initial',           // 鍒濆鐘舵€?    CHIEF_COMPLAINT: 'chief',    // 閲囬泦涓昏瘔
    HPI: 'hpi',                  // 鐜扮梾鍙?    PAST_HISTORY: 'past',        // 鏃㈠線鍙?    CONSITUTION: 'constitution', // 浣撹川杈ㄨ瘑
    PATTERN_DIFF: 'pattern',     // 杈ㄨ瘉鍒嗘瀽
    TREATMENT: 'treatment',      // 娌荤枟鏂规
    COMPLETE: 'complete'         // 瀹屾垚
  };

  let currentState = ConsultationState.INITIAL;
  let consultationData = {
    chiefComplaint: '',
    symptoms: [],
    duration: '',
    severity: '',
    triggers: [],
    pastHistory: [],
    constitution: '',
    patternResult: null,
    treatmentPlan: null
  };

  // ==================== 鑸岃瘖鍒嗘瀽 ====================
  /**
   * 鏍规嵁鑸岃薄闂嵎缁撴灉鍒嗘瀽鑸岃薄
   * @param {Object} answers - 鑸岃薄闂嵎绛旀
   * @returns {Object} 鑸岃瘖缁撴灉
   */
  function analyzeTongue(answers) {
    const { bodyColor, coatingColor, coatingTexture, bodyShape, moisture } = answers;
    let matched = null;
    let maxScore = 0;

    // 鑸屼綋棰滆壊鍖归厤
    const bodyMap = {
      '娣＄櫧': '娣＄櫧鑸?, '娣?: '娣＄櫧鑸?, '鑻嶇櫧': '娣＄櫧鑸?,
      '绾?: '绾㈣垖', '鍋忕孩': '绾㈣垖',
      '娣辩孩': '缁涜垖', '缁?: '缁涜垖',
      '闈掔传': '绱垖', '绱殫': '绱垖', '绱?: '绱垖',
      '娣¤儢': '娣¤儢鑸?, '鑳栧ぇ': '娣¤儢鑸?, '鑳?: '娣¤儢鑸?
    };

    // 鑸岃嫈棰滆壊鍖归厤
    const coatingMap = {
      '鐧?: '鐧借嫈', '钖勭櫧': '鐧借嫈',
      '榛?: '榛勮嫈', '寰粍': '榛勮嫈',
      '鐏?: '鑵昏嫈', '榛?: '鑵昏嫈'
    };

    // 鑸岃嫈璐ㄥ湴鍖归厤
    const textureMap = {
      '钖?: '鐧借嫈',
      '鍘?: '鑵昏嫈',
      '鑵?: '鑵昏嫈', '婊?: '鑵昏嫈', '鍘氳吇': '鑵昏嫈',
      '灏?: '灏戣嫈/鍓ヨ嫈', '鍓ヨ惤': '灏戣嫈/鍓ヨ嫈', '鏃犺嫈': '灏戣嫈/鍓ヨ嫈'
    };

    // 缁煎悎鍒ゆ柇
    let tonguePattern = null;
    
    // 浼樺厛绾э細鑸屼綋棰滆壊 > 鑸岃嫈璐ㄥ湴 > 鑸岃嫈棰滆壊
    if (bodyColor && bodyMap[bodyColor]) {
      tonguePattern = bodyMap[bodyColor];
    } else if (coatingTexture && textureMap[coatingTexture]) {
      tonguePattern = textureMap[coatingTexture];
    } else if (coatingColor && coatingMap[coatingColor]) {
      tonguePattern = coatingMap[coatingColor];
    } else {
      tonguePattern = '娣＄櫧鑸?; // 榛樿
    }

    // 榻跨棔鍜岃绾圭壒娈婂鐞?    if (bodyShape && (bodyShape.includes('榻跨棔') || bodyShape.includes('鏈夐娇鍗?))) {
      if (!['娣¤儢鑸?, '娣＄櫧鑸?].includes(tonguePattern)) {
        tonguePattern = '榻跨棔鑸?;
      }
    }
    if (coatingTexture && (coatingTexture.includes('瑁傜汗') || coatingTexture.includes('瑁?))) {
      tonguePattern = '瑁傜汗鑸?;
    }
    if (coatingTexture && (coatingTexture.includes('灏?) || coatingTexture.includes('鍓?) || coatingTexture === '鏃?)) {
      tonguePattern = '灏戣嫈/鍓ヨ嫈';
    }

    const patternData = TONGUE_PATTERNS[tonguePattern] || TONGUE_PATTERNS['娣＄櫧鑸?];

    return {
      pattern: tonguePattern,
      description: patternData.description,
      patterns: patternData.patterns,
      treatment: patternData.treatment,
      herbs: patternData.herbs,
      diet: patternData.diet,
      confidence: Object.keys(bodyMap).includes(bodyColor) ? 0.85 : 0.65
    };
  }

  /**
   * 鐢熸垚鑸岃瘖闂嵎
   * @returns {Array} 闂嵎闂鍒楄〃
   */
  function getTongueQuestionnaire() {
    return [
      {
        id: 'bodyColor',
        question: '璇烽€夋嫨鑸屼綋棰滆壊锛堜几鑸岃嚜鐒跺厜绾胯瀵燂級锛?,
        type: 'choice',
        options: [
          { value: '娣＄櫧', label: '娣＄櫧鑹诧紙鑸岃壊姣旀甯告祬锛?, desc: '鈫?姘旇铏?闃宠櫄' },
          { value: '绾?, label: '绾㈣壊锛堣垖鑹插亸绾級', desc: '鈫?鐑瘉' },
          { value: '娣辩孩', label: '娣辩孩鑹?缁涜壊', desc: '鈫?鐑叆钀ヨ/闃磋櫄鐏椇' },
          { value: '闈掔传', label: '闈掔传鑹?绱殫鑹?, desc: '鈫?琛€鐦€璇? },
          { value: '娣¤儢', label: '鑸屼綋鑳栧ぇ', desc: '鈫?鑴捐櫄婀跨洓/闃宠櫄' }
        ]
      },
      {
        id: 'coatingColor',
        question: '璇烽€夋嫨鑸岃嫈棰滆壊锛?,
        type: 'choice',
        options: [
          { value: '鐧?, label: '钖勭櫧鑻旓紙鐧借壊钖勮杽涓€灞傦級', desc: '鈫?姝ｅ父/瀵掕瘉' },
          { value: '榛?, label: '榛勮壊鑻?, desc: '鈫?鐑瘉' },
          { value: '鐏?, label: '鐏伴粦鑹茶嫈', desc: '鈫?婀挎祳/鐥伴ギ' },
          { value: '鏃?, label: '鍑犱箮鏃犺嫈/鍓ヨ惤', desc: '鈫?闃磋櫄/鑳冩皵铏? }
        ]
      },
      {
        id: 'coatingTexture',
        question: '璇烽€夋嫨鑸岃嫈璐ㄥ湴锛?,
        type: 'choice',
        options: [
          { value: '钖?, label: '钖勮嫈锛堥€忚繃鑸岃嫈闅愮害鍙鑸屼綋锛?, desc: '鈫?琛ㄨ瘉/姝ｅ父' },
          { value: '鍘?, label: '鍘氳嫈锛堢湅涓嶅埌鑸屼綋锛?, desc: '鈫?閲岃瘉/婀挎祳' },
          { value: '鑵?, label: '鑵昏嫈/婊戣嫈锛堣垖鑻旀箍娑﹂粡鑵伙級', desc: '鈫?鐥版箍/椋熺Н' },
          { value: '灏?, label: '灏戣嫈/鍓ヨ嫈锛堣垖鑻斿緢灏戞垨鑴辫惤锛?, desc: '鈫?闃磋櫄' },
          { value: '瑁傜汗', label: '鑸岄潰鏈夎绾?, desc: '鈫?闃磋櫄/琛€铏? }
        ]
      },
      {
        id: 'bodyShape',
        question: '璇烽€夋嫨鑸屼綋褰㈡€侊細',
        type: 'choice',
        options: [
          { value: '姝ｅ父', label: '姝ｅ父鑸屼綋', desc: '' },
          { value: '榻跨棔', label: '鑸岃竟鏈夐娇鐥曪紙鑸屼綋杈圭紭鏈夌墮鍗帮級', desc: '鈫?鑴捐櫄婀跨洓' },
          { value: '鑳栧ぇ', label: '鑸屼綋鏄庢樉鑳栧ぇ', desc: '鈫?闃宠櫄婀跨洓' },
          { value: '鐦﹀皬', label: '鑸屼綋鐦﹀皬', desc: '鈫?闃磋櫄/琛€铏? }
        ]
      },
      {
        id: 'moisture',
        question: '璇烽€夋嫨鑸岃薄骞叉箍搴︼細',
        type: 'choice',
        options: [
          { value: '娑?, label: '娑︽辰锛堝共婀块€備腑锛?, desc: '鈫?姝ｅ父' },
          { value: '骞茬嚗', label: '骞茬嚗锛堣垖闈㈠共鐕ワ級', desc: '鈫?闃磋櫄/鐑洓' },
          { value: '婀挎鼎', label: '婀挎鼎锛堣垖闈㈡按鍒嗚繃澶氾級', desc: '鈫?婀跨洓/鐥伴ギ' }
        ]
      }
    ];
  }

  // ==================== 鑴夎瘖鍒嗘瀽 ====================
  /**
   * 鏍规嵁鑴夎薄闂嵎缁撴灉鍒嗘瀽鑴夎薄
   * @param {Object} answers - 鑴夎薄闂嵎绛旀
   * @returns {Object} 鑴夎瘖缁撴灉
   */
  function analyzePulse(answers) {
    const { position, strength, rate, rhythm } = answers;
    let pulsePattern = null;
    let score = {};

    // 娴矇鍒ゆ柇
    if (position === '娴?) {
      score['娴剦'] = 10;
      score['婵¤剦锛堣蒋鑴夛級'] = 5;
    } else if (position === '娌?) {
      score['娌夎剦'] = 10;
      score['寮辫剦'] = 6;
      score['寰剦'] = 4;
    } else if (position === '涓?) {
      score['铏氳剦'] = 5;
      score['瀹炶剦'] = 5;
    }

    // 寮哄急鍒ゆ柇
    if (strength === '鏈夊姏') {
      score['瀹炶剦'] = (score['瀹炶剦'] || 0) + 8;
      score['娲剦'] = (score['娲剦'] || 0) + 6;
      score['婊戣剦'] = (score['婊戣剦'] || 0) + 4;
    } else if (strength === '鏃犲姏') {
      score['铏氳剦'] = (score['铏氳剦'] || 0) + 8;
      score['寮辫剦'] = (score['寮辫剦'] || 0) + 6;
      score['寰剦'] = (score['寰剦'] || 0) + 5;
      score['缁嗚剦'] = (score['缁嗚剦'] || 0) + 4;
    } else if (strength === '缁嗗急') {
      score['缁嗚剦'] = (score['缁嗚剦'] || 0) + 8;
      score['寮辫剦'] = (score['寮辫剦'] || 0) + 6;
    }

    // 閫熺巼鍒ゆ柇
    if (rate === '鎱?) {
      score['杩熻剦'] = (score['杩熻剦'] || 0) + 8;
      score['娌夎剦'] = (score['娌夎剦'] || 0) + 4;
    } else if (rate === '蹇?) {
      score['鏁拌剦'] = (score['鏁拌剦'] || 0) + 8;
      score['娲剦'] = (score['娲剦'] || 0) + 5;
    } else if (rate === '姝ｅ父') {
      // 姝ｅ父閫熺巼涓嶅奖鍝?    }

    // 鑺傚緥鍒ゆ柇
    if (rhythm === '娑?) {
      score['娑╄剦'] = (score['娑╄剦'] || 0) + 10;
    } else if (rhythm === '寮?) {
      score['寮﹁剦'] = (score['寮﹁剦'] || 0) + 10;
    } else if (rhythm === '绱?) {
      score['绱ц剦'] = (score['绱ц剦'] || 0) + 8;
    } else if (rhythm === '婊?) {
      score['婊戣剦'] = (score['婊戣剦'] || 0) + 6;
    }

    // 鍙栨渶楂樺垎
    let maxScore = 0;
    for (const [pattern, s] of Object.entries(score)) {
      if (s > maxScore) {
        maxScore = s;
        pulsePattern = pattern;
      }
    }

    if (!pulsePattern) {
      pulsePattern = '骞宠剦'; // 姝ｅ父鑴?    }

    const patternData = PULSE_PATTERNS[pulsePattern] || {
      description: '鑴夎薄骞冲拰锛屼粠瀹圭紦鍜?, patterns: ['骞冲拰璐?], treatment: '鏃犻渶鐗规畩娌荤枟'
    };

    return {
      pattern: pulsePattern,
      description: patternData.description || patternData.syndrome,
      syndrome: patternData.syndrome || '',
      patterns: patternData.patterns || [],
      treatment: patternData.treatment || '',
      herbs: patternData.herbs || [],
      diet: patternData.diet || [],
      confidence: Math.min(maxScore / 15, 1)
    };
  }

  /**
   * 鐢熸垚鑴夎瘖闂嵎
   * @returns {Array} 闂嵎闂鍒楄〃
   */
  function getPulseQuestionnaire() {
    return [
      {
        id: 'position',
        question: '璇锋劅鍙楄剦浣嶏紙杞绘寜/涓寜/閲嶆寜鑴夎薄锛夛細',
        type: 'choice',
        options: [
          { value: '娴?, label: '娴剦锛堣交鎸夊嵆寰楋級', desc: '鈫?琛ㄨ瘉锛堝鎰熷垵鏈燂級' },
          { value: '涓?, label: '涓彇锛堣交鎸?閲嶆寜鎰熻鐩歌繎锛?, desc: '鈫?閲岃瘉/姝ｅ父' },
          { value: '娌?, label: '娌夎剦锛堣交鎸変笉鏄庢樉锛岄噸鎸夋墠寰楋級', desc: '鈫?閲岃瘉/鑴忚厬鐥? }
        ]
      },
      {
        id: 'strength',
        question: '璇锋劅鍙楄剦鍔涳紙鏈夊姏/鏃犲姏/缁嗗急锛夛細',
        type: 'choice',
        options: [
          { value: '鏈夊姏', label: '鏈夊姏锛堣剦鎼忓己鍔诧級', desc: '鈫?瀹炶瘉' },
          { value: '鏃犲姏', label: '鏃犲姏锛堣剦鎼忚蒋寮憋級', desc: '鈫?铏氳瘉' },
          { value: '缁嗗急', label: '缁嗗急锛堣剦缁嗗绾匡級', desc: '鈫?姘旇涓よ櫄' },
          { value: '姝ｅ父', label: '姝ｅ父锛堜笉娴笉娌夛紝涓瓑鍔涘害锛?, desc: '鈫?姝ｅ父鑴夎薄' }
        ]
      },
      {
        id: 'rate',
        question: '璇锋劅鍙楄剦鐜囷紙涓€鎭嚑鑷筹級锛?,
        type: 'choice',
        options: [
          { value: '鎱?, label: '杩熻剦锛堜笉瓒冲洓鑷筹紝涓€鎭?鑷充互涓嬶級', desc: '鈫?瀵掕瘉锛堥槼铏氾級' },
          { value: '姝ｅ父', label: '缂撹剦/姝ｅ父锛堜竴鎭洓鑷筹紝浠庡缂撳拰锛?, desc: '鈫?姝ｅ父鎴栨箍璇? },
          { value: '蹇?, label: '鏁拌剦锛堜簲鑷充互涓婏級', desc: '鈫?鐑瘉锛堝疄鐑?铏氱儹锛? }
        ]
      },
      {
        id: 'rhythm',
        question: '璇锋劅鍙楄剦褰紙褰㈢姸鍜岃妭寰嬶級锛?,
        type: 'choice',
        options: [
          { value: '姝ｅ父', label: '娴佸埄锛堝線鏉ユ祦鍒╋紝濡傜彔璧扮洏锛?, desc: '鈫?姝ｅ父/鐥版箍/瀹炵儹' },
          { value: '娑?, label: '娑╂粸锛堝線鏉ヨ壈娑╋紝涓嶆祦鍒╋級', desc: '鈫?琛€鐦€/姘旀粸' },
          { value: '寮?, label: '寮︼紙绔洿浠ラ暱锛屽鎸夌惔寮︼級', desc: '鈫?鑲濊儐鐥?鐥涜瘉/鐥伴ギ' },
          { value: '绱?, label: '绱э紙缁锋€ユ湁鍔涳紝濡傝浆缁崇储锛?, desc: '鈫?瀵掕瘉/鐥涜瘉' },
          { value: '婊?, label: '婊戯紙鑴夋潵娴佸埄锛屽渾婊戝鐝狅級', desc: '鈫?鐥版箍/椋熺Н/瀹炵儹' }
        ]
      }
    ];
  }

  /**
   * 缁煎悎杈ㄨ瘉锛堢粨鍚堢棁鐘?鑸岃薄+鑴夎薄锛?   * @param {Object} data - 缁煎悎鏁版嵁 { symptoms, tongueAnswers, pulseAnswers }
   * @returns {Object} 缁煎悎杈ㄨ瘉缁撴灉
   */
  function comprehensiveAnalysis(data) {
    const { symptoms = [], tongueAnswers, pulseAnswers } = typeof data === 'string' || Array.isArray(data) ? { symptoms: Array.isArray(data) ? data : [data] } : data;

    // 鍩虹杈ㄨ瘉
    const bagang = bagangDifferentiation(symptoms);
    const zangfu = zangfuDifferentiation(symptoms);
    const tongue = tongueAnswers ? analyzeTongue(tongueAnswers) : null;
    const pulse = pulseAnswers ? analyzePulse(pulseAnswers) : null;

    // 缁煎悎鍒ゆ柇
    let syndrome = zangfu ? zangfu.pattern : '寰呭畾';
    let treatment = zangfu ? zangfu.treatment : '寰呰鲸璇?;
    let formula = zangfu ? zangfu.formula : '寰呭畾';
    let herbs = zangfu ? (zangfu.herbs || []) : [];
    let diet = zangfu ? (zangfu.diet || []) : [];

    // 鑻ヨ剰鑵戣鲸璇佸懡涓絾 herbs/diet 涓虹┖锛屼粠鑸岃剦妯″紡琛ュ厖
    if (zangfu && herbs.length === 0) {
      if (tongue && tongue.herbs) herbs = tongue.herbs;
      if (pulse && pulse.herbs) herbs = [...new Set([...herbs, ...(pulse.herbs || [])])];
    }
    if (zangfu && diet.length === 0) {
      if (tongue && tongue.diet) diet = tongue.diet;
      if (pulse && pulse.diet) diet = [...new Set([...diet, ...(pulse.diet || [])])];
    }

    // 褰撹剰鑵戣鲸璇佹湭鍛戒腑鏃讹紝浣跨敤鑸岃薄/鑴夎薄鐨勬不娉曚笌鏂硅嵂浣滀负 fallback
    if (!zangfu) {
      if (tongue && tongue.treatment) {
        syndrome = tongue.patterns && tongue.patterns[0] ? tongue.patterns[0] : tongue.pattern;
        treatment = tongue.treatment;
        formula = tongue.patterns && tongue.patterns.length > 1
          ? '鍙傝€冿細' + tongue.patterns.join('銆?)
          : '鑸岃薄璋冪悊';
        herbs = tongue.herbs || [];
        diet = tongue.diet || [];
      }
      if (pulse && pulse.treatment) {
        syndrome = syndrome === '寰呭畾' && pulse.patterns && pulse.patterns[0]
          ? pulse.patterns[0]
          : syndrome;
        treatment = treatment === '寰呰鲸璇?
          ? pulse.treatment
          : treatment + '锛? + pulse.treatment;
        if (pulse.patterns && pulse.patterns[0]) {
          formula = formula === '寰呭畾' || formula === '鑸岃薄璋冪悊'
            ? '鍙傝€冿細' + pulse.patterns[0]
            : formula + '锛涘弬鑰冿細' + pulse.patterns[0];
        }
        herbs = [...new Set([...herbs, ...(pulse.herbs || [])])];
        diet = [...new Set([...diet, ...(pulse.diet || [])])];
      }
    }
    // 鑸岃薄淇
    if (tongue) {
      // 鏍规嵁鑸岃薄琛ュ厖鍒ゆ柇
      if (tongue.patterns.includes('姘旇涓よ櫄') && !syndrome.includes('铏?)) {
        syndrome = syndrome + '锛堝弬鑰冿細' + tongue.patterns[0] + '锛?;
      }
      herbs = [...new Set([...herbs, ...(tongue.herbs || [])])];
      diet = [...new Set([...diet, ...(tongue.diet || [])])];
    }

    // 鑴夎薄淇
    if (pulse) {
      if (pulse.patterns.includes('闃磋櫄') && !syndrome.includes('闃磋櫄')) {
        syndrome = syndrome + '锛堝弬鑰冿細' + pulse.patterns[0] + '锛?;
      }
      if (pulse.herbs && pulse.herbs.length > 0) {
        herbs = [...new Set([...herbs, ...pulse.herbs])];
      }
      if (pulse.diet && pulse.diet.length > 0) {
        diet = [...new Set([...diet, ...pulse.diet])];
      }
    }

    return {
      symptoms,
      bagang,
      zangfu,
      tongue,
      pulse,
      syndrome,
      treatment,
      formula,
      herbs: herbs.slice(0, 8),
      diet: diet.slice(0, 8),
      timestamp: new Date().toISOString()
    };
  }

  // ==================== 鏍稿績鍑芥暟 ====================

  /**
   * 鍏翰杈ㄨ瘉
   * @param {Array} symptoms - 鐥囩姸鍒楄〃
   * @returns {Object} 杈ㄨ瘉缁撴灉
   */
  function bagangDifferentiation(symptoms) {
    const scores = { 琛? 0, 閲? 0, 瀵? 0, 鐑? 0, 铏? 0, 瀹? 0, 闃? 0, 闃? 0 };

    symptoms.forEach(symptom => {
      const normalized = symptom.trim();
      for (const [key, value] of Object.entries(SYMPTOM_WEIGHTS)) {
        if (normalized.includes(key) || key.includes(normalized)) {
          scores[value.category] += value.weight;
        }
      }
    });

    // 鍏?妫€娴?    const allZero = Object.values(scores).every(v => v === 0);
    
    // 鍒ゆ柇琛ㄩ噷
    const biaoLi = allZero ? '寰呰鲸璇? : scores['琛?] > scores['閲?] ? '琛ㄨ瘉' : scores['琛?] < scores['閲?] ? '閲岃瘉' : '琛ㄩ噷鍚岀梾';
    
    // 鍒ゆ柇瀵掔儹
    const hanRe = allZero ? '寰呰鲸璇? : scores['瀵?] > scores['鐑?] ? '瀵掕瘉' : scores['瀵?] < scores['鐑?] ? '鐑瘉' : '瀵掔儹閿欐潅';
    
    // 鍒ゆ柇铏氬疄
    const xuShi = allZero ? '寰呰鲸璇? : scores['铏?] > scores['瀹?] ? '铏氳瘉' : scores['铏?] < scores['瀹?] ? '瀹炶瘉' : '铏氬疄澶规潅';
    
    // 鍒ゆ柇闃撮槼
    const yinYang = allZero ? '寰呰鲸璇? : scores['闃?] > scores['闃?] ? '闃磋瘉' : scores['闃?] < scores['闃?] ? '闃宠瘉' : '闃撮槼涓よ櫄';

    return {
      biaoLi,
      hanRe,
      xuShi,
      yinYang,
      scores,
      summary: `${biaoLi}銆?{hanRe}銆?{xuShi}銆?{yinYang}`
    };
  }

  /**
   * 鑴忚厬杈ㄨ瘉
   * @param {Array} symptoms - 鐥囩姸鍒楄〃
   * @returns {Object} 杈ㄨ瘉缁撴灉
   */
  function zangfuDifferentiation(symptoms) {
    // 鐥囩姸鏍囧噯鍖栵細甯歌鍙ｈ鈫掓爣鍑嗘湳璇槧灏?    
    const normalized = symptoms.map(s => SYMPTOM_NORMALIZE[s.trim()] || s.trim());
    const results = [];
    const searchSymptoms = [...new Set([...symptoms, ...normalized])];

    for (const [organ, data] of Object.entries(ZANGFU_RULES)) {
      for (const [pattern, patternData] of Object.entries(data.patterns)) {
        const matchedPatterns = new Set();
        patternData.symptoms.forEach(ps => {
          searchSymptoms.forEach(s => {
            if (s.includes(ps) || ps.includes(s)) {
              matchedPatterns.add(ps);
            }
          });
        });
        const matchCount = matchedPatterns.size;

        if (matchCount > 0) {
          results.push({
            organ,
            pattern,
            matchCount,
            treatment: patternData.treatment,
            formula: patternData.formula,
            herbs: patternData.herbs || null,
            diet: patternData.diet || null,
            confidence: matchCount / patternData.symptoms.length
          });
        }
      }
    }

    // 鎸夌疆淇″害鎺掑簭
    results.sort((a, b) => b.confidence - a.confidence);

    return results.length > 0 ? results[0] : null;
  }

  /**
   * 瀹屾暣杈ㄨ瘉鍒嗘瀽
   * @param {Array} symptoms - 鐥囩姸鍒楄〃
   * @returns {Object} 瀹屾暣杈ㄨ瘉缁撴灉
   */

  /**
   * 鐢熸垚鍙鍖栨帹鐞嗛摼
   * @param {Array} symptoms - 鐥囩姸鍒楄〃
   * @returns {Object} 瀹屾暣鎺ㄧ悊閾炬暟鎹?   */
  function getReasoningChain(symptoms) {
    const chain = {
      steps: [],
      symptoms: symptoms,
      timestamp: new Date().toISOString()
    };

    // Step 1: 鐥囩姸閲囬泦
    chain.steps.push({
      title: '鐥囩姸閲囬泦',
      icon: '馃搵',
      type: 'input',
      content: symptoms.slice(0, 10).map(s => '路 ' + s).join('\n') + (symptoms.length > 10 ? '\n...鍏? + symptoms.length + '涓棁鐘? : ''),
      conclusion: '閲囬泦鍒?' + symptoms.length + ' 涓棁鐘舵弿杩?
    });

    // Step 2: 鍏翰杈ㄨ瘉
    const bagang = bagangDifferentiation(symptoms);
    const bagangDetails = [];
    const matchedBagangSyms = {};
    symptoms.forEach(symptom => {
      const normalized = symptom.trim();
      for (const [key, value] of Object.entries(SYMPTOM_WEIGHTS)) {
        if (normalized.includes(key) || key.includes(normalized)) {
          if (!matchedBagangSyms[value.category]) matchedBagangSyms[value.category] = [];
          matchedBagangSyms[value.category].push({ symptom: key, match: normalized, weight: value.weight });
        }
      }
    });
    const pairs = [['琛?,'閲?],['瀵?,'鐑?],['铏?,'瀹?],['闃?,'闃?]];
    pairs.forEach(([a, b]) => {
      bagangDetails.push({
        left: { name: a, score: bagang.scores[a], symptoms: (matchedBagangSyms[a]||[]).map(s => s.match + '(' + s.weight + ')') },
        right: { name: b, score: bagang.scores[b], symptoms: (matchedBagangSyms[b]||[]).map(s => s.match + '(' + s.weight + ')') },
        winner: bagang.scores[a] > bagang.scores[b] ? a : (bagang.scores[b] > bagang.scores[a] ? b : '鎸佸钩')
      });
    });
    chain.steps.push({
      title: '鍏翰杈ㄨ瘉',
      icon: '鈿栵笍',
      type: 'bagang',
      details: bagangDetails,
      conclusion: bagang.summary
    });

    // Step 3: 鑴忚厬杈ㄨ瘉
    // 鎺ㄧ悊閾句篃浣跨敤鐥囩姸鏍囧噯鍖?    const RNORM = SYMPTOM_NORMALIZE; // merged into SYMPTOM_NORMALIZE
    const rNormalized = [...new Set([...symptoms.map(s => RNORM[s.trim()] || s.trim()), ...symptoms])];
    const zangfuCandidates = [];
    for (const [organ, data] of Object.entries(ZANGFU_RULES)) {
      for (const [pattern, patternData] of Object.entries(data.patterns)) {
        const matched = [];
        patternData.symptoms.forEach(ps => {
          rNormalized.forEach(s => {
            if (s.includes(ps) || ps.includes(s)) {
              matched.push(s);
            }
          });
        });
        const unique = [...new Set(matched)];
        if (unique.length > 0) {
          zangfuCandidates.push({
            organ,
            pattern,
            matchedSymptoms: unique,
            totalRequired: patternData.symptoms.length,
            matchCount: unique.length,
            confidence: unique.length / patternData.symptoms.length,
            treatment: patternData.treatment,
            formula: patternData.formula
          });
        }
      }
    }
    zangfuCandidates.sort((a, b) => b.confidence - a.confidence);
    const topN = zangfuCandidates.slice(0, 5);
    chain.steps.push({
      title: '鑴忚厬杈ㄨ瘉',
      icon: '馃敩',
      type: 'zangfu',
      candidates: topN,
      totalCandidates: zangfuCandidates.length,
      conclusion: topN.length > 0 ? topN[0].organ + ' 路 ' + topN[0].pattern + '锛堢疆淇″害 ' + (topN[0].confidence * 100).toFixed(1) + '%锛? : '鏈尮閰嶅埌鏄庣‘璇佸瀷'
    });

    // Step 4: 缁煎悎璇婃柇
    const zangfu = zangfuCandidates[0] || null;
    chain.steps.push({
      title: '缁煎悎璇婃柇',
      icon: '馃摑',
      type: 'diagnosis',
      diagnosis: zangfu ? zangfu.pattern : '寰呭畾',
      treatment: zangfu ? zangfu.treatment : '寰呰鲸璇?,
      formula: zangfu ? zangfu.formula : '寰呭畾',
      bagang: bagang.summary,
      conclusion: zangfu
        ? '璇婃柇锛? + zangfu.pattern + '\n娌绘硶锛? + zangfu.treatment + '\n鏂瑰墏锛? + zangfu.formula
        : '鐥囩姸淇℃伅涓嶈冻锛屽缓璁ˉ鍏呮洿澶氱棁鐘舵弿杩?
    });

    return chain;
  }

  function fullPatternDifferentiation(symptoms) {
    const bagang = bagangDifferentiation(symptoms);
    const zangfu = zangfuDifferentiation(symptoms);

    return {
      bagang,
      zangfu,
      diagnosis: zangfu ? zangfu.pattern : '寰呭畾',
      treatment: zangfu ? zangfu.treatment : '寰呰鲸璇?,
      formula: zangfu ? zangfu.formula : '寰呭畾',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 闂瘖鐘舵€佹満鎺ㄨ繘
   * @param {string} input - 鐢ㄦ埛杈撳叆
   * @returns {Object} 涓嬩竴姝ュ姩浣?   */
  function advanceConsultation(input) {
    switch (currentState) {
      case ConsultationState.INITIAL:
        currentState = ConsultationState.CHIEF_COMPLAINT;
        return {
          question: '璇锋弿杩版偍鐨勪富瑕佷笉閫傦紙涓昏瘔锛夛紵',
          type: 'input'
        };

      case ConsultationState.CHIEF_COMPLAINT:
        consultationData.chiefComplaint = input;
        currentState = ConsultationState.HPI;
        return {
          question: '璇疯缁嗘弿杩扮棁鐘讹細鎸佺画鏃堕棿銆佹€ц川銆佸姞閲?缂撹В鍥犵礌锛?,
          type: 'input'
        };

      case ConsultationState.HPI:
        consultationData.symptoms = input.split(/[锛?銆乚/).map(s => s.trim()).filter(s => s);
        currentState = ConsultationState.PAST_HISTORY;
        return {
          question: '鏃㈠線鏈変粈涔堢梾鍙插悧锛燂紙楂樿鍘嬨€佺硸灏跨梾绛夛紝娌℃湁璇疯"鏃?锛?,
          type: 'input'
        };

      case ConsultationState.PAST_HISTORY:
        if (input !== '鏃?) {
          consultationData.pastHistory = input.split(/[锛?銆乚/).map(s => s.trim());
        }
        currentState = ConsultationState.CONSITUTION;
        return {
          question: '璇烽€夋嫨鎮ㄧ殑浣撹川绫诲瀷锛歕n1. 骞冲拰璐╘n2. 姘旇櫄璐╘n3. 闃宠櫄璐╘n4. 闃磋櫄璐╘n5. 鐥版箍璐╘n6. 婀跨儹璐╘n7. 琛€鐦€璐╘n8. 姘旈儊璐╘n9. 鐗圭璐?,
          type: 'choice',
          options: ['骞冲拰璐?, '姘旇櫄璐?, '闃宠櫄璐?, '闃磋櫄璐?, '鐥版箍璐?, '婀跨儹璐?, '琛€鐦€璐?, '姘旈儊璐?, '鐗圭璐?]
        };

      case ConsultationState.CONSITUTION:
        consultationData.constitution = input;
        currentState = ConsultationState.PATTERN_DIFF;
        // 鎵ц杈ㄨ瘉鍒嗘瀽
        consultationData.patternResult = fullPatternDifferentiation(consultationData.symptoms);
        return {
          result: consultationData.patternResult,
          type: 'result'
        };

      case ConsultationState.PATTERN_DIFF:
        currentState = ConsultationState.TREATMENT;
        // 鐢熸垚娌荤枟鏂规
        consultationData.treatmentPlan = generateTreatmentPlan(consultationData.patternResult, consultationData);
        return {
          plan: consultationData.treatmentPlan,
          type: 'treatment'
        };

      case ConsultationState.TREATMENT:
        currentState = ConsultationState.COMPLETE;
        return {
          message: '闂瘖瀹屾垚锛佺鎮ㄦ棭鏃ュ悍澶嶏紒',
          type: 'complete'
        };

      default:
        return { message: '闂瘖宸插畬鎴愩€?, type: 'complete' };
    }
  }

  /**
   * 鐢熸垚涓綋鍖栨不鐤楁柟妗?   * @param {Object} patternResult - 杈ㄨ瘉缁撴灉
   * @param {Object} patientData - 鎮ｈ€呮暟鎹?   * @returns {Object} 娌荤枟鏂规
   */
  function generateTreatmentPlan(patternResult, patientData) {
    const plan = {
      diagnosis: patternResult.diagnosis || patternResult.syndrome || '寰呭畾',
      treatment: patternResult.treatment || '寤鸿灏卞尰锛岃繘涓€姝ヨ鲸璇佹柦娌?,
      formula: patternResult.formula || '鏆傛棤鎺ㄨ崘鏂瑰墏',
      herbs: [], // 寰呰ˉ鍏?      acupuncture: [], // 寰呰ˉ鍏?      diet: [],
      lifestyle: [],
      precautions: []
    };

    // 鏍规嵁浣撹川璋冩暣
    switch (patientData.constitution) {
      case '姘旇櫄璐?:
        plan.diet.push('瀹滐細灏忕背銆佸北鑽€佺孩鏋ｃ€佹鍦?);
        plan.diet.push('蹇岋細鐢熷喎銆佹补鑵汇€佽緵杈?);
        break;
      case '闃宠櫄璐?:
        plan.diet.push('瀹滐細缇婅倝銆侀煭鑿溿€佺敓濮溿€佹鍦?);
        plan.diet.push('蹇岋細鐢熷喎銆佸瘨鍑夐鐗?);
        break;
      case '闃磋櫄璐?:
        plan.diet.push('瀹滐細鐧惧悎銆侀摱鑰炽€佹灨鏉炪€侀腑鑲?);
        plan.diet.push('蹇岋細杈涜荆銆佹俯鐑鐗?);
        break;
      // ... 鍏朵粬浣撹川
    }

    // 浠庤鲸璇佺粨鏋滅户鎵夸腑鑽拰楗寤鸿
    if (patternResult.herbs && patternResult.herbs.length > 0) {
      plan.herbs = [...new Set([...plan.herbs, ...patternResult.herbs])];
    }
    if (patternResult.diet && patternResult.diet.length > 0) {
      plan.diet = [...new Set([...plan.diet, ...patternResult.diet])];
    }

    // 鏍规嵁杈ㄨ瘉缁撴灉娣诲姞閽堢伕鏂规
    if (patternResult.zangfu) {
      const organ = patternResult.zangfu.organ;
      const acupoints = {
        '蹇?: ['绁為棬', '鍐呭叧', '蹇冧繛'],
        '鑲?: ['澶啿', '鑲濅繛', '鏈熼棬'],
        '鑴?: ['瓒充笁閲?, '鑴句繛', '涓夐槾浜?],
        '鑲?: ['鑲轰繛', '澶笂', '鍒楃己'],
        '鑲?: ['鑲句繛', '澶邯', '鍏冲厓']
      };
      plan.acupuncture = acupoints[organ] || [];
    }

    return plan;
  }

  /**
   * 鐢熸垚缁撴瀯鍖栫梾鍘?   * @param {Object} data - 闂瘖鏁版嵁
   * @returns {string} 鏍煎紡鍖栫梾鍘?   */
  function generateMedicalRecord(data) {
    const now = new Date();
    let record = '# 涓尰闂瘖鐥呭巻\n\n';
    record += `## 闂瘖鏃堕棿\n${now.toLocaleString('zh-CN')}\n\n`;
    record += `## 涓昏瘔\n${data.chiefComplaint}\n\n`;
    record += `## 鐜扮梾鍙瞈n${data.symptoms.join('銆?)}\n\n`;
    record += `## 鏃㈠線鍙瞈n${(data.pastHistory && data.pastHistory.length > 0) ? data.pastHistory.join('銆?) : '鏃?}\n\n`;
    record += `## 浣撹川杈ㄨ瘑\n${data.constitution}\n\n`;

    if (data.patternResult) {
      record += `## 杈ㄨ瘉鍒嗘瀽\n`;
      record += `- 鍏翰杈ㄨ瘉锛?{data.patternResult.bagang.summary}\n`;
      if (data.patternResult.zangfu) {
        record += `- 鑴忚厬杈ㄨ瘉锛?{data.patternResult.zangfu.organ}${data.patternResult.zangfu.pattern}\n`;
        record += `- 缃俊搴︼細${(data.patternResult.zangfu.confidence * 100).toFixed(1)}%\n`;
      }
      record += '\n';
    }

    if (data.treatmentPlan) {
      record += `## 璇婃柇\n${data.treatmentPlan.diagnosis}\n\n`;
      record += `## 娌绘硶\n${data.treatmentPlan.treatment}\n\n`;
      record += `## 鏂瑰墏寤鸿\n${data.treatmentPlan.formula}\n\n`;

      if (data.treatmentPlan.acupuncture.length > 0) {
        record += `## 閽堢伕鏂规\n${data.treatmentPlan.acupuncture.join('銆?)}\n\n`;
      }

      if (data.treatmentPlan.diet && data.treatmentPlan.diet.length > 0) {
        record += `## 楗璋冪悊\n`;
        data.treatmentPlan.diet.forEach(d => {
          record += `- ${d}\n`;
        });
        record += '\n';
      }
    }

    record += '---\n*鏈缓璁粎渚涘弬鑰冿紝涓嶈兘鏇夸唬涓撲笟鍖诲笀璇婃柇銆?\n';

    return record;
  }

  // ==================== 鍏叡鎺ュ彛 ====================
  return {
    // 鐘舵€佹満
    advanceConsultation,
    getState: () => currentState,
    getConsultationData: () => consultationData,
    resetConsultation: () => {
      currentState = ConsultationState.INITIAL;
      consultationData = {
        chiefComplaint: '',
        symptoms: [],
        duration: '',
        severity: '',
        triggers: [],
        pastHistory: [],
        constitution: '',
        patternResult: null,
        treatmentPlan: null
      };
    },

    // 鎺ㄧ悊閾?    getReasoningChain,

        // 杈ㄨ瘉寮曟搸
    bagangDifferentiation,
    zangfuDifferentiation,
    fullPatternDifferentiation,

    // 鑸岃瘖妯″潡
    analyzeTongue,
    getTongueQuestionnaire,
    TONGUE_PATTERNS,

    // 鑴夎瘖妯″潡
    analyzePulse,
    getPulseQuestionnaire,
    PULSE_PATTERNS,

    // 缁煎悎杈ㄨ瘉
    comprehensiveAnalysis,

    // 娌荤枟鏂规
    generateTreatmentPlan,

    // 鐥呭巻鐢熸垚
    generateMedicalRecord,

    // 甯搁噺
    ConsultationState
  };
})();

// 瀵煎嚭渚?demo.html 浣跨敤
if (typeof window !== 'undefined') {
  window.TCMEngine = TCMEngine;
}
