/**
 * Storage utility for Thunderbird extension compatibility
 * @interface StorageAdapter
 */

/**
 * @typedef {Object} StorageAdapter
 * @property {function(string): Promise<string|null>} getItem - Get item from storage
 * @property {function(string, string): Promise<void>} setItem - Set item in storage
 * @property {function(string): Promise<void>} removeItem - Remove item from storage
 */

class ThunderbirdStorage {
  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @returns {Promise<string|null>} Stored value or null
   */
  async getItem(key) {
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

  /**
   * Set item in storage
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   * @returns {Promise<void>}
   */
  async setItem(key, value) {
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

  /**
   * Remove item from storage
   * @param {string} key - Storage key to remove
   * @returns {Promise<void>}
   */
  async removeItem(key) {
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
  /**
   * Get all tasks from storage
   * @returns {Promise<Array>} Array of task objects
   */
  async getTasks() {
    const tasksJson = await storage.getItem('kanban-tasks');
    if (!tasksJson) return [];
    
    try {
      return JSON.parse(tasksJson).map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      console.error('Error parsing tasks:', error);
      return [];
    }
  },

  /**
   * Save tasks to storage
   * @param {Array} tasks - Array of task objects to save
   * @returns {Promise<void>}
   */
  async saveTasks(tasks) {
    await storage.setItem('kanban-tasks', JSON.stringify(tasks));
  },

  /**
   * Get column configuration from storage
   * @returns {Promise<Array|null>} Array of column objects or null
   */
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

  /**
   * Save column configuration to storage
   * @param {Array} columns - Array of column objects to save
   * @returns {Promise<void>}
   */
  async saveColumns(columns) {
    await storage.setItem('kanban-columns', JSON.stringify(columns));
  }
};
