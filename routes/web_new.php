<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\AcademicEventController;
use App\Http\Controllers\TipController;
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

    // Rutas de perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
