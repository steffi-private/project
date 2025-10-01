document.addEventListener('DOMContentLoaded', () => {
  const exportButton = document.getElementById('exportData');
  const importButton = document.getElementById('importData');
  const importFile = document.getElementById('importFile');
  const clearButton = document.getElementById('clearData');
  const openButton = document.getElementById('openBoard');
  const successMessage = document.getElementById('successMessage');

  // Export data
  exportButton.addEventListener('click', async () => {
    try {
      const data = await browser.storage.local.get(['kanban-tasks', 'kanban-columns']);
      const exportData = {
        tasks: data['kanban-tasks'] ? JSON.parse(data['kanban-tasks']) : [],
        columns: data['kanban-columns'] ? JSON.parse(data['kanban-columns']) : [],
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kanban-board-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showSuccess('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting data. Please try again.');
    }
  });

  // Import data
  importButton.addEventListener('click', () => {
    const file = importFile.files[0];
    if (!file) {
      alert('Please select a file to import.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        if (importData.tasks && Array.isArray(importData.tasks)) {
          await browser.storage.local.set({
            'kanban-tasks': JSON.stringify(importData.tasks)
          });
        }
        
        if (importData.columns && Array.isArray(importData.columns)) {
          await browser.storage.local.set({
            'kanban-columns': JSON.stringify(importData.columns)
          });
        }

        showSuccess('Data imported successfully!');
        importFile.value = '';
      } catch (error) {
        console.error('Import error:', error);
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  });

  // Clear all data
  clearButton.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all tasks and settings? This action cannot be undone.')) {
      try {
        await browser.storage.local.clear();
        showSuccess('All data cleared successfully!');
      } catch (error) {
        console.error('Clear error:', error);
        alert('Error clearing data. Please try again.');
      }
    }
  });

  // Open kanban board
  openButton.addEventListener('click', () => {
    browser.tabs.create({
      url: browser.runtime.getURL('index.html')
    });
  });

  // Show success message
  function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 3000);
  }
});