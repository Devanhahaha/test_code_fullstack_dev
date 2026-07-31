<?php

namespace App\Http\Controllers\Api\Member;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Member\MemberTaskUpdateRequest;
use App\Http\Resources\Member\MemberTaskResource;
use App\Models\Task;
use Illuminate\Http\Request;

class MemberTaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::with('project.client')
            ->where('assignee_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => MemberTaskResource::collection($tasks),
        ], 200);
    }

    public function update(MemberTaskUpdateRequest $request, Task $task)
    {
        if ($task->assignee_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki akses untuk mengubah task ini.'
            ], 403);
        }

        $task->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Status task berhasil diperbarui',
            'data' => new MemberTaskResource($task->load('project')),
        ], 200);
    }
}
