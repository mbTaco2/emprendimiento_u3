# 🤖 Configuración del Chatbot de IA - MiChanchito🐖

## 📋 Instrucciones para Configurar Groq API (GRATIS)

### **Paso 1: Crear cuenta en Groq (Gratuito)**
1. Ve a: https://console.groq.com/
2. Regístrate con tu email o GitHub
3. Completa la verificación

### **Paso 2: Obtener API Key**
1. En el dashboard, ve a **"API Keys"**
2. Haz clic en **"Create API Key"**
3. Dale un nombre como "MiChanchito-Chatbot"
4. Copia la API key generada

### **Paso 3: Configurar en Laravel**
1. Abre el archivo `.env` en la raíz del proyecto
2. Busca la línea que dice: `GROQ_API_KEY=your_groq_api_key_here`
3. Reemplaza `your_groq_api_key_here` con tu API key real

**Ejemplo:**
```
GROQ_API_KEY=gsk_abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx
```

### **Paso 4: Probar el Chatbot**
1. Guarda el archivo `.env`
2. Reinicia el servidor de Laravel: `php artisan serve`
3. Ve al dashboard y busca el botón circular en la esquina inferior derecha
4. ¡Haz clic y prueba tu chatbot de IA!

## 🎯 **Características del Chatbot**

### **🧠 Inteligencia Contextual**
- Analiza tu presupuesto mensual
- Considera tus gastos actuales  
- Evalúa tu progreso del mes
- Revisa las categorías de mayor gasto
- Toma en cuenta el día actual del mes

### **💡 Consejos Personalizados**
- Recomendaciones específicas según tu situación
- Consejos de ahorro basados en patrones de gasto
- Alertas cuando estés gastando mucho
- Motivación cuando vayas bien
- Tips específicos por categorías

### **📱 Interfaz Responsive**
- Botón flotante siempre visible
- Chat responsive para móvil y desktop
- Animaciones suaves
- Loading states profesionales

## 🔧 **Alternativas de IA (si Groq no funciona)**

### **OpenAI GPT-3.5 Turbo**
```env
# Cambiar en .env
OPENAI_API_KEY=sk-...
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
```

### **Hugging Face (Gratis)**
```env
# Cambiar en .env  
HF_API_KEY=hf_...
HF_API_URL=https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf
```

## ⚠️ **Solución de Problemas**

### **Error: "GROQ_API_KEY no está configurada"**
- Verifica que pusiste la API key en `.env`
- Reinicia el servidor de Laravel
- Asegúrate de no tener espacios extra

### **Error: "Error de conexión"**
- Verifica tu conexión a internet
- Comprueba que la API key sea válida
- Revisa que Groq esté funcionando

### **El chatbot no aparece**
- Recompila los assets: `npm run build`
- Revisa la consola del navegador por errores
- Verifica que estés logueado

## 🚀 **¡Listo para usar!**

Tu chatbot financiero inteligente está configurado. Ahora **MiChanchito🐖** puede darte consejos personalizados basados en tu situación financiera real.

**Características destacadas:**
- ✅ 100% Gratis con Groq
- ✅ Consejos basados en datos reales
- ✅ Interfaz moderna y responsive  
- ✅ Contextual e inteligente
- ✅ Disponible 24/7

¡Disfruta de tu nuevo asistente financiero inteligente! 🐖💰
