import { useLayoutEffect, useRef, useState } from 'react';
import { ChatMessage } from '~/components/ChatMessage';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import ollama from 'ollama';
import { ThoughtMessage } from '~/components/ThoughtMessage';
import { db } from '~/lib/dexie';
import { useParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';

const ChatPage = () => {
  const [messageInput, setMessageInput] = useState('');
  const [streamedMessage, setStreamedMessage] = useState('');
  const [thoughtMessage, setThoughtMessage] = useState('');

  const param = useParams();

  const scrollToBottomRef = useRef<HTMLDivElement>(null);

  const messages = useLiveQuery(() => db.getMessageForThread(param.threadId as string), [param.threadId]);

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

    setMessageInput('');
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
    setStreamedMessage('');
    setThoughtMessage('');
  };

  const handleScrollToBottom = () => {
    scrollToBottomRef.current?.scrollIntoView();
  };

  useLayoutEffect(() => {
    handleScrollToBottom();
  }, [streamedMessage, thoughtMessage, messages]);

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-zinc-800 text-black dark:text-white font-sans">
      {/* Header */}
      <header className="flex items-center px-6 h-20 border-b border-black bg-gray-100 dark:bg-zinc-900 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-wide">🗣️bacodeAI</h1>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6 w-full">
        <div className="mx-auto space-y-6 pb-24 max-w-screen-md">
          {messages?.map((message) => (
            <ChatMessage key={message.id} role={message.role} content={message.content} thought={message.thought} />
          ))}

          {!!thoughtMessage && <ThoughtMessage thought={thoughtMessage} />}

          {!!streamedMessage && <ChatMessage role="assistant" content={streamedMessage} />}

          <div ref={scrollToBottomRef}></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-100 border-black p-6 dark:bg-zinc-900 shadow-brutal dark:border-slate-800">
        <div className="max-w-3xl mx-auto flex gap-4">
          <Textarea
            className="flex-1 rounded-none border-2 lg:text-lg border-black bg-white dark:bg-zinc-800 text-black dark:text-white shadow-[4px_4px_0_0_black] focus:outline-none focus:ring-0 focus:border-black  dark:focus:border-green-400"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message here..."
            rows={4}
          />
          <Button onClick={handleSubmit} type="button" className="rounded-none bg-green-300 lg:text-lg hover:bg-green-500 text-black border-2 border-black shadow-brutal">
            Send
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
