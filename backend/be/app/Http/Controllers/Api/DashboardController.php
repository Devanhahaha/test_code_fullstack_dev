<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

class DashboardController extends Controller
{
    public function summary () {

        // hitung project aktif
        $activeProjectCount = Project::where('status', 'in_progress')->count();

        // Hitung Task Overdue (Deadline lewat hari ini & belum selesai)
        $overdueTaskCount = Task::where('deadline', '<', now()->toDateString())
            ->where('status', '!=', 'completed')
            ->count();

        // Workload per Anggota (Jumlah task aktif yang sedang ditangani user role member)
        $workload = User::role('member')->withCount(['assignedTasks as pending_tasks_count' => function ($query) {
            $query->where('status', '!=', 'completed');
        }])->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'pending_tasks_count' => $user->pending_tasks_count,
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Data Dashboard Summary Berhasil Diambil',
            'data' => [
                'active_project_count' => $activeProjectCount,
                'overdue_task_count' => $overdueTaskCount,
                'workload_per_member' => $workload,
            ]
        ], 200);
    }
}
