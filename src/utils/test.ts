import { streamChat } from './Axios';

const testChat = async () => {
  const query = 'Hello, how are you?';
  const data = {
    messages: [
      {
        role: 'user',
        content: query,
      },
    ],
  };

  try {
    const stream = await streamChat(data);
    stream.on('data', (chunk: Buffer) => {
      const message = chunk.toString();
      console.log('AI Response:', message);
    });
    stream.on('end', () => {
      console.log('Chat stream ended');
    });
    stream.on('error', (error: Error) => {
      console.error('Error in chat stream:', error);
    });
  } catch (error) {
    console.error('Error in testChat:', error);
  }
};

testChat();