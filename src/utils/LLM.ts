import {
    type EnterMessage,
    type FileObject,
} from '@coze/api';

/**
 * LLM 接口定义
 * 该接口定义了与大语言模型交互所需的方法。
 */
interface LLM {
    /**
     * 当设置发生变化时调用的方法。
     */
    onSettingsChange: () => void;


    /**
     * 创建消息的方法。
     * @param query - 用户输入的查询字符串。
     * @param fileInfo - 可选的文件信息对象。
     * @returns 返回一个 EnterMessage 数组。
     */
    createMessage: (query: string, fileInfo?: FileObject) => EnterMessage[];

    /**
     * 流式聊天的方法设置为 private，暂时只提供 chat 方法进行对话测试
     * @param query - 用户输入的查询字符串。
     * @param conversationId - 可选的对话 ID。
     * @param onUpdate - 消息更新时的回调函数。
     * @param onSuccess - 消息成功时的回调函数。
     * @param onCreated - 对话创建时的回调函数。
     *
     streamingChat: ({
     query,
     conversationId,
     onUpdate,
     onSuccess,
     onCreated,
     }: {
     query: string;
     conversationId?: string;
     onUpdate: (delta: string) => void;
     onSuccess: (delta: string) => void;
     onCreated: (data: CreateChatData) => void;
     }) => Promise<void>;*/

    /**
     * 设置配置的方法。
     * @param baseUrl - 基础URL。
     * @param pat - 个人访问令牌。
     * @param botId - 机器人ID。
     */
    setConfig: (baseUrl: string, pat: string, botId: string) => void;

    /**
     * 打印配置的方法。
     */
    printSetting: () => void;

    /**
     * 上传文件的方法。
     * @param file - 要上传的文件。
     */
    uploadFile: (file?: File) => Promise<FileObject | undefined>;
}

export default LLM;