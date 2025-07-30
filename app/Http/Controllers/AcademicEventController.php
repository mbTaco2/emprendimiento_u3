<?php

namespace App\Http\Controllers;

use App\Models\AcademicEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AcademicEventController extends Controller
{
    public function index()
    {
        $events = AcademicEvent::where('user_id', Auth::id())
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'date' => $event->date->format('Y-m-d'),
                    'formatted_date' => $event->date->format('d/m/Y'),
                    'linked_expense_category' => $event->linked_expense_category,
                    'is_upcoming' => $event->date >= now()->toDateString()
                ];
            });

        return Inertia::render('AcademicEvents', [
            'events' => $events
        ]);
    }

    public function store(Request $request)
    {
        Log::info('AcademicEventController@store called', [
            'data' => $request->all(),
            'user_id' => Auth::id()
        ]);

        $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'linked_expense_category' => 'nullable|string|max:100'
        ]);

        $event = AcademicEvent::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'date' => $request->date,
            'linked_expense_category' => $request->linked_expense_category
        ]);

        Log::info('AcademicEvent created', ['event_id' => $event->id]);

        return redirect()->route('academic-events')->with('success', 'Evento académico agregado correctamente');
    }

    public function update(Request $request, AcademicEvent $academicEvent)
    {
        // Verificar que el evento pertenece al usuario actual
        if ($academicEvent->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'linked_expense_category' => 'nullable|string|max:100'
        ]);

        $academicEvent->update([
            'title' => $request->title,
            'date' => $request->date,
            'linked_expense_category' => $request->linked_expense_category
        ]);

        return redirect()->route('academic-events')->with('success', 'Evento académico actualizado correctamente');
    }

    public function destroy(AcademicEvent $academicEvent)
    {
        // Verificar que el evento pertenece al usuario actual
        if ($academicEvent->user_id !== Auth::id()) {
            abort(403);
        }

        $academicEvent->delete();

        return redirect()->route('academic-events')->with('success', 'Evento académico eliminado correctamente');
    }
}
