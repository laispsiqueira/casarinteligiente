export enum AppMode {
  CHAT = 'chat',
  PLANNER = 'planner',
  SUPPLIERS = 'suppliers',
  GUESTS = 'guests',
  IMAGES = 'images',
  ACCOUNT = 'account',
  DASHBOARD = 'dashboard'
}

export type UserRole = 'Noivo Free' | 'Noivo+' | 'Assessor' | 'Administrador';

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: number;
  sources?: GroundingSource[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

export interface Guest {
  id: string;
  name: string;
  status: 'Pendente' | 'Confirmado' | 'Recusado';
  notified: boolean;
}

export interface GeneratedAsset {
  id: string;
  type: 'image';
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio?: "1:1" | "16:9" | "9:16";
}

export interface Invoice {
  id: string;
  date: number;
  amount: number;
  status: 'Pago' | 'Pendente' | 'Cancelado';
  planName: string;
  method: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  plan: 'Free' | 'Simplifier' | 'Enterprise';
  avatar?: string;
  createdAt: number;
  weddingDate?: string;
  totalSpent?: number;
}

export interface ClientData {
  id: string;
  coupleNames: string;
  status: 'Ativo' | 'Finalizado';
  contractValue: number;
  nextPayment?: number;
}