import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Expenses({ expenses = [] }) {
    const [showForm, setShowForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        description: '',
        category: '',
        amount: '',
        date: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingExpense) {
            put(route('expenses.update', editingExpense.id), {
                onSuccess: () => {
                    reset();
                    setShowForm(false);
                    setEditingExpense(null);
                }
            });
        } else {
            post(route('expenses.store'), {
                onSuccess: () => {
                    reset();
                    setShowForm(false);
                }
            });
        }
    };

    const startEdit = (expense) => {
        setEditingExpense(expense);
        setData({
            description: expense.description,
            category: expense.category,
            amount: expense.amount.toString(),
            date: expense.date
        });
        setShowForm(true);
    };

    const handleDelete = (expense) => {
        if (confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
            router.delete(route('expenses.destroy', expense.id));
        }
    };

    const cancelEdit = () => {
        setEditingExpense(null);
        reset();
        setShowForm(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-lg font-semibold leading-tight text-black">
                        Gastos
                    </h2>
                    <p className="text-sm text-pastelGreen">
                        Gestiona tus gastos
                    </p>
                </div>
            }
        >
            <Head title="Gastos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-pastelGreen">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-pastelGreen">Lista de Gastos</h3>
                                <button 
                                    onClick={() => setShowForm(true)}
                                    className="bg-pastelGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                                >
                                    Agregar Gasto
                                </button>
                            </div>

                            {/* Lista de gastos */}
                            <div className="space-y-4">
                                {expenses.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No hay gastos registrados</p>
                                ) : (
                                    expenses.map((expense, index) => (
                                        <div key={expense.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-black">{expense.description}</h4>
                                                    <p className="text-sm text-gray-600">{expense.category}</p>
                                                    <p className="text-xs text-gray-500">{expense.formatted_date || expense.date}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <p className="font-semibold text-pink">${expense.amount}</p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => startEdit(expense)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                            title="Editar"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(expense)}
                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                            title="Eliminar"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para agregar gasto */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-w-md mx-4">
                        <h3 className="text-lg font-medium text-pastelGreen mb-4">
                            {editingExpense ? 'Editar Gasto' : 'Agregar Nuevo Gasto'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-black">Descripción</label>
                                <input 
                                    type="text" 
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" 
                                    required
                                />
                                {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Categoría</label>
                                <select 
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                >
                                    <option value="">Seleccionar categoría</option>
                                    <option value="Comida">Comida</option>
                                    <option value="Transporte">Transporte</option>
                                    <option value="Educación">Educación</option>
                                    <option value="Entretenimiento">Entretenimiento</option>
                                    <option value="Otros">Otros</option>
                                </select>
                                {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Monto</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" 
                                    required
                                />
                                {errors.amount && <span className="text-red-500 text-sm">{errors.amount}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Fecha</label>
                                <input 
                                    type="date" 
                                    value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" 
                                    required
                                />
                                {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-pastelGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex-1 disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : (editingExpense ? 'Actualizar' : 'Guardar')}
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
