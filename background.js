// Background script for Thunderbird extension
browser.runtime.onInstalled.addListener(() => {
  console.log('Kanban Board extension installed');
});

// Try to open sidebar when user clicks the toolbar button.
// If sidebar API isn't available, fallback to opening the app in a new tab.
browser.browserAction.onClicked.addListener(async () => {
  const panelUrl = browser.runtime.getURL('dist/index.html');

  try {
    // Set panel URL (so the sidebar shows our built index.html)
    if (browser.sidebarAction && typeof browser.sidebarAction.setPanel === 'function') {
      await browser.sidebarAction.setPanel({ panel: panelUrl });
      await browser.sidebarAction.open();
      return;
    }
  } catch (err) {
    console.warn('sidebarAction failed, will fallback to tab:', err);
  }

  // Fallback: open as a tab
  browser.tabs.create({ url: panelUrl });
});

// Storage management for cross-platform compatibility
const storage = {
  async get(keys) {
    try {
      return await browser.storage.local.get(keys);
    } catch (error) {
      console.error('Storage get error:', error);
      return {};
    }
  },

  async set(data) {
    try {
      await browser.storage.local.set(data);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  async remove(keys) {
    try {
      await browser.storage.local.remove(keys);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }
};

// Make storage available globally
globalThis.extensionStorage = storage;