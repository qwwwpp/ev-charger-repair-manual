export type Language = 'zh' | 'en';

export type ErrorType = '常规停止' | '设备异常' | '车辆异常' | '';

export interface VideoTutorial {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  duration?: string;
  categoryId?: number;
}

export interface ErrorCode {
  id: number;
  code: string;
  description: string;
  errorType: ErrorType;
  cause: string;
  solution: string;
  steps?: RepairStep[];
  videoTutorials?: VideoTutorial[];
}

export interface RepairStep {
  id: number;
  errorCodeId: number;
  stepNumber: number;
  title: string;
  description: string;
  notes?: string;
}

export interface ErrorFilter {
  type: ErrorType | 'all';
  count: number;
}

export interface ErrorTypeStats {
  '常规停止': number;
  '设备异常': number;
  '车辆异常': number;
  total: number;
}
