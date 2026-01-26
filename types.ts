
export enum AppMode {
  CHAT = 'chat',
  PLANNER = 'planner',
  SUPPLIERS = 'suppliers',
  GUESTS = 'guests'
}

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

// Added GeneratedAsset interface to resolve errors in ImageSection and VideoSection
export interface GeneratedAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio?: "1:1" | "16:9" | "9:16";
}
