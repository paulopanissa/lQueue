<?php

namespace App\Models\Queue;

use Illuminate\Database\Eloquent\Model;

class QueueManager extends Model
{
    protected $fillable = [
      'pwd', 'queue_id', 'status_id', 'user_id'
    ];


    /**
     * inQueue
     * @return mixed
     */
    public static function inQueue(){
        return static::whereRaw("DATE(created_at) = CURDATE() and status_id = 1")->get();
    }

    /**
     * Count in Queue
     */
    public static function countQueue($queue){
        if($queue)
            return static::whereRaw("queue_id = {$queue} and DATE(created_at) = CURDATE()")->count();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(){
        return $this->belongsTo('App\User');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function queue(){
        return $this->belongsTO('App\Models\Setting\SettingQueue');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function status(){
        return $this->belongsTo('App\Models\Setting\SettingStatus');
    }
}
