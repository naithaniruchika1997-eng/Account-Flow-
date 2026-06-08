export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type Priority = 'low' | 'medium' | 'high';

export interface KanbanCard {
  id: string;
  columnId: string;
  title: string;
  description: string;
  accountName: string; // The client/account this task belongs to
  priority: Priority;
  dueDate: string;
  assignee: string;
  subtasks: Subtask[];
  createdAt: string;
  meetingId?: string; // Optional reference if generated/linked to a meeting
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string; // Tailwind color class e.g., 'bg-slate-100 border-slate-200'
}

export interface MeetingActionItem {
  title: string;
  assignee: string;
  dueDate: string;
}

export interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  accountName: string;
  attendees: string[];
  summary: string;
  rawNotes: string;
  actionItems: MeetingActionItem[];
  createdAt: string;
}

export interface GeminiResponse {
  summary: string;
  actionItems: MeetingActionItem[];
}

export interface ChangeLogEntry {
  id: string;
  timestamp: string;
  action: 'create_card' | 'delete_card' | 'move_card' | 'update_card' | 'add_client' | 'delete_client' | 'ai_sync_meeting' | 'delete_meeting';
  details: string;
  clientName?: string;
  cardTitle?: string;
  user?: string;
}

