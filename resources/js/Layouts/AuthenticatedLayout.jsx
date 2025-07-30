import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import AiChatbot from '@/Components/AiChatbot';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        // Limpiar la sesión de login actual antes de hacer logout
        localStorage.removeItem('currentLoginSession');
        // También limpiar todas las claves de welcome para este usuario
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(`welcomeShown_${user.id}_`)) {
                localStorage.removeItem(key);
            }
        });
        // Proceder con el logout
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-fondo">
            <div className="flex h-screen">
                {/* Mobile menu button */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-pastelGreen text-white shadow-lg"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div 
                        className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:w-64 xl:w-72`}>
                    <div className="flex items-center justify-between h-16 px-4 border-b border-pastelGreen">
                        <Link href="/" className="flex items-center">
                            <ApplicationLogo className="block h-8 w-auto fill-current text-pastelGreen" />
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-pastelGreen hover:text-pink transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Sidebar Header */}
                    {header && (
                        <div className="p-4 border-b border-pastelGreen bg-white">
                            <div className="text-black text-sm sm:text-base">
                                {header}
                            </div>
                        </div>
                    )}
                    
                    {/* Navigation Links */}
                    <nav className="mt-4 px-4">
                        <div className="space-y-2">
                            <NavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    route().current('dashboard') 
                                        ? 'bg-pastelGreen text-white' 
                                        : 'text-black hover:text-white hover:bg-pastelGreen'
                                }`}
                            >
                                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14l-4-2-4 2V5z" />
                                </svg>
                                Dashboard
                            </NavLink>
                            
                            {/* Aquí puedes agregar más opciones de navegación */}
                            <NavLink
                                href={route('academic-events')}
                                active={route().current('academic-events')}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    route().current('academic-events') 
                                        ? 'bg-pastelGreen text-white' 
                                        : 'text-black hover:text-white hover:bg-pastelGreen'
                                }`}
                            >
                                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Eventos Académicos
                            </NavLink>
                            
                            <NavLink
                                href={route('budgets')}
                                active={route().current('budgets')}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    route().current('budgets') 
                                        ? 'bg-pastelGreen text-white' 
                                        : 'text-black hover:text-white hover:bg-pastelGreen'
                                }`}
                            >
                                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                Presupuestos
                            </NavLink>
                            
                            <NavLink
                                href={route('expenses')}
                                active={route().current('expenses')}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    route().current('expenses') 
                                        ? 'bg-pastelGreen text-white' 
                                        : 'text-black hover:text-white hover:bg-pastelGreen'
                                }`}
                            >
                                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Gastos
                            </NavLink>
                        </div>
                    </nav>
                    
                    {/* User Menu */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-pastelGreen bg-white">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-left text-black bg-white border border-pastelGreen rounded-md hover:bg-fondo transition-colors duration-200">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-8 h-8 bg-pastelGreen rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-white">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium">{user.name}</p>
                                        </div>
                                    </div>
                                    <svg className="ml-auto h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>
                                    Perfil
                                </Dropdown.Link>
                                <button 
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                                >
                                    Cerrar Sesión
                                </button>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 lg:ml-0">
                    {/* Mobile menu button */}
                    <div className="lg:hidden bg-white border-b border-pastelGreen">
                        <div className="px-4 py-2">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="text-pastelGreen hover:text-pink transition-colors duration-200"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <main className="min-h-screen">{children}</main>
                </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Chatbot de IA */}
            <AiChatbot />
        </div>
    );
}
