document.addEventListener('DOMContentLoaded', async () => {
  const openButton = document.getElementById('openBoard');
  const statsElement = document.getElementById('taskStats');

  // Open kanban board in new tab
  openButton.addEventListener('click', () => {
    browser.tabs.create({
      url: browser.runtime.getURL('dist/index.html')
    });
    window.close();
  });

  // Load and display task statistics
  try {
    const data = await browser.storage.local.get(['kanban-tasks']);
    const tasks = data['kanban-tasks'] ? JSON.parse(data['kanban-tasks']) : [];
    
    const stats = {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'done').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      todo: tasks.filter(task => task.status === 'todo').length
    };

    if (stats.total === 0) {
      statsElement.textContent = 'No tasks yet. Click above to get started!';
    } else {
      statsElement.innerHTML = `
        <div>📊 ${stats.total} total tasks</div>
        <div>✅ ${stats.completed} completed • 🔄 ${stats.inProgress} in progress</div>
      `;
    }
  } catch (error) {
    console.error('Error loading task stats:', error);
    statsElement.textContent = 'Click above to open your kanban board';
  }
});