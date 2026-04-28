<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    public static function bootLogsActivity()
    {
        // When a model is created
        static::created(function ($model) {
            self::recordLog('created', $model);
        });

        // When a model is updated
        static::updated(function ($model) {
            self::recordLog('updated', $model);
        });

        // When a model is deleted
        static::deleted(function ($model) {
            self::recordLog('deleted', $model);
        });
    }

    protected static function recordLog($action, $model)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'old_data' => $action === 'updated' ? $model->getOriginal() : null,
            'new_data' => $action !== 'deleted' ? $model->getAttributes() : null,
        ]);
    }
}