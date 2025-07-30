import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const AiChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [advice, setAdvice] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [context, setContext] = useState(null);

    const getAdvice = async () => {
        setIsLoading(true);
        try {
            // Usar la ruta principal con datos contextuales
            const response = await fetch('/ai-advice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            const data = await response.json();
            console.log('Response data:', data); // Debug
            
            if (data.success) {
                setAdvice(data.advice);
                setContext(data.context);
            } else {
                setAdvice(`❌ Error: ${data.message || 'No se pudo generar un consejo en este momento.'}`);
            }
        } catch (error) {
            console.error('Error al obtener consejo:', error);
            setAdvice(`❌ Error de conexión: ${error.message}. Verifica tu internet e intenta nuevamente.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen && !advice) {
            getAdvice();
        }
    };

    return (
        <>
            {/* Botón flotante del chatbot */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={handleToggleChat}
                    className="bg-pastelGreen hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 group"
                    title="Consejo financiero inteligente"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <div className="relative">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            {/* Pulso animado */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink rounded-full animate-pulse"></div>
                        </div>
                    )}
                </button>
            </div>

            {/* Ventana del chat */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 max-w-[calc(100vw-3rem)]">
                    <div className="bg-white rounded-lg shadow-xl border border-pastelGreen overflow-hidden">
                        {/* Header del chat */}
                        <div className="bg-pastelGreen text-white p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                                        <img src="/imgs/logo.png" alt="MiChanchito" className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm">MiChanchito🐖 IA</h3>
                                        <p className="text-xs text-green-100">Asistente financiero inteligente</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white hover:text-green-200 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Contenido del chat */}
                        <div className="p-4 max-h-80 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-6">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pastelGreen"></div>
                                    <span className="ml-3 text-gray-600">Generando consejo personalizado...</span>
                                </div>
                            ) : advice ? (
                                <div className="space-y-4">
                                    {/* Mensaje del bot */}
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-pastelGreen rounded-full flex items-center justify-center flex-shrink-0">
                                            <img src="/imgs/logo.png" alt="Bot" className="w-5 h-5" />
                                        </div>
                                        <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                                            <p className="text-sm text-gray-800 whitespace-pre-line">{advice}</p>
                                        </div>
                                    </div>

                                    {/* Contexto financiero */}
                                    {context && (
                                        <div className="bg-fondo rounded-lg p-3 text-xs text-gray-600">
                                            <p className="font-medium mb-2">📊 Tu situación actual:</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>💰 Presupuesto: ${context.total_budget}</div>
                                                <div>💸 Gastado: ${context.monthly_expenses}</div>
                                                <div>� Restante: ${context.budget_remaining}</div>
                                                <div>�📈 Progreso: {context.progress_percentage}%</div>
                                                <div>📅 Día {context.day_of_month} del mes</div>
                                                <div>🔮 Proyección: ${context.projected_spending}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 bg-fondo rounded-full flex items-center justify-center mx-auto mb-3">
                                        <img src="/imgs/logo.png" alt="MiChanchito" className="w-8 h-8" />
                                    </div>
                                    <p className="text-gray-600 text-sm">¡Hola! Soy tu asistente financiero inteligente.</p>
                                    <p className="text-gray-500 text-xs mt-1">Haz clic en "Nuevo Consejo" para obtener recomendaciones personalizadas.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer con botones */}
                        <div className="border-t border-gray-200 p-3">
                            <div className="flex space-x-2">
                                <button
                                    onClick={getAdvice}
                                    disabled={isLoading}
                                    className="flex-1 bg-pastelGreen hover:bg-green-600 disabled:bg-gray-300 text-white text-sm py-2 px-3 rounded-md transition-colors duration-200"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Generando...
                                        </span>
                                    ) : (
                                        '🔄 Nuevo Consejo'
                                    )}
                                </button>
                                
                                {advice && (
                                    <button
                                        onClick={() => {
                                            setAdvice('');
                                            setContext(null);
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm py-2 px-3 rounded-md transition-colors duration-200"
                                    >
                                        🗑️ Limpiar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AiChatbot;
