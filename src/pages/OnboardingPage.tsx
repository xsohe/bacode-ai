import { useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-1 items-center justify-center h-screen px-6 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white">
      <div className="max-w-xl text-center p-8 border-4 border-black shadow-[8px_8px_0_0_black] bg-yellow-300 dark:bg-blue-500 rounded-none">
        <h1 className="text-4xl font-bold mb-4">Welcome to 🗣️bacodeAI!</h1>
        <p className="text-lg mb-6 font-mono">
          Your offline AI assistant powered by{' '}
          <a className="underline" href="https://ollama.com/library/deepseek-r1">
            ollama (deepseek-r1)
          </a>
          .
        </p>
        <ul className="text-left text-lg mb-6 space-y-2">
          <li>✅ Fully offline and private</li>
          <li>✅ Neo-brutalist UI</li>
          <li>✅ Message streaming with local storage</li>
        </ul>
        <Button className="bg-zinc-800 text-white hover:bg-white hover:text-black border-2 border-black rounded-none px-6 py-3 shadow-[4px_4px_0_0_black] text-base" onClick={() => navigate('/thread/new')}>
          🚀 Start Chatting
        </Button>
      </div>
    </div>
  );
}
