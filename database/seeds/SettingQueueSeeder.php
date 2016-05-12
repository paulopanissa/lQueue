<?php

use Illuminate\Database\Seeder;
use App\Models\Setting\SettingQueue;

class SettingQueueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        SettingQueue::create([
            'key' => 'N',
            'name' => 'ATENDIMENTO NORMAL',
            'btn' => 'btn-primary',
            'icon' => 'fa-check'
        ]);
        SettingQueue::create([
            'key' => 'M',
            'name' => 'ATENDIMENTO MENSALISTA',
            'btn' => 'btn-success',
            'icon' => 'fa-briefcase'
        ]);
        SettingQueue::create([
            'key' => 'P',
            'name' => 'ATENDIMENTO PREFERENCIAL',
            'btn' => 'btn-danger',
            'icon' => 'fa-wheelchair'
        ]);
    }
}
