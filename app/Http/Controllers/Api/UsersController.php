<?php

namespace App\Http\Controllers\Api;

use App\Repositories\UserRepository;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class UsersController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $repository)
    {
        $this->userRepository = $repository;
    }

    public function paginateUsers(){
        return $this->userRepository->paginateUsers();
    }

    public function create(Request $request){
        return $this->userRepository->create($request->all());
    }

    public function edit($id){
        return $this->userRepository->find($id);
    }

    public function update(Request $request, $id){

    }

    public function delete($id){
        return $this->userRepository->destroy($id);
    }

}
