<?php

namespace App\Repositories;

use App\User;

class UserRepository {

    protected $user;

    public function __construct(User $user){
        $this->user = $user;
    }

    public function paginateUsers(){
        $users = $this->user->orderBy('name', 'asc')->paginate(10);
        return $users;
    }

    public function create($store){

        $user = $this->user->create([
            'username'  => $store['username'],
            'name'  => $store['name'],
            'password'  => bcrypt($store['password']),
            'office'  => $store['office'],
            'access'  => $store['access']
        ]);

        $user->api_token = str_random(60);
        $user->save();
        return $user;
    }

    public function find($id){
        return $this->user->find($id);
    }


}