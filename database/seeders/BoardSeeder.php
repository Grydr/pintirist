<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Board;
use App\Models\Pin;
use Illuminate\Database\Seeder;

class BoardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Usage: php artisan db:seed --class=BoardSeeder
     */
    public function run(): void
    {
        // Get or create a test user
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create sample boards
        $boards = [
            [
                'name' => 'Design Inspiration',
                'description' => 'Collection of beautiful UI/UX designs',
            ],
            [
                'name' => 'Travel Ideas',
                'description' => 'Places I want to visit',
            ],
            [
                'name' => 'Recipes',
                'description' => null,
            ],
        ];

        foreach ($boards as $boardData) {
            $board = $user->boards()->create($boardData);

            // Create some pins and attach to board
            for ($i = 1; $i <= 3; $i++) {
                $pin = Pin::create([
                    'user_id' => $user->id,
                    'title' => "Pin {$i} for {$board->name}",
                    'description' => "Sample description for pin {$i}",
                    'image_url' => "https://picsum.photos/400/600?random={$board->id}{$i}",
                ]);

                // Attach pin to board
                $board->pins()->attach($pin->id);
            }
        }

        $this->command->info('✅ Sample boards and pins created successfully!');
        $this->command->info("📧 Test user: test@example.com");
        $this->command->info("🔑 Password: password");
    }
}
