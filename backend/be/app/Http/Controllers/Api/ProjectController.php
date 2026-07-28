<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Project\ProjectResource;
use App\Http\Resources\Project\StoreProjectRequest;
use App\Http\Resources\Project\UpdateProjectRequest;
use App\Models\Project;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::with('client')->latest()->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Data Proyek Berhasil Diambil',
            'data' => ProjectResource::collection($projects),
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $project = Project::create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Proyek Berhasil Ditambahkan',
            'data' => new ProjectResource($project->load('client')),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Detail Proyek Berhasil Diambil',
            'data' => new ProjectResource($project->load('client')),
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $project->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Proyek Berhasil Diupdate',
            'data' => new ProjectResource($project->load('client')),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Proyek Berhasil Dihapus',
        ], 200);
    }
}
