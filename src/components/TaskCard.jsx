import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, CreditCard as Edit3, Trash2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier for the task
 * @property {string} title - Task title
 * @property {string} [description] - Optional task description
 * @property {string} status - Current status of the task
 * @property {string} priority - Task priority level
 * @property {Date} createdAt - Task creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} TaskCardProps
 * @property {Task} task - Task object to display
 * @property {function(string, Partial<Task>): void} onUpdate - Callback for task updates
 * @property {function(string): void} onDelete - Callback for task deletion
 */

const priorityConfig = {
  low: { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle2 },
  medium: { color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock },
  high: { color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle },
};

/**
 * TaskCard component for displaying individual tasks
 * @param {TaskCardProps} props - Component props
 * @returns {JSX.Element}
 */
export default function TaskCard({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [showMenu, setShowMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  /**
   * Handle saving edited task
   */
  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
    }
    setIsEditing(false);
  };

  /**
   * Handle canceling edit mode
   */
  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  /**
   * Handle keyboard events during editing
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const PriorityIcon = priorityConfig[task.priority].icon;

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white rounded-xl p-4 shadow-lg border-2 border-blue-300 opacity-50"
      >
        <div className="h-20"></div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group"
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Task title..."
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Task description..."
            rows={2}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-full ${priorityConfig[task.priority].bg}`}>
                <PriorityIcon size={12} className={priorityConfig[task.priority].color} />
              </div>
              <span className={`text-xs font-medium ${priorityConfig[task.priority].color}`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <MoreVertical size={16} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-200"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 leading-tight">
              {task.title}
            </h4>
            {task.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Created {task.createdAt.toLocaleDateString()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
