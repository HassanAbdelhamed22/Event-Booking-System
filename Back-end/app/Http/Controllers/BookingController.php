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
    public function createBooking(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'event_id' => 'required|exists:events,id',
            'number_of_tickets' => 'required|integer|min:1',
        ]);

        // Create a new booking
        $booking = Booking::create([
            'user_id' => auth()->id(),
            'event_id' => $validatedData['event_id'],
            'number_of_tickets' => $validatedData['number_of_tickets'],
            'total_price' => $this->calculateTotalPrice($validatedData['event_id'], $validatedData['number_of_tickets']),
        ]);

        return response()->json(['message' => 'Booking created successfully', 'booking' => $booking], 201);
    }
}
