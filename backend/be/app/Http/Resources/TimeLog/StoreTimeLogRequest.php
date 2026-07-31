<?php

namespace App\Http\Resources\TimeLog;
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
            'note' => 'required|string|max:1000',
            'logged_hours' => 'required|numeric|min:0.1|max:24',
        ];
    }
}
