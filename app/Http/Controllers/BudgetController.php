<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Budget::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($budget) {
                // Calcular gastos por categorías si hay categorías definidas
                $spent = 0;
                if ($budget->categories && is_array($budget->categories)) {
                    $currentMonth = now()->format('Y-m');
                    foreach ($budget->categories as $category => $categoryBudget) {
                        $categorySpent = Expense::where('user_id', Auth::id())
                            ->where('category', $category)
                            ->whereRaw('strftime("%Y-%m", date) = ?', [$currentMonth])
                            ->sum('amount');
                        $spent += $categorySpent;
                    }
                } else {
                    // Si no hay categorías específicas, sumar todos los gastos del período
                    $currentMonth = now()->format('Y-m');
                    $spent = Expense::where('user_id', Auth::id())
                        ->whereRaw('strftime("%Y-%m", date) = ?', [$currentMonth])
                        ->sum('amount');
                }

                return [
                    'id' => $budget->id,
                    'total_amount' => (float) $budget->total,
                    'spent' => (float) $spent,
                    'remaining' => (float) ($budget->total - $spent),
                    'period' => $budget->period,
                    'categories' => $budget->categories,
                    'recommendations' => $budget->recommendations,
                    'progress' => $budget->total > 0 ? round(($spent / $budget->total) * 100, 1) : 0
                ];
            });

        return Inertia::render('Budgets', [
            'budgets' => $budgets
        ]);
    }

    public function store(Request $request)
    {
        Log::info('BudgetController@store called', [
            'data' => $request->all(),
            'user_id' => Auth::id()
        ]);

        $request->validate([
            'total' => 'required|numeric|min:0.01',
            'period' => 'required|string|in:Semanal,Mensual,Trimestral,Anual',
            'categories' => 'nullable|array',
            'recommendations' => 'nullable|string'
        ]);

        $budget = Budget::create([
            'user_id' => Auth::id(),
            'total' => $request->total,
            'period' => $request->period,
            'categories' => $request->categories,
            'recommendations' => $request->recommendations
        ]);

        Log::info('Budget created', ['budget_id' => $budget->id]);

        return redirect()->route('budgets')->with('success', 'Presupuesto creado correctamente');
    }

    public function update(Request $request, Budget $budget)
    {
        // Verificar que el presupuesto pertenece al usuario actual
        if ($budget->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'total' => 'required|numeric|min:0.01',
            'period' => 'required|string|in:Semanal,Mensual,Trimestral,Anual',
            'categories' => 'nullable|array',
            'recommendations' => 'nullable|string'
        ]);

        $budget->update([
            'total' => $request->total,
            'period' => $request->period,
            'categories' => $request->categories,
            'recommendations' => $request->recommendations
        ]);

        return redirect()->route('budgets')->with('success', 'Presupuesto actualizado correctamente');
    }

    public function destroy(Budget $budget)
    {
        // Verificar que el presupuesto pertenece al usuario actual
        if ($budget->user_id !== Auth::id()) {
            abort(403);
        }

        $budget->delete();

        return redirect()->route('budgets')->with('success', 'Presupuesto eliminado correctamente');
    }
}
