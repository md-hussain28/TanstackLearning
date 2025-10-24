import { NextRequest, NextResponse } from "next/server";
import { 
  randomInt, 
  delay, 
  errors, 
  getNetworkDelay, 
  getRandomError, 
  simulatePartialFailure 
} from "@/lib/api-config-utils";
import {
  getTodoById,
  addCommentToTodo,
  updateComment,
  deleteComment,
  validateCommentData
} from "@/lib/todo-utils";
import {
  AddCommentRequest,
  UpdateCommentRequest,
  AddCommentResponse,
  UpdateCommentResponse,
  DeleteCommentResponse
} from "@/projects/mod.todo/utils/todo-types";

// POST /api/todo/[id]/comments - Add a comment to a todo
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
          requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`,
          todoId: params.id
        },
        { status: randomError.status }
      );
    }

    // Simulate comment spam protection
    if (Math.random() < 0.05) {
      return NextResponse.json(
        { 
          error: 'Comment rate limit exceeded', 
          success: false,
          message: 'Too many comments added recently. Please wait before adding another comment.',
          timestamp: new Date().toISOString(),
          retryAfter: 300,
          todoId: params.id
        },
        { status: 429 }
      );
    }

    // Simulate content moderation
    if (Math.random() < 0.03) {
      return NextResponse.json(
        { 
          error: 'Comment rejected by content filter', 
          success: false,
          message: 'Your comment contains content that violates our community guidelines.',
          timestamp: new Date().toISOString(),
          todoId: params.id
        },
        { status: 422 }
      );
    }

    const body = await request.json();
    
    // Validate request data
    const validation = validateCommentData(body);
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

    const commentData: AddCommentRequest = {
      todoId: params.id,
      author: body.author,
      message: body.message
    };

    const newComment = addCommentToTodo(params.id, {
      author: body.author,
      message: body.message
    });
    
    if (!newComment) {
      return NextResponse.json(
        { error: 'Todo not found', success: false },
        { status: 404 }
      );
    }

    const response = {
      data: newComment,
      success: true,
      message: 'Comment added successfully',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`,
      latency: `${networkDelay}ms`,
      todoId: params.id
    } as AddCommentResponse;

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/todo/[id]/comments error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        success: false,
        message: 'An unexpected error occurred while adding the comment',
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`,
        todoId: params.id
      },
      { status: 500 }
    );
  }
}

