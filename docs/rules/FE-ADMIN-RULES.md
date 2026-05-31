# FE Admin Rules

本文约束 `apps/admin` 的 AI 开发与人工开发过程。目标应用名称为 **星流 创作者中心**，定位为 B 端创作者生产后台，视觉参考抖音创作者中心，但不复制外部站点代码和资产。

## 1. 技术栈边界

- 必须使用当前技术栈：React 19、React Router 7、Vite 8、TypeScript、Tailwind CSS 4。
- 组件库使用 `@douyinfe/semi-ui`，图标使用 `@douyinfe/semi-icons`，插画优先使用 `@douyinfe/semi-illustrations`。
- 服务端状态使用 `@tanstack/react-query`，本地交互状态使用 `zustand`，注意不要过渡使用`zustand`。
- HTTP 请求使用 `axios`；OpenAPI 代码生成使用 `orval`，生成代码不得手改。
- 富文本编辑器使用 Tiptap：`@tiptap/react`、`@tiptap/pm`、`@tiptap/starter-kit` 及已安装扩展。
- 离线草稿使用 `dexie` 和 `dexie-react-hooks`。
- 数据图表使用 `@visactor/react-vchart`。
- 草稿指纹、幂等 key、内容变更比对可使用 `md5`；密码提交前也按后端约定进行 MD5 处理，但不得把 MD5 当作安全加密方案。

## 2. 品牌与公共资产

- 应用展示名称统一为 `星流 创作者中心`。
- 浏览器图标使用 `apps/admin/public/favicon.png`。
- 不新增无来源的品牌图标文件；需要业务图片时放在 `src/assets`，公共静态资源才放在 `public`。
- 页面文案使用简洁中文，避免营销型夸张表达；后台产品优先表达状态、结果和下一步动作。

## 3. 目录职责

`apps/admin/src` 必须按以下职责组织代码：

- `api/`：接口类型来自 `packages/shared`;比如`api/login/`这样模块化封装接口请求和 React Query hooks。
- `assets/`：由源码 import 的图片、SVG、局部静态资源。比如`assets/icons/`、`assets/images/`、`assets/fonts/`。
- `components/`：`components/ui`跨页面复用组件，只沉淀有明确复用价值的业务组件和布局组件;`components/layout`放置整体布局组件，如后台框架、编辑器布局等;
- `configs/`：应用工具配置`configs/utils/`、axios 的基础封装、Semi 配置、环境变量读取。
- `hooks/`：跨组件复用的业务 hooks，必须以 `use` 开头。
- `pages/`：路由页面;遇到只属于自己的页面封装，需要放到自己模块的`components/`下面，比如`pages/login/components/`。
- `router/`：路由定义、懒加载、权限路由守卫。
- `stores/`：Zustand store，只存放客户端状态。
- `styles/`：全局样式、Tailwind 入口、Semi 变量覆盖、基础排版。

禁止把大量业务逻辑写进 `App.tsx`、`main.tsx` 或单个页面文件。

## 4. 命名规范

- 文件夹使用 kebab-case：`creator-workbench`、`content-review`。
- React 组件文件使用 PascalCase：`AdminShell.tsx`、`StatusTag.tsx`。
- 非组件 TypeScript 文件使用 kebab-case：`http-client.ts`、`query-client.ts`、`draft-repository.ts`。
- React 组件、类型、枚举使用 PascalCase：`CreatorProfile`、`DraftSyncStatus`。
- 变量、函数、hook、store selector 使用 camelCase：`createDraft`、`useDraftList`。
- 常量使用 UPPER_SNAKE_CASE：`DEFAULT_PAGE_SIZE`、`DRAFT_AUTOSAVE_INTERVAL_MS`。
- 布尔变量必须带语义前缀：`isLoading`、`hasConflict`、`canPublish`、`shouldSync`。
- 事件处理函数使用 `handle` 前缀：`handleSubmit`、`handleRetrySync`。
- API 方法名使用业务动词：`fetchDraftList`、`createPromptTemplate`、`publishContent`。
- 命名必须表达业务含义，禁止使用 `data`、`list`、`item`、`temp`、`foo` 这类无法单独理解的名称，除非作用域极小且语义清晰。

## 5. 组件化规则

- 有 Semi 组件可用时优先使用 Semi，不自行实现 Button、Input、Modal、Table、Tabs、Form、Select、Tag、Toast、Drawer 等基础组件。
- 不封装无价值的二次基础组件，例如 `XButton`、`BaseInput`；只封装业务复合组件，例如 `AdminShell`、`EditorLayout`、`ReviewSideSheet`、`StatusTag`、`DataTableToolbar`。
- 单个组件只承担一个主要职责；组件超过约 200 行时，应优先拆出子组件、hooks 或配置对象。
- 页面级组件不得直接写复杂表格列渲染、表单规则和请求适配逻辑；这些应拆到同目录的 `components/`、`hooks/` 或 `api/`。
- props 类型必须显式声明，组件对外 props 使用 `interface`。
- 组件内部派生数据优先使用局部变量或 `useMemo`，不要把可计算数据写入 store。
- 列表渲染必须使用稳定业务 id 作为 `key`，禁止使用数组下标作为 key。
- 空状态、加载态、错误态、禁用态必须完整处理。

## 6. 语义化与可访问性

- 页面结构优先使用语义化标签：`main`、`nav`、`header`、`section`、`aside`、`footer`。
- 可点击行为优先使用 `button` 或 Semi 按钮组件，导航跳转使用 React Router 的 `Link`。
- 图标按钮必须提供 `aria-label` 或可见文字。
- 表单项必须有明确 label、校验提示和提交反馈。
- 表格批量操作、危险操作、发布操作必须有确认或明确的二次反馈。
- 不用纯颜色表达状态；状态必须同时有文字，例如 `通过`、`需改写`、`同步失败`。

## 7. 样式规则

- Semi 负责组件视觉，Tailwind 只负责布局、间距、尺寸和页面级微调。
- 不在业务组件里大面积覆盖 Semi 内部 class；需要统一视觉时在 `src/styles/base.css` 中覆盖 CSS 变量。
- 布局必须适配桌面、平板和移动端。B 端以桌面效率优先，移动端保证主流程可用。
- 后台页面不要做营销型大 Hero；首屏应直接展示工作台、列表、编辑器或登录表单。
- 卡片只用于内容项、结果面板、弹窗或局部模块，不把整页套进大卡片。
- 文本不得溢出按钮、表格单元格和卡片；长标题必须使用省略、换行或 Tooltip。
- 颜色使用语义：成功为绿色，警告/需改写为橙色，错误/驳回为红色，同步/离线为蓝色或灰色。

## 8. 路由与页面规则

- 路由集中定义在 `router/`，页面组件放在 `pages/`。
- 路由页面必须懒加载，避免首屏加载编辑器、图表等大模块。
- 登录页路径为 `/login`；登录后默认进入创作工作台。
- 需要权限的页面必须经过统一路由守卫，不在每个页面重复写鉴权逻辑。
- 页面标题、面包屑、导航选中态应由路由元信息或集中配置驱动。

## 9. API 与类型规则

- 未来接口类型统一从 `packages/shared` 导入，保持前后端 DTO 一致。
- 页面禁止直接调用 axios 实例；页面通过 `api/` 方法、Orval hooks 或业务 hooks 取数。
- axios 实例必须统一处理 `baseURL`、token、requestId、401、网络错误和业务错误码。
- React Query key 必须集中管理，禁止散落硬编码字符串。
- 服务端列表、详情、分页、筛选结果放在 React Query，不放进 Zustand。
- 请求入参和响应适配在 `api/` 或业务 hook 中完成，页面只消费适配后的 UI 数据。
- Orval 生成目录应明显标记为 generated，禁止人工编辑生成文件。

## 10. 表单与安全规则

- 所有用户输入必须校验字段，包含必填、长度、格式、边界值和前后空格处理。
- 登录账号支持手机号或邮箱时，必须分别校验手机号和邮箱格式。
- 密码字段至少校验必填和长度；提交前按接口约定使用 `md5(password)`。
- 不在 console、URL、localStorage、Zustand 持久化数据中保存明文密码或 MD5 后的密码。
- token 只通过统一认证 store 和 axios 拦截器使用，禁止散落读取。
- 危险 HTML 内容必须经过可信来源或显式净化；Tiptap 渲染内容不得直接绕过 React 安全机制。

## 11. 状态管理规则

- Zustand 只管理客户端状态：登录态、编辑器 UI、同步状态、抽屉弹窗、当前操作上下文。
- React Query 管理服务端状态：Prompt、素材、草稿、内容、审核结果、分发数据。
- Dexie 管理本地持久数据：草稿、草稿快照、同步队列、冲突记录。
- Store 必须按业务域拆分，例如 `auth-store.ts`、`editor-store.ts`、`sync-store.ts`。
- Store action 必须表达意图，例如 `setCurrentDraft`、`markSyncFailed`，禁止直接暴露大而全的 `setState` 给页面。
- 跨域状态同步必须有明确来源，避免 React Query、Zustand、Dexie 三处互相复制同一份服务端数据。

## 12. 编辑器与离线规则

- 富文本编辑器统一基于 Tiptap 封装，编辑器扩展集中配置。
- AI 生成结果先进入候选区，用户确认后才能插入、替换或追加到正文。
- 编辑过程必须触发本地保存，离线时不得丢稿。
- 草稿保存必须记录内容 hash、更新时间、同步状态和冲突状态。
- Dexie schema 变更必须显式提升版本，并写清迁移逻辑。
- 同步冲突必须展示本地版本、云端版本和复制为新草稿的处理方式。

## 13. 性能规则

- 首屏不得加载 Tiptap、VChart、大型编辑器面板等非当前页面必要模块。
- 路由级代码分割必须保留；复杂页面内部也应按编辑器、图表、抽屉延迟加载。
- 表格大数据量必须分页；长列表需要虚拟滚动或分页，不一次渲染全部。
- 图片必须限制尺寸和比例，避免布局抖动。
- 避免在 render 中创建大量匿名配置；表格列、图表 spec、表单规则可提到组件外或用 `useMemo`。

## 14. AI 开发执行规则

- 修改代码前先阅读相关页面、组件、store、api 和路由，遵循现有结构。
- 只改与当前任务相关的文件，不做无关重构。
- 新增能力必须同步考虑加载、空、错、禁用、权限不足等状态。
- 新增公共能力必须放到正确目录，并给出清晰命名。
- 不生成重复类型；能从 `packages/shared` 或 Orval 获取类型时必须复用。
- 不引入未安装的新依赖，除非明确说明原因并获得确认。
- 完成后至少运行 `pnpm --filter @xingliu/admin build` 或说明无法运行的原因。

## 15. 推荐基础文件

后续实现时优先补齐以下基础文件：

- `src/configs/providers.tsx`：挂载 React Query、Semi 配置和全局上下文。
- `src/configs/query-client.ts`：React Query 默认配置。
- `src/api/http-client.ts`：axios 实例与拦截器。
- `src/api/query-keys.ts`：React Query key 工厂。
- `src/api/generated/`：Orval 生成代码目录。
- `src/api/draft-repository.ts`：Dexie 草稿仓储封装。
- `src/configs/dexie-db.ts`：Dexie schema 与版本。
- `src/utils/hash.ts`：MD5 hash 封装。
- `src/components/layout/AdminShell.tsx`：后台整体布局。
- `src/components/business/StatusTag.tsx`：统一业务状态展示。

## 16. 禁止过渡封装

- 对于类似于登陆注册页面的简单页面，不要过渡到`src/components`目录下创建过多的组件，比如登录注册页面直接在`src/pages/login/components`中实现。
- 对于一些简单的工具函数，不要过渡封装到`src/utils`目录下创建过多的工具函数，比如一些简单的格式化函数直接在需要使用的地方实现。
