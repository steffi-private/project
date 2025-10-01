import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';
import { Column, Task } from '../App';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export default function KanbanColumn({ column, tasks, onUpdateTask, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setSortableNodeRef}
        style={style}
        className="w-80 opacity-50 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300"
      >
        <div className="h-96"></div>
      </div>
    );
  }

  return (
    <div
      ref={setSortableNodeRef}
      style={style}
      className="flex flex-col h-full"
    >
      {/* Column Header */}
      <div className={`${column.bgColor} rounded-xl p-4 mb-4 border-2 border-transparent ${
        isOver ? 'border-blue-300 bg-blue-100' : ''
      } transition-all duration-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/50 transition-colors duration-200"
            >
              <GripVertical size={16} className={column.color} />
            </div>
            <h3 className={`font-semibold text-lg ${column.color}`}>
              {column.title}
            </h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${column.color} ${column.bgColor} border`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[200px] rounded-xl p-4 transition-all duration-200 ${
          isOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : 'bg-white/50 border-2 border-dashed border-gray-200'
        }`}
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2 opacity-50">📋</div>
                <p className="text-gray-500 text-sm">
                  {column.id === 'todo' ? 'Add your first task!' : `No ${column.title.toLowerCase()} tasks`}
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}