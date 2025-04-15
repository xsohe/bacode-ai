import { useState } from 'react';
import { ChatMessage } from '~/components/ChatMessage';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import ollama from 'ollama';
import { ThoughtMessage } from '~/components/ThoughtMessage';
import { db } from '~/lib/dexie';
import { useParams } from 'react-router';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const ChatPage = () => {
  const [messageInput, setMessageInput] = useState('');
  const [streamedMessage, setStreamedMessage] = useState('');
  const [thoughtMessage, setThoughtMessage] = useState('');
  const param = useParams();

  const handleSubmit = async () => {
    await db.createMessage({
      content: messageInput,
      thought: '',
      role: 'user',
      thread_id: param.threadId as string,
    });

    const stream = await ollama.chat({
      model: 'deepseek-r1:1.5b',
      messages: [
        {
          role: 'user',
          content: messageInput.trim(),
        },
      ],
      stream: true,
    });

    // output mode
    // 1. mode mikir (thought) -> ketemu </think>
    // 2. mode jawab (message)
    let outputMode: 'think' | 'response' = 'think';
    let fullContent = '';
    let thoughtContent = '';

    for await (const part of stream) {
      const messageContent = part.message.content;

      if (outputMode === 'think') {
        // akan menambahakan content messageThought jika tidak ada tag <think></think>
        // hanya pesan yang tidak mengandung <think> atau </think> saja yang akan diproses dan dimasukkan ke thoughtContent.
        if (!(messageContent.includes('<think>') || messageContent.includes('</think>'))) {
          thoughtContent += messageContent;
          setThoughtMessage(thoughtContent);
        }

        if (messageContent.includes('</think>')) {
          outputMode = 'response';
        }
      } else {
        fullContent += messageContent;
        setStreamedMessage(fullContent);
      }
    }

    await db.createMessage({
      content: fullContent,
      thought: thoughtContent,
      role: 'assistant',
      thread_id: param.threadId as string,
    });
  };

  // This would typically come from a state management solution or props
  const chatHistory: Message[] = [
    { role: 'assistant', content: 'Hello! How can I assist you today?' },
    { role: 'user', content: 'Can you explain what React is?' },
    {
      role: 'assistant',
      content:
        'React is a popular JavaScript library for building user interfaces. It was developed by Facebook and is widely used for creating interactive, efficient, and reusable UI components. React uses a virtual DOM (Document Object Model) to improve performance by minimizing direct manipulation of the actual DOM. It also introduces JSX, a syntax extension that allows you to write HTML-like code within JavaScript.',
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center px-4 h-16 border-b">
        <h1 className="text-xl font-bold ml-4">AI Chat Dashboard</h1>
      </header>
      <main className="flex-1 overflow-auto p-4 w-full">
        <div className="mx-auto space-y-4 pb-20 max-w-screen-md">
          {chatHistory.map((message, index) => (
            <ChatMessage key={index} role={message.role} content={message.content} />
          ))}

          {!!thoughtMessage && <ThoughtMessage thought={thoughtMessage} />}

          {!!streamedMessage && <ChatMessage role="assistant" content={streamedMessage} />}
        </div>
      </main>
      <footer className="border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Textarea className="flex-1" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type your message here..." rows={5} />
          <Button onClick={handleSubmit} type="button">
            Send
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
