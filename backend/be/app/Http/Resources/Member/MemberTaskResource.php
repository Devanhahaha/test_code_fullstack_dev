<?php

namespace App\Http\Resources\Member;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberTaskResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title, 
            'description' => $this->description,
            'deadline' => $this->deadline, 
            'status' => $this->status,
            'project' => $this->whenLoaded('project', function () {
                return [
                    'id' => $this->project->id,
                    'name' => $this->project->name,
                ];
            }),
        ];
    }
}
