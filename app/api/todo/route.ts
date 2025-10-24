import { NextRequest, NextResponse } from "next/server";
import { 
  randomInt, 
  delay, 
  errors, 
  getNetworkDelay, 
  getRandomError, 
  simulatePartialFailure,
  simulateDataCorruption 
} from "@/lib/api-config-utils";
import todoData from "@/projects/mod.todo/utils/todo.json";
import {
  initializeTodosData,
  getAllTodos,
  getTodosWithFilters,
  getTodoById,
  createTodo,
  updateTodo,
  patchTodo,
  deleteTodo,
  validateTodoData
} from "@/lib/todo-utils";
import type { TodoQueryParams } from "@/projects/mod.todo/utils/todo-types";
import {
  CreateTodoRequest,
  UpdateTodoRequest,
  PatchTodoRequest,
  GetTodosResponse,
  GetTodoResponse,
  CreateTodoResponse,
  UpdateTodoResponse,
  PatchTodoResponse,
  DeleteTodoResponse,
  ApiResponse
} from "@/projects/mod.todo/utils/todo-types";

// Initialize data on module load
initializeTodosData(todoData.todos);

// GET /api/todo - Get all todos with optional filtering, sorting, and pagination
export async function GET(request: NextRequest) {
  try {
    // Simulate realistic network latency for read operations
    const networkDelay = getNetworkDelay('read');
    await delay(networkDelay);

    // Simulate random errors based on operation type
    const randomError = getRandomError('read');
    if (randomError) {
      return NextResponse.json(
        { 
          error: randomError.message, 
          success: false,
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`
        },
        { status: randomError.status }
      );
    }

    // Simulate partial failure (some data missing)
    if (simulatePartialFailure()) {
      return NextResponse.json(
        { 
          error: 'Partial data retrieval failed', 
          success: false,
          message: 'Some todos could not be retrieved due to temporary issues',
          timestamp: new Date().toISOString()
        },
        { status: 206 } // Partial Content
      );
    }

    // Simulate data corruption
    if (simulateDataCorruption()) {
      return NextResponse.json(
        { 
          error: 'Data integrity check failed', 
          success: false,
          message: 'Data corruption detected, please retry',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const queryParams: TodoQueryParams = {
      completed: searchParams.get('completed') === 'true' ? true : 
                 searchParams.get('completed') === 'false' ? false : undefined,
      priority: searchParams.get('priority') as 'low' | 'medium' | 'high' || undefined,
      assignedTo: searchParams.get('assignedTo') || undefined,
      tag: searchParams.get('tag') || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      sortBy: (searchParams.get('sortBy') as 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title') || undefined,
      sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || undefined,
    };

    const result = getTodosWithFilters(queryParams);
    
    const response: GetTodosResponse = {
      data: result,
      success: true,
      message: `Found ${result.count} todos`,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`,
      latency: `${networkDelay}ms`
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('GET /api/todo error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        success: false,
        message: 'An unexpected error occurred while processing your request',
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`
      },
      { status: 500 }
    );
  }
}

// POST /api/todo - Create a new todo
export async function POST(request: NextRequest) {
  try {
    // Simulate realistic network latency for write operations
    const networkDelay = getNetworkDelay('write');
    await delay(networkDelay);

    // Simulate random errors based on operation type
    const randomError = getRandomError('write');
    if (randomError) {
      return NextResponse.json(
        { 
          error: randomError.message, 
          success: false,
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`
        },
        { status: randomError.status }
      );
    }

    // Simulate database connection issues
    if (Math.random() < 0.08) {
      return NextResponse.json(
        { 
          error: 'Database connection failed', 
          success: false,
          message: 'Unable to connect to the database. Please try again.',
          timestamp: new Date().toISOString(),
          retryAfter: 30
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    
    // Validate request data
    const validation = validateTodoData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors,
          success: false 
        },
        { status: 400 }
      );
    }

    const createData: CreateTodoRequest = {
      title: body.title,
      description: body.description,
      priority: body.priority || 'medium',
      dueDate: body.dueDate,
      tags: body.tags,
      assignedTo: body.assignedTo,
      parentId: body.parentId
    };

    const newTodo = createTodo({
      title: createData.title,
      description: createData.description,
      priority: createData.priority || 'medium',
      dueDate: createData.dueDate,
      tags: createData.tags,
      assignedTo: createData.assignedTo,
      completed: false,
      subtasks: [],
      comments: []
    });

    const response: CreateTodoResponse = {
      data: newTodo,
      success: true,
      message: 'Todo created successfully',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`,
      latency: `${networkDelay}ms`
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/todo error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        success: false,
        message: 'An unexpected error occurred while creating the todo',
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`
      },
      { status: 500 }
    );
  }
}

// PUT /api/todo - Update a todo (full update)
export async function PUT(request: NextRequest) {
  try {
    // Simulate realistic network latency for write operations
    const networkDelay = getNetworkDelay('write');
    await delay(networkDelay);

    // Simulate random errors based on operation type
    const randomError = getRandomError('write');
    if (randomError) {
      return NextResponse.json(
        { 
          error: randomError.message, 
          success: false,
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`
        },
        { status: randomError.status }
      );
    }

    // Simulate optimistic locking conflicts
    if (Math.random() < 0.06) {
      return NextResponse.json(
        { 
          error: 'Resource was modified by another user', 
          success: false,
          message: 'The todo has been updated by another user. Please refresh and try again.',
          timestamp: new Date().toISOString(),
          conflictId: `conflict_${Date.now()}`
        },
        { status: 409 }
      );
    }

    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Todo ID is required for update', success: false },
        { status: 400 }
      );
    }

    // Validate request data
    const validation = validateTodoData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors,
          success: false 
        },
        { status: 400 }
      );
    }

    const updateData: UpdateTodoRequest = {
      title: body.title,
      description: body.description,
      completed: body.completed,
      priority: body.priority,
      dueDate: body.dueDate,
      tags: body.tags,
      assignedTo: body.assignedTo
    };

    const updatedTodo = updateTodo(body.id, updateData);
    
    if (!updatedTodo) {
      return NextResponse.json(
        { error: 'Todo not found', success: false },
        { status: 404 }
      );
    }

    const response: UpdateTodoResponse = {
      data: updatedTodo,
      success: true,
      message: 'Todo updated successfully',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`,
      latency: `${networkDelay}ms`
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('PUT /api/todo error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        success: false,
        message: 'An unexpected error occurred while updating the todo',
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`
      },
      { status: 500 }
    );
  }
}

// PATCH /api/todo - Update a todo (partial update)
export async function PATCH(request: NextRequest) {
  try {
    // Simulate realistic network latency for write operations
    const networkDelay = getNetworkDelay('write');
    await delay(networkDelay);

    // Simulate random errors based on operation type
    const randomError = getRandomError('write');
    if (randomError) {
      return NextResponse.json(
        { 
          error: randomError.message, 
          success: false,
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`
        },
        { status: randomError.status }
      );
    }

    // Simulate rate limiting
    if (Math.random() < 0.04) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          success: false,
          message: 'Too many requests. Please wait before trying again.',
          timestamp: new Date().toISOString(),
          retryAfter: 60
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Todo ID is required for update', success: false },
        { status: 400 }
      );
    }

    const patchData: PatchTodoRequest = {
      completed: body.completed,
      priority: body.priority,
      assignedTo: body.assignedTo
    };

    const updatedTodo = patchTodo(body.id, patchData);
    
    if (!updatedTodo) {
      return NextResponse.json(
        { error: 'Todo not found', success: false },
        { status: 404 }
      );
    }

    const response: PatchTodoResponse = {
      data: updatedTodo,
      success: true,
      message: 'Todo updated successfully',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`,
      latency: `${networkDelay}ms`
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('PATCH /api/todo error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        success: false,
        message: 'An unexpected error occurred while updating the todo',
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`
      },
      { status: 500 }
    );
  }
}

// DELETE /api/todo - Delete a todo
export async function DELETE(request: NextRequest) {
  try {
    // Simulate realistic network latency for delete operations
    const networkDelay = getNetworkDelay('delete');
    await delay(networkDelay);

    // Simulate random errors based on operation type
    const randomError = getRandomError('delete');
    if (randomError) {
      return NextResponse.json(
        { 
          error: randomError.message, 
          success: false,
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`
        },
        { status: randomError.status }
      );
    }

    // Simulate cascade delete issues
    if (Math.random() < 0.05) {
      return NextResponse.json(
        { 
          error: 'Cannot delete todo with dependencies', 
          success: false,
          message: 'This todo has subtasks or comments that must be deleted first.',
          timestamp: new Date().toISOString(),
          dependencies: ['subtasks', 'comments']
        },
        { status: 409 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required for deletion', success: false },
        { status: 400 }
      );
    }

    const deletedTodo = deleteTodo(id);
    
    if (!deletedTodo) {
      return NextResponse.json(
        { error: 'Todo not found', success: false },
        { status: 404 }
      );
    }

    const response: DeleteTodoResponse = {
      data: {
        deleted: deletedTodo,
        message: 'Todo deleted successfully'
      },
      success: true,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`,
      latency: `${networkDelay}ms`
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/todo error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        success: false,
        message: 'An unexpected error occurred while deleting the todo',
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`
      },
      { status: 500 }
    );
  }
}
