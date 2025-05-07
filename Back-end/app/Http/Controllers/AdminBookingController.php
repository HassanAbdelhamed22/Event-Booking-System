<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    // Function to get all bookings for an event
    public function getEventBookings($eventId)
    {
        // Fetch all bookings for the specified event
        $bookings = Booking::where('event_id', $eventId)->with('user')->get();

        return response()->json(['bookings' => $bookings], 200);
    }
}
