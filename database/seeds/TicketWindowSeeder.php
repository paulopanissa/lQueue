<?php

use Illuminate\Database\Seeder;
use App\Models\Queue\TicketWindow;

class TicketWindowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        TicketWindow::create([
            'name' => 'ATENDIMENTO PREFERENCIAL',
            'number' => 1
        ]);
        TicketWindow::create([
            'name' => 'ATENDIMENTO PREFERENCIAL',
            'number' => 2
        ]);
        TicketWindow::create([
            'name' => 'ATENDIMENTO NORMAL',
            'number' => 3
        ]);
        TicketWindow::create([
            'name' => 'ATENDIMENTO NORMAL',
            'number' => 4
        ]);
        TicketWindow::create([
            'name' => 'ATENDIMENTO NORMAL',
            'number' => 5
        ]);
        TicketWindow::create([
            'name' => 'ATENDIMENTO NORMAL',
            'number' => 6
        ]);
        TicketWindow::create([
            'name' => 'ATENDIMENTO NORMAL',
            'number' => 7
        ]);
        TicketWindow::create([
            'name' => 'ATENDIMENTO MENSALISTA',
            'number' => 8
        ]);
        TicketWindow::create([
            'name' => 'ATENDIMENTO MENSALISTA',
            'number' => 9
        ]);
        TicketWindow::create([
            'name' => 'ATENDIMENTO MENSALISTA',
            'number' => 10
        ]);
    }
}
