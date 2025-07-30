<?php

namespace App\Http\Controllers;

use App\Models\Tip;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TipController extends Controller
{
    public function index()
    {
        $tips = Tip::orderBy('created_at', 'desc')
            ->get()
            ->map(function ($tip) {
                return [
                    'id' => $tip->id,
                    'title' => $tip->title,
                    'content' => $tip->content,
                    'tags' => $tip->tags ? explode(',', $tip->tags) : [],
                    'category' => $tip->tags ? explode(',', $tip->tags)[0] ?? 'General' : 'General',
                    'author' => 'Sistema'
                ];
            });

        return Inertia::render('Tips', [
            'tips' => $tips
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'tags' => 'nullable|string'
        ]);

        Tip::create([
            'title' => $request->title,
            'content' => $request->input('content'),
            'tags' => $request->tags
        ]);

        return redirect()->route('tips')->with('success', 'Consejo agregado correctamente');
    }

    public function update(Request $request, Tip $tip)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'tags' => 'nullable|string'
        ]);

        $tip->update([
            'title' => $request->title,
            'content' => $request->input('content'),
            'tags' => $request->tags
        ]);

        return redirect()->route('tips')->with('success', 'Consejo actualizado correctamente');
    }

    public function destroy(Tip $tip)
    {
        $tip->delete();

        return redirect()->route('tips')->with('success', 'Consejo eliminado correctamente');
    }
}
