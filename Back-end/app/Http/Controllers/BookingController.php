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

    // Function to get all bookings for a user with category image
    public function getUserBookings()
    {
        // Check if the user is authenticated
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Fetch the bookings for the authenticated user
        $bookings = Booking::where('user_id', auth()->id())
            ->with(['event.category'])
            ->paginate(10);

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

    // Function to update a booking
    public function updateBooking(Request $request, $bookingId)
    {
        // Check if the user is authenticated
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Fetch the booking
        $booking = Booking::where('user_id', auth()->id())->findOrFail($bookingId);

        // Validate the request data
        $validatedData = $request->validate([
            'number_of_tickets' => 'required|integer|min:1',
        ]);

        // Update the booking
        $booking->update([
            'number_of_tickets' => $validatedData['number_of_tickets'],
            'total_price' => $this->calculateTotalPrice($booking->event_id, $validatedData['number_of_tickets']),
        ]);

        return response()->json(['message' => 'Booking updated successfully', 'booking' => $booking], 200);
    }

    // Function to delete a booking
    public function deleteBooking($bookingId)
    {
        // Check if the user is authenticated
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Fetch the booking
        $booking = Booking::where('user_id', auth()->id())->findOrFail($bookingId);

        // Delete the booking
        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully'], 200);
    }

    public function checkUserBookedEvent($eventId)
    {
        // Check if the user is authenticated
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Check if the user has booked the event
        $hasBooked = Booking::where('user_id', auth()->id())
            ->where('event_id', $eventId)
            ->exists();

        return response()->json(['has_booked' => $hasBooked], 200);
    }
}