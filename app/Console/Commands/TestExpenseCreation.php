<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Expense;
use App\Models\User;

class TestExpenseCreation extends Command
{
    protected $signature = 'test:expense';
    protected $description = 'Prueba la creación de gastos';

    public function handle()
    {
        $user = User::where('email', 'test@example.com')->first();

        if (!$user) {
            $this->error('Usuario no encontrado');
            return;
        }

        $expense = Expense::create([
            'user_id' => $user->id,
            'description' => 'Prueba desde comando',
            'category' => 'Test',
            'amount' => 15.75,
            'date' => '2025-07-30'
        ]);

        $this->info("Gasto creado con ID: {$expense->id}");

        // Verificar que se puede leer
        $recentExpenses = Expense::where('user_id', $user->id)->count();
        $this->info("Total de gastos del usuario: {$recentExpenses}");
    }
}
