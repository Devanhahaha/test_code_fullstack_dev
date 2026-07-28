<?php

namespace App\Http\Resources\Client;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'name' =>'required|string|max:255',
            'contact' => 'required|string|max:255',
            'company' => 'required|string|max:255',
        ];
    }
}
