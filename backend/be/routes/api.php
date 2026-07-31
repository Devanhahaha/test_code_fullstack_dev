<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\Member\MemberTaskController;
use App\Http\Controllers\Api\Member\NotificationController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TimeLogController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // route CRUD client
    Route::apiResource('clients', ClientController::class);

    // route CRUD project
    Route::apiResource('projects', ProjectController::class);
    // route generate task breakdown
    Route::post('projects/{project}/tasks/generate', [ProjectController::class, 'generateTasks']);

    // route CRUD task
    Route::apiResource('tasks', TaskController::class);
    // Endpoint untuk menyimpan sekaligus daftar task yang sudah di-approve dari AI
    Route::post('projects/{project}/tasks/batch', [TaskController::class, 'storeBatch']);

    // route dashboard summary
    Route::get('dashboard/summary', [DashboardController::class, 'summary']);

    // route get data member
    Route::get('/users', [UserController::class, 'index']);
});

Route::prefix('member')->middleware('auth:sanctum')->group(function () {
    Route::get('/tasks', [MemberTaskController::class, 'index']);
    Route::put('/tasks/{task}', [MemberTaskController::class, 'update']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    Route::post('/tasks/{task}/time-logs', [TimeLogController::class, 'store']);
    Route::get('/tasks/{task}/time-logs', [TimeLogController::class, 'index']);
});
