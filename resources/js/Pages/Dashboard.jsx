import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard({ 
    auth,
    monthlyExpenses = 0, 
    totalBudget = 0, 
    recentExpenses = [], 
    expensesByCategory = [],
    upcomingEvents = [],
    currentMonth = "Julio 2025"
}) {
    const [showWelcome, setShowWelcome] = useState(false);

    // Verificar si el popup ya se mostró en esta sesión de usuario
    useEffect(() => {
        // Generar un identificador único para esta sesión de login
        const currentLoginSession = localStorage.getItem('currentLoginSession');
        const userLoginKey = `welcomeShown_${auth.user.id}`;
        const now = new Date().getTime();
        
        // Si no hay sesión actual, crear una nueva
        if (!currentLoginSession) {
            const newSessionId = `${auth.user.id}_${now}`;
            localStorage.setItem('currentLoginSession', newSessionId);
            setShowWelcome(true);
        } else {
            // Verificar si ya se mostró el popup en esta sesión de login
            const welcomeShownInThisSession = localStorage.getItem(`${userLoginKey}_${currentLoginSession}`);
            if (!welcomeShownInThisSession) {
                setShowWelcome(true);
            }
        }
    }, [auth.user.id]);

    const handleCloseWelcome = () => {
        setShowWelcome(false);
        // Marcar como visto en esta sesión de login específica
        const currentLoginSession = localStorage.getItem('currentLoginSession');
        const userLoginKey = `welcomeShown_${auth.user.id}`;
        localStorage.setItem(`${userLoginKey}_${currentLoginSession}`, 'true');
    };

    // Usar los datos que vienen del controlador
    const topCategories = expensesByCategory.slice(0, 5);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-lg font-semibold leading-tight text-black">
                        Dashboard
                    </h2>
                    <p className="text-sm text-pastelGreen">
                        Panel de control principal
                    </p>
                </div>
            }
        >
            <Head title="Dashboard" />

            {/* Pop-up de bienvenida */}
            {showWelcome && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md mx-4 relative">
                        <button 
                            onClick={handleCloseWelcome}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="text-center">
                            <div className="mb-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-fondo rounded flex items-center justify-center mx-auto mb-4">
                                    <img src="imgs/logo.png" alt="" className="w-8 h-8 sm:w-12 sm:h-12" />
                                </div>
                                <h3 className="text-base sm:text-lg font-medium text-pastelGreen mb-2">¡Bienvenido a <span className="font-bold text-pink">MiChanchito🐖</span></h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Tu asistente personal para el manejo inteligente de finanzas estudiantiles. 
                                    Aquí podrás controlar tus gastos, establecer presupuestos y recibir consejos útiles.
                                </p>
                            </div>
                            <button 
                                onClick={handleCloseWelcome}
                                className="bg-pastelGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors w-full text-sm sm:text-base"
                            >
                                Comenzar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Widgets principales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        {/* Widget de gastos mensuales */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-pastelGreen">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-3 sm:ml-4">
                                        <h3 className="text-sm sm:text-lg font-medium text-black">Gastos del Mes</h3>
                                        <p className="text-lg sm:text-2xl font-bold text-pink">${monthlyExpenses.toFixed(2)}</p>
                                        <p className="text-xs sm:text-sm text-gray-500">{currentMonth}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Widget de presupuesto disponible */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-pastelGreen">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pastelGreen rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-3 sm:ml-4">
                                        <h3 className="text-sm sm:text-lg font-medium text-black">Presupuesto Disponible</h3>
                                        <p className="text-lg sm:text-2xl font-bold text-pastelGreen">${(totalBudget - monthlyExpenses).toFixed(2)}</p>
                                        <p className="text-xs sm:text-sm text-gray-500">De ${totalBudget.toFixed(2)} total</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Widget de progreso */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-pastelGreen">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-fondo rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-3 sm:ml-4">
                                        <h3 className="text-sm sm:text-lg font-medium text-black">Progreso del Mes</h3>
                                        <p className="text-lg sm:text-2xl font-bold text-black">{totalBudget > 0 ? Math.round((monthlyExpenses / totalBudget) * 100) : 0}%</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div 
                                                className="bg-pastelGreen h-2 rounded-full transition-all duration-300" 
                                                style={{ width: `${totalBudget > 0 ? Math.min((monthlyExpenses / totalBudget) * 100, 100) : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historial detallado */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Gastos recientes */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-pastelGreen">
                            <div className="p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-medium text-pastelGreen mb-4">Gastos Recientes</h3>
                                <div className="space-y-3">
                                    {recentExpenses.length === 0 ? (
                                        <div className="text-center py-6 sm:py-8">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <p className="text-sm sm:text-base text-gray-500">No hay gastos registrados</p>
                                            <p className="text-xs sm:text-sm text-gray-400">¡Empieza a registrar tus gastos!</p>
                                        </div>
                                    ) : (
                                        recentExpenses.slice(0, 5).map((expense, index) => (
                                            <div key={index} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1 min-w-0 mr-2">
                                                    <p className="font-medium text-black text-sm sm:text-base truncate">{expense.description}</p>
                                                    <p className="text-xs sm:text-sm text-gray-600">{expense.category}</p>
                                                </div>
                                                <p className="font-semibold text-pink text-sm sm:text-base">${expense.amount}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Gastos por categoría */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-pastelGreen">
                            <div className="p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-medium text-pastelGreen mb-4">Gastos por Categoría</h3>
                                <div className="space-y-3">
                                    {topCategories.length === 0 ? (
                                        <div className="text-center py-6 sm:py-8">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm sm:text-base text-gray-500">Sin datos de categorías</p>
                                            <p className="text-xs sm:text-sm text-gray-400">Los gastos se mostrarán aquí</p>
                                        </div>
                                    ) : (
                                        topCategories.map((item) => (
                                            <div key={item.category} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center flex-1 min-w-0 mr-2">
                                                    <div className="w-3 h-3 bg-pastelGreen rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                                                    <span className="font-medium text-black text-sm sm:text-base truncate">{item.category}</span>
                                                </div>
                                                <span className="font-semibold text-pink text-sm sm:text-base">${item.total.toFixed(2)}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
