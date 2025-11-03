import type { Case } from '@/types';

/**
 * Mock case data with hierarchical task structure
 * Demonstrates real-world scenarios with nested tasks
 */
export const mockCases: Case[] = [
  {
    id: 'TK-2847',
    title: 'Water Leak in Unit A-101 Bathroom',
    description: 'Guest reported water dripping from ceiling in master bathroom. Urgent repair needed before next check-in on Nov 10.',
    status: 'IN_PROGRESS',
    domain: 'PROPERTY',
    propertyId: 'prop-1',
    reservationId: 'res-1',
    assignedTo: 'user-3',
    createdAt: '2025-11-02T08:30:00Z',
    updatedAt: '2025-11-02T14:15:00Z',
    tasks: [
      {
        id: 'TK-2847.1',
        title: 'Emergency inspection and assessment',
        description: 'Inspect ceiling and identify source of leak',
        status: 'DONE',
        assignedTo: 'user-3',
        createdAt: '2025-11-02T08:35:00Z',
        updatedAt: '2025-11-02T10:20:00Z',
        subtasks: [
          {
            id: 'TK-2847.1.1',
            title: 'Check unit above (A-201) for plumbing issues',
            status: 'DONE',
            assignedTo: 'user-3',
            createdAt: '2025-11-02T08:40:00Z',
            updatedAt: '2025-11-02T09:15:00Z',
          },
          {
            id: 'TK-2847.1.2',
            title: 'Document damage with photos',
            status: 'DONE',
            assignedTo: 'user-3',
            createdAt: '2025-11-02T08:40:00Z',
            updatedAt: '2025-11-02T09:45:00Z',
          },
        ],
      },
      {
        id: 'TK-2847.2',
        title: 'Repair plumbing and ceiling',
        description: 'Fix broken pipe in A-201 and repair ceiling damage in A-101',
        status: 'IN_PROGRESS',
        assignedTo: 'user-3',
        createdAt: '2025-11-02T10:25:00Z',
        updatedAt: '2025-11-02T14:15:00Z',
        subtasks: [
          {
            id: 'TK-2847.2.1',
            title: 'Replace damaged pipe section',
            status: 'IN_PROGRESS',
            assignedTo: 'user-3',
            createdAt: '2025-11-02T10:30:00Z',
            updatedAt: '2025-11-02T14:15:00Z',
          },
          {
            id: 'TK-2847.2.2',
            title: 'Dry out ceiling and walls',
            status: 'TODO',
            assignedTo: 'user-3',
            createdAt: '2025-11-02T10:30:00Z',
            updatedAt: '2025-11-02T10:30:00Z',
          },
          {
            id: 'TK-2847.2.3',
            title: 'Patch and repaint ceiling',
            status: 'TODO',
            createdAt: '2025-11-02T10:30:00Z',
            updatedAt: '2025-11-02T10:30:00Z',
          },
        ],
      },
    ],
    comments: [
      {
        id: 'comment-1',
        caseId: 'TK-2847',
        author: 'user-3',
        text: 'Found the issue - broken shower valve in unit above. Need to order replacement part.',
        createdAt: '2025-11-02T09:30:00Z',
      } as const,
      {
        id: 'comment-2',
        caseId: 'TK-2847',
        author: 'user-1',
        text: 'Part ordered with expedited shipping. Should arrive tomorrow morning.',
        createdAt: '2025-11-02T11:45:00Z',
      } as const,
    ],
    attachments: [
      {
        id: 'attach-1',
        caseId: 'TK-2847',
        fileName: 'ceiling-damage-photo.jpg',
        fileType: 'image/jpeg',
        fileSize: 2450000,
        uploadedBy: 'user-3',
        uploadedAt: '2025-11-02T09:50:00Z',
        url: '#',
      } as const,
    ],
  },
  {
    id: 'TK-2848',
    title: 'Guest Refund Request - Cancelled Reservation',
    description: 'Guest Maria Garcia requesting refund for early checkout due to family emergency. Need to process refund and update reservation status.',
    status: 'TODO',
    domain: 'FINANCE',
    propertyId: 'prop-2',
    reservationId: 'res-2',
    assignedTo: 'user-4',
    createdAt: '2025-11-02T13:20:00Z',
    updatedAt: '2025-11-02T13:20:00Z',
    tasks: [
      {
        id: 'TK-2848.1',
        title: 'Review refund policy and calculate amount',
        description: 'Check reservation terms and calculate prorated refund',
        status: 'TODO',
        assignedTo: 'user-4',
        createdAt: '2025-11-02T13:25:00Z',
        updatedAt: '2025-11-02T13:25:00Z',
      },
      {
        id: 'TK-2848.2',
        title: 'Get manager approval for refund',
        status: 'TODO',
        assignedTo: 'user-1',
        createdAt: '2025-11-02T13:25:00Z',
        updatedAt: '2025-11-02T13:25:00Z',
      },
      {
        id: 'TK-2848.3',
        title: 'Process refund transaction',
        description: 'Issue refund through payment gateway',
        status: 'TODO',
        assignedTo: 'user-4',
        createdAt: '2025-11-02T13:25:00Z',
        updatedAt: '2025-11-02T13:25:00Z',
        subtasks: [
          {
            id: 'TK-2848.3.1',
            title: 'Initiate payment reversal',
            status: 'TODO',
            createdAt: '2025-11-02T13:30:00Z',
            updatedAt: '2025-11-02T13:30:00Z',
          },
          {
            id: 'TK-2848.3.2',
            title: 'Send confirmation email to guest',
            status: 'TODO',
            createdAt: '2025-11-02T13:30:00Z',
            updatedAt: '2025-11-02T13:30:00Z',
          },
        ],
      },
    ],
    comments: [
      {
        id: 'comment-3',
        caseId: 'TK-2848',
        author: 'user-2',
        text: 'Guest was very understanding. Family emergency is legitimate - she provided documentation.',
        createdAt: '2025-11-02T13:40:00Z',
      } as const,
    ],
  },
];

