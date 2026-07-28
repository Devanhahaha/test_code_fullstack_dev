<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'name',
        'contact',
        'company',
    ];

    public function projects() {
        return $this->hasMany(Project::class);
    }
}
