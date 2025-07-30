import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AcademicEvents({ events = [] }) {
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        date: '',
        linked_expense_category: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingEvent) {
            put(route('academic-events.update', editingEvent.id), {
                onSuccess: () => {
                    reset();
                    setShowForm(false);
                    setEditingEvent(null);
                }
            });
        } else {
            post(route('academic-events.store'), {
                onSuccess: () => {
                    reset();
                    setShowForm(false);
                }
            });
        }
    };

    const startEdit = (event) => {
        setEditingEvent(event);
        setData({
            title: event.title,
            date: event.date,
            linked_expense_category: event.linked_expense_category || ''
        });
        setShowForm(true);
    };

    const handleDelete = (event) => {
        if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
            router.delete(route('academic-events.destroy', event.id));
        }
    };

    const cancelEdit = () => {
        setEditingEvent(null);
        reset();
        setShowForm(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-lg font-semibold leading-tight text-black">
                        Eventos Académicos
                    </h2>
                    <p className="text-sm text-pastelGreen">
                        Gestiona tus eventos académicos
                    </p>
                </div>
            }
        >
            <Head title="Eventos Académicos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-pastelGreen">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-pastelGreen">Próximos Eventos</h3>
                                <button 
                                    onClick={() => setShowForm(true)}
                                    className="bg-pastelGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                                >
                                    Agregar Evento
                                </button>
                            </div>

                            {/* Lista de eventos */}
                            <div className="space-y-4">
                                {events.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No hay eventos programados</p>
                                ) : (
                                    events.map((event, index) => (
                                        <div key={event.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-black">{event.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                                                    {event.linked_expense_category && (
                                                        <p className="text-xs text-pastelGreen mt-1">
                                                            Vinculado a: {event.linked_expense_category}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => startEdit(event)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(event)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                        title="Eliminar"
                                                    >
                                                        🗑️
                                                    </button>
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

            {/* Modal para agregar evento */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-w-md mx-4">
                        <h3 className="text-lg font-medium text-pastelGreen mb-4">
                            {editingEvent ? 'Editar Evento' : 'Agregar Nuevo Evento'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-black">Título del Evento</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <div className="text-red-600 text-sm">{errors.title}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Fecha</label>
                                <input 
                                    type="date" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    required
                                />
                                {errors.date && <div className="text-red-600 text-sm">{errors.date}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Categoría vinculada (opcional)</label>
                                <select 
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    value={data.linked_expense_category}
                                    onChange={(e) => setData('linked_expense_category', e.target.value)}
                                >
                                    <option value="">Sin vincular</option>
                                    <option value="Comida">Comida</option>
                                    <option value="Transporte">Transporte</option>
                                    <option value="Educación">Educación</option>
                                    <option value="Entretenimiento">Entretenimiento</option>
                                    <option value="Otros">Otros</option>
                                </select>
                                {errors.linked_expense_category && <div className="text-red-600 text-sm">{errors.linked_expense_category}</div>}
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button 
                                    type="submit" 
                                    className="bg-pastelGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex-1"
                                    disabled={processing}
                                >
                                    {processing ? (editingEvent ? 'Actualizando...' : 'Guardando...') : (editingEvent ? 'Actualizar' : 'Guardar')}
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
