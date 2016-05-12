<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQueueManagersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('queue_managers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('pwd');
            $table->integer('queue_id')->unsigned();
            $table->integer('status_id')->unsigned();
            $table->integer('user_id')->unsigned()->nullable();
            $table->timestamps();
            $table->foreign('queue_id')->references('id')->on('setting_queues');
            $table->foreign('status_id')->references('id')->on('setting_statuses');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('queue_managers');
    }
}
