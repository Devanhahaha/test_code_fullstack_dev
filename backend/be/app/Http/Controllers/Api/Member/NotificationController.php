<?php

namespace App\Http\Controllers\Api\Member;

use App\Http\Controllers\Controller;
use App\Http\Resources\Member\NotificationResource;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $notifications = $user->notifications()->latest()->get();

        return response()->json([
            'status'       => 'success',
            'unread_count' => $user->notifications()->where('is_read', false)->count(),
            'data'         => NotificationResource::collection($notifications)
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->update(['is_read' => true]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Notification marked as read'
        ]);
    }
}
