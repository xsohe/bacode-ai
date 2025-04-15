import { useState } from 'react';
import { ChatSidebar } from '~/components/ChatSidebar';
import { SidebarProvider } from '~/components/ui/sidebar';
import { Route, Routes } from 'react-router';
import ChatPage from './pages/ChatPage';
import OnboardingPage from './pages/OnboardingPage';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex h-screen bg-background w-full">
        <ChatSidebar />
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route path="/thread/:threadId" element={<ChatPage />} />
        </Routes>
      </div>
    </SidebarProvider>
  );
}
