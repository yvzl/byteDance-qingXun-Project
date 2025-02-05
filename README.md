# LLM 对话框组件2.0 Coze API

本项目是一个由 Vue3 + Vite3 + TypeScript、Axios4、pinia 和 Coze API 搭建的 LLM 对话框组件。
项目启动命令：

```bash
git pull
npm install
npm run dev
```

## 协同开发约定

在开发过程中我们约定如下内容：

1. vue 文件的顺序为 `script -> template -> style`。
2. `script` 使用 `setup` 语法糖和 TypeScript。
3. 文件夹名采用小写，文件名首字母大写。
4. 通过 `action` 操作 `store` 中的数据。
5. 所有模块都要写清楚运行过程原理，注释函数的作用，让其他人能理解整个项目的运行，做好答辩准备。

## 模块拆分

### 1. 内联对话框容器 (DialogContainer)
- 包括 `InputBox` 和 `MessageList`。
- 要求实现管理对话框的三种显示状态（收缩、展开、对话）。
  - **收缩形态**：表现为一个单一地输入框，点击后展开弹框进入第二形态。
  - **展开形态**：表现为支持对话的弹框模式，用户输入问题后，立即进入该形态。
  - **对话形态**：用户输入问题后，立即进入该形态，形态上既为 LLM 对话信息流。
- 提供接口供其他组件调用，控制对话框的显示和隐藏。
- 根据一个状态变量 `dialogState` 的值表示不同的显示状态，渲染不同的子组件。
- 由于内联对话框与 `main` 组件的对话需要分离，这潜在的要求了需要做到历史对话分离。
- 使用 Pinia 通过 `Store` 管理会话数据，并确保内联对话框与主对话框的消息分离。

### 2. 输入框组件 (InputBox)
- 准备用在两个地方，内联对话框和独立对话框。
- `InputBox` 是组件调用 AI 的地方，实现用户与 AI 对话。
- 将用户输入的内容通过 `chatWithCoze` 实时传递给消息仓库 `MessageStore` 并进行处理。
- 支持通过 `Enter` 键触发发送事件，实现了防抖发送功能，防止频繁触发发送事件。
- **子组件**：
  - `TextArea.vue`: 用于文本输入，支持自动调整高度。
  - `Upload.vue`: 用于上传图片、PDF 等文件。
  - `Send.vue`: 用于发送消息，支持禁用状态。

### 3. 对话内容组件 (MessageList)
- 包括 `MessageUser` 和 `MessageChat` 组件。
- 负责展示对话历史记录，包括用户输入和 LLM 返回的内容。
- 支持多种内容格式，例如文本、Markdown、图片、代码等。
- 实现流式加载 LLM 返回的结果，逐行显示。

### 4. 消息组件 (MessageItem)
- 负责展示单条对话消息。要求解析 Markdown 内容，并支持图片和代码等格式。
- 根据消息类型（用户输入或 LLM 返回）渲染不同的样式。
- 支持展示 Markdown 内容、图片、代码等，这里使用 `markdown-it` 来解析 Markdown 内容。
- 使用 `github-markdown-css` 样式库来美化 Markdown 渲染效果。
- 代码消息提供“**复制**”按钮，方便用户复制。

### 5. LLM 交互工具类 (LLMInteraction)
- 负责与 LLM API 进行交互，处理用户输入并获取 AI 回复。
- 从 `MessageStore` 获取用户输入的内容发送给 LLM API，并接收返回的结果。
- 将 LLM 返回的结果传递给调用方法的组件进行展示。
- **主要函数**：
  - 初始化 Coze API 客户端。
  - 获取机器人信息。
  - 创建对话消息，分离文本与文件，合并历史消息一并发送给 Coze。
  - 上传文件。
  - 流式聊天调用 API。
  - 设置和打印配置信息。
- **调用流式对话方法示例**：
  ```js
  await LLMInteraction.streamingChat({
    query: query.value, // 这里是用户输入的内容
    onUpdate: (delta: string) => {
      response.value = delta; // response 是 AI 返回的结果
    },
    onSuccess: (delta: string) => {
      response.value = delta;
    },
    onCreated: (data: CreateChatData) => {
      console.log('Chat created:', data);
    },
  });
  ```

### 6. 独立对话框组件 (Main)
- 包括 `InputBox` 和 `MessageList`。
- 根据用户输入（含文件）使用 Axios 调用大模型 Coze API。
- 这里要求给出总体界面设计，其他组件的样式以 `Main` 为例进行设计。
- 要求响应式设计，除 Web 端外，实现 H5 与小程序界面的屏幕适应。

### 7. Pinia 数据存储类 (MessageStore)
- 负责存储对话记录和持久化，包括用户输入和 LLM 返回的内容。
- 通过控制全局 `ref`，即 `activeMessageId` 实现不同的会话切换。
- 提供 `addContent`、`updateContent` 等方法来操作会话数据。

### 8. 配置文件 (Config)
- 负责三个配置信息的存储和修改，包括：
  - `bot ID`
  - `PAT`
  - `baseUrl`
- 以上三条信息需要通过 Coze 官网创建机器人并开放 API 调用权限获取，详细参考 Coze 文档准备工作。

### 9. AI 消息组件 (MessageChat)
- 包含 `MessageItem` 和 `Avatar`，用于展示 AI 的单条对话消息。
- 使用默认头像 `chatHead` 来标识 AI 发送的消息。
- 根据传入的 `value` 和 `type` 属性，渲染对应的消息内容。

### 10. 用户消息组件 (MessageUser)
- 包含 `MessageItem`，用于展示用户的单条对话消息。
- 根据传入的 `value` 和 `type` 属性，渲染对应的消息内容。

### 11. 文本输入 (TextArea.vue)
- 接收用户输入的文本内容。
- 支持自动调整高度，根据输入内容动态调整文本域的高度。
- 调用双向绑定钩子 (`useModel.ts`) 使用 `ref` 和 `watch` 实现双向数据绑定。
- 确保父组件和子组件之间的数据同步。

### 12. 消息类型定义 (Message.ts)
- 定义 `ContentType` 枚举。
- 定义 `Message` 和 `Content` 接口。

## 要求
参考 https://bytedance.larkoffice.com/docx/YP0Md2LwCoelRQxnwiZc5DWUndb?share_token=a0c7986e-45ce-42af-a8c6-431fcd10f3b1
- **可选模块: 工具栏组件 (Toolbar)**: 可以包含一些操作按钮，例如清空对话记录、切换对话模式等。
- 除 Web 端外，组件还需兼容 H5、小程序形态，并提交相关演示材料。
- 需要支持 LLM 流式返回结果，实现逐行打印效果。
- 若返回结果包含代码，请提供“Copy” 按钮，方便用户复制代码。

## 加分项

1. 单测覆盖率超过 80%，（预计使用单元测试框架：Vitest）。
2. 有完善的 CI 流水线，并在 CI 中执行构建、自动测试、Lint 检查、ts 检查等检测动作。
3. 有完善的 CD 流水线，实现发布动作自动化。

## 组件之间的关系

- `DialogContainer` 是内联对话框组件。
- `InputBox` 和 `MessageList` 是 `Main` 的子组件，分别负责用户输入和对话内容的展示。
- `MessageUser` 和 `MessageChat` 是 `MessageList` 的子组件，负责分别展示用户和 AI 的单条对话消息。
- `MessageUser` 和 `MessageChat` 分别负责展示用户和 AI 的消息。包括 `MessageItem`。
- `LLMInteraction` 作为一个独立工具类被 InputBox 和 Upload 调用，
- `Config` 供 LLMInteraction 初始化时调用
- `MessageStore` 提供 addContent、updateContent 方法供 InputBox、LLMInteraction、DialogContainer、Main 操作数据。


# 开发日志

## 发布智能体为 API 服务

发布智能体为 API 服务后，可以通过调用 API 的方式使用智能体，例如查看智能体的基本设置、发起智能体对话等。

## 准备工作

参考 [扣子平台开发者指南](https://www.coze.cn/open/docs/developer_guides/preparation)。

## 操作步骤

1. 登录扣子平台。
2. 在左侧导航栏中选择工作空间，并在页面顶部空间列表中选择个人空间或团队空间。
3. 在项目开发页面，选择智能体。
4. 在页面右上角，单击 **发布**。
5. 在发布页面，选择 **Agent as API** 选项，然后单击 **发布**。

## 获取访问令牌

本文档以生成个人访问令牌为例，演示获取访问令牌的方式。

1. 登录扣子平台。
2. 在左侧菜单栏下方，单击扣子 API 图标。
3. 在扣子 API 页面，进入 **授权** > **个人访问令牌** 页签。
4. 你也可以直接访问个人访问令牌页面。
5. 单击 **添加新令牌**。
6. 在弹出的页面完成以下配置，然后单击**确定**。

## API 鉴权

扣子 API 通过访问令牌进行 API 请求的鉴权。所有的 API 请求都必须在请求头的 `Authorization` 参数中包含你的访问令牌（Access Token）。

```plaintext
Authorization: Bearer $Access_Token
```

**限额**

当前扣子 API 免费供开发者使用，每个空间的 API 请求限额如下：

- QPS (每秒发送的请求数): 2
- QPM (每分钟发送的请求数): 60
- QPD (每天发送的请求数): 3000

注意：2024 年 8 月 15 日之后，扣子 API 的免费额度为每个账号 100 次 API 调用。一旦累计调用次数超过免费额度，此账号将无法继续使用任何扣子 API。

## 合并冲突解决

当两个分支对同一个文件进行了修改，但修改内容不同，则出现合并冲突。

合并分支的时候，只要打开一次就已经向 `main` 分支发起请求了，这个时候仓库所有者会收到合并消息邮件，如果出现合并冲突，则需要审查者手动调整合并冲突。

此时需要审查者根据项目需求审查原有代码和传入代码，选择性的合并，然后提交代码。

- 组件导入冲突大部分是因为 `tsconfig` 文件配置问题，`tsconfig` 创建时会全局扫描组件并固定组件路径，导入出错只需要删除其内容再重新写入即可。

## 项目技术点

1. 从扣子平台的智能体创建到本地代码调用功能。
2. 智能体对话的实现：`streamingChat` 调用 API，本项目通过安装 SDK 调用方法实现。
3. Markdown 解析：`markdown-it`。
4. 文件上传 参考：[扣子平台文件上传文档](https://www.coze.cn/open/playground/upload_file)，本项目通过 `axios` post 到对应地址实现。
   - 支持上传的文件格式：
     - 文档：DOC、DOCX、XLS、XLSX、PPT、PPTX、PDF...
     - 图片：JPG、JPG2、PNG、GIF...
5. 上下文结合推理：项目将所有消息统一在 `LLMInteraction` 赋值给 `addtionContext`，使用 API 规定特性实现，如果 `additional_messages` 中有多条消息，则最后一条会作为本次用户 Query，其他消息为上下文。
6. 代码块添加复制功能。
7. 流式打印 AI 返回结果，项目通过 `streamChat` 从 `this.Coze.chat.stream` 获取流式结果，遍历流式结果，在流式更新的过程中不断调用 `InputBox` 中的 `updateContent` 方法，实现 `MessageStore` 中当前会话的最后一条消息更新，然后 `Main` 通过 `findContent` 查找当前会话，传入 `MessageList`，`MessageList` 通过 `Content` 属性中的 `role` 分发消息给 `MessageUser` 或 `MessageChat`，这整个消息流实时更新从而实现流式打印效果。
- 数据流： LLMInteraction → InputBox → MessageStore → Main → MessageList → MessageChat
