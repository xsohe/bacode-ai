import ReactMarkdown from 'react-markdown';
import { ThoughtMessage } from './ThoughtMessage';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  thought?: string;
}

export const ChatMessage = (props: ChatMessageProps) => {
  const isAssistant = props.role === 'assistant';

  return (
    <>
      {!!props.thought && <ThoughtMessage thought={props.thought} />}
      <div className={`flex items-start gap-4 ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Profile Image */}
        <img src={!isAssistant ? 'https://api.dicebear.com/9.x/lorelei/svg' : 'https://api.dicebear.com/9.x/bottts/svg'} alt="Profile" className="w-10 h-10 rounded-full dark:bg-blue-500 border border-black shadow-[2px_2px_0_0_black] p-1" />

        {/* Chat Bubble */}
        <div
          className={`rounded-none border p-4 max-w-[80%] font-sans text-sm leading-relaxed
      ${isAssistant ? 'bg-green-100 text-black dark:text-blue-600 shadow-brutal border-black dark:bg-slate-900' : 'bg-blue-200 text-black border-black dark:text-white dark:bg-pink-600 shadow-brutal'}
    `}
        >
          <div className={isAssistant ? 'prose dark:prose-invert dark:text-white text-black' : ''}>
            <ReactMarkdown>{props.content.trim()}</ReactMarkdown>
          </div>
        </div>
      </div>
    </>
  );
};
