<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'client_id',
        'name',
        'deadline',
        'status',
    ];

    public function client() {
        return $this->belongsTo(Client::class);
    }

    public function tasks() {
        return $this->hasMany(Task::class);
    }
}
