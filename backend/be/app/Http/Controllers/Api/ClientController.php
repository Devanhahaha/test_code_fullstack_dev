<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\ClientResource;
use App\Http\Resources\Client\StoreClientRequest;
use App\Http\Resources\Client\UpdateClientRequest;
use App\Models\Client;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = Client::latest()->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Data Klien Berhasil Diambil',
            'data' => ClientResource::collection($clients),
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request)
    {
        $clients = Client::create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Klien Berhasil Ditambahkan',
            'data' => new ClientResource($clients),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        return response()->json([
            'status'=> 'success',
            'message' => 'Detail Klien Berhasil Diambil',
            'data' => new ClientResource($client),
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, Client $client)
    {
        $client->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Klien Berhasil Diupdate',
            'data' => new ClientResource($client),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Klien Berhasil Dihapus',
        ], 200);
    }
}
