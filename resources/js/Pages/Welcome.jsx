import React from 'react';

const Welcome = ({ canLogin, canRegister }) => {
  return (
    <div className="relative bg-cover bg-center h-screen" style={{ backgroundImage: "url('/imgs/fondo.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>  {/* Sombra oscura */}
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6 sm:px-8 md:px-16">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-pastelGreen mb-4">
          Bienvenido a <span className="text-pink">MiChanchito🐖</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-6 text-gray-200">
          Una plataforma para ayudar a los estudiantes a controlar y optimizar sus finanzas universitarias. 
          Automatiza tu presupuesto y mejora tu educación financiera.
        </p>

        <div className="space-x-4 flex flex-col sm:flex-row">
          {canLogin && (
            <a href="/login" className="bg-pastelGreen text-black py-3 px-6 rounded-lg text-xl font-semibold hover:bg-green-700 transition duration-300 mb-4 sm:mb-0">
              Iniciar Sesión
            </a>
          )}
          {canRegister && (
            <a href="/register" className="bg-pink text-black py-3 px-6 rounded-lg text-xl font-semibold hover:bg-purple-700 transition duration-300">
              Registrarse
            </a>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pastelGreen mb-4">¿Por qué elegirnos?</h2>
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto">
            Nuestro objetivo es hacer que la gestión financiera de los estudiantes sea simple, eficiente y accesible, 
            proporcionando herramientas que te permitan ahorrar tiempo y tomar mejores decisiones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
