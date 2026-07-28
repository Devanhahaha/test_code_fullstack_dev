<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Project::create([
            'client_id' => Client::where('name', 'Andi Wijaya')->first()->id,
            'name' => 'ProjectPulse Platform Development',
            'deadline' => now()->addDays(30),
            'status'=> 'in_progress',
        ]);
    }
}
