import type { User } from '@/types';

/**
 * Mock user data for development and testing
 * Represents various roles in the hospitality management system
 */
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@ticketinghub.com',
    role: 'Property Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: 'user-2',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@ticketinghub.com',
    role: 'Guest Communication',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
  },
  {
    id: 'user-3',
    name: 'Emily Watson',
    email: 'emily.watson@ticketinghub.com',
    role: 'Technician',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  },
  {
    id: 'user-4',
    name: 'David Kim',
    email: 'david.kim@ticketinghub.com',
    role: 'Finance',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  },
  {
    id: 'user-5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@ticketinghub.com',
    role: 'Property Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
  },
];

