import { Todo, Comment } from "@/projects/mod.todo/utils/todo-types";
import type { TodoQueryParams } from "@/projects/mod.todo/utils/todo-types";

// In-memory storage simulation (in a real app, this would be a database)
let todosData: Todo[] = [];

// Initialize with sample data
export function initializeTodosData(data: any[]): void {
  // Type-safe conversion of JSON data to Todo objects
  todosData = data.map(todo => ({
    ...todo,
    priority: todo.priority as 'low' | 'medium' | 'high',
    subtasks: todo.subtasks?.map((subtask: any) => ({
      ...subtask,
      priority: subtask.priority as 'low' | 'medium' | 'high'
    })) || [],
    comments: todo.comments || []
  }));
}

// Get all todos
export function getAllTodos(): Todo[] {
  return [...todosData];
}

// Get todos with filtering, sorting, and pagination
export function getTodosWithFilters(params: TodoQueryParams): {
  todos: Todo[];
  count: number;
  page?: number;
  limit?: number;
  totalPages?: number;
} {
  let filteredTodos = [...todosData];

  // Filter by completion status
  if (params.completed !== undefined) {
    filteredTodos = filteredTodos.filter(todo => todo.completed === params.completed);
  }

  // Filter by priority
  if (params.priority) {
    filteredTodos = filteredTodos.filter(todo => todo.priority === params.priority);
  }

  // Filter by assigned user
  if (params.assignedTo) {
    filteredTodos = filteredTodos.filter(todo => 
      todo.assignedTo?.toLowerCase().includes(params.assignedTo!.toLowerCase())
    );
  }

  // Filter by tag
  if (params.tag) {
    filteredTodos = filteredTodos.filter(todo => 
      todo.tags?.some(tag => tag.toLowerCase().includes(params.tag!.toLowerCase()))
    );
  }

  // Search in title and description
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filteredTodos = filteredTodos.filter(todo => 
      todo.title.toLowerCase().includes(searchTerm) ||
      todo.description?.toLowerCase().includes(searchTerm)
    );
  }

  // Sort todos
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder || 'desc';
  
  filteredTodos.sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];

    // Handle priority sorting
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      aValue = priorityOrder[a.priority];
      bValue = priorityOrder[b.priority];
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTodos = filteredTodos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredTodos.length / limit);

  return {
    todos: paginatedTodos,
    count: filteredTodos.length,
    page,
    limit,
    totalPages
  };
}

// Get single todo by ID
export function getTodoById(id: string): Todo | null {
  return todosData.find(todo => todo.id === id) || null;
}

// Create new todo
export function createTodo(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Todo {
  const newTodo: Todo = {
    ...todoData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  todosData.push(newTodo);
  return newTodo;
}

// Update todo (PUT - full update)
export function updateTodo(id: string, updateData: Partial<Todo>): Todo | null {
  const todoIndex = todosData.findIndex(todo => todo.id === id);
  if (todoIndex === -1) return null;

  const updatedTodo: Todo = {
    ...todosData[todoIndex],
    ...updateData,
    id, // Ensure ID doesn't change
    createdAt: todosData[todoIndex].createdAt, // Preserve creation date
    updatedAt: new Date().toISOString()
  };

  todosData[todoIndex] = updatedTodo;
  return updatedTodo;
}

// Patch todo (PATCH - partial update)
export function patchTodo(id: string, patchData: Partial<Todo>): Todo | null {
  const todoIndex = todosData.findIndex(todo => todo.id === id);
  if (todoIndex === -1) return null;

  const updatedTodo: Todo = {
    ...todosData[todoIndex],
    ...patchData,
    id, // Ensure ID doesn't change
    createdAt: todosData[todoIndex].createdAt, // Preserve creation date
    updatedAt: new Date().toISOString()
  };

  todosData[todoIndex] = updatedTodo;
  return updatedTodo;
}

// Delete todo
export function deleteTodo(id: string): Todo | null {
  const todoIndex = todosData.findIndex(todo => todo.id === id);
  if (todoIndex === -1) return null;

  const deletedTodo = todosData[todoIndex];
  todosData.splice(todoIndex, 1);
  return deletedTodo;
}

// Add comment to todo
export function addCommentToTodo(todoId: string, commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Comment | null {
  const todo = getTodoById(todoId);
  if (!todo) return null;

  const newComment: Comment = {
    ...commentData,
    id: generateCommentId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (!todo.comments) {
    todo.comments = [];
  }
  todo.comments.push(newComment);
  
  // Update the todo's updatedAt timestamp
  todo.updatedAt = new Date().toISOString();
  
  return newComment;
}

// Update comment
export function updateComment(todoId: string, commentId: string, message: string): Comment | null {
  const todo = getTodoById(todoId);
  if (!todo || !todo.comments) return null;

  const commentIndex = todo.comments.findIndex(comment => comment.id === commentId);
  if (commentIndex === -1) return null;

  const updatedComment: Comment = {
    ...todo.comments[commentIndex],
    message,
    updatedAt: new Date().toISOString()
  };

  todo.comments[commentIndex] = updatedComment;
  todo.updatedAt = new Date().toISOString();
  
  return updatedComment;
}

// Delete comment
export function deleteComment(todoId: string, commentId: string): Comment | null {
  const todo = getTodoById(todoId);
  if (!todo || !todo.comments) return null;

  const commentIndex = todo.comments.findIndex(comment => comment.id === commentId);
  if (commentIndex === -1) return null;

  const deletedComment = todo.comments[commentIndex];
  todo.comments.splice(commentIndex, 1);
  todo.updatedAt = new Date().toISOString();
  
  return deletedComment;
}

// Utility functions
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function generateCommentId(): string {
  return 'c' + Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

// Validation functions
export function validateTodoData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }

  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Priority must be one of: low, medium, high');
  }

  if (data.completed !== undefined && typeof data.completed !== 'boolean') {
    errors.push('Completed must be a boolean value');
  }

  if (data.dueDate && !isValidDate(data.dueDate)) {
    errors.push('Due date must be a valid ISO date string');
  }

  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array');
  }

  if (data.assignedTo && typeof data.assignedTo !== 'string') {
    errors.push('AssignedTo must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateCommentData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.author || typeof data.author !== 'string' || data.author.trim().length === 0) {
    errors.push('Author is required and must be a non-empty string');
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    errors.push('Message is required and must be a non-empty string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

