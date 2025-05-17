export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  members: string[];
  statuses: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  dueDate?: string;
  assigneeId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Automation {
  id: string;
  projectId: string;
  name: string;
  trigger: {
    type: 'status_change' | 'assignment' | 'due_date';
    condition: any;
  };
  action: {
    type: 'change_status' | 'assign_badge' | 'send_notification';
    data: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: string;
}