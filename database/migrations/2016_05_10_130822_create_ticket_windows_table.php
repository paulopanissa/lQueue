<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTicketWindowsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ticket_windows', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->tinyInteger('number')->unique();
            $table->string('ip', 15)->nullable();
            $table->string('mac')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('ticket_windows');
    }
}
