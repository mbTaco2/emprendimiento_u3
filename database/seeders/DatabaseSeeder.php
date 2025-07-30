<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Expense;
use App\Models\Budget;
use App\Models\AcademicEvent;
use App\Models\Tip;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear usuario de prueba
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Usuario de Prueba',
                'password' => Hash::make('password'),
            ]
        );

        // Crear gastos de ejemplo
        $expenses = [
            ['description' => 'Almuerzo universitario', 'category' => 'Comida', 'amount' => 15.50, 'date' => '2025-07-29'],
            ['description' => 'Transporte público', 'category' => 'Transporte', 'amount' => 8.00, 'date' => '2025-07-29'],
            ['description' => 'Libro de texto', 'category' => 'Educación', 'amount' => 45.00, 'date' => '2025-07-28'],
            ['description' => 'Café con amigos', 'category' => 'Entretenimiento', 'amount' => 12.25, 'date' => '2025-07-28'],
            ['description' => 'Materiales de arte', 'category' => 'Educación', 'amount' => 25.00, 'date' => '2025-07-27'],
            ['description' => 'Almuerzo', 'category' => 'Comida', 'amount' => 18.75, 'date' => '2025-07-26'],
            ['description' => 'Bus a casa', 'category' => 'Transporte', 'amount' => 6.50, 'date' => '2025-07-26'],
            ['description' => 'Cine', 'category' => 'Entretenimiento', 'amount' => 22.00, 'date' => '2025-07-25'],
        ];

        foreach ($expenses as $expense) {
            Expense::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'description' => $expense['description'],
                    'date' => $expense['date']
                ],
                [
                    'category' => $expense['category'],
                    'amount' => $expense['amount']
                ]
            );
        }

        // Crear presupuestos de ejemplo
        $budgets = [
            [
                'total' => 200.00,
                'period' => 'Mensual',
                'categories' => ['Comida' => 200.00],
                'recommendations' => 'Cocinar en casa para ahorrar dinero'
            ],
            [
                'total' => 80.00,
                'period' => 'Mensual',
                'categories' => ['Transporte' => 80.00],
                'recommendations' => 'Usar transporte público y caminar cuando sea posible'
            ],
            [
                'total' => 150.00,
                'period' => 'Mensual',
                'categories' => ['Educación' => 150.00],
                'recommendations' => 'Comprar libros usados o digitales'
            ],
            [
                'total' => 100.00,
                'period' => 'Mensual',
                'categories' => ['Entretenimiento' => 100.00],
                'recommendations' => 'Buscar actividades gratuitas en la universidad'
            ]
        ];

        foreach ($budgets as $budget) {
            Budget::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'period' => $budget['period'],
                    'total' => $budget['total']
                ],
                [
                    'categories' => $budget['categories'],
                    'recommendations' => $budget['recommendations']
                ]
            );
        }

        // Crear eventos académicos de ejemplo
        $events = [
            ['title' => 'Examen Final - Matemáticas', 'date' => '2025-08-15', 'linked_expense_category' => 'Educación'],
            ['title' => 'Entrega de Proyecto', 'date' => '2025-08-10', 'linked_expense_category' => null],
            ['title' => 'Conferencia de Tecnología', 'date' => '2025-08-20', 'linked_expense_category' => 'Transporte'],
            ['title' => 'Presentación Final', 'date' => '2025-08-25', 'linked_expense_category' => null],
            ['title' => 'Seminario de Emprendimiento', 'date' => '2025-09-05', 'linked_expense_category' => 'Educación'],
        ];

        foreach ($events as $event) {
            AcademicEvent::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'title' => $event['title'],
                    'date' => $event['date']
                ],
                [
                    'linked_expense_category' => $event['linked_expense_category']
                ]
            );
        }

        // Crear consejos de ejemplo
        $tips = [
            [
                'title' => 'Presupuesto 50/30/20',
                'content' => 'Destina el 50% de tus ingresos a gastos esenciales, 30% a entretenimiento y 20% para ahorros. Esta regla te ayudará a mantener un equilibrio financiero.',
                'tags' => 'Presupuesto,Ahorro,Finanzas'
            ],
            [
                'title' => 'Ahorro en Comida',
                'content' => 'Prepara tu comida en casa y llévala a la universidad. Puedes ahorrar hasta $150 al mes comparado con comprar comida diariamente.',
                'tags' => 'Comida,Ahorro,Universidad'
            ],
            [
                'title' => 'Libros de Segunda Mano',
                'content' => 'Compra libros usados o digitales para ahorrar en materiales de estudio. También puedes intercambiar libros con otros estudiantes.',
                'tags' => 'Educación,Ahorro,Libros'
            ],
            [
                'title' => 'Transporte Inteligente',
                'content' => 'Usa pases estudiantiles, camina cuando sea posible y considera compartir viajes con otros estudiantes para reducir gastos de transporte.',
                'tags' => 'Transporte,Ahorro,Universidad'
            ],
            [
                'title' => 'Actividades Gratuitas',
                'content' => 'Busca eventos y actividades gratuitas en tu universidad. Muchas veces hay conferencias, talleres y eventos sociales sin costo.',
                'tags' => 'Entretenimiento,Universidad,Gratuito'
            ],
            [
                'title' => 'Control de Gastos Hormiga',
                'content' => 'Registra todos tus gastos pequeños diarios como café, snacks, etc. Estos "gastos hormiga" pueden sumar cantidades significativas al mes.',
                'tags' => 'Gastos,Control,Finanzas'
            ]
        ];

        foreach ($tips as $tip) {
            Tip::firstOrCreate(
                [
                    'title' => $tip['title']
                ],
                [
                    'content' => $tip['content'],
                    'tags' => $tip['tags']
                ]
            );
        }
    }
}
