<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::where('user_id', Auth::id())
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($expense) {
                return [
                    'id' => $expense->id,
                    'description' => $expense->description,
                    'category' => $expense->category,
                    'amount' => (float) $expense->amount,
                    'date' => $expense->date->format('Y-m-d'),
                    'formatted_date' => $expense->date->format('d/m/Y')
                ];
            });

        return Inertia::render('Expenses', [
            'expenses' => $expenses
        ]);
    }

    public function store(Request $request)
    {
        Log::info('ExpenseController@store called', [
            'data' => $request->all(),
            'user_id' => Auth::id()
        ]);

        $request->validate([
            'description' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date'
        ]);

        $expense = Expense::create([
            'user_id' => Auth::id(),
            'description' => $request->description,
            'category' => $request->category,
            'amount' => $request->amount,
            'date' => $request->date
        ]);

        Log::info('Expense created', ['expense_id' => $expense->id]);

        return redirect()->route('expenses')->with('success', 'Gasto agregado correctamente');
    }

    public function update(Request $request, Expense $expense)
    {
        // Verificar que el gasto pertenece al usuario actual
        if ($expense->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'description' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date'
        ]);

        $expense->update([
            'description' => $request->description,
            'category' => $request->category,
            'amount' => $request->amount,
            'date' => $request->date
        ]);

        return redirect()->route('expenses')->with('success', 'Gasto actualizado correctamente');
    }

    public function destroy(Expense $expense)
    {
        // Verificar que el gasto pertenece al usuario actual
        if ($expense->user_id !== Auth::id()) {
            abort(403);
        }

        $expense->delete();

        return redirect()->route('expenses')->with('success', 'Gasto eliminado correctamente');
    }
}
