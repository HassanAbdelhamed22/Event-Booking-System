<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class AdminCategoryController extends Controller
{
    // Get all categories
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories, 200);
    }

    // Create a new category
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload if present
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('category_images', 'public');
            $request['image'] = $imagePath;
        }

        $category = Category::create($request->all());

        return response()->json($category, 201);
    }

    // Update a category
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $category = Category::findOrFail($id);
        $category->update($request->all());

        return response()->json($category, 200);
    }

    // Delete a category
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(null, 204);
    }
}
