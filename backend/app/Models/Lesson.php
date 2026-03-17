<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $guarded = [];

    protected $appends = ['video_url'];

    public function getVideoUrlAttribute()
    {
        if ($this->video == "") {
            return "";
        }

        return asset('uploads/course/videos/' . $this->video);
    }
}
