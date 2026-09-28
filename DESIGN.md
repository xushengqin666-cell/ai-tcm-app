---
version: alpha
name: 云晓药 水墨
description: 家庭用药助手 App 的视觉识别。宣纸底 + 墨黑结构 + 朱砂唯一交互色，医疗场景要求高可读、可触达、可信。
colors:
  primary: "#23282B"
  primary-container: "#4D565B"
  secondary: "#6F6657"
  tertiary: "#AD402D"
  neutral: "#F1E8D5"
  surface: "#FFFDF7"
  on-surface: "#37322A"
  border: "#E2D5BA"
  success: "#2E7D32"
  success-container: "#E8F5E9"
  warning-strong: "#8A5200"
  warning-container: "#FDF6E8"
  error: "#AD402D"
  error-container: "#FDF1EE"
typography:
  display:
    fontFamily: PingFang SC
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0em
  headline-lg:
    fontFamily: PingFang SC
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
  headline-md:
    fontFamily: PingFang SC
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: PingFang SC
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: PingFang SC
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: PingFang SC
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: PingFang SC
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0.02em
  label-sm:
    fontFamily: PingFang SC
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.5
  data-num:
    fontFamily: PingFang SC
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.1
    fontFeature: '"tnum" 1, "cv01" 1'
rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 16px
  pill: 999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 12px
  page-margin: 14px
components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 16px
  card-title:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.headline-md}"
  stat-number:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.data-num}"
  caption:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-sm}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.neutral}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 10px
    height: 44px
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 44px
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.pill}"
    padding: 8px
    height: 36px
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.pill}"
  tab-item:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    height: 44px
  tab-item-active:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.tertiary}"
  list-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 56px
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  alert-success:
    backgroundColor: "{colors.success-container}"
    textColor: "{colors.success}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 12px
  alert-warning:
    backgroundColor: "{colors.warning-container}"
    textColor: "{colors.warning-strong}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 12px
  alert-danger:
    backgroundColor: "{colors.error-container}"
    textColor: "{colors.error}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 12px
  badge-accent:
    backgroundColor: "{colors.error-container}"
    textColor: "{colors.tertiary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: 4px
---

# 云晓药 · 设计系统

## Overview

**宣纸上的临床秩序。** 云晓药服务于家庭用药场景：使用者包含给父母备药的子女与慢病老人，界面必须让人**一眼看清、一次点中、全程放心**。视觉基调取自水墨——宣纸米色底、墨黑结构线、单一朱砂色驱动交互，整体克制、安静、可长时间阅读；动效只用于表达状态变化，不做装饰性炫技。

成熟度体现在纪律而非装饰：所有圆角、间距、字号、阴影只允许取自本文件的 token；同类控件在八页面（含药箱页与管理后台）表现一致；任何可点控件的触达区不小于 44px；键盘与辅助设备必须可见焦点；系统声明"减少动效"时全部动画让位。

## Colors

调色板由中性纸墨与唯一强调色构成，语义优先于美观。

- **Primary (#23282B)：** 深墨。用于标题、主按钮底色与结构线。它代表权威与稳定，是界面中面积最大的深色。
- **Primary Container (#4D565B)：** 墨色浅阶。仅用于主按钮的按下/悬停态，制造"踏实按下"的物理反馈。
- **Secondary (#6F6657)：** 青灰。用于说明文字、时间戳、元信息（规格、效期、使用人）。它必须比正文退后一层。
- **Tertiary (#AD402D)：** 朱砂。**全站唯一的交互强调色**：选中态、风险提示、关键数字。一个屏幕内只允许出现在最重要的位置。
- **Neutral (#F1E8D5)：** 宣纸米。全站页面底色，比纯白柔和，长时间阅读不刺眼。
- **Surface (#FFFDF7)：** 卡片纸。承载所有卡片、输入框、弹层内容。
- **On Surface (#37322A)：** 正文字色。在 Surface 上提供最高可读性。
- **Border (#E2D5BA)：** 暖界。卡片描边与分隔线，替代重阴影表达层级。
- **Success (#2E7D32) / Warning (#8A5200) / Error (#AD402D)：** 状态语义色，各自配套浅底容器色。**状态色文字一律使用深阶版本**（如警示文字用 #8A5200 而非 #B26A00），保证在浅底上达到 WCAG AA。

## Typography

中文优先的无衬线单字族（PingFang SC → Hiragino Sans GB → Microsoft YaHei），不引入装饰字体；**靠字重与字号建立层级，不靠字体变化**。

- **Display (28px/700)：** 药箱统计数字等需要一眼读取的量值，使用等宽数字（`tnum`）避免跳动。
- **Headline (18px/600、15px/600)：** 页面与卡片标题，永远用 Primary 墨色。
- **Body (15px/1.7、14px/1.6、13px/1.6)：** 长文说明用 15px 行高 1.7；表单与列表用 14px；元信息用 13px。
- **Label (12px/600、11px/400)：** 字段名、按钮文字、徽标。字段名允许 0.02em 字距，中文不加全大写处理。

## Layout

移动优先的**单列流式布局**，内容区最大宽度 720px 居中；桌面浏览器不改变信息密度，只做留白外扩。

采用严格的 **4px 基础栅格**：间距只允许 4 / 8 / 12 / 16 / 24 / 32。卡片内边距统一 16px，卡片之间 12px，页面左右留白 14px，表单行间距 12px。相关控件用"容器化"归组——同一功能的元素必须落在同一张卡片内，禁止用空行凑层次。

## Elevation & Depth

**以描边代替阴影**的水墨分层策略：层级由"纸底 → 卡片纸 → 墨线"三档表达，阴影只保留一档极轻的暖色投影（`rgba(55,48,36,.10) 0 3px 16px`）用于卡片与纸底的分离。

- 卡片：Surface 底 + 1px Border 描边 + 上述唯一阴影。
- 弹层/模态：Surface 底 + 更强投影，并加半透明墨色遮罩（`rgba(35,40,43,.45)`）。
- 强调线：需要在标题区表达品牌时，用 2px 朱砂下边线，而不是加粗阴影。
- **禁止**在同一视图混用多种阴影强度，也禁止用阴影表达可点击性（可点击性由形状与颜色表达）。

## Shapes

**圆角分级收敛为四档**，不随元素随意取值：

- `none (0px)`：全宽区块、背景层、进度条。
- `sm (8px)`：按钮、输入框、列表行、提示条——所有"可操作"与"小容器"。
- `md (12px)`：卡片、统计块、弹层内容区。
- `lg (16px)`：模态框本体等需要更强包裹感的大容器。
- `pill (999px)`：成员标签、徽标、状态胶囊。

同一屏内若出现两种以上非相邻档位（例如同时出现 8px 与 16px 而中间没有 12px 的层级理由），视为不一致。

## Components

- **Buttons：** 主按钮墨底米字、高 44px、圆角 8px；次按钮纸底墨字加 1px 暖界描边，同样 44px 高。两者都提供 hover/按下反馈，并共享 2px 朱砂焦点环。
- **Input fields：** 纸底、1px 暖界描边、圆角 8px、高 44px；聚焦时描边换墨色并叠加 2px 朱砂焦点环，不使用发光或放大。
- **Chips：** 成员与筛选标签用胶囊形，默认纸底墨字；选中态反转为墨底米字。高度 36px，但因存在触控需求，其可点区域通过内边距补足到 44px。
- **Lists：** 药品行、检查结果行统一最小高度 56px，左图标右操作，行与行之间用 1px Border 分隔，最后一行不分隔。
- **Tooltips / 提示条：** 统一使用状态三色容器（成功 / 警示 / 危险），圆角 8px、内边距 12px、正文 13px；警示文字使用深阶 `warning-strong` 以保证对比度。
- **Accessibility（本设计系统的硬约束）：** 所有可聚焦元素必须有可见焦点环；所有可点控件触达区 ≥44px；尊重 `prefers-reduced-motion`；正文与背景对比度 ≥4.5:1。

## Do's and Don'ts

- Do 让朱砂色只出现在每屏最重要的一个位置（选中态或风险提示），它出现得越少越有力。
- Do 用描边与留白表达层级，阴影只保留一档。
- Do 让数字使用等宽数字，避免统计值跳动。
- Do 为每个可点控件保留至少 44px 触达区，即便视觉上按钮很小（用透明内边距补足）。
- Don't 在同一视图混用多种圆角档位或多种阴影强度。
- Don't 用字号小于 11px 承载正文信息；元信息最小 11px、正文最小 13px。
- Don't 在浅底上使用浅阶状态色文字（如 #B26A00 配 #FDF6E8），必须换成深阶。
- Don't 用动画表达装饰；`prefers-reduced-motion: reduce` 时必须停用全部漂移、涟漪与入场动画。
- Don't 修改既有模块的视觉语言来表示"新功能"——新功能必须沿用本文件的 token，保持八页面一致。
