<?php

namespace App\Http\Resources\TimeLog;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTimeLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'task_id' => 'sometimes|required|exists:tasks,id',
            'user_id' => [
                'sometimes',
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    $user = User::find($value);
                    if ($user && !$user->hasRole('member')) {
                        $fail('Hanya user dengan role member yang dapat mencatat waktu kerja.');
                    }
                },
            ],
            'note' => 'sometimes|required|string',
            'logged_hours' => 'sometimes|required|numeric|min:0.1|max:24',
        ];
    }
}
