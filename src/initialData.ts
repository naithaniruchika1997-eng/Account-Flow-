import { KanbanCard, KanbanColumn, MeetingRecord } from './types';

export const INITIAL_COLUMNS: KanbanColumn[] = [
  { id: 'backlog', title: 'Opportunity & Backlog', color: 'border-l-4 border-l-slate-400 bg-slate-50' },
  { id: 'todo', title: 'To Do / Action Items', color: 'border-l-4 border-l-indigo-500 bg-indigo-50/20' },
  { id: 'progress', title: 'In Progress', color: 'border-l-4 border-l-amber-500 bg-amber-50/20' },
  { id: 'review', title: 'Client Review & Approval', color: 'border-l-4 border-l-rose-500 bg-rose-50/20' },
  { id: 'done', title: 'Done / Completed', color: 'border-l-4 border-l-emerald-500 bg-emerald-50/20' },
];

export const INITIAL_ACCOUNTS = [
  'Acme Corp',
  'Globex Corporation',
  'Stark Industries',
  'Initech Solutions',
  'Tyrell Group',
  'Wayne Enterprises',
];

export const INITIAL_CARDS: KanbanCard[] = [
  {
    id: 'card-1',
    columnId: 'progress',
    title: 'Acme Corp Premium Contract Renewal Review',
    description: 'Review updated pricing tiers, seat expansion proposals, and prepare custom premium pitch deck for the VP of Procurement.',
    accountName: 'Acme Corp',
    priority: 'high',
    dueDate: '2026-06-12',
    assignee: 'Naithan',
    subtasks: [
      { id: 'sub-1', title: 'Prepare custom tiered pricing proposal', completed: true },
      { id: 'sub-2', title: 'Verify client seat usage dashboard', completed: true },
      { id: 'sub-3', title: 'Draft legal addendum draft', completed: false },
    ],
    createdAt: '2026-06-01',
  },
  {
    id: 'card-2',
    columnId: 'todo',
    title: 'Globex Corp Q3 Roadmap Alignment',
    description: 'Schedule a discovery session with Globex directors to review their custom product request and secure Q3 account commitments.',
    accountName: 'Globex Corporation',
    priority: 'medium',
    dueDate: '2026-06-18',
    assignee: 'Ruchika',
    subtasks: [
      { id: 'sub-4', title: 'Send Calendar invite', completed: false },
      { id: 'sub-5', title: 'Gather feedback from product engineering team', completed: false },
    ],
    createdAt: '2026-06-03',
  },
  {
    id: 'card-3',
    columnId: 'review',
    title: 'Stark Industries Security Assessment Sign-off',
    description: 'The Stark IT security department sent a 120-item spreadsheet. Need internal legal approval of the standard data processing agreement.',
    accountName: 'Stark Industries',
    priority: 'high',
    dueDate: '2026-06-10',
    assignee: 'Naithan',
    subtasks: [
      { id: 'sub-6', title: 'Complete question 1-60 security assessment', completed: true },
      { id: 'sub-7', title: 'Complete question 61-120', completed: true },
      { id: 'sub-8', title: 'Get legal officer signature on addendum', completed: false },
    ],
    createdAt: '2026-06-02',
    meetingId: 'meet-1',
  },
  {
    id: 'card-4',
    columnId: 'backlog',
    title: 'Initech Solutions Integration Upsell Pitch',
    description: 'Pitch our premium Zapier/Salesforce automatic integrations during their annual contract checkup.',
    accountName: 'Initech Solutions',
    priority: 'low',
    dueDate: '2026-06-25',
    assignee: 'Ruchika',
    subtasks: [],
    createdAt: '2026-06-05',
  },
  {
    id: 'card-5',
    columnId: 'done',
    title: 'Wayne Enterprises Onboarding Kickoff Briefing',
    description: 'Completed standard executive kickoff presentation. Delivered onboarding guidelines and established technical integrations channels.',
    accountName: 'Wayne Enterprises',
    priority: 'medium',
    dueDate: '2026-06-06',
    assignee: 'Ruchika',
    subtasks: [
      { id: 'sub-9', title: 'Onboard Wayne tech lead to Slack', completed: true },
      { id: 'sub-10', title: 'Upload onboarding materials folder', completed: true },
    ],
    createdAt: '2026-06-01',
    meetingId: 'meet-2',
  },
];

export const INITIAL_MEETINGS: MeetingRecord[] = [
  {
    id: 'meet-1',
    title: 'Stark Security Audit & Data Privacy Alignment',
    date: '2026-06-02',
    accountName: 'Stark Industries',
    attendees: ['Jarvis', 'Naithan', 'Happy Hogan'],
    summary: 'Discussed key concerns about our SaaS data residency rules inside Stark Industries network. \n\n### Key Outcomes:\n- Identified missing answers in security spreadsheet regarding third-party subprocessors.\n- Agreed to sign data processing addendum (DPA) under EU laws.\n- Happy Hogan requested high-level exec summary.',
    rawNotes: 'Stark security audit team represents a strict compliance process. Naithan spoke with Happy Hogan and Jarvis. We explained that we store database files inside highly secure regions. Jarvis requested that we answer rows 60-120 of the Stark vendor checklist. Happy Hogan is ready to get the NDA and DPA signed as soon as our legal advisor provides a signature. Target date is 2026-06-10.',
    actionItems: [
      { title: 'Answer rows 60-120 of security spreadsheet', assignee: 'Naithan', dueDate: '2026-06-09' },
      { title: 'Obtain legal sign-off on Stark DPA', assignee: 'Naithan', dueDate: '2026-06-10' },
    ],
    createdAt: '2026-06-02T10:00:00Z',
  },
  {
    id: 'meet-2',
    title: 'Wayne Enterprises Technical Kickoff',
    date: '2026-06-01',
    accountName: 'Wayne Enterprises',
    attendees: ['Bruce Wayne', 'Lucius Fox', 'Ruchika'],
    summary: 'First official kickoff meeting with Wayne Enterprises technical group. Established core goals of connecting custom internal ERP to our system API. \n\n### Key Outcomes:\n- Lucius approved our standard API schema and sandbox testing parameters.\n- Setup communication channel on Slack for daily integration updates.',
    rawNotes: 'Great session with Lucius Fox and Bruce Wayne. Bruce stepped off early due to external business, but Lucius finalized the integration checklist. Ruchika confirmed standard Slack channel invite has been sent. Lucius confirmed sandbox is ready to receive sample API payloads. All deliverables are complete.',
    actionItems: [
      { title: 'Invite Wayne Tech team to shared Slack workspace', assignee: 'Ruchika', dueDate: '2026-06-03' },
      { title: 'Upload onboarding docs to Wayne Drive folder', assignee: 'Ruchika', dueDate: '2026-06-05' },
    ],
    createdAt: '2026-06-01T15:30:00Z',
  },
];

export const MEETING_TEMPLATES = [
  {
    name: 'Standard Client Kickoff Sync',
    title: 'Kickoff meeting with Acme Corp',
    accountName: 'Acme Corp',
    rawNotes: `Participants: Sarah (VP Acme), Naithan (Account Exec), Ruchika (Product Operations)
Date: Today

General Sync Notes:
We started by greeting Sarah and reviewing the Acme kickoff schedule.
Sarah explained that their absolute highest priority for Q3 is to achieve automated syncs of their client databases to our pipeline dashboard.

Specific Decisions & Tasks:
1. Ruchika will draft the standard product setup roadmap detailed document by tomorrow (2026-06-09) and share the document link via email.
2. Naithan needs to coordinate with technical engineering before Friday (2026-06-12) to verify webhook event payload capacities.
3. Sarah confirmed their engineering lead, Dave, will configure the sandbox webhook endpoints by next Monday (2026-06-15).
4. Ruchika will host a 30-minute training masterclass session for Dave and team on 2026-06-16.`,
  },
  {
    name: 'Quarterly Business Review (QBR)',
    title: 'Globex Corporation QBR Sync',
    accountName: 'Globex Corporation',
    rawNotes: `Participants: Hank Scorpio (Globex CEO), Ruchika, Naithan
Date: Today

We held our regular Quarterly Business Review. Hank Scorpio is extremely happy with the performance of our tool. However, they are looking to purchase 50 additional licenses for their secret research division.

Task Allocations:
1. Naithan will generate a custom custom enterprise license quote with a bulk discount rate by 2026-06-11.
2. Hank Scorpio needs to send over the formal purchase requisition form before 2026-06-15.
3. Ruchika will prepare the master license activation dashboard so the team can login immediately once the procurement team confirms. (Target: 2026-06-14).`,
  },
  {
    name: 'General Urgent Align Sync',
    title: 'Tyrell Group Urgent API Debug Sync',
    accountName: 'Tyrell Group',
    rawNotes: `Participants: Dr. Eldon Tyrell, Naithan, Ruchika
Date: Today

Urgent alignment meeting regarding replication errors. Dr. Tyrell reports that several automation tasks failed to update client records.

Action points decided:
1. Naithan will escalate the high priority replication bug report directly to backend engineering team today (2026-06-08) and follow up hourly.
2. Ruchika will perform a clean manual sync of Tyrell systems records in our admin console by tomorrow (2026-06-09) to prevent data drift.
3. Dr. Tyrell promised to send over their local web server output logs before Friday (2026-06-12).`,
  }
];
