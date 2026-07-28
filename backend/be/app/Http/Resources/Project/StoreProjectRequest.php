<?php

namespace App\Http\Resources\Project;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'deadline' => 'required|date',
            'status' => 'required|in:pending,in_progress,completed',
        ];
    }
}
