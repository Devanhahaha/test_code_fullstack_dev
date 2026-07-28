<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Task\StoreTaskRequest;
use App\Http\Resources\Task\TaskResource;
use App\Http\Resources\Task\UpdateTaskRequest;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::with(['project.client', 'assignee'])->latest()->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Data Task Berhasil Diambil',
            'data' => TaskResource::collection($tasks), 
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $task = Task::create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Task Berhasil Ditambahkan',
            'data' => new TaskResource($task->load(['project', 'assignee'])),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Detail Task Berhasil Diambil',
            'data' => new TaskResource($task->load(['project', 'assignee'])),
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Task Berhasil Diupdate',
            'data' => new TaskResource($task->load(['project', 'assignee'])),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Task Berhasil Dihapus',
        ], 200);
    }
}
