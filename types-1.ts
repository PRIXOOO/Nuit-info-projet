export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

export interface SystemStat {
  name: string;
  value: number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface MetricPoint {
  time: string;
  value: number;
  value2: number;
}
