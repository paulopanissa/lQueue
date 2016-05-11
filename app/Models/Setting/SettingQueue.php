<?php

namespace App\Models\Setting;

use Illuminate\Database\Eloquent\Model;

class SettingQueue extends Model
{
    protected $fillable = [
        'key', 'name'
    ];

    public static function toQueue(){
        return static::select('id', 'name')->get();
    }

    public static function setQueue($queue){
        return static::select('key', 'name')->where('id', $queue)->first();
    }

}
