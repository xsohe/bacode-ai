import Dexie, { Table } from 'dexie';

interface DEX_Thread {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
}

interface DEX_Message {
  id: string;
  role: 'user' | 'assistant';
  thought: string;
  content: string;
  thread_id: string;
  created_at: Date;
}

class ChatDB extends Dexie {
  threads!: Table<DEX_Thread>;
  messages!: Table<DEX_Message>;

  constructor() {
    super('chatdb');

    this.version(1).stores({
      threads: 'id, title, created_at, updated_at',
      messages: 'id, role, thought, content, thread_id, created_at',
    });

    this.threads.hook('creating', (_, obj) => {
      obj.created_at = new Date();
      obj.updated_at = new Date();
    });

    this.threads.hook('creating', (_, obj) => {
      obj.created_at = new Date();
    });
  }

  async createThread(title: string) {
    const id = crypto.randomUUID();

    this.threads.add({
      id,
      title,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return id;
  }

  async getAllThreads() {
    return this.threads.reverse().sortBy('updated_at');
  }

  async createMessage(message: Pick<DEX_Message, 'content' | 'thought' | 'role' | 'thread_id'>) {
    // 1. create message
    // 2. update thread
    const messageId = crypto.randomUUID();

    await this.transaction('rw', [this.threads, this.messages], async () => {
      await this.messages.add({
        ...message,
        // content: message.content,
        // thought: message.thought,
        // role: message.role,
        // thread_id: message.thread_id,
        id: messageId,
        created_at: new Date(),
      });
    });

    await this.threads.update(message.thread_id, {
      updated_at: new Date(),
    });

    return messageId;
  }
}

export const db = new ChatDB();
