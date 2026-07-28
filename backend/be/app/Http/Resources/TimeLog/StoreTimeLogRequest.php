<?php

namespace App\Http\Resources\TimeLog;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreTimeLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'task_id' => 'required|exists:tasks,id',
            'user_id' => [
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    $user = User::find($value);
                    if ($user && !$user->hasRole('member')) {
                        $fail('Hanya user dengan role member yang dapat mencatat waktu kerja.');
                    }
                },
            ],
            'note' => 'required|string',
            'logged_hours' => 'required|numeric|min:0.1|max:24',
        ];
    }
}
