<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AiAdviceController extends Controller
{
    /**
     * Obtener un consejo financiero personalizado usando IA
     */
    public function getAdvice(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            // Obtener datos financieros del usuario
            $monthlyExpenses = $user->expenses()
                ->whereMonth('date', Carbon::now()->month)
                ->whereYear('date', Carbon::now()->year)
                ->sum('amount');

            // Obtener el presupuesto mensual total del usuario (sumar todos los presupuestos mensuales)
            $totalBudget = $user->budgets()
                ->where('period', 'Mensual')
                ->sum('total');

            // Si no hay presupuestos mensuales, sumar todos los presupuestos disponibles
            if ($totalBudget == 0) {
                $totalBudget = $user->budgets()->sum('total');
            }

            // Log para debug
            Log::info('Datos financieros obtenidos', [
                'user_id' => $user->id,
                'monthly_expenses' => $monthlyExpenses,
                'total_budget' => $totalBudget,
                'budgets_count' => $user->budgets()->count()
            ]);

            $recentExpenses = $user->expenses()
                ->orderBy('date', 'desc')
                ->limit(5)
                ->get(['description', 'amount', 'category']);

            $expensesByCategory = $user->expenses()
                ->whereMonth('date', Carbon::now()->month)
                ->whereYear('date', Carbon::now()->year)
                ->selectRaw('category, SUM(amount) as total')
                ->groupBy('category')
                ->orderBy('total', 'desc')
                ->get();

            // Calcular estadísticas
            $dayOfMonth = Carbon::now()->day;
            $daysInMonth = Carbon::now()->daysInMonth;
            $progressPercentage = $totalBudget > 0 ? ($monthlyExpenses / $totalBudget) * 100 : 0;
            $averageDailySpending = $dayOfMonth > 0 ? $monthlyExpenses / $dayOfMonth : 0;
            $projectedMonthlySpending = $averageDailySpending * $daysInMonth;
            $budgetRemaining = $totalBudget - $monthlyExpenses;

            // Crear el prompt contextualizado
            $prompt = $this->buildPrompt(
                $monthlyExpenses,
                $totalBudget,
                $recentExpenses,
                $expensesByCategory,
                $dayOfMonth,
                $daysInMonth,
                $progressPercentage,
                $projectedMonthlySpending
            );

            // Llamar a la API de Groq
            $response = $this->callGroqAPI($prompt);

            if ($response->successful()) {
                $data = $response->json();
                $advice = $data['choices'][0]['message']['content'] ?? 'No se pudo generar un consejo en este momento.';

                Log::info('Consejo de IA generado exitosamente', [
                    'user_id' => $user->id,
                    'monthly_expenses' => $monthlyExpenses,
                    'total_budget' => $totalBudget,
                    'progress_percentage' => $progressPercentage
                ]);

                return response()->json([
                    'success' => true,
                    'advice' => $advice,
                    'context' => [
                        'monthly_expenses' => $monthlyExpenses,
                        'total_budget' => $totalBudget,
                        'budget_remaining' => round($budgetRemaining, 2),
                        'progress_percentage' => round($progressPercentage, 2),
                        'day_of_month' => $dayOfMonth,
                        'projected_spending' => round($projectedMonthlySpending, 2)
                    ]
                ]);
            } else {
                Log::error('Error al llamar a la API de Groq', [
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Error al generar el consejo. Intenta nuevamente.'
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Error en AiAdviceController::getAdvice', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor.'
            ], 500);
        }
    }

    /**
     * Construir el prompt contextualizado para la IA
     */
    private function buildPrompt(
        $monthlyExpenses,
        $totalBudget,
        $recentExpenses,
        $expensesByCategory,
        $dayOfMonth,
        $daysInMonth,
        $progressPercentage,
        $projectedMonthlySpending
    ): string {
        $currentMonth = Carbon::now()->format('F Y');
        $budgetRemaining = $totalBudget - $monthlyExpenses;

        $recentExpensesText = $recentExpenses->map(function ($expense) {
            return "- {$expense->description}: \${$expense->amount} ({$expense->category})";
        })->join("\n");

        $categoriesText = $expensesByCategory->map(function ($category) {
            return "- {$category->category}: \${$category->total}";
        })->join("\n");

        $prompt = "Eres un asistente financiero inteligente llamado 'MiChanchito🐖' especializado en ayudar a estudiantes universitarios con sus finanzas personales.

CONTEXTO FINANCIERO ACTUAL:
📅 Fecha: {$currentMonth} (Día {$dayOfMonth} de {$daysInMonth})
💰 Presupuesto mensual: \${$totalBudget}
💸 Gastos hasta ahora: \${$monthlyExpenses}
💵 Presupuesto restante: \${$budgetRemaining}
📊 Progreso del mes: {$progressPercentage}%
📈 Gasto diario promedio: \$" . round($monthlyExpenses / max($dayOfMonth, 1), 2) . "
🔮 Proyección de gasto mensual: \${$projectedMonthlySpending}

GASTOS RECIENTES:
{$recentExpensesText}

GASTOS POR CATEGORÍA:
{$categoriesText}

INSTRUCCIONES:
1. Genera un consejo financiero personalizado, práctico y motivador
2. Considera el progreso actual del mes y la proyección
3. Si va bien, felicítalo y sugiere optimizaciones
4. Si va mal, da consejos específicos para mejorar
5. Incluye tips específicos basados en las categorías de mayor gasto
6. Mantén un tono amigable y motivador
7. Máximo 150 palabras
8. Incluye un emoji relevante al inicio

Responde SOLO con el consejo, sin explicaciones adicionales.";

        return $prompt;
    }

    /**
     * Llamar a la API de Groq
     */
    private function callGroqAPI(string $prompt)
    {
        $apiKey = env('GROQ_API_KEY');
        $apiUrl = env('GROQ_API_URL');

        if (!$apiKey) {
            throw new \Exception('GROQ_API_KEY no está configurada');
        }

        Log::info('Intentando llamada a Groq API', [
            'api_url' => $apiUrl,
            'api_key_length' => strlen($apiKey),
            'has_prompt' => !empty($prompt)
        ]);

        try {
            // Configurar el cliente HTTP con opciones SSL para desarrollo
            $httpClient = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30);

            // Deshabilitar verificación SSL solo en desarrollo local
            if (env('APP_ENV') === 'local' || env('APP_DEBUG') === true) {
                $httpClient = $httpClient->withOptions([
                    'verify' => false, // Deshabilitar verificación SSL
                    'curl' => [
                        CURLOPT_SSL_VERIFYPEER => false,
                        CURLOPT_SSL_VERIFYHOST => false,
                    ]
                ]);
            }

            $response = $httpClient->post($apiUrl, [
                'model' => 'llama-3.1-8b-instant', // Modelo actualizado y disponible
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Eres MiChanchito🐖, un asistente financiero inteligente para estudiantes universitarios. Proporcionas consejos financieros personalizados, prácticos y motivadores.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => 300,
                'temperature' => 0.7,
                'top_p' => 0.9,
            ]);

            Log::info('Respuesta de Groq API recibida', [
                'status' => $response->status(),
                'successful' => $response->successful(),
                'body_length' => strlen($response->body())
            ]);

            return $response;
        } catch (\Exception $e) {
            Log::error('Excepción en callGroqAPI', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
