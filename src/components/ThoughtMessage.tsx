type ThoughtMessageProps = {
  thought: string;
};

export const ThoughtMessage = (props: ThoughtMessageProps) => {
  return (
    <div className="mb-6">
      <span className="italic text-sm px-2 py-1 bg-yellow-200 dark:bg-blue-500 dark:text-white shadow-brutal border-2 border-black text-black rounded-none inline-block">AI thought:</span>

      <div className="p-4 mt-2 bg-white dark:bg-zinc-900 border-black text-black dark:text-white relative flex rounded-none">
        {/* Brutal vertical separator */}
        <div className="absolute left-0 top-4 bottom-2 w-[4px] bg-black" />

        <p className="pl-4 text-sm font-mono leading-relaxed whitespace-pre-line">{props.thought.trim()}</p>
      </div>
    </div>
  );
};
