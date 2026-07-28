<?php

namespace Database\Seeders;
use App\Models\Task;
use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class TimeLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TimeLog::create([
            'task_id' => Task::where('title', 'Setup Laravel 12 Backend API')->first()->id,
            'user_id' => User::where('name', 'Jhon Full Stack')->first()->id,
            'note' => 'Inisialisasi project dan set up migration database PostgreSQL',
            'logged_hours' => 3.5,
        ]);
    }
}
