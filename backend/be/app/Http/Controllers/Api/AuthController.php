<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // auth register
    public function register(Request $request)
    {

        // validasi form request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // error response jika validasi gagal
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi Gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // create user (memeber) and generate token
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        $user->assignRole('member');
        $token = $user->createToken('auth_token')->plainTextToken;

        // response jika berhasil
        return response()->json([
            'status' => 'success',
            'message' => 'Registrasi Berhasil!',
            'data' => [
                'user' => $user,
                'role' => 'member',
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 201);
    }

    // auth login
    public function login(Request $request)
    {

        // validasi form request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // error response jika validasi gagal
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi Gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        // cek user berdasarkan email
        $user = User::where('email', $request->email)->first();

        // cek password user dan response jika email atau password salah
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau Password Salah',
            ], 401);
        }

        // generate token dan ambil role user
        $token = $user->createToken('auth_token')->plainTextToken;
        $role = $user->getRoleNames()->first();

        return response()->json([
            'status' => 'success',
            'message' => 'Login Berhasil!',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $role,
                ],
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 200);
    }

    // auth logout
    public function logout(Request $request)
    {
        // hapus token user
        $request->user()->currentAccessToken()->delete();

        // response jika berhasil
        return response()->json([
            'status' => 'success',
            'message' => 'Logout Berhasil!',
        ], 200);
    }
}
