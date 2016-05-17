<?php

namespace App\Models\Queue;

use Illuminate\Database\Eloquent\Model;

class UsersTicketWindow extends Model
{
    protected $fillable = [
      'user_id', 'ticket_id'
    ];

    public function user(){
        return $this->belongsTo('App\User', 'user_id');
    }

    public function ticket(){
        return $this->belongsTo('App\Models\Queue\TicketWindow', 'ticket_id');
    }


}
