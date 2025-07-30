import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Tips({ tips = [] }) {
    const [showForm, setShowForm] = useState(false);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-lg font-semibold leading-tight text-black">
                        Consejos Financieros
                    </h2>
                    <p className="text-sm text-pastelGreen">
                        Tips para tu economía estudiantil
                    </p>
                </div>
            }
        >
            <Head title="Consejos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-pastelGreen">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-pastelGreen">Consejos Útiles</h3>
                                <button 
                                    onClick={() => setShowForm(true)}
                                    className="bg-pastelGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                                >
                                    Agregar Consejo
                                </button>
                            </div>

                            {/* Lista de consejos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tips.length === 0 ? (
                                    <div className="col-span-full text-gray-500 text-center py-8">
                                        No hay consejos disponibles
                                    </div>
                                ) : (
                                    tips.map((tip, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="mb-3">
                                                <h4 className="font-medium text-black">{tip.title}</h4>
                                                <span className="inline-block bg-pastelGreen text-white text-xs px-2 py-1 rounded-full mt-1">
                                                    {tip.category}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-3">{tip.content}</p>
                                            {tip.author && (
                                                <p className="text-xs text-gray-500 italic">Por: {tip.author}</p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Consejos predeterminados si no hay datos */}
                            {tips.length === 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <h4 className="font-medium text-black mb-2">💰 Presupuesto Estudiantil</h4>
                                        <p className="text-sm text-gray-700">Destina el 50% de tus ingresos a gastos esenciales, 30% a entretenimiento y 20% para ahorros.</p>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <h4 className="font-medium text-black mb-2">🍽️ Comida Inteligente</h4>
                                        <p className="text-sm text-gray-700">Cocina en casa y lleva tu almuerzo. Puedes ahorrar hasta $200 al mes.</p>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <h4 className="font-medium text-black mb-2">📚 Materiales de Estudio</h4>
                                        <p className="text-sm text-gray-700">Compra libros usados o digitales. Utiliza la biblioteca de tu universidad.</p>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <h4 className="font-medium text-black mb-2">🚌 Transporte</h4>
                                        <p className="text-sm text-gray-700">Usa pases estudiantiles y camina cuando sea posible. Considera compartir viajes.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para agregar consejo */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-w-md mx-4">
                        <h3 className="text-lg font-medium text-pastelGreen mb-4">Agregar Nuevo Consejo</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-black">Título</label>
                                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Categoría</label>
                                <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                                    <option>Ahorro</option>
                                    <option>Presupuesto</option>
                                    <option>Comida</option>
                                    <option>Transporte</option>
                                    <option>Estudios</option>
                                    <option>General</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Contenido</label>
                                <textarea rows="3" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button type="submit" className="bg-pastelGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex-1">
                                    Guardar
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowForm(false)}
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
