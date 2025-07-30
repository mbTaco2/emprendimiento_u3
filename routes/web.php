<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\AcademicEventController;
use App\Http\Controllers\TipController;
use App\Http\Controllers\AiAdviceController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard route usando controlador
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Rutas protegidas
Route::middleware('auth')->group(function () {
    // Rutas de Gastos
    Route::get('/expenses', [ExpenseController::class, 'index'])->name('expenses');
    Route::post('/expenses', [ExpenseController::class, 'store'])->name('expenses.store');
    Route::put('/expenses/{expense}', [ExpenseController::class, 'update'])->name('expenses.update');
    Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');

    // Rutas de Presupuestos
    Route::get('/budgets', [BudgetController::class, 'index'])->name('budgets');
    Route::post('/budgets', [BudgetController::class, 'store'])->name('budgets.store');
    Route::put('/budgets/{budget}', [BudgetController::class, 'update'])->name('budgets.update');
    Route::delete('/budgets/{budget}', [BudgetController::class, 'destroy'])->name('budgets.destroy');

    // Rutas de Eventos Académicos
    Route::get('/academic-events', [AcademicEventController::class, 'index'])->name('academic-events');
    Route::post('/academic-events', [AcademicEventController::class, 'store'])->name('academic-events.store');
    Route::put('/academic-events/{academicEvent}', [AcademicEventController::class, 'update'])->name('academic-events.update');
    Route::delete('/academic-events/{academicEvent}', [AcademicEventController::class, 'destroy'])->name('academic-events.destroy');

    // Rutas de Consejos
    Route::get('/tips', [TipController::class, 'index'])->name('tips');
    Route::post('/tips', [TipController::class, 'store'])->name('tips.store');
    Route::put('/tips/{tip}', [TipController::class, 'update'])->name('tips.update');
    Route::delete('/tips/{tip}', [TipController::class, 'destroy'])->name('tips.destroy');

    // Ruta para consejos de IA
    Route::post('/ai-advice', [AiAdviceController::class, 'getAdvice'])->name('ai-advice');

    // Ruta de prueba POST simple
    Route::post('/ai-test-post', function () {
        return response()->json([
            'success' => true,
            'message' => 'POST funcionando correctamente',
            'csrf' => request()->header('X-CSRF-TOKEN') ? 'Token presente' : 'Token faltante'
        ]);
    });

    // Ruta de prueba simplificada (GET para evitar CSRF)
    Route::get('/ai-test', function () {
        try {
            $apiKey = env('GROQ_API_KEY');
            $apiUrl = env('GROQ_API_URL');

            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->withOptions([
                'verify' => false, // Para desarrollo local
                'curl' => [
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_SSL_VERIFYHOST => false,
                ]
            ])->timeout(30)->post($apiUrl, [
                'model' => 'llama-3.1-8b-instant', // Modelo actualizado
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => 'Dame un consejo financiero simple para estudiantes en máximo 50 palabras.'
                    ]
                ],
                'max_tokens' => 100,
                'temperature' => 0.7,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'success' => true,
                    'advice' => $data['choices'][0]['message']['content'] ?? 'Consejo no disponible',
                    'raw_response' => $data
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'error' => 'HTTP Error: ' . $response->status(),
                    'body' => $response->body()
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    })->name('ai-test');

    // Ruta de prueba para debuggear
    Route::get('/test-ai', function () {
        $apiKey = env('GROQ_API_KEY');
        $apiUrl = env('GROQ_API_URL');

        return response()->json([
            'api_key_configured' => !empty($apiKey),
            'api_url' => $apiUrl,
            'api_key_length' => strlen($apiKey ?? ''),
            'env_app_name' => env('APP_NAME')
        ]);
    })->name('test-ai');

    // Ruta para probar relaciones del usuario
    Route::get('/test-user-relations', function (\Illuminate\Http\Request $request) {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'No authenticated user']);
        }

        try {
            $expensesCount = $user->expenses()->count();
            $budgetsCount = $user->budgets()->count();
            $monthlyExpenses = $user->expenses()
                ->whereMonth('date', \Carbon\Carbon::now()->month)
                ->whereYear('date', \Carbon\Carbon::now()->year)
                ->sum('amount');

            // Debug: ver todos los presupuestos
            $allBudgets = $user->budgets()->get(['id', 'total', 'period', 'created_at']);
            $totalBudgetSum = $user->budgets()->where('period', 'Mensual')->sum('total');

            return response()->json([
                'user_id' => $user->id,
                'expenses_count' => $expensesCount,
                'budgets_count' => $budgetsCount,
                'monthly_expenses' => $monthlyExpenses,
                'all_budgets' => $allBudgets,
                'total_budget_sum' => $totalBudgetSum,
                'current_month' => \Carbon\Carbon::now()->month,
                'current_year' => \Carbon\Carbon::now()->year,
                'relations_working' => true
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'relations_working' => false
            ]);
        }
    })->middleware('auth')->name('test-user-relations');

    // Rutas de perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
