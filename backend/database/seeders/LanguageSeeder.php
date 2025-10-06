<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Language::insert([
            [
                'name' => 'English',
                'status' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Spanish',
                'status' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'French',
                'status' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Hindi',
                'status' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
