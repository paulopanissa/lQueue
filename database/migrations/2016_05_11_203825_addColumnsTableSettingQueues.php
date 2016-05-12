<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsTableSettingQueues extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('setting_queues', function (Blueprint $table) {
            $table->string('btn')->default('btn-primary')->after('name');
            $table->string('icon')->default('fa-check')->after('btn');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('setting_queues', function (Blueprint $table) {
            $table->dropColumn(['btn', 'icon']);
        });
    }
}
