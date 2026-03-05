<?php

namespace Database\Seeders;

use App\Models\Pollen;
use Illuminate\Database\Seeder;

class PollenSeeder extends Seeder
{
    public function run(): void
    {
        $pollens = [
            ['name' => 'Leszczyna', 'icon' => '🌰'],
            ['name' => 'Olsza', 'icon' => '🌳'],
            ['name' => 'Brzoza', 'icon' => '🌿'],
            ['name' => 'Topola', 'icon' => '🍃'],
            ['name' => 'Dąb', 'icon' => '🌳'],
            ['name' => 'Trawy', 'icon' => '🌾'],
            ['name' => 'Babka', 'icon' => '🌱'],
            ['name' => 'Szczaw', 'icon' => '🍀'],
            ['name' => 'Pokrzywa', 'icon' => '🌿'],
            ['name' => 'Komosa', 'icon' => '🌱'],
            ['name' => 'Bylica', 'icon' => '🌼'],
            ['name' => 'Ambrozja', 'icon' => '🌻'],
            ['name' => 'Cladosporium', 'icon' => '🍄'],
            ['name' => 'Alternaria', 'icon' => '🍄'],
        ];

        foreach ($pollens as $pollen) {
            Pollen::firstOrCreate(
                ['name' => $pollen['name']],
                $pollen
            );
        }
    }
}
