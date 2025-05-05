<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateEventRequest;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AdminEventController extends Controller
{ 
    // Create a new event
    public function create(CreateEventRequest $request)
    {
        $user = Auth::user();
        Log::info('Authenticated User:', $user ? $user->toArray() : 'No user found');

        $validatedData = $request->validated();

        // Handle image upload if present
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('event_images', 'public');
            $validatedData['image'] = $imagePath;
        }

        // Create the event
        $event = Event::create($validatedData);

        return response()->json(['message' => 'Event created successfully', 'event' => $event], 201);
    }
}