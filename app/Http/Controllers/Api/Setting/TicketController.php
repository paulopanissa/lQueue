<?php

namespace App\Http\Controllers\Api\Setting;

use App\Models\Queue\TicketWindow;
use App\Models\Queue\UsersTicketWindow;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class TicketController extends Controller
{
    /**
     * Get all Users
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getUsers(){
        return User::all();
    }

    /**
     * Get All Tickets Register
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getTickets(){
        return TicketWindow::all();
    }

    /**
     * Get Users in Tickets
     * @return array
     */
    public function getUsersInTickets()
    {
        $UsersInTicket = UsersTicketWindow::all();
        $usersInTicket = [];
        foreach($UsersInTicket as $uit){
            array_push($usersInTicket, [
                'id'        => $uit->id,
                'user'      => $uit->user->name,
                'ticket'    => $uit->ticket->number
            ]);
        }
        return $usersInTicket;
    }

    /**
     * 
     * @param $id
     */
    public function destroyUsersInTickets($id){
        return UsersTicketWindow::destroy($id);
    }

}
