<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

        $data = [
            'name' => $request->name,
            'image' => null,
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();

            // Store in public disk
            $path = $file->storeAs('category_images', $filename, 'public');

            // Verify file exists
            if (!Storage::disk('public')->exists($path)) {
                throw new Exception("File failed to upload!");
            }

            $data['image'] = $path;
        }

        $category = Category::create($data);

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
        $data = [
            'name' => $request->name,
        ];
        
        try {
            if ($request->hasFile('image')) {
                // Delete old image
                if ($category->image && Storage::disk('public')->exists($category->image)) {
                    Storage::disk('public')->delete($category->image);
                }

                // Store new image
                $imagePath = $request->file('image')->store('category_images', 'public');
                $data['image'] = $imagePath;
            }

            $category->update($data);

            return response()->json($category, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error updating category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Delete a category
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        // Delete old image from storage
        if ($category->image && Storage::disk('public')->exists($category->image)) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return response()->json(null, 204);
    }
}