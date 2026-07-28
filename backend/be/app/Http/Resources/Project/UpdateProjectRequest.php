<?php

namespace App\Http\Resources\Project;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'client_id' => 'sometimes|required|exists:clients,id',
            'name' => 'sometimes|required|string|max:255',
            'deadline' => 'sometimes|required|date',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
        ];
    }
}
