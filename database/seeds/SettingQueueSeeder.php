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
            'name' => 'ATENDIMENTO NORMAL'
        ]);
        SettingQueue::create([
            'key' => 'M',
            'name' => 'ATENDIMENTO MENSALISTA'
        ]);
        SettingQueue::create([
            'key' => 'P',
            'name' => 'ATENDIMENTO PREFERENCIAL'
        ]);
    }
}
