<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Budget;
use App\Models\AcademicEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $currentMonth = now()->format('Y-m');

        // Gastos del mes actual
        $monthlyExpenses = Expense::where('user_id', $user->id)
            ->whereRaw('strftime("%Y-%m", date) = ?', [$currentMonth])
            ->sum('amount');

        // Presupuesto total del usuario
        $totalBudget = Budget::where('user_id', $user->id)
            ->where('period', 'Mensual')
            ->sum('total');

        // Gastos recientes (últimos 10)
        $recentExpenses = Expense::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(10)
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

        // Gastos por categoría del mes actual
        $expensesByCategory = Expense::where('user_id', $user->id)
            ->whereRaw('strftime("%Y-%m", date) = ?', [$currentMonth])
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->orderBy('total', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category,
                    'total' => (float) $item->total
                ];
            });

        // Próximos eventos académicos
        $upcomingEvents = AcademicEvent::where('user_id', $user->id)
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date', 'asc')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user
            ],
            'monthlyExpenses' => $monthlyExpenses,
            'totalBudget' => $totalBudget,
            'recentExpenses' => $recentExpenses,
            'expensesByCategory' => $expensesByCategory,
            'upcomingEvents' => $upcomingEvents,
            'currentMonth' => now()->format('F Y')
        ]);
    }
}
