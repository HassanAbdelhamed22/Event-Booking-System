<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'date',
        'start_time',
        'end_time',
        'location',
        'organizer',
        'category_id',
        'status',
        'ticket_price',
        'venue_name',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getPotentialRevenueAttribute()
    {
        return $this->bookings->sum('total_price');
    }
}
