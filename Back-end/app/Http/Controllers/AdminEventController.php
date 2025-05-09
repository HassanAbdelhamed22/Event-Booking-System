<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateEventRequest;
use App\Http\Requests\UpdateEventRequest;
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
        $validatedData['category_id'] = $request->input('category_id');

        // Create the event
        $event = Event::create($validatedData);

        return response()->json(['message' => 'Event created successfully', 'event' => $event], 201);
    }

    // Update an existing event
    public function update(UpdateEventRequest $request, $id)
    {
        $event = Event::findOrFail($id);

        // Validate the request
        $validatedData = $request->validated();

        // Handle image upload if present
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('event_images', 'public');
            $validatedData['image'] = $imagePath;
        }

        // Update the event
        $event->update($validatedData);

        return response()->json(['message' => 'Event updated successfully', 'event' => $event], 200);
    }

    // Delete an event
    public function delete($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json(['message' => 'Event deleted successfully'], 200);
    }
}