<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    // Get all events
    public function index()
    {
        $events = Event::paginate(10);
        return response()->json([
            'events' => $events->items(),
            'pagination' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'per_page' => $events->perPage(),
                'total' => $events->total(),
            ],
        ], 200);
    }

    // Get a single event
    public function show($id)
    {
        $event = Event::findOrFail($id);
        return response()->json($event, 200);
    }

    // Get Categories
    public function getCategories()
    {
        $categories = Event::select('category', 'image')->distinct()->get();
        return response()->json($categories, 200);
    }

    // Search events
    public function search(Request $request)
    {
        $query = $request->input('query');
        $events = Event::where('name', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->get();

        return response()->json($events, 200);
    }

    // Filter events by date
    public function filterByDate(Request $request)
    {
        $date = $request->input('date');
        $events = Event::whereDate('date', $date)->get();

        return response()->json($events, 200);
    }

    // Filter events by location
    public function filterByLocation(Request $request)
    {
        $location = $request->input('location');
        $events = Event::where('location', 'LIKE', "%{$location}%")->get();

        return response()->json($events, 200);
    }

    // Filter events by category    
    public function filterByCategory(Request $request)
    {
        $category = $request->input('category');
        $events = Event::where('category', 'LIKE', "%{$category}%")->get();

        return response()->json($events, 200);
    }
}
