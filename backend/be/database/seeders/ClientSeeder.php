<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Client::create([
            'name' => 'Andi Wijaya',
            'contact' => '081234567890',
            'company' => 'PT Technology Nusantara',
        ]);
    }
}
