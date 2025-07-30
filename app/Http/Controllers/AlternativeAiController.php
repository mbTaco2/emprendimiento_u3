<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AlternativeAiController extends Controller
{
    /**
     * Obtener consejo usando OpenAI GPT-3.5-turbo
     */
    public function getOpenAIAdvice(Request $request): JsonResponse
    {
        try {
            $context = $this->getFinancialContext($request->user());
            $prompt = $this->buildPrompt($context);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Eres MiChanchito🐖, un asistente financiero para estudiantes.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => 300,
                'temperature' => 0.7,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'success' => true,
                    'advice' => $data['choices'][0]['message']['content'],
                    'context' => $context
                ]);
            }

            return response()->json(['success' => false, 'message' => 'Error con OpenAI'], 500);
        } catch (\Exception $e) {
            Log::error('Error en OpenAI: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error interno'], 500);
        }
    }

    /**
     * Obtener consejo usando Hugging Face (Llama 2)
     */
    public function getHuggingFaceAdvice(Request $request): JsonResponse
    {
        try {
            $context = $this->getFinancialContext($request->user());
            $prompt = $this->buildSimplePrompt($context);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('HF_API_KEY'),
                'Content-Type' => 'application/json',
            ])->timeout(60)->post('https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf', [
                'inputs' => $prompt,
                'parameters' => [
                    'max_new_tokens' => 200,
                    'temperature' => 0.7,
                    'return_full_text' => false
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $advice = $data[0]['generated_text'] ?? 'Consejo no disponible';

                return response()->json([
                    'success' => true,
                    'advice' => "🐖 " . trim($advice),
                    'context' => $context
                ]);
            }

            return response()->json(['success' => false, 'message' => 'Error con Hugging Face'], 500);
        } catch (\Exception $e) {
            Log::error('Error en Hugging Face: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error interno'], 500);
        }
    }

    /**
     * Obtener consejo usando Claude (Anthropic)
     */
    public function getClaudeAdvice(Request $request): JsonResponse
    {
        try {
            $context = $this->getFinancialContext($request->user());
            $prompt = $this->buildPrompt($context);

            $response = Http::withHeaders([
                'x-api-key' => env('ANTHROPIC_API_KEY'),
                'Content-Type' => 'application/json',
                'anthropic-version' => '2023-06-01'
            ])->timeout(30)->post('https://api.anthropic.com/v1/messages', [
                'model' => 'claude-3-haiku-20240307',
                'max_tokens' => 300,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'success' => true,
                    'advice' => $data['content'][0]['text'],
                    'context' => $context
                ]);
            }

            return response()->json(['success' => false, 'message' => 'Error con Claude'], 500);
        } catch (\Exception $e) {
            Log::error('Error en Claude: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error interno'], 500);
        }
    }

    /**
     * Obtener contexto financiero del usuario
     */
    private function getFinancialContext($user): array
    {
        $monthlyExpenses = $user->expenses()
            ->whereMonth('expense_date', Carbon::now()->month)
            ->whereYear('expense_date', Carbon::now()->year)
            ->sum('amount');

        $totalBudget = $user->budgets()
            ->whereMonth('month', Carbon::now()->month)
            ->whereYear('month', Carbon::now()->year)
            ->sum('amount');

        $dayOfMonth = Carbon::now()->day;
        $progressPercentage = $totalBudget > 0 ? ($monthlyExpenses / $totalBudget) * 100 : 0;

        return [
            'monthly_expenses' => $monthlyExpenses,
            'total_budget' => $totalBudget,
            'progress_percentage' => round($progressPercentage, 2),
            'day_of_month' => $dayOfMonth
        ];
    }

    /**
     * Construir prompt para modelos avanzados
     */
    private function buildPrompt(array $context): string
    {
        return "Como MiChanchito🐖, asistente financiero para estudiantes, da un consejo personalizado basado en:
- Presupuesto: \${$context['total_budget']}
- Gastos: \${$context['monthly_expenses']} 
- Progreso: {$context['progress_percentage']}%
- Día: {$context['day_of_month']} del mes

Responde en máximo 150 palabras con un consejo práctico y motivador.";
    }

    /**
     * Construir prompt simple para modelos básicos
     */
    private function buildSimplePrompt(array $context): string
    {
        $status = $context['progress_percentage'] > 80 ? "gastando mucho" : ($context['progress_percentage'] > 50 ? "gastando normal" : "gastando poco");

        return "Eres un asistente financiero. El usuario tiene presupuesto de \${$context['total_budget']}, ha gastado \${$context['monthly_expenses']} y está {$status}. Da un consejo financiero en 100 palabras:";
    }
}
