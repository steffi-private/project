// Storage utility for Thunderbird extension compatibility
interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

class ThunderbirdStorage implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof browser !== 'undefined' && browser.storage) {
        const result = await browser.storage.local.get(key);
        return result[key] || null;
      }
      // Fallback to localStorage for development
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Storage get error:', error);
      return localStorage.getItem(key);
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof browser !== 'undefined' && browser.storage) {
        await browser.storage.local.set({ [key]: value });
        return;
      }
      // Fallback to localStorage for development
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage set error:', error);
      localStorage.setItem(key, value);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (typeof browser !== 'undefined' && browser.storage) {
        await browser.storage.local.remove(key);
        return;
      }
      // Fallback to localStorage for development
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
      localStorage.removeItem(key);
    }
  }
}

export const storage = new ThunderbirdStorage();

// Helper functions for common storage operations
export const storageHelpers = {
  async getTasks() {
    const tasksJson = await storage.getItem('kanban-tasks');
    if (!tasksJson) return [];
    
    try {
      return JSON.parse(tasksJson).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      console.error('Error parsing tasks:', error);
      return [];
    }
  },

  async saveTasks(tasks: any[]) {
    await storage.setItem('kanban-tasks', JSON.stringify(tasks));
  },

  async getColumns() {
    const columnsJson = await storage.getItem('kanban-columns');
    if (!columnsJson) return null;
    
    try {
      return JSON.parse(columnsJson);
    } catch (error) {
      console.error('Error parsing columns:', error);
      return null;
    }
  },

  async saveColumns(columns: any[]) {
    await storage.setItem('kanban-columns', JSON.stringify(columns));
  }
};