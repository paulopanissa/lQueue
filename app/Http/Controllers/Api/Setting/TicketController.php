<?php

namespace App\Http\Controllers\Api\Setting;

use App\Models\Queue\TicketWindow;
use App\Models\Queue\UsersTicketWindow;
use App\Models\Setting\Access;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class TicketController extends Controller
{
    public function getUsers(){
        return User::all();
    }
    public function getTickets(){
        return TicketWindow::all();
    }
    public function getUsersInTickets(){
        return UsersTicketWindow::all();
    }


}
