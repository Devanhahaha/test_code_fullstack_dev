<?php

namespace App\Http\Requests\Api\Member;
use Illuminate\Foundation\Http\FormRequest;

class MemberTaskUpdateRequest extends FormRequest
{
    public function authorize()
    {
        // Pastikan hanya user yang login yang bisa melakukan request
        return auth()->check();
    }

    public function rules()
    {
        return [
            'status' => ['required', 'string', 'in:pending,in_progress,completed'],
        ];
    }

    public function messages()
    {
        return [
            'status.in' => 'Status task tidak valid.',
        ];
    }
}
