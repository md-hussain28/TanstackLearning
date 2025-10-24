
// lib/types/todo.types.ts - Enhanced with additional response fields

export interface Comment {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  assignedTo?: string;
  subtasks?: Todo[];
  comments?: Comment[];
  parentId?: string; // For subtasks
}

export interface TodosData {
  todos: Todo[];
}

// Request body types
export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
  assignedTo?: string;
  parentId?: string; // For creating subtasks
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
  assignedTo?: string;
}

export interface PatchTodoRequest {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

export interface AddSubtaskRequest {
  parentId: string;
  subtask: CreateTodoRequest;
}

export interface AddCommentRequest {
  todoId: string;
  author: string;
  message: string;
}

export interface UpdateCommentRequest {
  commentId: string;
  message: string;
}

// Query parameters
export interface TodoQueryParams {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
  timestamp?: string;
  requestId?: string;
  latency?: string;
}

export interface GetTodosResponse extends ApiResponse {
  data: {
    todos: Todo[];
    count: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  todoId?: string;
}

export interface GetTodoResponse extends ApiResponse {
  data: Todo;
  todoId?: string;
}

export interface CreateTodoResponse extends ApiResponse {
  data: Todo;
  todoId?: string;
}

export interface UpdateTodoResponse extends ApiResponse {
  data: Todo;
  todoId?: string;
}

export interface PatchTodoResponse extends ApiResponse {
  data: Todo;
  todoId?: string;
}

export interface DeleteTodoResponse extends ApiResponse {
  data: {
    deleted: Todo;
    message: string;
  };
  todoId?: string;
}

export interface AddCommentResponse extends ApiResponse {
  data: Comment;
  todoId?: string;
  commentId?: string;
}

export interface UpdateCommentResponse extends ApiResponse {
  data: Comment;
  todoId?: string;
  commentId?: string;
}

export interface DeleteCommentResponse extends ApiResponse {
  data: {
    deleted: Comment;
    message: string;
  };
  todoId?: string;
  commentId?: string;
}

// Error types
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
