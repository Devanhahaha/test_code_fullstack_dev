<?php

namespace App\Http\Resources\Task;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'project_id' => 'sometimes|required|exists:projects,id',
            'assignee_id' => [
                'nullable',
                'exists:users,id',
                function ($attribute, $value, $fail) { 
                    $user = User::find($value);
                    if ($user && !$user->hasRole('member')) {
                        $fail('User yang di-assign harus memiliki role sebagai member.');
                    }
                },
            ],
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'estimated_hours' => 'nullable|integer|min:0',
            'deadline' => 'nullable|date',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
        ];
    }
}
