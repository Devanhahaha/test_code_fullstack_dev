<?php

namespace App\Http\Resources\TimeLog;

use App\Http\Resources\Task\TaskResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimeLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'task_id' => $this->task_id,
            'task' => new TaskResource($this->whenLoaded('task')),
            'user_id' => $this->user_id,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
            'note' => $this->note,
            'logged_hours' => (float) $this->logged_hours, 
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
