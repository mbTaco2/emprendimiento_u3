import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Budgets({ budgets = [] }) {
    const [showForm, setShowForm] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        total: '',
        period: 'Mensual',
        categories: {},
        recommendations: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingBudget) {
            put(route('budgets.update', editingBudget.id), {
                onSuccess: () => {
                    reset();
                    setShowForm(false);
                    setEditingBudget(null);
                }
            });
        } else {
            post(route('budgets.store'), {
                onSuccess: () => {
                    reset();
                    setShowForm(false);
                }
            });
        }
    };

    const startEdit = (budget) => {
        setEditingBudget(budget);
        setData({
            total: budget.total_amount.toString(),
            period: budget.period,
            categories: budget.categories || {},
            recommendations: budget.recommendations || ''
        });
        setShowForm(true);
    };

    const handleDelete = (budget) => {
        if (confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
            router.delete(route('budgets.destroy', budget.id));
        }
    };

    const cancelEdit = () => {
        setEditingBudget(null);
        reset();
        setShowForm(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-lg font-semibold leading-tight text-black">
                        Presupuestos
                    </h2>
                    <p className="text-sm text-pastelGreen">
                        Administra tus presupuestos
                    </p>
                </div>
            }
        >
            <Head title="Presupuestos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-pastelGreen">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-pastelGreen">Lista de Presupuestos</h3>
                                <button 
                                    onClick={() => setShowForm(true)}
                                    className="bg-pastelGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                                >
                                    Crear Presupuesto
                                </button>
                            </div>

                            {/* Lista de presupuestos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {budgets.length === 0 ? (
                                    <div className="col-span-full text-gray-500 text-center py-8">
                                        No hay presupuestos creados
                                    </div>
                                ) : (
                                    budgets.map((budget, index) => (
                                        <div key={budget.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="mb-3 flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-black">{budget.period}</h4>
                                                    <p className="text-sm text-gray-600">Presupuesto Total</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startEdit(budget)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(budget)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                        title="Eliminar"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Presupuesto:</span>
                                                    <span className="font-semibold text-pastelGreen">${budget.total_amount}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Gastado:</span>
                                                    <span className="font-semibold text-pink">${budget.spent || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Disponible:</span>
                                                    <span className="font-semibold text-black">${budget.remaining || (budget.total_amount - (budget.spent || 0))}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                    <div 
                                                        className="bg-pastelGreen h-2 rounded-full transition-all duration-300" 
                                                        style={{ width: `${Math.min(((budget.spent || 0) / budget.total_amount) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                {budget.recommendations && (
                                                    <div className="mt-2 text-xs text-gray-500 italic">
                                                        {budget.recommendations}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para crear presupuesto */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-w-md mx-4">
                        <h3 className="text-lg font-medium text-pastelGreen mb-4">
                            {editingBudget ? 'Editar Presupuesto' : 'Crear Nuevo Presupuesto'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-black">Monto Total</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    value={data.total}
                                    onChange={(e) => setData('total', e.target.value)}
                                    required
                                />
                                {errors.total && <div className="text-red-600 text-sm">{errors.total}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Período</label>
                                <select 
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    value={data.period}
                                    onChange={(e) => setData('period', e.target.value)}
                                >
                                    <option value="Semanal">Semanal</option>
                                    <option value="Mensual">Mensual</option>
                                    <option value="Trimestral">Trimestral</option>
                                    <option value="Anual">Anual</option>
                                </select>
                                {errors.period && <div className="text-red-600 text-sm">{errors.period}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Recomendaciones (Opcional)</label>
                                <textarea 
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    rows="3"
                                    value={data.recommendations}
                                    onChange={(e) => setData('recommendations', e.target.value)}
                                    placeholder="Consejos para este presupuesto..."
                                />
                                {errors.recommendations && <div className="text-red-600 text-sm">{errors.recommendations}</div>}
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button 
                                    type="submit" 
                                    className="bg-pastelGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex-1"
                                    disabled={processing}
                                >
                                    {processing ? (editingBudget ? 'Actualizando...' : 'Creando...') : (editingBudget ? 'Actualizar' : 'Crear')}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={cancelEdit}
                                    className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition-colors flex-1"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
