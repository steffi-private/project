import { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { storageHelpers } from './utils/storage';
import KanbanColumn from './components/KanbanColumn';
import TaskCard from './components/TaskCard';
import AddTaskModal from './components/AddTaskModal';
import ColumnSettingsModal from './components/ColumnSettingsModal';

/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier for the task
 * @property {string} title - Task title
 * @property {string} [description] - Optional task description
 * @property {TaskStatus} status - Current status of the task
 * @property {Priority} priority - Task priority level
 * @property {Date} createdAt - Task creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {'todo' | 'in-progress' | 'review' | 'done'} TaskStatus
 */

/**
 * @typedef {'low' | 'medium' | 'high'} Priority
 */

/**
 * @typedef {Object} Column
 * @property {TaskStatus} id - Column identifier
 * @property {string} title - Column display name
 * @property {string} color - Text color class
 * @property {string} bgColor - Background color class
 */

const defaultColumns = [
  { id: 'todo', title: 'To Do', color: 'text-slate-700', bgColor: 'bg-slate-50' },
  { id: 'in-progress', title: 'In Progress', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  { id: 'review', title: 'Review', color: 'text-amber-700', bgColor: 'bg-amber-50' },
  { id: 'done', title: 'Done', color: 'text-green-700', bgColor: 'bg-green-50' },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState(defaultColumns);
  const [activeTask, setActiveTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedTasks = await storageHelpers.getTasks();
        setTasks(savedTasks);

        const savedColumns = await storageHelpers.getColumns();
        if (savedColumns) {
          setColumns(savedColumns);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    storageHelpers.saveTasks(tasks);
  }, [tasks]);

  // Save columns to localStorage whenever columns change
  useEffect(() => {
    storageHelpers.saveColumns(columns);
  }, [columns]);

  /**
   * Add a new task to the board
   * @param {Omit<Task, 'id' | 'createdAt' | 'updatedAt'>} taskData - Task data without auto-generated fields
   */
  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks(prev => [newTask, ...prev]);
  };

  /**
   * Update an existing task
   * @param {string} id - Task ID to update
   * @param {Partial<Task>} updates - Partial task data to update
   */
  const updateTask = (id, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  /**
   * Delete a task by ID
   * @param {string} id - Task ID to delete
   */
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  /**
   * Handle drag start event
   * @param {Object} event - Drag start event
   */
  const handleDragStart = (event) => {
    const task = tasks.find(t => t.id === event.active.id);
    const column = columns.find(c => c.id === event.active.id);

    if (task) {
      setActiveTask(task);
    } else if (column) {
      setActiveColumn(column);
    }
  };

  /**
   * Handle drag end event
   * @param {Object} event - Drag end event
   */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    setActiveColumn(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if we're dragging a column
    if (columns.some(col => col.id === activeId)) {
      const activeIndex = columns.findIndex(col => col.id === activeId);
      const overIndex = columns.findIndex(col => col.id === overId);

      if (activeIndex !== overIndex) {
        const newColumns = [...columns];
        const [removed] = newColumns.splice(activeIndex, 1);
        newColumns.splice(overIndex, 0, removed);
        setColumns(newColumns);
      }
      return;
    }

    // Handle task dragging
    const taskId = activeId;
    const newStatus = overId;

    if (columns.some(col => col.id === newStatus)) {
      updateTask(taskId, { status: newStatus });
    }
  };

  /**
   * Get tasks filtered by status
   * @param {TaskStatus} status - Status to filter by
   * @returns {Task[]} Filtered tasks
   */
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  /**
   * Update column properties
   * @param {TaskStatus} id - Column ID to update
   * @param {Partial<Column>} updates - Partial column data to update
   */
  const updateColumn = (id, updates) => {
    setColumns(prev =>
      prev.map(column =>
        column.id === id ? { ...column, ...updates } : column
      )
    );
  };

  /**
   * Get task statistics
   * @returns {Object} Task statistics object
   */
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'done').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const inReview = tasks.filter(task => task.status === 'review').length;

    return { total, completed, inProgress, inReview };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Board</h1>
              <p className="text-gray-600">Organize your tasks and track progress</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsColumnSettingsOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Settings size={18} />
                Columns
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Add Task
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-amber-600">{stats.inReview}</div>
              <div className="text-sm text-gray-600">In Review</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={getTasksByStatus(column.id)}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 opacity-90">
                <TaskCard
                  task={activeTask}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                />
              </div>
            ) : activeColumn ? (
              <div className="w-80 opacity-90">
                <KanbanColumn
                  column={activeColumn}
                  tasks={getTasksByStatus(activeColumn.id)}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddTask={addTask}
        />

        {/* Column Settings Modal */}
        <ColumnSettingsModal
          isOpen={isColumnSettingsOpen}
          onClose={() => setIsColumnSettingsOpen(false)}
          columns={columns}
          onUpdateColumn={updateColumn}
        />
      </div>
    </div>
  );
}

export default App;
