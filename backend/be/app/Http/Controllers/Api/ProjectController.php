<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Project\ProjectResource;
use App\Http\Resources\Project\StoreProjectRequest;
use App\Http\Resources\Project\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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

    // method generated task untuk gemini
    public function generateTasks(Request $request, Project $project) {

        $brief = $request->input('brief', $project->name);

        if (!$brief) {
            return response()->json([
                'status' => 'error',
                'message' => 'Brief tidak boleh kosong',
            ], 400);
        }

        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json([
                'status' => 'error',
                'message' => 'GEMINI_API_KEY belum dikonfigurasi di file .env.',
            ], 500);
        }

        try {

            // Prompt yang ketat meminta format JSON Array murni
            $prompt = "Kamu adalah Project Manager berpengalaman. Analisis brief proyek berikut dan buatkan breakdown task yang spesifik.\n\n"
                . "Brief Proyek: {$brief}\n\n"
                . "Kembalikan HANYA array JSON tanpa format markdown lain seperti ```json. Format JSON harus persis seperti ini:\n"
                . "[\n"
                . "  {\n"
                . "    \"title\": \"Judul Task\",\n"
                . "    \"description\": \"Deskripsi detail task\",\n"
                . "    \"category\": \"frontend|backend|design|QA\",\n"
                . "    \"estimated_hours\": 8\n"
                . "  }\n"
                . "]";

            // Panggil API Gemini 3.1 Flash
            $response = Http::timeout(15)->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'response_mime_type' => 'application/json'
                ]
            ]);

            if ($response->failed()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Gagal terhubung ke AI Service (Gemini API)',
                    'error_detail' => $response->json()
                ], 502);
            }

            $jsonText = $response->json('candidates.0.content.parts.0.text');
            $suggestedTasks = json_decode($jsonText, true);

            return response()->json([
                'status' => 'success',
                'message' => 'Saran task dari AI berhasil dibuat',
                'project_id' => $project->id,
                'data' => $suggestedTasks
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan sistem saat menghubungi AI Service: ' . $e->getMessage()
            ], 500);
        }
    }
}
