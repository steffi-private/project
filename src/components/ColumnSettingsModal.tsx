import React, { useState } from 'react';
import { X, Palette } from 'lucide-react';
import { Column, TaskStatus } from '../App';

interface ColumnSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  onUpdateColumn: (id: TaskStatus, updates: Partial<Column>) => void;
}

const colorOptions = [
  { name: 'Slate', color: 'text-slate-700', bgColor: 'bg-slate-50' },
  { name: 'Blue', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  { name: 'Indigo', color: 'text-indigo-700', bgColor: 'bg-indigo-50' },
  { name: 'Purple', color: 'text-purple-700', bgColor: 'bg-purple-50' },
  { name: 'Pink', color: 'text-pink-700', bgColor: 'bg-pink-50' },
  { name: 'Red', color: 'text-red-700', bgColor: 'bg-red-50' },
  { name: 'Orange', color: 'text-orange-700', bgColor: 'bg-orange-50' },
  { name: 'Amber', color: 'text-amber-700', bgColor: 'bg-amber-50' },
  { name: 'Yellow', color: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  { name: 'Lime', color: 'text-lime-700', bgColor: 'bg-lime-50' },
  { name: 'Green', color: 'text-green-700', bgColor: 'bg-green-50' },
  { name: 'Emerald', color: 'text-emerald-700', bgColor: 'bg-emerald-50' },
  { name: 'Teal', color: 'text-teal-700', bgColor: 'bg-teal-50' },
  { name: 'Cyan', color: 'text-cyan-700', bgColor: 'bg-cyan-50' },
];

export default function ColumnSettingsModal({ isOpen, onClose, columns, onUpdateColumn }: ColumnSettingsModalProps) {
  const [editingColumns, setEditingColumns] = useState<Column[]>(columns);

  React.useEffect(() => {
    setEditingColumns(columns);
  }, [columns]);

  const handleSave = () => {
    editingColumns.forEach(column => {
      const originalColumn = columns.find(c => c.id === column.id);
      if (originalColumn && (originalColumn.title !== column.title || originalColumn.color !== column.color || originalColumn.bgColor !== column.bgColor)) {
        onUpdateColumn(column.id, {
          title: column.title,
          color: column.color,
          bgColor: column.bgColor,
        });
      }
    });
    onClose();
  };

  const handleCancel = () => {
    setEditingColumns(columns);
    onClose();
  };

  const updateEditingColumn = (id: TaskStatus, updates: Partial<Column>) => {
    setEditingColumns(prev =>
      prev.map(column =>
        column.id === id ? { ...column, ...updates } : column
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Column Settings</h2>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <div className="text-sm text-gray-600 mb-4">
              Customize your column names and colors. You can also drag columns by their grip handle to reorder them on the board.
            </div>

            {editingColumns.map((column) => (
              <div key={column.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-4 h-4 rounded-full ${column.bgColor} border-2 border-current ${column.color}`}></div>
                  <h3 className="font-medium text-gray-900 capitalize">
                    {column.id.replace('-', ' ')} Column
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Column Name
                    </label>
                    <input
                      type="text"
                      value={column.title}
                      onChange={(e) => updateEditingColumn(column.id, { title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter column name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Palette size={16} className="inline mr-1" />
                      Column Color
                    </label>
                    <div className="grid grid-cols-7 gap-2">
                      {colorOptions.map((colorOption) => (
                        <button
                          key={colorOption.name}
                          onClick={() => updateEditingColumn(column.id, {
                            color: colorOption.color,
                            bgColor: colorOption.bgColor,
                          })}
                          className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${colorOption.bgColor} ${
                            column.color === colorOption.color
                              ? 'border-gray-900 scale-110'
                              : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                          }`}
                          title={colorOption.name}
                        >
                          <div className={`w-full h-full rounded-md ${colorOption.color}`}>
                            <div className="w-full h-full bg-current opacity-20 rounded-md"></div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}