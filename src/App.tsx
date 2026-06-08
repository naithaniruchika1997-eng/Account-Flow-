import React, { useState, useEffect } from 'react';
import { KanbanCard, KanbanColumn, MeetingRecord, Priority, Subtask, ChangeLogEntry } from './types';
import { INITIAL_COLUMNS, INITIAL_ACCOUNTS, INITIAL_CARDS, INITIAL_MEETINGS, MEETING_TEMPLATES } from './initialData';
import CardModal from './components/CardModal';
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Check, 
  CheckSquare, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Trash2, 
  Edit, 
  Briefcase, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  ChevronRight, 
  AlertCircle, 
  Filter, 
  FileText, 
  Layers, 
  Send,
  Loader2,
  Bookmark,
  CheckCircle2,
  HelpCircle,
  FolderPlus
} from 'lucide-react';

export default function App() {
  // --- Persistent States (Load from LocalStorage) ---
  const [accounts, setAccounts] = useState<string[]>(() => {
    const saved = localStorage.getItem('account_flow_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [cards, setCards] = useState<KanbanCard[]>(() => {
    const saved = localStorage.getItem('account_flow_cards');
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [meetings, setMeetings] = useState<MeetingRecord[]>(() => {
    const saved = localStorage.getItem('account_flow_meetings');
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  const [changeLogs, setChangeLogs] = useState<ChangeLogEntry[]>(() => {
    const saved = localStorage.getItem('account_flow_changelog');
    if (saved) return JSON.parse(saved);
    
    // Seed some elegant default audit logs
    const seedLogs: ChangeLogEntry[] = [
      {
        id: 'log-1',
        timestamp: '2026-06-08T13:30:00Z',
        action: 'move_card',
        details: 'Moved milestone "Wayne Enterprises Onboarding Kickoff Briefing" to Completed.',
        clientName: 'Wayne Enterprises',
        cardTitle: 'Wayne Enterprises Onboarding Kickoff Briefing',
        user: 'Ruchika'
      },
      {
        id: 'log-2',
        timestamp: '2026-06-08T11:45:00Z',
        action: 'ai_sync_meeting',
        details: 'Decoded "Stark Security Audit & Data Privacy Alignment" details and published 2 tasks.',
        clientName: 'Stark Industries',
        user: 'Naithan'
      },
      {
        id: 'log-3',
        timestamp: '2026-06-07T16:20:00Z',
        action: 'add_client',
        details: 'New corporate portfolio partner "Tyrell Group" provisioned.',
        clientName: 'Tyrell Group',
        user: 'Naithan'
      },
      {
        id: 'log-4',
        timestamp: '2026-06-06T09:10:00Z',
        action: 'create_card',
        details: 'Created milestone card "Acme Corp Premium Contract Renewal Review".',
        clientName: 'Acme Corp',
        cardTitle: 'Acme Corp Premium Contract Renewal Review',
        user: 'Naithan'
      }
    ];
    return seedLogs;
  });

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('account_flow_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('account_flow_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('account_flow_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('account_flow_changelog', JSON.stringify(changeLogs));
  }, [changeLogs]);

  // Log audit helper
  const logChange = (action: ChangeLogEntry['action'], details: string, clientName?: string, cardTitle?: string) => {
    const newEntry: ChangeLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      clientName,
      cardTitle,
      user: 'Naithan'
    };
    setChangeLogs(prev => [newEntry, ...prev]);
  };

  // --- Active Workspace Filters & View States ---
  const [selectedAccount, setSelectedAccount] = useState<string>('All Accounts');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Custom sidebar status tags (simulating account tier/health indicators)
  const accountHealthColors: Record<string, string> = {
    'Acme Corp': 'bg-emerald-400',
    'Globex Corporation': 'bg-amber-400',
    'Stark Industries': 'bg-indigo-400',
    'Initech Solutions': 'bg-rose-400',
    'Tyrell Group': 'bg-emerald-400',
    'Wayne Enterprises': 'bg-indigo-400'
  };

  const getHealthDot = (name: string) => {
    return accountHealthColors[name] || 'bg-slate-400';
  };

  // --- Modal Edit States ---
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [activeEditingCard, setActiveEditingCard] = useState<KanbanCard | null>(null);

  // --- New Quick Creator Forms ---
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  
  const [inlineAddingColumnId, setInlineAddingColumnId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardAccount, setNewCardAccount] = useState('');

  // --- Live Meeting Center Controller ---
  const [meetingTitle, setMeetingTitle] = useState('Standard Align Sync');
  const [meetingAccount, setMeetingAccount] = useState('Acme Corp');
  const [meetingAttendees, setMeetingAttendees] = useState('Naithan, Ruchika');
  const [meetingRawNotes, setMeetingRawNotes] = useState('');
  const [referenceDate, setReferenceDate] = useState('2026-06-08'); // Baseline Time

  // AI Parser Async state
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiExecutionError, setAiExecutionError] = useState<string | null>(null);
  const [parsedSummary, setParsedSummary] = useState<string>('');
  const [parsedActionItems, setParsedActionItems] = useState<{title: string; assignee: string; dueDate: string}[]>([]);
  const [justParsed, setJustParsed] = useState(false);

  // View Log history sync
  const [activeRightTab, setActiveRightTab] = useState<'minutes' | 'history'>('minutes');
  const [selectedHistoryMeeting, setSelectedHistoryMeeting] = useState<MeetingRecord | null>(null);

  // --- Toast/Status message ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Preset Template loader
  const handleLoadTemplate = (templateName: string) => {
    const template = MEETING_TEMPLATES.find(t => t.name === templateName);
    if (template) {
      setMeetingTitle(template.title);
      setMeetingAccount(template.accountName);
      setMeetingRawNotes(template.rawNotes);
      showToast(`Loaded "${templateName}" blueprint!`);
    }
  };

  // Add new Account Client item
  const handleAddNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newAccountName.trim();
    if (!trimmed) return;
    if (accounts.map(a => a.toLowerCase()).includes(trimmed.toLowerCase())) {
      alert('This client account is already tracked in your portfolio!');
      return;
    }
    const updated = [...accounts, trimmed];
    setAccounts(updated);
    setSelectedAccount(trimmed);
    setNewAccountName('');
    setIsAddingAccount(false);
    logChange('add_client', `New client account "${trimmed}" added to active portfolio list.`, trimmed);
    showToast(`New Account "${trimmed}" provisioned successfully!`);
  };

  // Delete client account and all associated cards
  const handleDeleteAccount = (accName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Dynamic calculation of cards that would be affected
    const linkedCardsCount = cards.filter(c => c.accountName === accName).length;
    const confirmPrompt = `Are you sure you want to delete the client "${accName}"?\n\nThis will permanently remove this client account profile and all ${linkedCardsCount} of their linked project cards from the Kanban board. This action cannot be undone.`;
    
    if (window.confirm(confirmPrompt)) {
      setAccounts(prev => prev.filter(a => a !== accName));
      setCards(prev => prev.filter(c => c.accountName !== accName));
      
      if (selectedAccount === accName) {
        setSelectedAccount('All Accounts');
      }
      
      logChange('delete_client', `Deleted client account profile "${accName}" and purged all ${linkedCardsCount} associated task cards.`, accName);
      showToast(`Client "${accName}" and all linked cards successfully deleted.`);
    }
  };

  // Create real Kanban card from Board controls
  const handleCreateCardInline = (colId: string) => {
    setInlineAddingColumnId(colId);
    setNewCardTitle('');
    // Prefill account if specific account is selected, otherwise default to first available
    setNewCardAccount(selectedAccount !== 'All Accounts' ? selectedAccount : accounts[0] || 'Acme Corp');
  };

  const handleSaveNewCardInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim() || !inlineAddingColumnId) return;

    const newCard: KanbanCard = {
      id: `card-${Date.now()}`,
      columnId: inlineAddingColumnId,
      title: newCardTitle.trim(),
      description: 'Created during active account monitoring overview sync.',
      accountName: newCardAccount,
      priority: 'medium',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], // 5 days out
      assignee: 'Unassigned',
      subtasks: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCards(prev => [newCard, ...prev]);
    setInlineAddingColumnId(null);
    setNewCardTitle('');
    logChange('create_card', `Created new milestone task "${newCard.title}" via inline board injector.`, newCard.accountName, newCard.title);
    showToast(`Task successfully added to ${INITIAL_COLUMNS.find(c => c.id === inlineAddingColumnId)?.title}!`);
  };

  // Trigger call to backend Gemini endpoints to parse minutes
  const handleParseWithGemini = async () => {
    if (!meetingRawNotes.trim()) {
      alert('Please fill out the meeting transcript/notes before parsing!');
      return;
    }

    setIsLoadingAI(true);
    setAiExecutionError(null);
    setJustParsed(false);

    try {
      const response = await fetch('/api/gemini/parse-minutes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawNotes: meetingRawNotes,
          accountName: meetingAccount,
          title: meetingTitle,
          referenceDate: referenceDate
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status code ${response.status}`);
      }

      const parsedData = await response.json();
      
      setParsedSummary(parsedData.summary || 'Minutes Summary extracted successfully.');
      setParsedActionItems(parsedData.actionItems || []);
      setJustParsed(true);
      showToast('Gemini successfully generated meeting summary & task matrix!');
    } catch (err: any) {
      console.error(err);
      setAiExecutionError(err.message || 'Trouble reaching AI server. Verify GEMINI_API_KEY settings.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Sync AI action items into columns as tasks
  const handleSyncActionItemsToBoard = () => {
    if (parsedActionItems.length === 0) return;

    const newGeneratedCards: KanbanCard[] = parsedActionItems.map((item, index) => ({
      id: `ai-card-${Date.now()}-${index}`,
      columnId: 'todo', // Default to To Do
      title: item.title,
      description: `Auto-generated Action Item from meeting "${meetingTitle}" on ${referenceDate}. Attendees: ${meetingAttendees}.`,
      accountName: meetingAccount,
      priority: item.title.toLowerCase().includes('urgent') || item.title.toLowerCase().includes('immediately') ? 'high' : 'medium',
      dueDate: item.dueDate || referenceDate,
      assignee: item.assignee || 'Account Owner',
      subtasks: [],
      createdAt: referenceDate,
      meetingId: `meet-${Date.now()}` // Match to temporary meeting id we will save
    }));

    // Register the meeting in historical record log
    const newMeetingRecord: MeetingRecord = {
      id: `meet-${Date.now()}`,
      title: meetingTitle,
      date: referenceDate,
      accountName: meetingAccount,
      attendees: meetingAttendees.split(',').map(s => s.trim()),
      summary: parsedSummary,
      rawNotes: meetingRawNotes,
      actionItems: parsedActionItems,
      createdAt: new Date().toISOString()
    };

    setMeetings(prev => [newMeetingRecord, ...prev]);
    setCards(prev => [...newGeneratedCards, ...prev]);

    // Reset meeting form
    setMeetingTitle('Standard Align Sync');
    setMeetingRawNotes('');
    setParsedActionItems([]);
    setParsedSummary('');
    setJustParsed(false);

    logChange('ai_sync_meeting', `Decoded sync logs for "${newMeetingRecord.title}" and linked ${newGeneratedCards.length} action cards.`, meetingAccount);
    showToast(`Instantly synced ${newGeneratedCards.length} AI cards into the pipeline board!`);
  };

  // Moving cards via quick arrow / context menu (Simulates dragging for ease inside frames)
  const handleMoveCardStatus = (cardId: string, direction: 'forward' | 'backward') => {
    const activeColumns = INITIAL_COLUMNS;
    setCards(prev => prev.map(card => {
      if (card.id === cardId) {
        const currentIndex = activeColumns.findIndex(c => c.id === card.columnId);
        let nextIndex = currentIndex;
        if (direction === 'forward' && currentIndex < activeColumns.length - 1) {
          nextIndex = currentIndex + 1;
        } else if (direction === 'backward' && currentIndex > 0) {
          nextIndex = currentIndex - 1;
        }
        
        if (currentIndex !== nextIndex) {
          const fromTitle = activeColumns[currentIndex].title;
          const toTitle = activeColumns[nextIndex].title;
          // Defer to prevent side effects back-reporting during active batch state render
          setTimeout(() => {
            logChange('move_card', `Shifted card "${card.title}" from [${fromTitle}] to [${toTitle}]`, card.accountName, card.title);
          }, 0);
        }
        return { ...card, columnId: activeColumns[nextIndex].id };
      }
      return card;
    }));
  };

  // Deep save on single card edit save
  const handleSaveCardModal = (updatedCard: KanbanCard) => {
    setCards(prev => {
      const exists = prev.some(c => c.id === updatedCard.id);
      if (exists) {
        setTimeout(() => {
          logChange('update_card', `Modified card details and subtasks for "${updatedCard.title}"`, updatedCard.accountName, updatedCard.title);
        }, 0);
        return prev.map(c => c.id === updatedCard.id ? updatedCard : c);
      } else {
        setTimeout(() => {
          logChange('create_card', `Created card "${updatedCard.title}" via detail form creator`, updatedCard.accountName, updatedCard.title);
        }, 0);
        return [updatedCard, ...prev];
      }
    });
    showToast(`Task details for "${updatedCard.title.substring(0, 20)}..." verified and updated!`);
  };

  // Delete card from modal or board direct trash button
  const handleDeleteCard = (cardId: string) => {
    const targetCard = cards.find(c => c.id === cardId);
    if (targetCard) {
      logChange('delete_card', `Permanently deleted card "${targetCard.title}" from pipeline board.`, targetCard.accountName, targetCard.title);
    }
    setCards(prev => prev.filter(c => c.id !== cardId));
    showToast(`Project card deleted successfully.`);
  };

  // --- Metrics Engine for the Filtered Scope ---
  const eligibleCards = cards.filter(card => {
    const matchesAccount = selectedAccount === 'All Accounts' || card.accountName === selectedAccount;
    const matchesSearch = searchQuery.trim() === '' || 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      card.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.assignee && card.assignee.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || card.priority === priorityFilter;

    return matchesAccount && matchesSearch && matchesPriority;
  });

  // Calculate high-fidelity portfolio math
  const totalTasksCount = eligibleCards.length;
  const pendingTasks = eligibleCards.filter(c => c.columnId !== 'done');
  const completedTasksCount = eligibleCards.filter(c => c.columnId === 'done').length;

  const urgentAlertsCount = pendingTasks.filter(c => {
    const isOverdue = new Date(c.dueDate) < new Date(referenceDate);
    return c.priority === 'high' || isOverdue;
  }).length;

  // Render visual element styled helper
  function renderMarkdownToHtml(markdown: string) {
    if (!markdown) return null;
    const lines = markdown.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-xs font-semibold text-slate-800 mt-2 mb-1 uppercase tracking-wider">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-sm font-bold text-indigo-900 mt-3 mb-1">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-base font-bold text-slate-900 mt-4 mb-1.5">{line.replace('# ', '')}</h1>;
      }
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const cleanLine = line.trim().replace(/^[-*]\s+/, '');
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5 text-slate-600 text-xs">
            <span className="text-indigo-500 mt-1 shrink-0">•</span>
            <span>{cleanLine}</span>
          </div>
        );
      }
      if (/^\d+\.\s+/.test(line.trim())) {
        const cleanLine = line.trim().replace(/^\d+\.\s+/, '');
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5 text-slate-600 text-xs">
            <span className="text-indigo-600 font-bold mt-0.5 shrink-0">·</span>
            <span>{cleanLine}</span>
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1"></div>;
      }
      return <p key={idx} className="text-xs text-slate-600 leading-relaxed my-0.5">{line}</p>;
    });
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Toast Alert Popups under top header */}
      {toastMessage && (
        <div className="absolute top-16 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-slate-100 rounded-lg shadow-xl text-xs font-medium animate-bounce border border-slate-700/50">
          <Sparkles size={14} className="text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation Header */}
      <nav className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-30">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-base shadow-sm">
              AM
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900">AccountFlow</span>
              <span className="text-[9px] text-slate-400 font-medium leading-none">Elite Sync Platform</span>
            </div>
          </div>
          <div className="flex gap-6 text-xs font-semibold text-slate-500">
            <span className="text-indigo-600 border-b-2 border-indigo-600 h-14 flex items-center gap-1.5 transition-colors cursor-pointer">
              <Layers size={13} /> Dashboard Board & Syncs
            </span>
            <span 
              onClick={() => showToast("Account Master lists are fully manageable in the Left Sidebar!")}
              className="h-14 flex items-center hover:text-slate-800 cursor-pointer gap-1.5 transition-colors"
            >
              <Users size={13} /> Clients List
            </span>
            <span 
              onClick={() => showToast(`Today is simulated as: Monday, June 8th, 2026. Target goals on track!`)}
              className="h-14 flex items-center hover:text-slate-800 cursor-pointer gap-1.5 transition-colors"
            >
              <Clock size={13} /> Roadmap Hub
            </span>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-3">
          
          {/* Quick Search across everything */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Search dashboard cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-100 border-none rounded-full py-1.5 pl-8 pr-4 text-[11px] w-52 placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800 focus:outline-none transition-all"
            />
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center text-[10px] uppercase font-bold text-slate-600" title={localStorage.getItem('ai_user_email') || 'Ruchika'}>
            AM
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar: Accounts Log List */}
        <aside className="w-56 bg-slate-900 text-slate-400 p-4 flex flex-col flex-shrink-0 justify-between">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">My Client Portfolio</h3>
                <button 
                  onClick={() => setIsAddingAccount(!isAddingAccount)}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
                  title="Add new Account client"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add Account Inline Form */}
              {isAddingAccount && (
                <form onSubmit={handleAddNewAccount} className="mb-3 p-2 bg-slate-800 rounded-lg space-y-2 animate-fade-in">
                  <input
                    type="text"
                    required
                    placeholder="E.g., SkyNet Systems"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end gap-1 text-[10px]">
                    <button 
                      type="button" 
                      onClick={() => setIsAddingAccount(false)}
                      className="px-2 py-0.5 text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-indigo-600 hover:bg-indigo-700 px-2 py-0.5 rounded text-white font-medium"
                    >
                      Add
                    </button>
                  </div>
                </form>
              )}

              {/* Accounts Nav Loop */}
              <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar pr-1 pb-1">
                <div
                  onClick={() => setSelectedAccount('All Accounts')}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors font-semibold text-left cursor-pointer ${
                    selectedAccount === 'All Accounts' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-800/45 hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                    Unified View (All)
                  </span>
                  <span className="bg-slate-950 text-slate-300 text-[10px] px-1.5 rounded-full font-bold">
                    {cards.length}
                  </span>
                </div>

                {accounts.map(accName => {
                  const cardCount = cards.filter(c => c.accountName === accName).length;
                  const isSelected = selectedAccount === accName;
                  return (
                    <div
                      key={accName}
                      className={`group w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-all font-medium text-left cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-800 text-white font-bold border-l-2 border-l-indigo-500 pl-2.5' 
                          : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                      onClick={() => setSelectedAccount(accName)}
                    >
                      <div className="flex items-center gap-2 truncate flex-1 min-w-0 mr-1">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getHealthDot(accName)}`}></span>
                        <span className="truncate">{accName}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="bg-slate-950 text-slate-400 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold shrink-0">
                          {cardCount}
                        </span>
                        
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAccount(accName, e)}
                          title={`Delete Client Portfolio: ${accName}`}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-700 text-slate-500 hover:text-rose-400 rounded transition-all shrink-0"
                        >
                          <Trash2 size={11} className="shrink-0" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!isAddingAccount && (
                <button
                  type="button"
                  onClick={() => setIsAddingAccount(true)}
                  className="w-full mt-2 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700/55 rounded text-[10px] font-extrabold tracking-wider text-slate-300 hover:text-white uppercase transition-all flex items-center justify-center gap-1 shadow-2xs"
                >
                  <Plus size={11} />
                  Add New Client
                </button>
              )}
            </div>

            {/* Quick KPI stats in sidebar */}
            <div className="p-3 bg-slate-800/40 rounded-lg space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                TODAY'S CONTEXT
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <Calendar size={13} className="text-indigo-400" />
                <span>June 8, 2026</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
                <span>Account Syncs</span>
                <span className="text-indigo-400 font-bold">Active</span>
              </div>
            </div>
          </div>

          {/* Bottom account Target progress widget from Polish design */}
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">Target Tracking</p>
            <div className="h-1.5 w-full bg-slate-700 rounded-full mb-1">
              <div className="h-full w-[82%] bg-indigo-500 rounded-full"></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-300">
              <span className="font-semibold">$1.23M / $1.5M</span>
              <span className="text-[9px] text-indigo-400 font-bold uppercase">82% Q3</span>
            </div>
          </div>
        </aside>

        {/* Board Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
          
          {/* Dashboard board top action bar */}
          <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0 shadow-sm z-10">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                  <span>💼 {selectedAccount}</span>
                  <span className="text-slate-400 text-xs font-normal normal-case">/ Account Pipeline stage tracker</span>
                </h2>
              </div>
              <p className="text-[11px] text-slate-500">
                Displaying {eligibleCards.length} of {cards.length} corporate milestones inside workflow.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs text-slate-500">
                <span className="px-2 font-semibold">Priority:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-slate-700 focus:outline-none focus:ring-0 mr-1"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">🔴 High Only</option>
                  <option value="medium">🟡 Medium Only</option>
                  <option value="low">🟢 Low Only</option>
                </select>
              </div>

              {/* Add task button */}
              <button 
                onClick={() => {
                  const newCard: KanbanCard = {
                    id: `card-${Date.now()}`,
                    columnId: 'todo',
                    title: 'New Account Review Objective',
                    description: 'Prepare contract checklist, review key renewal scopes, and document outcomes.',
                    accountName: selectedAccount !== 'All Accounts' ? selectedAccount : accounts[0] || 'Acme Corp',
                    priority: 'medium',
                    dueDate: '2026-06-15',
                    assignee: 'Unassigned',
                    subtasks: [],
                    createdAt: '2026-06-08'
                  };
                  setActiveEditingCard(newCard);
                  setIsCardModalOpen(true);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded shadow-sm transition-all flex items-center gap-1 shrink-0"
              >
                <Plus size={13} /> Add Card
              </button>
            </div>
          </div>

          {/* Quick Metrics KPI Ribbons */}
          <div className="grid grid-cols-3 gap-3 px-4 py-3 bg-slate-50/50 border-b border-slate-200">
            <div className="bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="bg-indigo-50 p-2 rounded-full text-indigo-600">
                <Layers size={14} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Card Actions</span>
                <span className="font-bold text-sm text-slate-800">{totalTasksCount} milestones</span>
              </div>
            </div>
            <div className="bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="bg-emerald-50 p-2 rounded-full text-emerald-600">
                <CheckCircle2 size={14} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Completed Delivery</span>
                <span className="font-bold text-sm text-slate-800">
                  {completedTasksCount} / {totalTasksCount} ({totalTasksCount > 0 ? Math.round((completedTasksCount/totalTasksCount)*100) : 0}%)
                </span>
              </div>
            </div>
            <div className="bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="bg-rose-50 p-2 rounded-full text-rose-600">
                <AlertCircle size={14} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Critical Warnings</span>
                <span className="font-bold text-sm text-slate-800">{urgentAlertsCount} urgent</span>
              </div>
            </div>
          </div>

          {/* The Board Workspace */}
          <div className="flex-1 flex gap-4 p-4 overflow-x-auto custom-scrollbar select-none">
            {INITIAL_COLUMNS.map(column => {
              const columnCards = eligibleCards.filter(c => c.columnId === column.id);
              
              return (
                <div key={column.id} className="w-64 flex flex-col flex-shrink-0 bg-slate-100/60 rounded-xl border border-slate-200/50 p-2.5">
                  
                  {/* Column Header */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-1 mb-2.5">
                    <span className="tracking-wide uppercase font-semibold text-slate-500">{column.title}</span>
                    <span className="px-2 py-0.5 bg-white text-slate-700 rounded-full font-bold shadow-xs">
                      {columnCards.length}
                    </span>
                  </div>

                  {/* Add Inline Input Area option */}
                  {inlineAddingColumnId === column.id ? (
                    <form onSubmit={handleSaveNewCardInline} className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs mb-3 space-y-2 animate-fade-in">
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="Milestone action title..."
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                      {selectedAccount === 'All Accounts' && (
                        <select
                          value={newCardAccount}
                          onChange={(e) => setNewCardAccount(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          {accounts.map(a => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      )}
                      <div className="flex justify-end gap-1 text-[10px]">
                        <button 
                          type="button" 
                          onClick={() => setInlineAddingColumnId(null)}
                          className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="bg-indigo-600 text-white hover:bg-indigo-700 px-2 py-0.5 rounded font-bold"
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  ) : null}

                  {/* Column Cards Lists */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-0.5">
                    {columnCards.length === 0 ? (
                      <div className="border border-dashed border-slate-300 py-6 text-center text-[10px] text-slate-400 rounded-lg">
                        Empty Stage
                      </div>
                    ) : (
                      columnCards.map(card => {
                        const calculatedProgress = card.subtasks && card.subtasks.length > 0
                          ? Math.round((card.subtasks.filter(s => s.completed).length / card.subtasks.length) * 100)
                          : null;

                        const isOverdue = new Date(card.dueDate) < new Date(referenceDate) && card.columnId !== 'done';

                        return (
                          <div 
                            key={card.id} 
                            onClick={() => {
                              setActiveEditingCard(card);
                              setIsCardModalOpen(true);
                            }}
                            className={`bg-white p-3 rounded-lg border-l-4 ${
                              card.priority === 'high' 
                                ? 'border-l-rose-500' 
                                : card.priority === 'medium'
                                  ? 'border-l-amber-500'
                                  : 'border-l-indigo-400'
                            } border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition-all duration-150 animate-fade-in group`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider block bg-indigo-50 px-1.5 py-0.2 rounded truncate max-w-[120px]">
                                {card.accountName}
                              </span>
                              
                              {/* Task Stage Mover arrows and quick deletion */}
                              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 bg-slate-50 border border-slate-200 rounded p-0.5 shadow-2xs transition-all relative -top-0.5">
                                <button
                                  type="button"
                                  title="Previous column"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveCardStatus(card.id, 'backward');
                                  }}
                                  disabled={column.id === INITIAL_COLUMNS[0].id}
                                  className="p-1 hover:bg-white rounded text-slate-500 disabled:opacity-20 disabled:hover:bg-transparent text-[9px] leading-none"
                                >
                                  ◀
                                </button>
                                <button
                                  type="button"
                                  title="Next column"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveCardStatus(card.id, 'forward');
                                  }}
                                  disabled={column.id === INITIAL_COLUMNS[INITIAL_COLUMNS.length - 1].id}
                                  className="p-1 hover:bg-white rounded text-slate-500 disabled:opacity-20 disabled:hover:bg-transparent text-[9px] leading-none"
                                >
                                  ▶
                                </button>
                                <button
                                  type="button"
                                  title="Delete card"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Permanently delete card: "${card.title}"?`)) {
                                      handleDeleteCard(card.id);
                                    }
                                  }}
                                  className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-605 rounded transition-all ml-0.5 shrink-0"
                                >
                                  <Trash2 size={11} className="shrink-0 text-slate-500 hover:text-rose-500" />
                                </button>
                              </div>
                            </div>

                            <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                              {card.title}
                            </p>

                            {card.description && (
                              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                                {card.description}
                              </p>
                            )}

                            {/* Checklist Subtask metrics inline */}
                            {calculatedProgress !== null && (
                              <div className="mt-2 text-[10px] flex items-center justify-between gap-2.5 text-slate-500">
                                <span className="flex items-center gap-1 font-medium shrink-0">
                                  <CheckSquare size={10} />
                                  {card.subtasks.filter(s => s.completed).length}/{card.subtasks.length} Checklists
                                </span>
                                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-indigo-500 transition-all rounded-full"
                                    style={{ width: `${calculatedProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Info row */}
                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px]">
                              <span className="text-slate-400 font-bold flex items-center gap-1">
                                <User size={9} /> {card.assignee || 'Unassigned'}
                              </span>
                              <span className={`font-semibold px-1 rounded flex items-center gap-1 ${
                                isOverdue 
                                  ? 'text-rose-600 bg-rose-50 font-bold' 
                                  : 'text-slate-400'
                              }`}>
                                <Calendar size={9} /> 
                                {isOverdue ? 'Overdue: ' : ''}{card.dueDate}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add action task button under stage */}
                  {inlineAddingColumnId !== column.id && (
                    <button
                      type="button"
                      onClick={() => handleCreateCardInline(column.id)}
                      className="mt-2 w-full py-1 border border-dashed border-slate-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-500 transition-all text-center text-xs font-medium flex items-center justify-center gap-1"
                    >
                      <Plus size={12} /> Add Milestone Card
                    </button>
                  )}

                </div>
              );
            })}
          </div>
        </main>

        {/* Right Section: Meeting Center Tabbed panel */}
        <section className="w-80 bg-white border-l border-slate-200 flex flex-col flex-shrink-0 z-20">
          
          {/* Section Header */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-indigo-600" />
              <h3 className="font-extrabold text-xs text-slate-800 tracking-wide uppercase">Meeting Minutes Lab</h3>
            </div>
            
            <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-[9px] font-bold">
              <button
                type="button"
                onClick={() => setActiveRightTab('minutes')}
                className={`px-1.5 py-1 rounded-md transition-colors ${
                  activeRightTab === 'minutes' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
                }`}
              >
                AI Sync
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveRightTab('history');
                  setSelectedHistoryMeeting(null);
                }}
                className={`px-1.5 py-1 rounded-md transition-colors ${
                  activeRightTab === 'history' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
                }`}
              >
                Meetings ({meetings.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveRightTab('changelog');
                }}
                className={`px-1.5 py-1 rounded-md transition-colors ${
                  activeRightTab === 'changelog' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
                }`}
              >
                Logs ({changeLogs.length})
              </button>
            </div>
          </div>

          {/* TAB 1: Minute parsing Lab */}
          {activeRightTab === 'minutes' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Quick Template Loading bar */}
              <div className="p-2 border-b border-slate-100 bg-slate-50 flex flex-col gap-1.5 shrink-0">
                <span className="text-[9px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                  <Bookmark size={9} /> Load Sample Client Notes Template:
                </span>
                <div className="flex gap-1 overflow-x-auto custom-scrollbar no-underline pb-0.5">
                  {MEETING_TEMPLATES.map(t => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => handleLoadTemplate(t.name)}
                      className="bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 px-2 py-0.5 rounded-full text-[9px] text-slate-600 font-semibold transition-colors shrink-0"
                    >
                      {t.name.split(' ').slice(0, 3).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form Fields for Action Syncs */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-3.5">
                
                {/* Simulated live indicators */}
                <div className="flex items-center gap-2 p-2 bg-indigo-50 border border-indigo-100 rounded-lg select-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-[9px] font-bold text-indigo-700 uppercase leading-none">
                    Session Voice Decoder Ready
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">1. Meeting Document Title</label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-slate-50/20 bg-white"
                    placeholder="E.g., Q3 Onboarding sync - Stark Industries"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">2. Client account</label>
                    <select
                      value={meetingAccount}
                      onChange={(e) => setMeetingAccount(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {accounts.map(acc => (
                        <option key={acc} value={acc}>{acc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">3. Recording Date</label>
                    <input
                      type="date"
                      value={referenceDate}
                      onChange={(e) => setReferenceDate(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">4. Attendees Sync</label>
                  <input
                    type="text"
                    value={meetingAttendees}
                    onChange={(e) => setMeetingAttendees(e.target.value)}
                    className="w-full px-2.5 py-1 border border-slate-200 rounded text-xs text-slate-800 focus:none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Comma-separated list"
                  />
                </div>

                {/* Raw notes field */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">
                    5. Raw Meeting Conversation/Logs (To Parse)
                  </label>
                  <textarea
                    rows={6}
                    value={meetingRawNotes}
                    onChange={(e) => setMeetingRawNotes(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded text-xs text-slate-700 bg-slate-50 font-mono placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 custom-scrollbar"
                    placeholder="Paste email transcripts, conversation notes, or transcript lines from the client sync here..."
                  />
                </div>

                {/* AI parsing action buttons */}
                <button
                  type="button"
                  onClick={handleParseWithGemini}
                  disabled={isLoadingAI}
                  className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-900 text-white font-bold rounded-lg text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-40 transition-all"
                >
                  {isLoadingAI ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-indigo-400" />
                      Extricating Agenda with Gemini AI...
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} className="text-yellow-400" />
                      Decode Transcript (Gemini AI)
                    </>
                  )}
                </button>

                {aiExecutionError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2 text-rose-700 text-[11px]">
                    <AlertCircle size={14} className="shrink-0 text-rose-500 mt-0.5" />
                    <div>
                      <p className="font-bold">Process Error</p>
                      <p className="text-[10px] text-rose-600">{aiExecutionError}</p>
                    </div>
                  </div>
                )}

                {/* AI Extracted Output Render panel */}
                {justParsed && (
                  <div className="border border-indigo-100 bg-indigo-50/20 p-3.5 rounded-lg space-y-4 animate-fade-in">
                    
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-800 border-b border-indigo-100/50 pb-1">
                      <Sparkles size={13} className="text-indigo-600 shrink-0" />
                      <span>Extracted Minutes Summary:</span>
                    </div>

                    <div className="space-y-1.5 prose max-w-none text-xs custom-scrollbar max-h-52 overflow-y-auto pr-1">
                      {renderMarkdownToHtml(parsedSummary)}
                    </div>

                    <div className="border-t border-indigo-100/50 pt-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                        <span>Extracted Action Cards:</span>
                        <span className="bg-indigo-100 text-indigo-800 px-1.5 rounded-full text-[10px]">
                          {parsedActionItems.length}
                        </span>
                      </div>

                      <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                        {parsedActionItems.length === 0 ? (
                          <p className="text-[10px] text-slate-400 italic">No specific action milestones found.</p>
                        ) : (
                          parsedActionItems.map((item, id) => (
                            <div key={id} className="bg-white p-2 border border-slate-200/80 rounded-lg text-[11px] space-y-1">
                              <p className="font-bold text-slate-800 leading-tight">📍 {item.title}</p>
                              <div className="flex justify-between text-[10px] font-medium text-slate-500">
                                <span>Owner: {item.assignee || 'Unassigned'}</span>
                                <span>Due: {item.dueDate}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Sync to Pipeline Button */}
                    <button
                      type="button"
                      onClick={handleSyncActionItemsToBoard}
                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle size={12} />
                      Publish & Link Cards on Board
                    </button>

                  </div>
                )}

              </div>

              {/* Next Meetings bottom panel */}
              <div className="p-3 border-t border-slate-100 bg-slate-50 shrink-0">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  Next Alignments
                </span>
                <div className="bg-white p-2 border border-slate-200 rounded-lg flex items-center gap-3">
                  <div className="bg-slate-100 text-[#334155] rounded py-1 px-2 text-center text-xs shrink-0 font-bold border border-slate-200">
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400">Fri</span>
                    <span>12</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">Acme Renewal Strategy Call</p>
                    <p className="text-[9px] text-slate-400 font-medium">02:30 PM • EMEA Sync Room</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Historical Meeting Records Log */}
          {activeRightTab === 'history' && (
            <div className="flex-1 flex flex-col overflow-hidden p-3.5 bg-slate-50/50">
              
              {!selectedHistoryMeeting ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 block">
                    Historical Minutes Records
                  </h4>

                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                    {meetings.length === 0 ? (
                      <div className="p-10 text-center text-xs text-slate-400 italic">
                        No previous historical sync notes stored yet.
                      </div>
                    ) : (
                      meetings.map(m => (
                        <div
                          key={m.id}
                          onClick={() => setSelectedHistoryMeeting(m)}
                          className="bg-white p-3 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded shrink-0">
                              {m.accountName}
                            </span>
                            <span className="text-slate-400 font-semibold">{m.date}</span>
                          </div>
                          
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">
                            {m.title}
                          </p>
                          
                          <p className="text-[10px] text-slate-500 line-clamp-2 italic">
                            "{m.rawNotes.substring(0, 80)}..."
                          </p>

                          <div className="flex justify-between items-center text-[9px] pt-1 border-t border-slate-50">
                            <span className="text-slate-400">Attendees: {m.attendees?.length || 0}</span>
                            <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                              View Summary <ChevronRight size={10} />
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden space-y-3.5">
                  
                  {/* Selected Sync Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <button
                      type="button"
                      onClick={() => setSelectedHistoryMeeting(null)}
                      className="text-xs text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-0.5"
                    >
                      ◀ Back to list
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Are you authorized to delete this permanent meeting record?')) {
                          setMeetings(prev => prev.filter(mt => mt.id !== selectedHistoryMeeting.id));
                          setSelectedHistoryMeeting(null);
                          showToast('Meeting minutes entry deleted.');
                        }
                      }}
                      className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete log"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
                    <div>
                      <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                        {selectedHistoryMeeting.accountName}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-1.5 leading-tight">
                        {selectedHistoryMeeting.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                        Recorded Date: {selectedHistoryMeeting.date}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Attendees:</span>
                      <p className="text-xs text-slate-600 font-medium bg-slate-100 p-2 rounded-lg">
                        {selectedHistoryMeeting.attendees ? selectedHistoryMeeting.attendees.join(', ') : 'None listed'}
                      </p>
                    </div>

                    <div className="space-y-1 bg-white p-3 border border-slate-200 rounded-lg">
                      <span className="text-[9px] font-bold text-indigo-600 uppercase block border-b border-indigo-50 pb-1">
                        Minutes Summary Outcome:
                      </span>
                      <div className="pt-2 text-xs text-slate-600 space-y-1.5">
                        {renderMarkdownToHtml(selectedHistoryMeeting.summary)}
                      </div>
                    </div>

                    {selectedHistoryMeeting.actionItems && selectedHistoryMeeting.actionItems.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">Identified Action Items:</span>
                        <div className="space-y-1">
                          {selectedHistoryMeeting.actionItems.map((act, idx) => (
                            <div key={idx} className="bg-slate-100/70 p-2.5 rounded-lg text-xs flex justify-between gap-2">
                              <div>
                                <p className="font-semibold text-slate-800">✅ {act.title}</p>
                                <p className="text-[10px] text-slate-500">Owner: {act.assignee}</p>
                              </div>
                              <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                                {act.dueDate}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 3: Change History Audit Log */}
          {activeRightTab === 'changelog' && (
            <div className="flex-1 flex flex-col overflow-hidden p-3.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                  Dashboard Change History
                </h4>
                {changeLogs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Clear all change history logs?')) {
                        setChangeLogs([]);
                        showToast('Audit trail history logs cleared.');
                      }
                    }}
                    className="text-[9px] font-bold text-rose-600 hover:text-rose-800 uppercase"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-0.5">
                {changeLogs.length === 0 ? (
                  <div className="p-10 text-center text-xs text-slate-400 italic">
                    No change history logs recorded yet.
                  </div>
                ) : (
                  changeLogs.map(log => {
                    // Decide icon matching based on action
                    let actionIcon = '📝';
                    let badgeColor = 'bg-slate-100 text-slate-600';
                    if (log.action === 'add_client') {
                      actionIcon = '👥';
                      badgeColor = 'bg-emerald-50 border border-emerald-100 text-emerald-800';
                    } else if (log.action === 'delete_client') {
                      actionIcon = '🗑️';
                      badgeColor = 'bg-rose-50 border border-rose-100 text-rose-800';
                    } else if (log.action === 'create_card') {
                      actionIcon = '⚡';
                      badgeColor = 'bg-blue-50 border border-blue-100 text-blue-800';
                    } else if (log.action === 'delete_card') {
                      actionIcon = '🗑️';
                      badgeColor = 'bg-orange-50 border border-orange-100 text-orange-850';
                    } else if (log.action === 'move_card') {
                      actionIcon = '🔄';
                      badgeColor = 'bg-indigo-50 border border-indigo-100 text-indigo-800';
                    } else if (log.action === 'update_card') {
                      actionIcon = '✏️';
                      badgeColor = 'bg-amber-50 border border-amber-100 text-amber-800';
                    } else if (log.action === 'ai_sync_meeting') {
                      actionIcon = '✨';
                      badgeColor = 'bg-purple-100 text-purple-800';
                    } else if (log.action === 'delete_meeting') {
                      actionIcon = '🗑️';
                      badgeColor = 'bg-rose-105 text-rose-800';
                    }

                    // Friendly formatted timestamp
                    const formatTimestamp = (iso: string) => {
                      try {
                        const dateObj = new Date(iso);
                        return dateObj.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false
                        }) + ' ' + dateObj.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        });
                      } catch {
                        return iso;
                      }
                    };

                    return (
                      <div 
                        key={log.id} 
                        className="bg-white p-2.5 rounded-lg border border-slate-205 text-[11px] space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`${badgeColor} px-1.5 py-0.2 rounded text-[8px] font-bold uppercase shrink-0`}>
                            {actionIcon} {log.action.replace('_', ' ')}
                          </span>
                          <span className="text-[8px] text-slate-400 font-mono">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-normal font-medium">
                          {log.details}
                        </p>
                        {log.clientName && (
                          <div className="flex items-center gap-1 text-[9px] text-indigo-600 font-bold bg-slate-50 px-1.5 py-0.5 rounded-md w-fit">
                            <span>Client:</span>
                            <span>{log.clientName}</span>
                          </div>
                        )}
                        <div className="text-[8px] text-slate-400 font-semibold text-right">
                          by {log.user || 'Naithan'}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </section>

      </div>

      {/* Trello Card Detail Modal overlay */}
      <CardModal
        card={activeEditingCard}
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setActiveEditingCard(null);
        }}
        onSave={handleSaveCardModal}
        onDelete={handleDeleteCard}
        accounts={accounts}
        columns={INITIAL_COLUMNS}
        meetings={meetings}
        onOpenMeeting={(meetId) => {
          const matched = meetings.find(m => m.id === meetId);
          if (matched) {
            setActiveRightTab('history');
            setSelectedHistoryMeeting(matched);
            showToast(`Opened linked meeting: ${matched.title}`);
          }
        }}
      />

    </div>
  );
}
