<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TimeLogController;
use Illuminate\Support\Facades\Route;

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // route CRUD client
    Route::apiResource('clients', ClientController::class);

    // route CRUD project
    Route::apiResource('projects', ProjectController::class);

    // route CRUD task
    Route::apiResource('tasks', TaskController::class);

    // route CRUD time log
    Route::apiResource('time-logs', TimeLogController::class);
});
