<?php

namespace App\Http\Resources\Task;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'project_id' => 'required|exists:projects,id',
            'assignee_id' => [
                'nullable',
                'exists:users,id',
                function ($attribute,$value, $fail) {
                    $user = User::find($value);
                    if ($user && !$user->hasRole('member')) {
                        $fail('User yang di-assign harus memiliki role sebagai member.');
                    }
                },
            ],
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'status' => 'nullable|in:pending,in_progress,completed',
        ];
    }
}
