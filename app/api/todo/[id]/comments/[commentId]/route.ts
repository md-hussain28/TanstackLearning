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
  updateComment,
  deleteComment,
  validateCommentData
} from "@/lib/todo-utils";
import {
  UpdateCommentRequest,
  UpdateCommentResponse,
  DeleteCommentResponse
} from "@/projects/mod.todo/utils/todo-types";

// PUT /api/todo/[id]/comments/[commentId] - Update a comment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
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
          todoId: params.id,
          commentId: params.commentId
        },
        { status: randomError.status }
      );
    }

    // Simulate comment edit time restrictions
    if (Math.random() < 0.04) {
      return NextResponse.json(
        { 
          error: 'Comment edit time expired', 
          success: false,
          message: 'Comments can only be edited within 5 minutes of creation.',
          timestamp: new Date().toISOString(),
          todoId: params.id,
          commentId: params.commentId
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate request data
    const validation = validateCommentData({ author: 'temp', message: body.message });
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

    const updatedComment = updateComment(params.id, params.commentId, body.message);
    
    if (!updatedComment) {
      return NextResponse.json(
        { error: 'Comment not found', success: false },
        { status: 404 }
      );
    }

    const response = {
      data: updatedComment,
      success: true,
      message: 'Comment updated successfully',
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`,
      latency: `${networkDelay}ms`,
      todoId: params.id,
      commentId: params.commentId
    } as UpdateCommentResponse;

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('PUT /api/todo/[id]/comments/[commentId] error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        success: false,
        message: 'An unexpected error occurred while updating the comment',
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`,
        todoId: params.id,
        commentId: params.commentId
      },
      { status: 500 }
    );
  }
}

// DELETE /api/todo/[id]/comments/[commentId] - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
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
          requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`,
          todoId: params.id,
          commentId: params.commentId
        },
        { status: randomError.status }
      );
    }

    // Simulate comment deletion restrictions
    if (Math.random() < 0.05) {
      return NextResponse.json(
        { 
          error: 'Comment deletion not allowed', 
          success: false,
          message: 'This comment cannot be deleted due to moderation policies.',
          timestamp: new Date().toISOString(),
          todoId: params.id,
          commentId: params.commentId
        },
        { status: 403 }
      );
    }

    const deletedComment = deleteComment(params.id, params.commentId);
    
    if (!deletedComment) {
      return NextResponse.json(
        { error: 'Comment not found', success: false },
        { status: 404 }
      );
    }

    const response = {
      data: {
        deleted: deletedComment,
        message: 'Comment deleted successfully'
      },
      success: true,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`,
      latency: `${networkDelay}ms`,
      todoId: params.id,
      commentId: params.commentId
    } as DeleteCommentResponse;

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/todo/[id]/comments/[commentId] error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        success: false,
        message: 'An unexpected error occurred while deleting the comment',
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${randomInt(1000, 9999)}`,
        todoId: params.id,
        commentId: params.commentId
      },
      { status: 500 }
    );
  }
}

