---
description: "Use when working with Stitch artifacts, design exports, or `.stitch/` workflow files."
applyTo: "**/.stitch/**"
---

# Stitch Workflow Rules

## Goal

保证 Stitch 相关输出可追踪、可复用、可验证。

## Rules

- 任何新增页面都应写入明确的页面用途与状态说明，避免仅保留视觉文件。
- 生成或更新设计时，优先复用现有 design tokens、色彩和排版系统。
- 如果更新了页面结构，需同步更新说明文档（如 `DESIGN.md`、流程说明或组件映射）。
- 输出代码前，先检查是否已有同名页面/组件，优先增量修改而非重复创建。
- 对导出的 HTML/CSS/JS，要求可直接运行，并避免依赖隐式全局变量。

## Validation Checklist

- 页面是否可打开并完成主流程交互。
- 颜色、间距、字号是否与设计系统一致。
- 是否存在死链按钮或无反馈交互。
- 文案与状态是否匹配（预约前/预约后/评价完成等）。

## Fallback

当 Stitch MCP 不可用时：

- 使用现有原型图和本地代码进行静态/交互还原。
- 在结果中明确标注“未调用 Stitch MCP”的原因与替代路径。