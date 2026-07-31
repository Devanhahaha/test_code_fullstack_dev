<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TimeLog\StoreTimeLogRequest;
use App\Http\Resources\TimeLog\TimeLogResource;
use App\Http\Resources\TimeLog\UpdateTimeLogRequest;
use App\Models\Task;
use App\Models\TimeLog;

class TimeLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $timeLogs = TimeLog::with(['task', 'user'])->latest()->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Data Time Log Berhasil Diambil',
            'data' => TimeLogResource::collection($timeLogs)
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTimeLogRequest $request, $taskId)
    {
        $task = Task::where('id', $taskId)->firstOrFail();

        $timeLog = TimeLog::create([
            'task_id' => $task->id,
            'user_id' => $request->user()->id,
            'note' => $request->note,
            'logged_hours' => $request->logged_hours,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Time log berhasil ditambahkan',
            'data' => $timeLog
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TimeLog $timeLog)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Detail Time Log Berhasil Diambil',
            'data' => new TimeLogResource($timeLog->load(['task', 'user']))
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTimeLogRequest $request, TimeLog $timeLog)
    {
        $timeLog->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Time Log Berhasil Diupdate',
            'data' => new TimeLogResource($timeLog->load(['task', 'user']))
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TimeLog $timeLog)
    {
        $timeLog->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Time Log Berhasil Dihapus'
        ], 200);
    }
}
