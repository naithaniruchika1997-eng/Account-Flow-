import React, { useState, useEffect } from 'react';
import { KanbanCard, Priority, Subtask } from '../types';
import { X, Calendar, User, Trash2, CheckSquare, Plus, ArrowRight, Link, Briefcase } from 'lucide-react';

interface CardModalProps {
  card: KanbanCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCard: KanbanCard) => void;
  onDelete: (cardId: string) => void;
  accounts: string[];
  columns: { id: string; title: string }[];
  meetings: { id: string; title: string }[];
  onOpenMeeting?: (meetingId: string) => void;
}

export default function CardModal({
  card,
  isOpen,
  onClose,
  onSave,
  onDelete,
  accounts,
  columns,
  meetings,
  onOpenMeeting,
}: CardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accountName, setAccountName] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [columnId, setColumnId] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Sync state when card changes
  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setAccountName(card.accountName);
      setPriority(card.priority);
      setDueDate(card.dueDate);
      setAssignee(card.assignee || 'Unassigned');
      setColumnId(card.columnId);
      setSubtasks(card.subtasks || []);
    }
  }, [card]);

  if (!isOpen || !card) return null;

  const handleSave = () => {
    onSave({
      ...card,
      title,
      description,
      accountName,
      priority,
      dueDate,
      assignee,
      columnId,
      subtasks,
    });
    onClose();
  };

  const toggleSubtask = (subId: string) => {
    const updated = subtasks.map(s => (s.id === subId ? { ...s, completed: !s.completed } : s));
    setSubtasks(updated);
  };

  const addSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSub: Subtask = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const removeSubtask = (subId: string) => {
    setSubtasks(subtasks.filter(s => s.id !== subId));
  };

  const linkedMeeting = meetings.find(m => m.id === card.meetingId);

  return (
    <div id="card-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-slate-500" />
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Account Task Details
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            title="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-4 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          
          {/* Card Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              placeholder="e.g. Schedule onboarding session"
            />
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Associated Account/Client */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Client Account</label>
              <select
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {accounts.map(acc => (
                  <option key={acc} value={acc}>{acc}</option>
                ))}
              </select>
            </div>

            {/* Column / Stage Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Pipeline Column</label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {columns.map(col => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <User size={13} /> Owner / Assignee
              </label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Assignee name"
              />
            </div>

            {/* Target Due Date */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Calendar size={13} /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Priority Select */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Priority Level</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as Priority[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-medium capitalize transition-all ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold ring-2 ring-rose-300/30'
                          : p === 'medium'
                            ? 'bg-amber-50 border-amber-300 text-amber-700 font-semibold ring-2 ring-amber-300/30'
                            : 'bg-slate-100 border-slate-300 text-slate-700 font-semibold ring-2 ring-slate-300/30'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Linked Meeting */}
            {linkedMeeting && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <Link size={13} /> Originated From Meeting
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenMeeting) {
                      onOpenMeeting(card.meetingId!);
                      onClose();
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-indigo-100 rounded-lg text-xs text-indigo-600 font-medium flex items-center gap-2 hover:text-indigo-800 transition-colors text-left"
                >
                  <span className="flex-1 truncate">📄 {linkedMeeting.title}</span>
                  <ArrowRight size={14} className="shrink-0" />
                </button>
              </div>
            )}

          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Task Notes / Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 custom-scrollbar"
              placeholder="Provide a detailed objective for this task..."
            />
          </div>

          {/* Checklist / Subtasks */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold flex items-center gap-1.5 text-slate-700">
                <CheckSquare size={16} className="text-slate-500" /> 
                Subtask Checklist ({subtasks.filter(s => s.completed).length}/{subtasks.length})
              </h4>
            </div>

            {/* ProgressBar */}
            {subtasks.length > 0 && (
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${(subtasks.filter(s => s.completed).length / subtasks.length) * 100}%` }}
                />
              </div>
            )}

            {/* Subtask list */}
            <div className="space-y-2 pt-1 max-h-40 overflow-y-auto custom-scrollbar">
              {subtasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No checklist items added yet.</p>
              ) : (
                subtasks.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between gap-3 px-3 py-2 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors">
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => toggleSubtask(sub.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs select-none truncate ${sub.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {sub.title}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeSubtask(sub.id)}
                      className="text-slate-400 hover:text-rose-500 focus:outline-none transition-colors"
                      title="Delete checklist item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={addSubtask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask checklist item..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Plus size={14} /> Add
              </button>
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you authorized and sure you want to delete this task card?')) {
                onDelete(card.id);
                onClose();
              }
            }}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-rose-600 hover:text-white border border-rose-200 hover:bg-rose-600 rounded-lg transition-colors"
            title="Delete this task completely"
          >
            <Trash2 size={13} />
            Delete Card
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
