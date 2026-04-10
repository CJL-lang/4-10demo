# Copilot Workspace Rules

本项目启用了 Stitch 相关 skills，位于 `.github/skills/`。处理设计和前端生成任务时，按以下规则路由：

## Skill Routing

- 需求包含「Stitch 设计生成 / 页面重绘 / 按设计改图」: 优先 `stitch-design`
- 需求包含「把模糊想法改成高质量提示词」: 使用 `enhance-prompt`
- 需求包含「为 Stitch 项目输出/更新 DESIGN.md」: 使用 `design-md` 或 `taste-design`
- 需求包含「将 Stitch 结果转 React 组件」: 使用 `react-components`
- 需求包含「多页面自动迭代生成」: 使用 `stitch-loop`
- 需求包含「生成设计演示视频」: 使用 `remotion`
- 需求包含「shadcn/ui 组件接入」: 使用 `shadcn-ui`

## Execution Rules

- 先识别是否存在 Stitch 或相关 MCP 工具；若不可用，明确告知并提供本地替代方案。
- 对于改动代码的任务：先最小改动，再运行必要验证，再汇报结果。
- 输出前端代码时，优先保持设计一致性和可维护性，不引入无关依赖。
- 涉及 `.stitch/` 目录时，遵守 `.github/instructions/stitch-workflow.instructions.md`。

## Safety and Quality

- 不泄露密钥、令牌或个人敏感信息。
- 不在未获确认时执行破坏性命令（删除、重置、覆盖关键文件）。
- 如遇冲突约束，优先满足用户显式要求，并说明取舍。
