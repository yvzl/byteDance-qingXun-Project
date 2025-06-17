import type {EnterMessage, FileObject} from '@coze/api';

interface LLM {
    onSettingsChange: () => void;

    createMessage: (query: string, fileInfo?: FileObject) => EnterMessage[];
}

export {
    LLM
};