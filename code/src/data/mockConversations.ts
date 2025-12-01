import type { ConversationThread } from '@/types/conversation';

/**
 * Mock conversation threads data
 * Past conversations with guests
 */
export const mockConversations: ConversationThread[] = [
  {
    id: 'conv-001',
    reservationId: 'DE_KOB_008_LohrStay_008',
    createdAt: '2025-10-16T11:11:00Z',
    updatedAt: '2025-10-16T19:36:00Z',
    messages: [
      {
        id: 'msg-001',
        senderName: 'Sarah Chen',
        senderRole: 'guest',
        content: 'I just received an update from booking.com that my new card has been validated on the platform, so could I ask you to try once more?',
        timestamp: '2025-10-16T11:11:00Z',
        tag: 'Payment',
      },
      {
        id: 'msg-002',
        senderName: 'Bartholomew L',
        senderRole: 'staff',
        content: "Hi Sarah,\nThanks for the update. We'll retry the payment with your newly validated card now and let you know as soon as we have a result.",
        timestamp: '2025-10-16T11:13:00Z',
        isDone: true,
        doneBy: 'Bartholomew L',
        doneAt: '2025-10-16T17:00:00Z',
      },
      {
        id: 'msg-003',
        senderName: 'Sarah Chen',
        senderRole: 'guest',
        content: 'Hello. Can you confirm that everything is OK?',
        timestamp: '2025-10-16T19:36:00Z',
        tag: 'Problem followup',
      },
    ],
  },
  {
    id: 'conv-002',
    reservationId: 'DE_KOB_008_LohrStay_008',
    createdAt: '2025-10-10T14:20:00Z',
    updatedAt: '2025-10-10T15:45:00Z',
    messages: [
      {
        id: 'msg-004',
        senderName: 'Sarah Chen',
        senderRole: 'guest',
        content: 'Hi! I wanted to ask about early check-in options for my upcoming stay. My flight arrives at 8 AM.',
        timestamp: '2025-10-10T14:20:00Z',
        tag: 'Check-in Request',
      },
      {
        id: 'msg-005',
        senderName: 'Michael Torres',
        senderRole: 'staff',
        content: "Hello Sarah! Thank you for reaching out. Let me check our cleaning schedule and the previous guest's checkout time. I'll get back to you within the hour.",
        timestamp: '2025-10-10T14:35:00Z',
      },
      {
        id: 'msg-006',
        senderName: 'Michael Torres',
        senderRole: 'staff',
        content: "Good news! We can accommodate a 10 AM early check-in for you at no additional charge. The property will be ready by then.",
        timestamp: '2025-10-10T15:45:00Z',
        isDone: true,
        doneBy: 'Michael Torres',
        doneAt: '2025-10-10T15:50:00Z',
      },
    ],
  },
  {
    id: 'conv-003',
    reservationId: 'DE_KOB_008_LohrStay_008',
    createdAt: '2025-09-25T09:15:00Z',
    updatedAt: '2025-09-25T10:30:00Z',
    messages: [
      {
        id: 'msg-007',
        senderName: 'Sarah Chen',
        senderRole: 'guest',
        content: 'I have a question about parking. Is there street parking available near the property, or should I look for a parking garage?',
        timestamp: '2025-09-25T09:15:00Z',
        tag: 'Property Question',
      },
      {
        id: 'msg-008',
        senderName: 'Emma Schmidt',
        senderRole: 'staff',
        content: "Hi Sarah! There is free street parking available right in front of the building. We also have a dedicated parking spot in the building's garage that you can use. The access code will be in your check-in instructions.",
        timestamp: '2025-09-25T10:30:00Z',
        isDone: true,
        doneBy: 'Emma Schmidt',
        doneAt: '2025-09-25T10:35:00Z',
      },
    ],
  },
];


