export interface Deal {
  id: string;
  name: string;
  sku: string;
  apartmentSku: string;
  status: 'signed' | 'listing-units' | 'live';
  value: number;
  currency: string;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  expectedCloseDate: string;
  owner: string;
}
