<?php

namespace App\Console\Commands;

use App\Models\Notification;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendDeadlineReminder extends Command
{
    protected $signature = 'tasks:send-reminder';
    protected $description = 'Kirim notifikasi reminder H-1 deadline task ke member';

    public function handle()
    {
        // Ambil tanggal besok (H-1 dari deadline)
        $tomorrow = Carbon::tomorrow()->toDateString();

        // Cari task yang deadlinenya besok dan belum selesai
        $tasks = Task::whereDate('deadline', $tomorrow)
            ->where('status', '!=', 'completed')
            ->get();

        $count = 0;
        foreach ($tasks as $task) {
            Notification::create([
                'user_id' => $task->assignee_id,
                'title'   => '⏰ Reminder Deadline!',
                'message' => "Task '{$task->title}' akan jatuh tempo besok ({$task->deadline}).",
                'is_read' => false,
            ]);

            $count++;
        }

        $this->info("Berhasil mengirim {$count} notifikasi reminder H-1 deadline.");
    }
}
