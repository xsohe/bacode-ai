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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Creat new thread</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <Label htmlFor="thread-title">Thread title</Label>
            <Input
              id="thread-title"
              placeholder="Your new thread title"
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateThread}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SidebarPrimitive>
        <SidebarHeader>
          <Button onClick={() => setDialogIsOpen(true)} className="w-full justify-start" variant="ghost">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
              <SidebarMenu>
                {threads?.map((thread) => (
                  <SidebarMenuItem key={thread.id}>
                    <Link to={`/thread/${thread.id}`}>
                      <SidebarMenuButton isActive={thread.id === activeThread}>{thread.title}</SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button onClick={handleToggleTheme} variant="ghost" className="w-full justify-start">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> Toggle Theme
          </Button>
        </SidebarFooter>
      </SidebarPrimitive>
    </>
  );
};
