<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles admin (Spatie)
        $adminRole = Role::create([
            'name' => 'admin',
        ]);

        // Create roles member (Spatie)
        $memberRole = Role::create([
            'name' => 'member',
        ]);

        // Create admin user
        $admin = User::create([
            'name' => 'PM Bilcode',
            'email' => 'admin@bilcode.com',
            'password' => Hash::make('@Password123'),
        ]);
        $admin->assignRole($adminRole);

        // Create member 1 user
        $member1 = User::create([
            'name' => 'Jhon Full Stack',
            'email' => 'fullstack@bilcode.com',
            'password' => Hash::make('@Password123'),
        ]);
        $member1->assignRole($memberRole);

        // Create member 2 user
        $member2 = User::create([
            'name' => 'Siti Designer',
            'email' => 'designer@bilcode.com',
            'password' => Hash::make('@Password123'),
        ]);
        $member2->assignRole($memberRole);
    }
}
