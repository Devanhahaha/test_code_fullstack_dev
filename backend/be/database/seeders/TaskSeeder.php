<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Task::create([
            'project_id' => Project::where('name', 'ProjectPulse Platform Development')->first()->id,
            'assignee_id' => User::where('name', 'Jhon Full Stack')->first()->id,
            'title' => 'Setup Laravel 12 Backend API',
            'description' => 'Konfigurasi authentication Sanctum & Spatie Permission',
            'deadline' => now()->addDays(3),
            'status' => 'in_progress',
        ]);
    }
}
