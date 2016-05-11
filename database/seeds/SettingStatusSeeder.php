<?php

use Illuminate\Database\Seeder;
use App\Models\Setting\SettingStatus;

class SettingStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        SettingStatus::create([
            'status' => 'Aguardando Atendimento'
        ]);

        SettingStatus::create([
            'status' => 'Chamando'
        ]);

        SettingStatus::create([
            'status' => 'Em Atendimento'
        ]);

        SettingStatus::create([
            'status' => 'Finalizado'
        ]);

        SettingStatus::create([
            'status' => 'Cancelado'
        ]);

        SettingStatus::create([
            'status' => 'Não compareceu'
        ]);
    }
}
