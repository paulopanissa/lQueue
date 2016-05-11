<?php

namespace App\Models\Queue;

use Illuminate\Database\Eloquent\Model;

class UsersTicketWindow extends Model
{
    protected $fillable = [
      'user_id', 'ticket_id'
    ];


}
