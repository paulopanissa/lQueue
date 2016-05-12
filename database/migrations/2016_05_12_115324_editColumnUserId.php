<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EditColumnUserId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('queue_managers', function (Blueprint $table) {
            $table->integer('user_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('queue_managers', function (Blueprint $table) {
            $table->integer('user_id')->change();
        });
    }
}
