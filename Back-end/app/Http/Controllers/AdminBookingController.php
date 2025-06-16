<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    public function totalBookingsCount()
    {
        return response()->json([
            'total_bookings' => Booking::count()
        ]);
    }

    // Function to get all bookings for an event
    public function getEventBookings($eventId)
    {
        // Fetch all bookings for the specified event
        $bookings = Booking::where('event_id', $eventId)->with('user')->get();

        return response()->json(['bookings' => $bookings], 200);
    }

    // Function to get all bookings with user details and event information
    public function getAllBookings()
    {
        // Fetch all bookings with user details and event information
        $bookings = Booking::with(['user', 'event'])->get();

        return response()->json(['bookings' => $bookings], 200);
    }
}