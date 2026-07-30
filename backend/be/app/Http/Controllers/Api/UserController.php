<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::role('member')->select('id', 'name', 'email')->get();

        return response()->json([
            'success' => true,
            'message' => 'List data member',
            'data'    => $users
        ], 200);
    }
}
