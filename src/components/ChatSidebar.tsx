import { Moon, Plus, Sun } from 'lucide-react';
import { useLayoutEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, Sidebar as SidebarPrimitive } from '~/components/ui/sidebar';
import { useTheme } from './ThemeProvider';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { db } from '~/lib/dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useLocation } from 'react-router';

export const ChatSidebar = () => {
  const [activeThread, setActiveThread] = useState('');
  const { setTheme, theme } = useTheme();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const location = useLocation();

  const handleToggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const threads = useLiveQuery(() => db.getAllThreads(), []);

  const handleCreateThread = () => {
    const threadId = db.createThread(textInput);

    setDialogIsOpen(false);
    setTextInput('');
  };

  useLayoutEffect(() => {
    const activeThreadId = location.pathname.split('/')[2];
    setActiveThread(activeThreadId);
  }, [location.pathname]);

  return (
    <>
      <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
        <DialogContent className="bg-gray-100 dark:bg-zinc-800 border-[3px] border-black dark:border-gray-700 rounded-none shadow-none text-black dark:text-white p-6 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black dark:text-white">Create new thread</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 mt-4">
            <Label htmlFor="thread-title" className="text-black dark:text-white font-semibold text-sm">
              Thread title
            </Label>
            <Input
              id="thread-title"
              placeholder="Your new thread title"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="border-2 border-black dark:border-white rounded-none px-4 py-2 text-black dark:text-white bg-gray-100 dark:bg-zinc-800 focus:outline-none focus:ring-0 focus:border-black  dark:focus:border-green-400"
            />
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setDialogIsOpen(false)}
              className="shadow-brutal bg-red-200  dark:bg-red-600 border-2 border-black dark:border-slate-900 text-black dark:text-white rounded-none px-4 py-2 hover:bg-red-300 dark:hover:bg-red-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateThread}
              className="shadow-brutal  bg-green-300 dark:bg-green-600 border-2 border-black dark:border-slate-900 text-black dark:text-white rounded-none px-4 py-2 hover:bg-green-400 dark:hover:bg-green-500"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SidebarPrimitive className="bg-blue-200 dark:bg-zinc-900 text-black dark:text-white border-black dark:border-slate-800 rounded-none h-full flex flex-col">
        <SidebarHeader className="p-4 border-b-2 border-black dark:border-gray-700">
          <Button
            onClick={() => setDialogIsOpen(true)}
            className="shadow-brutal   w-full justify-start bg-green-300 dark:bg-green-600 border-2 border-black dark:border-gray-200 text-black dark:text-white rounded-none hover:bg-green-400 dark:hover:bg-green-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-auto p-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wide text-black dark:text-white mb-2">Recent Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {threads?.map((thread) => (
                  <SidebarMenuItem key={thread.id}>
                    <Link to={`/thread/${thread.id}`}>
                      <SidebarMenuButton
                        isActive={thread.id === activeThread}
                        className={`w-full text-left border-2 rounded-none px-3 py-2 ${
                          thread.id === activeThread
                            ? 'bg-blue-300 dark:bg-yellow-500 border-black dark:border-gray-700 text-black dark:text-white'
                            : 'bg-blue-100 dark:bg-zinc-800 border-black dark:border-gray-700 text-black dark:text-white hover:bg-blue-100 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {thread.title}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t-2 border-black dark:border-gray-700">
          <Button
            onClick={handleToggleTheme}
            variant="ghost"
            className="shadow-brutal w-full justify-start border-2 border-black dark:border-gray-700 bg-red-200 dark:bg-red-600 text-black dark:text-white rounded-none hover:bg-red-300 dark:hover:bg-red-500"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="ml-2">Toggle Theme</span>
          </Button>
        </SidebarFooter>
      </SidebarPrimitive>
    </>
  );
};
