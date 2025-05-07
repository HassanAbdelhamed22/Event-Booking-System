<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Event;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // Function to calculate the total price of a booking
    private function calculateTotalPrice($eventId, $numberOfTickets)
    {
        // Fetch the event details
        $event = Event::findOrFail($eventId);

        // Calculate the total price
        return $event->ticket_price * $numberOfTickets;
    }

    // Function to create a new booking
    public function createBooking(Request $request, $eventId)
    {
        // Check if the user is authenticated
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Check if the user has already booked for this event
        $existingBooking = Booking::where('user_id', auth()->id())
            ->where('event_id', $eventId)
            ->first();
        if ($existingBooking) {
            return response()->json(['message' => 'You have already booked for this event'], 400);
        }

        // Validate the request data
        $validatedData = $request->validate([
            'number_of_tickets' => 'required|integer|min:1',
        ]);

        // Create a new booking
        $booking = Booking::create([
            'user_id' => auth()->id(),
            'event_id' => $eventId,
            'number_of_tickets' => $validatedData['number_of_tickets'],
            'total_price' => $this->calculateTotalPrice($eventId, $validatedData['number_of_tickets']),
        ]);

        return response()->json(['message' => 'Booking created successfully', 'booking' => $booking], 201);
    }

    // Function to get all bookings for a user
    public function getUserBookings()
    {
        // Check if the user is authenticated
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Fetch the bookings for the authenticated user
        $bookings = Booking::where('user_id', auth()->id())->with('event')->paginate(10);

        return response()->json([
            'bookings' => $bookings->items(),
            'pagination' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
            ],
        ], 200);
    }
}
