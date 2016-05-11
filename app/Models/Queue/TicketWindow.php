<?php

namespace App\Models\Queue;

use Illuminate\Database\Eloquent\Model;

class TicketWindow extends Model
{
    protected $fillable = [
      'name', 'number', 'ip', 'mac'
    ];

    public function users(){
        return $this->belongsToMany('App\User', 'users_ticket_windows', 'ticket_id', 'user_id');
    }
}
