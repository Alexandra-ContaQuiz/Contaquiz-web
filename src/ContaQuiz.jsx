import { useState, useEffect, useRef } from "react";
import {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion,
  escucharSesion,
  obtenerPerfil,
  incrementarPreguntasGratis,
  registrarResultadoQuiz,
  activarPremium,
  obtenerRankingGlobal,
  recuperarContrasena,
} from "./firebaseConfig.js";

/* ─────────────────────────────────────────
   🌍 TRADUCCIONES (ES / EN) — interfaz
   Las preguntas del banco siguen en español
   por ahora; solo se traduce la interfaz.
───────────────────────────────────────── */
const TEXTOS = {
  es: {
    bienvenida: "Te damos la bienvenida a",
    eslogan1: "\"Fortalece tus conocimientos,",
    eslogan2: "una respuesta a la vez.\"",
    subtitulo: "Plataforma educativa interactiva de Contabilidad · NIC · NIIF · Auditoría",
    jugarAhora: "¡Jugar Ahora! 🎯",
    statPreguntas: "Preguntas", statModulos: "Módulos", statTipos: "Tipos de Quiz", statRanking: "Ranking Global",
    iniciarSesionTitulo: "Inicia sesión para continuar",
    crearCuentaTitulo: "Crea tu cuenta gratis",
    tabLogin: "Iniciar Sesión", tabRegistro: "Registrarse",
    nombreCompleto: "Nombre completo", correoElectronico: "Correo electrónico", contrasena: "Contraseña", confirmarContrasena: "Confirmar contraseña",
    placeholderNombre: "Ej. María González", placeholderCorreo: "tucorreo@ejemplo.com", placeholderPass: "Mínimo 6 caracteres", placeholderConfirmar: "Repite tu contraseña",
    nombreValido: "✅ Nombre válido", correoValido: "✅ Correo válido", correoInvalido: "⚠️ Formato de correo inválido",
    passCoinciden: "✅ Las contraseñas coinciden", passNoCoinciden: "❌ Las contraseñas no coinciden",
    passFuerte: "🔐 Contraseña fuerte", passMedia: "🔑 Contraseña aceptable", passDebil: "⚠️ Contraseña débil (muy corta)",
    passConsejo: "Para contraseña fuerte: 10+ caracteres, mayúsculas y números",
    procesando: "Procesando...", iniciarSesionBtn: "Iniciar Sesión →", crearCuentaBtn: "Crear Cuenta →",
    o: "o", probarGratis: "🎁 Probar gratis (3 preguntas sin registro)",
    datosSeguros: "🔒 Tus datos están seguros · Sin necesidad de tarjeta de crédito",
    yaTienesCuenta: "¿Ya tienes cuenta? Inicia sesión",
    olvidasteContrasena: "¿Olvidaste tu contraseña?",
    recuperarTitulo: "Recuperar contraseña",
    recuperarDesc: "Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.",
    recuperarBtn: "Enviar enlace de recuperación",
    volverALogin: "← Volver a iniciar sesión",
    continuaRegistroTitulo: "¡Vas muy bien! 🎉",
    continuaRegistroDesc: "Ya respondiste tus 3 preguntas gratis. Crea tu cuenta gratis para seguir con las 7 restantes y guardar tu progreso.",
    seleccionaModulo: "Selecciona un Módulo",
    accesoCompleto: "Acceso completo a todos los módulos",
    modoGratuito: "Modo gratuito",
    preguntasDisponibles: "preguntas disponibles",
    puntuacionTotal: "Puntuación Total", insignias: "Insignias", estado: "Estado", premium: "Premium ✨", gratis: "Gratis",
    ranking: "Ranking", verPosicion: "Ver posición",
    desbloquea: "¡Desbloquea el acceso completo!",
    desbloqueaDesc: "500+ preguntas · Todos los niveles · Ranking global · Insignias exclusivas",
    suscribirseDesde: "Suscribirse desde $4.99/mes →",
    ajustes: "⚙️ Ajustes y Configuración",
    salir: "← Salir",
    ptsLabel: "pts", respondeRapido: "¡Responde rápido! +20 pts extra",
    casoPractico: "📋 CASO PRÁCTICO",
    verResultados: "Ver Resultados 🏁", siguientePregunta: "Siguiente Pregunta →",
    correcto: "¡Correcto!", incorrecto: "Incorrecto.", respuestaCorrectaEs: "La respuesta correcta es:",
    insigniaDesbloqueada: "¡Insignia Desbloqueada!",
    deAciertos: "de aciertos",
    puntos: "Puntos", correctas: "Correctas", incorrectas: "Incorrectas", tiempo: "Tiempo",
    reporteDesempeno: "📊 Reporte de Desempeño",
    areasdeMejora: "💡 Áreas de Mejora",
    repetir: "🔄 Repetir", modulos: "← Módulos",
    accesoGratuitoCompletado: "¡Has completado tu acceso gratuito!",
    desbloqueaTexto: "Desbloquea",
    desbloqueaTexto2: "todos los niveles, ranking global e insignias exclusivas con una suscripción ContaQuiz.",
    primeroCuenta: "Primero crea tu cuenta gratis",
    primeroCuentaDesc: "Estás navegando como invitado. Para suscribirte y guardar tu progreso, puntaje e insignias, necesitas una cuenta de ContaQuiz.",
    crearCuentaAhora: "Crear mi cuenta ahora →",
    metodosPago: "MÉTODOS DE PAGO",
    pagoSeguro: "Pago seguro · Cancela cuando quieras",
    suscribirme: "Suscribirme Ahora", crearCuentaSuscribirte: "Crea tu cuenta para suscribirte",
    volver: "← Volver",
    rankingGlobal: "🏆 Ranking Global",
    competeDesc: "Compite con estudiantes de toda Latinoamérica",
    tu: "Tú",
    perfil: "👤 Perfil", miProgreso: "📊 Mi Progreso", preferenciasJuego: "🎮 Preferencias del Juego",
    notificaciones: "🔔 Notificaciones", suscripcionPago: "💳 Suscripción y Pago", acercaDe: "ℹ️ Acerca de ContaQuiz",
    actualizarPremium: "✨ Actualizar a Premium — $4.99/mes",
    cerrarSesionBtn: "🚪 Cerrar Sesión",
    idioma: "Idioma",
    nivelExcelente: "¡Excelente!", nivelBien: "¡Bien hecho!", nivelMejorar: "Puedes mejorar", nivelPracticar: "¡Sigue practicando!",
    area1: "Revisar respuestas incorrectas del módulo", area2: "Practicar con más casos prácticos", area3: "Repasar conceptos teóricos base",
    planMensualDesc: "Acceso completo mensual", planAnualDesc: "Equivale a $3.92/mes", planAnualAhorra: "💰 Ahorra 22%",
    porMes: "/mes", porAnio: "/año",
    beneficio1: "✅ 500+ preguntas de selección múltiple, V/F y casos prácticos",
    beneficio2: "✅ 5 módulos: Básico → Superior",
    beneficio3: "✅ Ranking global con otros estudiantes",
    beneficio4: "✅ Insignias y sistema de logros",
    beneficio5: "✅ Reporte de desempeño detallado",
    beneficio6: "✅ Preguntas aleatorizadas en cada sesión",
    beneficio7: "✅ Acceso desde cualquier dispositivo",
    ajustesTitulo: "⚙️ Ajustes y Configuración",
    secPerfil: "👤 Perfil", lblNombre: "Nombre", lblCorreo: "Correo", lblSuscripcion: "Suscripción", suscGratuita: "Gratuita",
    secProgreso: "📊 Mi Progreso", lblPuntuacionTotal: "Puntuación total", lblInsigniasObtenidas: "Insignias obtenidas", lblPreguntasResp: "Preguntas respondidas",
    secPreferencias: "🎮 Preferencias del Juego", lblPregPorSesion: "Preguntas por sesión", valPregPorSesion: "20 (por módulo)",
    lblRandom: "Randomización", valActivada: "✅ Activada", lblTimer: "Temporizador", valActivado: "✅ Activado",
    lblPenalizacion: "Penalización por error", lblBonusRapidez: "Bonus por rapidez (<10s)",
    secNotif: "🔔 Notificaciones", lblRecordatorio: "Recordatorio diario", lblNovedades: "Novedades y actualizaciones", valProximamente: "Próximamente",
    secSuscPago: "💳 Suscripción y Pago", lblPlanActual: "Plan actual", planGratuito: "Gratuito", lblMetodosAceptados: "Métodos aceptados",
    lblPrecioMensual: "Precio mensual", lblPrecioAnual: "Precio anual",
    secAcerca: "ℹ️ Acerca de ContaQuiz", lblVersion: "Versión", lblSoporte: "Soporte", lblTerminos: "Términos y Privacidad", valVerDocumento: "Ver documento",
    lblIdioma: "🌍 Idioma",
    avisoCriptoTitulo: "💡 Pagas con cripto: considera el plan anual",
    avisoCriptoTexto: "Binance Pay no permite cobros automáticos recurrentes — cada mes deberás volver a pagar manualmente. Con el plan anual, pagas una sola vez $46.99 y no tienes que repetir el pago cada mes.",
    avisoCriptoCambiarAnual: "Cambiar al plan anual ($46.99)",
    avisoCriptoSeguirMensual: "Prefiero seguir con el plan mensual",
    renuevaManualmente: "⚠️ Con Binance Pay, la renovación es manual: te avisaremos antes de que venza tu plan.",
    footerOperadoPor: "Operado por SEPHIRA-APM GLOBAL S.R.L.",
    footerTerminos: "Términos y Condiciones",
    footerPrivacidad: "Privacidad",
    terminosTitulo: "Términos y Condiciones",
    terminosVolver: "← Volver al inicio",
  },
  en: {
    bienvenida: "Welcome to",
    eslogan1: "\"Strengthen your knowledge,",
    eslogan2: "one answer at a time.\"",
    subtitulo: "Interactive learning platform for Accounting · IAS · IFRS · Auditing",
    jugarAhora: "Play Now! 🎯",
    statPreguntas: "Questions", statModulos: "Modules", statTipos: "Quiz Types", statRanking: "Global Ranking",
    iniciarSesionTitulo: "Sign in to continue",
    crearCuentaTitulo: "Create your free account",
    tabLogin: "Sign In", tabRegistro: "Sign Up",
    nombreCompleto: "Full name", correoElectronico: "Email", contrasena: "Password", confirmarContrasena: "Confirm password",
    placeholderNombre: "E.g. María González", placeholderCorreo: "youremail@example.com", placeholderPass: "At least 6 characters", placeholderConfirmar: "Repeat your password",
    nombreValido: "✅ Valid name", correoValido: "✅ Valid email", correoInvalido: "⚠️ Invalid email format",
    passCoinciden: "✅ Passwords match", passNoCoinciden: "❌ Passwords don't match",
    passFuerte: "🔐 Strong password", passMedia: "🔑 Acceptable password", passDebil: "⚠️ Weak password (too short)",
    passConsejo: "For a strong password: 10+ characters, uppercase letters and numbers",
    procesando: "Processing...", iniciarSesionBtn: "Sign In →", crearCuentaBtn: "Create Account →",
    o: "or", probarGratis: "🎁 Try for free (3 questions, no sign-up)",
    datosSeguros: "🔒 Your data is secure · No credit card required",
    yaTienesCuenta: "Already have an account? Sign in",
    olvidasteContrasena: "Forgot your password?",
    recuperarTitulo: "Reset password",
    recuperarDesc: "Enter your email and we'll send you a link to create a new password.",
    recuperarBtn: "Send reset link",
    volverALogin: "← Back to sign in",
    continuaRegistroTitulo: "You're doing great! 🎉",
    continuaRegistroDesc: "You've used your 3 free questions. Create a free account to continue with the remaining 7 and save your progress.",
    seleccionaModulo: "Select a Module",
    accesoCompleto: "Full access to all modules",
    modoGratuito: "Free mode",
    preguntasDisponibles: "questions available",
    puntuacionTotal: "Total Score", insignias: "Badges", estado: "Status", premium: "Premium ✨", gratis: "Free",
    ranking: "Ranking", verPosicion: "View position",
    desbloquea: "Unlock full access!",
    desbloqueaDesc: "500+ questions · All levels · Global ranking · Exclusive badges",
    suscribirseDesde: "Subscribe from $4.99/mo →",
    ajustes: "⚙️ Settings",
    salir: "← Exit",
    ptsLabel: "pts", respondeRapido: "Answer fast! +20 extra pts",
    casoPractico: "📋 CASE STUDY",
    verResultados: "View Results 🏁", siguientePregunta: "Next Question →",
    correcto: "Correct!", incorrecto: "Incorrect.", respuestaCorrectaEs: "The correct answer is:",
    insigniaDesbloqueada: "Badge Unlocked!",
    deAciertos: "correct answers",
    puntos: "Points", correctas: "Correct", incorrectas: "Incorrect", tiempo: "Time",
    reporteDesempeno: "📊 Performance Report",
    areasdeMejora: "💡 Areas to Improve",
    repetir: "🔄 Retry", modulos: "← Modules",
    accesoGratuitoCompletado: "You've used up your free access!",
    desbloqueaTexto: "Unlock",
    desbloqueaTexto2: "all levels, global ranking and exclusive badges with a ContaQuiz subscription.",
    primeroCuenta: "First, create your free account",
    primeroCuentaDesc: "You're browsing as a guest. To subscribe and save your progress, score and badges, you need a ContaQuiz account.",
    crearCuentaAhora: "Create my account now →",
    metodosPago: "PAYMENT METHODS",
    pagoSeguro: "Secure payment · Cancel anytime",
    suscribirme: "Subscribe Now", crearCuentaSuscribirte: "Create an account to subscribe",
    volver: "← Back",
    rankingGlobal: "🏆 Global Ranking",
    competeDesc: "Compete with students across Latin America",
    tu: "You",
    perfil: "👤 Profile", miProgreso: "📊 My Progress", preferenciasJuego: "🎮 Game Preferences",
    notificaciones: "🔔 Notifications", suscripcionPago: "💳 Subscription & Payment", acercaDe: "ℹ️ About ContaQuiz",
    actualizarPremium: "✨ Upgrade to Premium — $4.99/mo",
    cerrarSesionBtn: "🚪 Sign Out",
    idioma: "Language",
    nivelExcelente: "Excellent!", nivelBien: "Well done!", nivelMejorar: "You can improve", nivelPracticar: "Keep practicing!",
    area1: "Review incorrect answers from this module", area2: "Practice more case studies", area3: "Review the core theoretical concepts",
    planMensualDesc: "Full monthly access", planAnualDesc: "Equivalent to $3.92/mo", planAnualAhorra: "💰 Save 22%",
    porMes: "/mo", porAnio: "/yr",
    beneficio1: "✅ 500+ multiple-choice, T/F and case-study questions",
    beneficio2: "✅ 5 modules: Basic → Advanced",
    beneficio3: "✅ Global ranking with other students",
    beneficio4: "✅ Badges and achievement system",
    beneficio5: "✅ Detailed performance report",
    beneficio6: "✅ Randomized questions every session",
    beneficio7: "✅ Access from any device",
    ajustesTitulo: "⚙️ Settings",
    secPerfil: "👤 Profile", lblNombre: "Name", lblCorreo: "Email", lblSuscripcion: "Subscription", suscGratuita: "Free",
    secProgreso: "📊 My Progress", lblPuntuacionTotal: "Total score", lblInsigniasObtenidas: "Badges earned", lblPreguntasResp: "Questions answered",
    secPreferencias: "🎮 Game Preferences", lblPregPorSesion: "Questions per session", valPregPorSesion: "20 (per module)",
    lblRandom: "Randomization", valActivada: "✅ Enabled", lblTimer: "Timer", valActivado: "✅ Enabled",
    lblPenalizacion: "Penalty for wrong answer", lblBonusRapidez: "Speed bonus (<10s)",
    secNotif: "🔔 Notifications", lblRecordatorio: "Daily reminder", lblNovedades: "News and updates", valProximamente: "Coming soon",
    secSuscPago: "💳 Subscription & Payment", lblPlanActual: "Current plan", planGratuito: "Free", lblMetodosAceptados: "Accepted methods",
    lblPrecioMensual: "Monthly price", lblPrecioAnual: "Annual price",
    secAcerca: "ℹ️ About ContaQuiz", lblVersion: "Version", lblSoporte: "Support", lblTerminos: "Terms & Privacy", valVerDocumento: "View document",
    lblIdioma: "🌍 Language",
    avisoCriptoTitulo: "💡 Paying with crypto? Consider the annual plan",
    avisoCriptoTexto: "Binance Pay doesn't support automatic recurring charges — you'll need to pay manually each month. With the annual plan, you pay once for $46.99 and skip the monthly hassle.",
    avisoCriptoCambiarAnual: "Switch to annual plan ($46.99)",
    avisoCriptoSeguirMensual: "I'll stick with the monthly plan",
    renuevaManualmente: "⚠️ With Binance Pay, renewal is manual: we'll notify you before your plan expires.",
    footerOperadoPor: "Operated by SEPHIRA-APM GLOBAL S.R.L.",
    footerTerminos: "Terms & Conditions",
    footerPrivacidad: "Privacy",
    terminosTitulo: "Terms & Conditions",
    terminosVolver: "← Back to home",
  },
};

/* ─────────────────────────────────────────
   GOOGLE FONTS
───────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; }

    :root {
      --azul:    #1B4F72;
      --azul2:   #2E86C1;
      --verde:   #27AE60;
      --verde2:  #2ECC71;
      --amarillo:#F1C40F;
      --rojo:    #E74C3C;
      --fondo:   #F0F4F8;
      --blanco:  #FFFFFF;
      --gris1:   #F8FAFC;
      --gris2:   #E2E8F0;
      --gris3:   #94A3B8;
      --texto:   #1E293B;
      --sombra:  0 4px 24px rgba(27,79,114,0.13);
      --sombra2: 0 8px 40px rgba(27,79,114,0.18);
    }

    @keyframes fadeUp {
      from { opacity:0; transform:translateY(28px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes pop {
      0%   { transform:scale(0.7); opacity:0; }
      70%  { transform:scale(1.08); }
      100% { transform:scale(1); opacity:1; }
    }
    @keyframes pulse {
      0%,100% { transform:scale(1); }
      50%      { transform:scale(1.06); }
    }
    @keyframes spin {
      to { transform:rotate(360deg); }
    }
    @keyframes shimmer {
      0%   { background-position:-400px 0; }
      100% { background-position:400px 0; }
    }
    @keyframes confettiFall {
      0%   { transform:translateY(-20px) rotate(0deg); opacity:1; }
      100% { transform:translateY(80px) rotate(720deg); opacity:0; }
    }
    @keyframes badgePop {
      0%   { transform:scale(0) rotate(-15deg); }
      60%  { transform:scale(1.15) rotate(5deg); }
      100% { transform:scale(1) rotate(0deg); }
    }

    .fade-up   { animation: fadeUp .5s ease both; }
    .pop       { animation: pop .4s cubic-bezier(.34,1.56,.64,1) both; }
    .pulse-btn { animation: pulse 2s infinite; }

    .btn-primary {
      background: linear-gradient(135deg, var(--verde), var(--verde2));
      color: #fff;
      border: none;
      border-radius: 14px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      cursor: pointer;
      transition: transform .15s, box-shadow .15s;
      box-shadow: 0 4px 18px rgba(39,174,96,.35);
    }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(39,174,96,.45); }
    .btn-primary:active { transform:translateY(0); }

    .btn-secondary {
      background: linear-gradient(135deg, var(--azul), var(--azul2));
      color: #fff;
      border: none;
      border-radius: 14px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      cursor: pointer;
      transition: transform .15s, box-shadow .15s;
      box-shadow: 0 4px 18px rgba(27,79,114,.3);
    }
    .btn-secondary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(27,79,114,.4); }

    .btn-outline {
      background: transparent;
      color: var(--azul);
      border: 2px solid var(--azul);
      border-radius: 14px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      cursor: pointer;
      transition: all .2s;
    }
    .btn-outline:hover { background:var(--azul); color:#fff; }

    input[type=email], input[type=password], input[type=text] {
      width: 100%;
      padding: 14px 18px;
      border: 2px solid var(--gris2);
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      color: var(--texto);
      background: var(--blanco);
      transition: border-color .2s, box-shadow .2s;
      outline: none;
    }
    input:focus { border-color:var(--azul2); box-shadow:0 0 0 3px rgba(46,134,193,.15); }

    .card {
      background: var(--blanco);
      border-radius: 20px;
      box-shadow: var(--sombra);
    }

    ::-webkit-scrollbar { width:6px; }
    ::-webkit-scrollbar-track { background:var(--fondo); }
    ::-webkit-scrollbar-thumb { background:var(--gris3); border-radius:3px; }
  `}</style>
);

/* ─────────────────────────────────────────
   LOGO SVG (replica the uploaded logo style)
───────────────────────────────────────── */
const Logo = ({ size = 40, showText = true, variante = "claro" }) => {
  const colorConta = variante === "oscuro" ? "#FFFFFF" : "#1B4F72";
  const colorIcono = variante === "oscuro" ? "#FFFFFF" : "#1B4F72";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <path d="M40 8C22.3 8 8 22.3 8 40C8 57.7 22.3 72 40 72C49.2 72 57.5 68.1 63.5 61.8" stroke={colorIcono} strokeWidth="10" strokeLinecap="round" fill="none"/>
        <polyline points="22,40 34,53 62,24" stroke="#2ECC71" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      {showText && (
        <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize: size*0.45 }}>
          <span style={{ color:colorConta }}>Conta</span>
          <span style={{ color:"#2ECC71" }}>Quiz</span>
        </span>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   DATOS: TEMAS Y PREGUNTAS (muestra representativa)
───────────────────────────────────────── */
const TEMAS = [
  {
    id:1, nombre:"Contabilidad Básica", icono:"📘", color:"#1B4F72", accent:"#2E86C1",
    nivel:"Básico", descripcion:"Principios, ecuación contable, ciclo contable y estados financieros.",
    insignia:"🏅 Experto en Fundamentos Contables",
    preguntas: [
      { id:1, tipo:"multiple", texto:"¿Cuál es la ecuación contable fundamental?", opciones:["Activo = Pasivo + Patrimonio","Activo + Pasivo = Patrimonio","Ingreso – Gasto = Activo","Patrimonio = Activo – Pasivo – Capital"], correcta:0, dificultad:"básico" },
      { id:2, tipo:"vf", texto:"El libro diario registra las transacciones en orden cronológico.", opciones:["Verdadero","Falso"], correcta:0, dificultad:"básico" },
      { id:3, tipo:"multiple", texto:"Los activos corrientes son aquellos que se espera convertir en efectivo en:", opciones:["Más de 5 años","Más de 2 años","Menos de un año","Exactamente 2 años"], correcta:2, dificultad:"básico" },
      { id:4, tipo:"multiple", texto:"¿Cuál de los siguientes NO es un estado financiero básico?", opciones:["Balance general","Estado de resultados","Libro diario","Estado de flujo de efectivo"], correcta:2, dificultad:"básico" },
      { id:5, tipo:"vf", texto:"La depreciación es un egreso de efectivo.", opciones:["Verdadero","Falso"], correcta:1, dificultad:"básico" },
      { id:6, tipo:"multiple", texto:"El principio de 'empresa en marcha' supone que:", opciones:["La empresa cerrará pronto","La empresa continuará operando indefinidamente","Los activos se valuarán a precio de mercado","Los estados se ajustarán por inflación"], correcta:1, dificultad:"básico" },
      { id:7, tipo:"multiple", texto:"¿Qué tipo de cuenta aumenta con un débito?", opciones:["Ingresos","Pasivos","Activos","Patrimonio"], correcta:2, dificultad:"básico" },
      { id:8, tipo:"caso", texto:"La empresa XYZ compra mercancía por $10,000 pagando $4,000 en efectivo y el resto a crédito. ¿Cuál es el efecto en el balance?", opciones:["Activo aumenta $10,000; Pasivo aumenta $6,000; Patrimonio no cambia","Activo aumenta $4,000; Pasivo no cambia","Solo disminuye el efectivo en $10,000","Pasivo aumenta $10,000"], correcta:0, dificultad:"intermedio" },
      { id:9, tipo:"multiple", texto:"La conciliación bancaria tiene como objetivo:", opciones:["Aumentar el saldo bancario","Detectar diferencias entre el libro de banco y el extracto","Calcular los intereses bancarios","Registrar nuevos depósitos"], correcta:1, dificultad:"básico" },
      { id:10, tipo:"multiple", texto:"El patrimonio neto de una empresa se calcula como:", opciones:["Activo total + Pasivo total","Activo total – Pasivo total","Pasivo total – Activo total","Ingresos – Gastos"], correcta:1, dificultad:"básico" },
      { id:11, tipo:"multiple", texto:"¿Cuál es el saldo normal de una cuenta de pasivo?", opciones:["Deudor (débito)","Acreedor (crédito)","Nulo","Puede ser cualquiera"], correcta:1, dificultad:"básico" },
      { id:12, tipo:"vf", texto:"Los dividendos decretados pero no pagados se clasifican como pasivo corriente.", opciones:["Verdadero","Falso"], correcta:0, dificultad:"intermedio" },
      { id:13, tipo:"multiple", texto:"El método PEPS (FIFO) supone que:", opciones:["Los últimos artículos comprados son los primeros en venderse","Los primeros artículos comprados son los primeros en venderse","El costo promedio se aplica","Los artículos se identifican individualmente"], correcta:1, dificultad:"intermedio" },
      { id:14, tipo:"caso", texto:"Una empresa tiene: Activos corrientes $50,000 y Pasivos corrientes $20,000. ¿Cuál es el capital de trabajo neto?", opciones:["$70,000","$30,000","$20,000","$50,000"], correcta:1, dificultad:"intermedio" },
      { id:15, tipo:"multiple", texto:"Los gastos pagados por anticipado se clasifican como:", opciones:["Pasivos corrientes","Activos corrientes","Gastos del período","Patrimonio"], correcta:1, dificultad:"básico" },
      { id:16, tipo:"vf", texto:"El EBITDA incluye la depreciación y amortización en su cálculo.", opciones:["Verdadero","Falso"], correcta:1, dificultad:"intermedio" },
      { id:17, tipo:"multiple", texto:"La utilidad bruta se calcula como:", opciones:["Ingresos totales – Gastos operativos","Ventas netas – Costo de ventas","Ingresos – Impuestos","Utilidad operativa – Gastos financieros"], correcta:1, dificultad:"básico" },
      { id:18, tipo:"multiple", texto:"El principio de 'uniformidad' indica que:", opciones:["Todos los datos deben registrarse igual","Los métodos contables deben aplicarse consistentemente entre períodos","Las cuentas deben tener saldos iguales","Los estados deben ser uniformes en formato"], correcta:1, dificultad:"básico" },
      { id:19, tipo:"caso", texto:"Si ventas = $200,000 y costo de ventas = $120,000, ¿cuál es el margen bruto?", opciones:["60%","40%","80%","20%"], correcta:1, dificultad:"intermedio" },
      { id:20, tipo:"multiple", texto:"Los asientos de cierre sirven para:", opciones:["Abrir nuevas cuentas","Cerrar cuentas temporales al final del período","Registrar errores","Iniciar el ciclo contable"], correcta:1, dificultad:"básico" },
    ]
  },
  {
    id:2, nombre:"NIC / NIIF", icono:"📗", color:"#1A5C38", accent:"#27AE60",
    nivel:"Intermedio", descripcion:"Normas Internacionales de Contabilidad e Información Financiera.",
    insignia:"🏆 Especialista NIIF Certificado",
    preguntas: [
      { id:1, tipo:"multiple", texto:"Las NIIF son emitidas por:", opciones:["El IASB","La SEC","El Banco Mundial","La ONU"], correcta:0, dificultad:"básico" },
      { id:2, tipo:"multiple", texto:"La NIC 2 establece que los inventarios se miden al:", opciones:["Valor de mercado","Costo o valor neto realizable, el menor","Valor razonable siempre","Costo de reposición"], correcta:1, dificultad:"intermedio" },
      { id:3, tipo:"vf", texto:"La NIC 2 permite el uso del método UEPS (LIFO) para valorar inventarios.", opciones:["Verdadero","Falso"], correcta:1, dificultad:"intermedio" },
      { id:4, tipo:"multiple", texto:"La NIIF 16 requiere que el arrendatario reconozca:", opciones:["Solo arrendamientos financieros","Un activo por derecho de uso y pasivo por arrendamiento para casi todos los arrendamientos","Solo gastos de arrendamiento en resultados","Los arrendamientos como activos intangibles"], correcta:1, dificultad:"avanzado" },
      { id:5, tipo:"multiple", texto:"La NIC 36 regula:", opciones:["Provisiones","El deterioro del valor de los activos","Ingresos ordinarios","Beneficios a empleados"], correcta:1, dificultad:"intermedio" },
      { id:6, tipo:"caso", texto:"Una empresa mide sus propiedades al modelo de revaluación (NIC 16). Si el valor razonable supera el valor en libros, ¿dónde se registra la diferencia?", opciones:["En el estado de resultados como ingreso","En el patrimonio como reserva de revaluación (OCI)","Como pasivo diferido","Como activo intangible"], correcta:1, dificultad:"avanzado" },
      { id:7, tipo:"multiple", texto:"La NIIF 15 regula:", opciones:["Arrendamientos","Ingresos de actividades ordinarias procedentes de contratos con clientes","Instrumentos financieros","Beneficios a empleados"], correcta:1, dificultad:"intermedio" },
      { id:8, tipo:"multiple", texto:"El modelo de reconocimiento de ingresos de la NIIF 15 consta de:", opciones:["3 pasos","5 pasos","7 pasos","2 pasos"], correcta:1, dificultad:"avanzado" },
      { id:9, tipo:"vf", texto:"Según NIIF 13, el valor razonable es el precio de entrada (lo que pagarías por adquirir el activo).", opciones:["Verdadero","Falso"], correcta:1, dificultad:"avanzado" },
      { id:10, tipo:"multiple", texto:"La NIC 37 regula:", opciones:["Instrumentos financieros","Provisiones, pasivos contingentes y activos contingentes","Arrendamientos","Impuesto a las ganancias"], correcta:1, dificultad:"intermedio" },
      { id:11, tipo:"caso", texto:"Una empresa tiene una demanda legal en su contra. Los asesores estiman 70% de probabilidad de perder y el monto sería $50,000. Según NIC 37, ¿qué debe hacer?", opciones:["Ignorarlo","Reconocer una provisión de $50,000","Solo revelar en notas","Reconocer un activo contingente"], correcta:1, dificultad:"avanzado" },
      { id:12, tipo:"multiple", texto:"La NIC 12 trata:", opciones:["Los ingresos por intereses","El impuesto a las ganancias (diferido y corriente)","Las propiedades de inversión","Los instrumentos de patrimonio"], correcta:1, dificultad:"intermedio" },
      { id:13, tipo:"vf", texto:"El goodwill adquirido en una combinación de negocios (NIIF 3) se amortiza en 10 años.", opciones:["Verdadero","Falso"], correcta:1, dificultad:"avanzado" },
      { id:14, tipo:"multiple", texto:"Los tres niveles de la jerarquía del valor razonable según NIIF 13 son:", opciones:["Alto, medio y bajo","Nivel 1 (precios cotizados), Nivel 2 (datos observables) y Nivel 3 (datos no observables)","Corriente, no corriente y diferido","Mercado activo, secundario y estimado"], correcta:1, dificultad:"avanzado" },
      { id:15, tipo:"multiple", texto:"La NIC 19 regula:", opciones:["Activos fijos","Beneficios a los empleados","Propiedades de inversión","Contratos de seguros"], correcta:1, dificultad:"intermedio" },
      { id:16, tipo:"caso", texto:"Una empresa adopta NIIF por primera vez. Según NIIF 1, ¿cuál es una exención opcional más común?", opciones:["No presentar estados comparativos","Medir P,P&E al valor razonable como costo atribuido en la fecha de transición","Ignorar el impuesto diferido","No aplicar NIC 36"], correcta:1, dificultad:"avanzado" },
      { id:17, tipo:"vf", texto:"La NIC 8 exige que los cambios en política contable se apliquen de forma retroactiva.", opciones:["Verdadero","Falso"], correcta:0, dificultad:"intermedio" },
      { id:18, tipo:"multiple", texto:"Las características cualitativas fundamentales según el Marco Conceptual IASB son:", opciones:["Claridad y precisión","Relevancia y representación fiel","Exactitud y completitud","Transparencia y objetividad"], correcta:1, dificultad:"intermedio" },
      { id:19, tipo:"multiple", texto:"La diferencia entre NIIF completas y NIIF para PYMES es que:", opciones:["No hay diferencia","Las NIIF para PYMES son una versión simplificada para entidades sin obligación pública de rendir cuentas","Las NIIF para PYMES son más complejas","Solo PYMES aplican NIC"], correcta:1, dificultad:"básico" },
      { id:20, tipo:"caso", texto:"Bajo NIIF 9, un instrumento de deuda se clasifica a costo amortizado si: ¿cuál condición debe cumplir?", opciones:["Solo si es un bono gubernamental","El modelo de negocio es cobrar flujos contractuales Y los flujos son solo principal e intereses (SPPI)","Si cotiza en bolsa","Si vence en menos de un año"], correcta:1, dificultad:"avanzado" },
    ]
  },
  {
    id:3, nombre:"Auditoría (NIAS)", icono:"📙", color:"#7D6608", accent:"#F1C40F",
    nivel:"Intermedio", descripcion:"Normas Internacionales de Auditoría, evidencia y tipos de opinión.",
    insignia:"🔍 Auditor Certificado ContaQuiz",
    preguntas: [
      { id:1, tipo:"multiple", texto:"Las NIA son emitidas por:", opciones:["El IASB","La IAASB","La IFAC exclusivamente","El Banco Mundial"], correcta:1, dificultad:"básico" },
      { id:2, tipo:"multiple", texto:"Los tres componentes del riesgo de auditoría son:", opciones:["Operativo, financiero y cumplimiento","Riesgo inherente, riesgo de control y riesgo de detección","Alto, medio y bajo","Fraude, error y omisión"], correcta:1, dificultad:"intermedio" },
      { id:3, tipo:"vf", texto:"El auditor emite una opinión adversa cuando las incorrecciones son materiales pero NO generalizadas.", opciones:["Verdadero","Falso"], correcta:1, dificultad:"intermedio" },
      { id:4, tipo:"multiple", texto:"La materialidad en auditoría se refiere a:", opciones:["La importancia jerárquica de la empresa","El umbral a partir del cual las incorrecciones pueden influir en decisiones de los usuarios","El tamaño de la empresa auditada","El número de empleados"], correcta:1, dificultad:"intermedio" },
      { id:5, tipo:"caso", texto:"Un auditor no puede obtener evidencia sobre el 40% del inventario de un cliente. ¿Qué tipo de opinión debe emitir?", opciones:["Opinión no modificada (limpia)","Con salvedades o denegación de opinión según la materialidad y carácter generalizado","Opinión adversa siempre","Solo revelar en notas"], correcta:1, dificultad:"avanzado" },
      { id:6, tipo:"multiple", texto:"La NIA 240 trata sobre:", opciones:["Las estimaciones contables","Las responsabilidades del auditor respecto al fraude","Los procedimientos analíticos","La auditoría de grupos"], correcta:1, dificultad:"intermedio" },
      { id:7, tipo:"vf", texto:"El 'escepticismo profesional' significa desconfiar absolutamente de todo lo que dice el cliente.", opciones:["Verdadero","Falso"], correcta:1, dificultad:"básico" },
      { id:8, tipo:"multiple", texto:"El 'triángulo del fraude' incluye:", opciones:["Oportunidad, habilidad y voluntad","Presión/incentivo, oportunidad y racionalización","Error, omisión y manipulación","Control, detección y prevención"], correcta:1, dificultad:"intermedio" },
      { id:9, tipo:"multiple", texto:"La carta de representación (NIA 580) es emitida por:", opciones:["El auditor al final","La dirección de la entidad al auditor confirmando representaciones clave","El comité de auditoría únicamente","El gobierno corporativo"], correcta:1, dificultad:"intermedio" },
      { id:10, tipo:"caso", texto:"Una empresa auditada tiene dudas sobre su capacidad de continuar operando. Según NIA 570, el auditor debe:", opciones:["Emitir opinión limpia e ignorarlo","Evaluar planes de la gerencia, obtener evidencia y considerar el impacto en el informe y revelaciones","Negarse a auditar","Solo mencionarlo en notas"], correcta:1, dificultad:"avanzado" },
      { id:11, tipo:"multiple", texto:"Las 'Cuestiones Clave de Auditoría' (KAM - NIA 701) se incluyen en:", opciones:["El informe de auditoría de todas las empresas","El informe de entidades cotizadas y otras cuando se requiere por ley","Solo cuando hay salvedades","Solo en empresas grandes"], correcta:1, dificultad:"avanzado" },
      { id:12, tipo:"vf", texto:"La confirmación positiva solicita respuesta solo si existen diferencias.", opciones:["Verdadero","Falso"], correcta:1, dificultad:"intermedio" },
      { id:13, tipo:"multiple", texto:"El período de conservación recomendado de los papeles de trabajo es:", opciones:["Un año","Al menos cinco años","Solo hasta emitir el informe","Tres meses"], correcta:1, dificultad:"básico" },
      { id:14, tipo:"multiple", texto:"La 'segregación de funciones' es un control interno que implica:", opciones:["Que una persona realice todas las tareas","Que distintas personas realicen funciones clave para reducir riesgo de fraude","Que el auditor realice las funciones","Que solo auditores accedan a registros"], correcta:1, dificultad:"básico" },
      { id:15, tipo:"caso", texto:"El auditor detecta que las ventas de diciembre se registraron en enero. ¿Qué afirmación de auditoría está siendo violada?", opciones:["Integridad","Corte (cut-off)","Valoración","Clasificación"], correcta:1, dificultad:"avanzado" },
      { id:16, tipo:"multiple", texto:"La NICC 1 (ISQC 1) regula:", opciones:["El informe del auditor","El control de calidad de firmas que realizan auditorías","La independencia del auditor","El código de ética"], correcta:1, dificultad:"avanzado" },
      { id:17, tipo:"vf", texto:"La independencia del auditor incluye independencia de la mente E independencia en apariencia.", opciones:["Verdadero","Falso"], correcta:0, dificultad:"intermedio" },
      { id:18, tipo:"multiple", texto:"El muestreo en auditoría (NIA 530) se utiliza para:", opciones:["Auditar el 100% de las transacciones","Aplicar procedimientos a menos del 100% de la población para concluir sobre toda ella","Solo en auditorías de pequeñas empresas","Seleccionar partidas de alta importancia únicamente"], correcta:1, dificultad:"intermedio" },
      { id:19, tipo:"multiple", texto:"Los procedimientos analíticos (NIA 520) consisten en:", opciones:["Contar el inventario físicamente","Evaluar información financiera mediante el análisis de relaciones plausibles","Confirmar saldos con terceros","Inspeccionar documentos fuente"], correcta:1, dificultad:"intermedio" },
      { id:20, tipo:"caso", texto:"Un auditor incluye un párrafo de énfasis en su informe. ¿Qué significa esto respecto a su opinión?", opciones:["La opinión es con salvedades","La opinión NO se modifica; solo llama la atención sobre un asunto importante revelado en los estados","Hay una limitación al alcance","El auditor se abstiene de opinar"], correcta:1, dificultad:"avanzado" },
    ]
  },
  {
    id:4, nombre:"Contabilidad Intermedia", icono:"📒", color:"#512E5F", accent:"#8E44AD",
    nivel:"Avanzado", descripcion:"Flujos de efectivo, consolidación, impuesto diferido, instrumentos financieros.",
    insignia:"⭐ Contador Avanzado ContaQuiz",
    preguntas: [
      { id:1, tipo:"multiple", texto:"El método indirecto del estado de flujos de efectivo comienza con:", opciones:["Las ventas del período","La utilidad neta ajustada con partidas no monetarias","El efectivo al inicio","Los ingresos de inversión"], correcta:1, dificultad:"intermedio" },
      { id:2, tipo:"multiple", texto:"Las diferencias temporales imponibles generan:", opciones:["Activos por impuesto diferido","Pasivos por impuesto diferido","Solo gastos del período","Impuesto corriente adicional"], correcta:1, dificultad:"avanzado" },
      { id:3, tipo:"vf", texto:"Las acciones en tesorería se presentan como reducción del patrimonio.", opciones:["Verdadero","Falso"], correcta:0, dificultad:"intermedio" },
      { id:4, tipo:"caso", texto:"Una empresa adquiere una subsidiaria pagando $500,000. El valor razonable de activos netos identificables es $420,000. ¿Cuánto es el goodwill?", opciones:["$500,000","$80,000","$420,000","$0"], correcta:1, dificultad:"avanzado" },
      { id:5, tipo:"multiple", texto:"Los intereses no controladores en el balance consolidado se presentan:", opciones:["Como pasivo","Dentro del patrimonio neto, separado del patrimonio de la controladora","Como activo diferido","Fuera del balance"], correcta:1, dificultad:"avanzado" },
      { id:6, tipo:"multiple", texto:"La prima de emisión de acciones representa:", opciones:["El valor nominal de las acciones","El exceso sobre el valor nominal recibido en la emisión","Un tipo de dividendo","Una reserva obligatoria"], correcta:1, dificultad:"intermedio" },
      { id:7, tipo:"vf", texto:"Las ganancias y pérdidas actuariales en planes de beneficios definidos (NIC 19) se reconocen en el estado de resultados.", opciones:["Verdadero","Falso"], correcta:1, dificultad:"avanzado" },
      { id:8, tipo:"caso", texto:"Un arrendamiento bajo NIIF 16 tiene pagos anuales de $10,000 por 5 años. Tasa implícita 5%. ¿Qué registra el arrendatario el día 1?", opciones:["Solo un gasto de arrendamiento $10,000","Un activo (derecho de uso) y un pasivo por el valor presente de los pagos futuros","Un préstamo bancario","Un activo intangible"], correcta:1, dificultad:"avanzado" },
      { id:9, tipo:"multiple", texto:"La cobertura de flujos de efectivo (cash flow hedge) cubre:", opciones:["El valor razonable de activos","La variabilidad en flujos de efectivo de un riesgo específico","Combinaciones de negocios","La inflación únicamente"], correcta:1, dificultad:"avanzado" },
      { id:10, tipo:"multiple", texto:"El método de participación (equity method) se aplica cuando la inversora tiene:", opciones:["Control total >50%","Influencia significativa (generalmente 20–50%) sobre la asociada","Menos del 20% sin influencia","Solo instrumentos de deuda"], correcta:1, dificultad:"intermedio" },
      { id:11, tipo:"vf", texto:"Los costos de transacción en una combinación de negocios (NIIF 3) se incluyen en el costo de la adquisición.", opciones:["Verdadero","Falso"], correcta:1, dificultad:"avanzado" },
      { id:12, tipo:"caso", texto:"Una empresa vende un edificio a una subsidiaria con una ganancia de $30,000. Al consolidar, ¿qué se hace con esa ganancia?", opciones:["Se mantiene en resultados del grupo","Se elimina porque es una ganancia no realizada intercompañía","Se distribuye entre las dos entidades","Se revela solo en notas"], correcta:1, dificultad:"avanzado" },
      { id:13, tipo:"multiple", texto:"El 'FVOCI para instrumentos de patrimonio' (NIIF 9) significa que al darse de baja:", opciones:["El OCI se reclasifica a resultados","El OCI acumulado NO se reclasifica a resultados (sin reciclaje)","Se reconoce como ingreso","Se elimina del patrimonio"], correcta:1, dificultad:"avanzado" },
      { id:14, tipo:"multiple", texto:"La GPA básica se calcula como:", opciones:["Utilidad neta / Acciones emitidas totales","Utilidad atribuible a accionistas ordinarios / Promedio ponderado de acciones en circulación","EBITDA / Acciones totales","Utilidad operativa / Acciones emitidas"], correcta:1, dificultad:"avanzado" },
      { id:15, tipo:"vf", texto:"Las exenciones de reconocimiento del arrendatario en NIIF 16 incluyen arrendamientos a corto plazo (≤12 meses) y activos de bajo valor.", opciones:["Verdadero","Falso"], correcta:0, dificultad:"intermedio" },
      { id:16, tipo:"caso", texto:"Una empresa reporta utilidad neta $100,000, depreciación $20,000, aumento en cuentas por cobrar $15,000, disminución en proveedores $5,000. Flujo operativo por método indirecto:", opciones:["$100,000","$100,000","$100,000 + 20,000 – 15,000 – 5,000 = $100,000","$100,000 + $20,000 – $15,000 – $5,000 = $100,000"], correcta:2, dificultad:"avanzado" },
      { id:17, tipo:"multiple", texto:"El 'ciclo de conversión de efectivo' mide:", opciones:["Solo la rotación de inventario","El tiempo desde que se paga a proveedores hasta que se cobra a clientes: días inventario + días cobro – días pago","La rotación del activo total","El período de amortización"], correcta:1, dificultad:"avanzado" },
      { id:18, tipo:"vf", texto:"Los activos no corrientes mantenidos para la venta (NIIF 5) se miden al mayor entre valor en libros y valor razonable menos costos de venta.", opciones:["Verdadero","Falso"], correcta:1, dificultad:"avanzado" },
      { id:19, tipo:"multiple", texto:"Las operaciones discontinuadas (NIIF 5) se presentan en el estado de resultados:", opciones:["Mezcladas con operaciones continuas","En línea separada después del resultado de operaciones continuas, neto de impuestos","Solo en notas","Eliminadas de los estados financieros"], correcta:1, dificultad:"avanzado" },
      { id:20, tipo:"caso", texto:"Una empresa emite bonos con valor nominal $100,000 al 95% (a descuento). ¿Cómo se registra el descuento?", opciones:["Como gasto inmediato","Se amortiza como gasto de interés adicional durante la vida del bono usando el método del interés efectivo","Como activo diferido","Como reducción del pasivo solamente al vencimiento"], correcta:1, dificultad:"avanzado" },
    ]
  },
  {
    id:5, nombre:"Finanzas y Contabilidad Superior", icono:"📕", color:"#922B21", accent:"#E74C3C",
    nivel:"Superior", descripcion:"Valoración de empresas, WACC, CAPM, EVA, finanzas corporativas avanzadas.",
    insignia:"🎓 Máster en Finanzas ContaQuiz",
    preguntas: [
      { id:1, tipo:"multiple", texto:"El WACC se utiliza para:", opciones:["Calcular el capital de trabajo","Descontar flujos de caja en valoración y evaluar la rentabilidad mínima requerida","Calcular la depreciación","Determinar el precio de venta"], correcta:1, dificultad:"avanzado" },
      { id:2, tipo:"multiple", texto:"La fórmula del WACC es:", opciones:["Kd + Ke / 2","(Ke × E/V) + (Kd × (1-t) × D/V)","ROE + ROA / 2","Solo el costo del patrimonio"], correcta:1, dificultad:"avanzado" },
      { id:3, tipo:"caso", texto:"Una empresa tiene: Ke=12%, Kd=6%, tasa fiscal=25%, Patrimonio=$600,000, Deuda=$400,000. ¿Cuál es el WACC?", opciones:["9%","8.4%","10%","7.5%"], correcta:1, dificultad:"avanzado" },
      { id:4, tipo:"multiple", texto:"El modelo CAPM calcula:", opciones:["El costo de la deuda","El retorno esperado del patrimonio: Ke = Rf + β(Rm - Rf)","El valor de la empresa","El flujo de caja libre"], correcta:1, dificultad:"avanzado" },
      { id:5, tipo:"vf", texto:"Un EVA positivo indica que la empresa está destruyendo valor para los accionistas.", opciones:["Verdadero","Falso"], correcta:1, dificultad:"intermedio" },
      { id:6, tipo:"multiple", texto:"El flujo de caja libre (FCF) de la firma se calcula como:", opciones:["Utilidad neta + Depreciación","EBIT×(1-t) + D&A – Capex – Variación capital de trabajo operativo","Ventas – Costos","EBITDA únicamente"], correcta:1, dificultad:"avanzado" },
      { id:7, tipo:"caso", texto:"Si FCF proyectado año 1 = $100,000, WACC = 10%, g perpetua = 3%. ¿Cuál es el valor terminal (TV)?", opciones:["$1,000,000","$1,428,571","$1,100,000","$333,333"], correcta:1, dificultad:"avanzado" },
      { id:8, tipo:"multiple", texto:"La teoría del trade-off en estructura de capital establece que:", opciones:["Las empresas no deben endeudarse","Las empresas equilibran los beneficios fiscales de la deuda con los costos de dificultades financieras","Solo grandes empresas se endeudan","La deuda no tiene impacto en el valor"], correcta:1, dificultad:"avanzado" },
      { id:9, tipo:"vf", texto:"El teorema de Modigliani-Miller sin impuestos establece que el valor de la empresa es independiente de su estructura de capital.", opciones:["Verdadero","Falso"], correcta:0, dificultad:"avanzado" },
      { id:10, tipo:"multiple", texto:"La beta (β) en el modelo CAPM mide:", opciones:["El retorno de la empresa","El riesgo sistemático del activo respecto al mercado","La tasa libre de riesgo","El rendimiento del mercado"], correcta:1, dificultad:"avanzado" },
      { id:11, tipo:"caso", texto:"El Z-Score de Altman sirve para:", opciones:["Calcular el WACC","Predecir la probabilidad de quiebra combinando múltiples ratios financieros","Valorar opciones financieras","Calcular la rentabilidad sobre activos"], correcta:1, dificultad:"avanzado" },
      { id:12, tipo:"multiple", texto:"El EVA se calcula como:", opciones:["Ventas – Costos operativos","NOPAT – (Capital empleado × WACC)","Utilidad neta – Dividendos","EBITDA – Impuestos"], correcta:1, dificultad:"avanzado" },
      { id:13, tipo:"vf", texto:"El VAN de un proyecto debe aceptarse cuando VAN > 0.", opciones:["Verdadero","Falso"], correcta:0, dificultad:"básico" },
      { id:14, tipo:"multiple", texto:"El modelo de Gordon valora acciones como:", opciones:["El valor en libros por acción","P = D1 / (Ke - g)","El EBITDA / número de acciones","El precio de mercado actual"], correcta:1, dificultad:"avanzado" },
      { id:15, tipo:"caso", texto:"Una empresa tiene ROE=15%, tasa de retención=60%. ¿Cuál es la tasa de crecimiento sostenible (g)?", opciones:["15%","9%","6%","25%"], correcta:1, dificultad:"avanzado" },
      { id:16, tipo:"multiple", texto:"La 'doble materialidad' en reporte ESG/sostenibilidad implica:", opciones:["Dos auditorías","Evaluar tanto el impacto financiero en la empresa como el impacto de la empresa en el medioambiente/sociedad","Solo riesgos climáticos","Solo grandes empresas cotizadas"], correcta:1, dificultad:"avanzado" },
      { id:17, tipo:"multiple", texto:"El VaR (Value at Risk) estima:", opciones:["El máximo beneficio esperado","La pérdida máxima en un portafolio durante un período con un nivel de confianza determinado","La rentabilidad promedio","El flujo de caja del portafolio"], correcta:1, dificultad:"avanzado" },
      { id:18, tipo:"vf", texto:"La 'pecking order theory' establece que las empresas prefieren financiarse primero con nueva emisión de acciones.", opciones:["Verdadero","Falso"], correcta:1, dificultad:"avanzado" },
      { id:19, tipo:"caso", texto:"Una empresa tiene: EV=$5M, EBITDA=$800K. ¿Cuál es el múltiplo EV/EBITDA y qué indica?", opciones:["5x — muy caro","6.25x — valoración relativa respecto a comparables del sector","10x — muy barato","3x — infravalorada siempre"], correcta:1, dificultad:"avanzado" },
      { id:20, tipo:"multiple", texto:"El 'impuesto mínimo global' (Pilar 2 OCDE/G20) establece una tasa efectiva mínima de:", opciones:["10%","15%","20%","5%"], correcta:1, dificultad:"avanzado" },
    ]
  }
];

const LIMITE_GRATIS = 10;
const LIMITE_INVITADO = 3; // preguntas que un invitado (sin registro) puede responder antes de pedirle cuenta
const PUNTOS_CORRECTA = 100;
const PUNTOS_RAPIDA = 20;
const PENALIZACION = -50;
const TIEMPO_RAPIDA = 10;

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

/* ─────────────────────────────────────────
   RANKING SIMULADO
───────────────────────────────────────── */
const RANKING_BASE = [
  { nombre:"María G.", pais:"🇩🇴", pts:12450, insignias:5 },
  { nombre:"Carlos M.", pais:"🇲🇽", pts:11200, insignias:4 },
  { nombre:"Sofía R.", pais:"🇨🇴", pts:10800, insignias:5 },
  { nombre:"Luis P.", pais:"🇦🇷", pts:9600, insignias:3 },
  { nombre:"Ana T.", pais:"🇵🇪", pts:8950, insignias:4 },
  { nombre:"Pedro V.", pais:"🇩🇴", pts:7800, insignias:2 },
  { nombre:"Laura N.", pais:"🇨🇱", pts:6500, insignias:3 },
  { nombre:"Tú", pais:"🇩🇴", pts:0, insignias:0, esUsuario:true },
];

/* ─────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────── */
/* ─────────────────────────────────────────
   COMPONENTES DE NIVEL DE MÓDULO
   (deben vivir AQUÍ, fuera del componente
   principal, para que React no los recree
   en cada tecla — eso es lo que causaba que
   el input de contraseña perdiera el foco)
───────────────────────────────────────── */
const EyeIcon = ({ visible }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {visible
      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
    }
  </svg>
);

const CampoPassword = ({ label, field, ver, setVer, placeholder, extra, loginForm, setLoginForm }) => (
  <div>
    <label style={{ fontSize:13, fontWeight:600, color:"#475569", display:"block", marginBottom:6, fontFamily:"'Montserrat',sans-serif" }}>{label}</label>
    <div style={{ position:"relative" }}>
      <input
        type={ver ? "text" : "password"}
        placeholder={placeholder}
        value={loginForm[field]}
        onChange={e => setLoginForm(f => ({...f, [field]: e.target.value}))}
        style={{ paddingRight:48 }}
      />
      <button
        type="button"
        onClick={() => setVer(v => !v)}
        style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color: ver ? "#1B4F72" : "#94A3B8", display:"flex", alignItems:"center", padding:0, transition:"color .2s" }}
        title={ver ? "Ocultar contraseña" : "Ver contraseña"}
      >
        <EyeIcon visible={ver} />
      </button>
    </div>
    {extra}
  </div>
);

const SelectorIdioma = ({ idioma, onChange, variante = "claro" }) => {
  const claro = variante === "claro";
  return (
    <div style={{ display:"flex", background: claro ? "rgba(27,79,114,0.08)" : "rgba(255,255,255,0.12)", borderRadius:30, padding:3, gap:2 }}>
      {["es","en"].map(code => (
        <button key={code} onClick={() => onChange(code)}
          style={{
            padding:"5px 12px", borderRadius:24, fontSize:12, fontWeight:700, fontFamily:"'Montserrat',sans-serif",
            background: idioma === code ? (claro ? "#1B4F72" : "#fff") : "transparent",
            color: idioma === code ? (claro ? "#fff" : "#1B4F72") : (claro ? "#1B4F72" : "rgba(255,255,255,0.7)"),
            transition:"all .2s",
          }}>
          {code === "es" ? "🇪🇸 ES" : "🇺🇸 EN"}
        </button>
      ))}
    </div>
  );
};

export default function ContaQuiz() {
  // 🌍 Idioma: detecta el navegador la primera vez, luego respeta lo que el usuario elija
  const [idioma, setIdioma] = useState(() => {
    try {
      const guardado = localStorage.getItem("contaquiz_idioma");
      if (guardado === "es" || guardado === "en") return guardado;
    } catch (e) {}
    const navLang = (typeof navigator !== "undefined" && navigator.language) || "es";
    return navLang.toLowerCase().startsWith("en") ? "en" : "es";
  });
  const t = (clave) => TEXTOS[idioma]?.[clave] ?? TEXTOS.es[clave] ?? clave;
  const cambiarIdioma = (nuevo) => {
    setIdioma(nuevo);
    try { localStorage.setItem("contaquiz_idioma", nuevo); } catch (e) {}
  };

  const [pantalla, setPantalla] = useState("inicio");
  const [usuario, setUsuario] = useState(null);
  const [uid, setUid] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [rankingReal, setRankingReal] = useState([]);
  const [esPremium, setEsPremium] = useState(false);
  const [preguntasGratis, setPreguntasGratis] = useState(0);
  const [temaActivo, setTemaActivo] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [idx, setIdx] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [respondida, setRespondida] = useState(false);
  const [puntaje, setPuntaje] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [tiempo, setTiempo] = useState(0);
  const [tiempoRespuesta, setTiempoRespuesta] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [mostrarInsignia, setMostrarInsignia] = useState(false);
  const [puntajeTotal, setPuntajeTotal] = useState(0);
  const [insignias, setInsignias] = useState([]);
  const [loginForm, setLoginForm] = useState({ email:"", password:"", confirmar:"", nombre:"" });
  const [loginError, setLoginError] = useState("");
  const [loginExito, setLoginExito] = useState("");
  const [modoAuth, setModoAuth] = useState("login");
  const [emailRecuperar, setEmailRecuperar] = useState("");
  const [recuperarError, setRecuperarError] = useState("");
  const [recuperarExito, setRecuperarExito] = useState("");
  const [cargandoRecuperar, setCargandoRecuperar] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [planSel, setPlanSel] = useState("mensual");
  const [metodoPagoSel, setMetodoPagoSel] = useState(null); // "paypal" | "binance" | null
  const [cargandoPago, setCargandoPago] = useState(false);
  const [errorPago, setErrorPago] = useState("");
  const [ordenBinance, setOrdenBinance] = useState(null); // { checkoutUrl, qrcodeLink, merchantTradeNo }
  const [verificandoPago, setVerificandoPago] = useState(false);
  const [idxPendiente, setIdxPendiente] = useState(null); // guarda en qué pregunta retomar tras registrarse a mitad de quiz
  const intervalRef = useRef(null);
  const tiempoRespRef = useRef(0);

  // Escucha la sesión de Firebase: mantiene al usuario logueado entre recargas
  useEffect(() => {
    const unsubscribe = escucharSesion(async (firebaseUser) => {
      if (firebaseUser) {
        setUid(firebaseUser.uid);
        const perfil = await obtenerPerfil(firebaseUser.uid);
        if (perfil) {
          setUsuario({ nombre: perfil.nombre, email: perfil.email });
          setEsPremium(!!perfil.esPremium);
          setPreguntasGratis(perfil.preguntasGratisUsadas || 0);
          setPuntajeTotal(perfil.puntajeTotal || 0);
          setInsignias(perfil.insignias || []);
          setPantalla(p => (p === "inicio" || p === "auth") ? "temas" : p);
        }
      } else {
        setUid(null);
      }
      setCargandoSesion(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (timerOn) {
      intervalRef.current = setInterval(() => {
        setTiempo(t => t + 1);
        tiempoRespRef.current += 1;
        setTiempoRespuesta(tiempoRespRef.current);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerOn]);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const iniciarQuiz = (tema) => {
    const qs = shuffle(tema.preguntas).map(q => ({ ...q, opciones: shuffle(q.opciones.map((o,i) => ({ texto:o, original:i }))) }));
    setTemaActivo(tema);
    setPreguntas(qs);
    setIdx(0); setSeleccion(null); setRespondida(false);
    setPuntaje(0); setAciertos(0); setHistorial([]);
    setTiempo(0); tiempoRespRef.current = 0; setTiempoRespuesta(0);
    setTimerOn(true);
    setPantalla("quiz");
  };

  const responder = (opIdx) => {
    if (respondida) return;
    const pregunta = preguntas[idx];
    const opcionSeleccionada = pregunta.opciones[opIdx];
    const esCorrecta = opcionSeleccionada.original === pregunta.correcta;
    const rapida = tiempoRespRef.current <= TIEMPO_RAPIDA;
    let pts = esCorrecta ? PUNTOS_CORRECTA + (rapida ? PUNTOS_RAPIDA : 0) : PENALIZACION;
    setSeleccion(opIdx);
    setRespondida(true);
    setPuntaje(p => p + pts);
    if (esCorrecta) setAciertos(a => a + 1);
    setHistorial(h => [...h, { pregunta: pregunta.texto, esCorrecta, pts, tiempo: tiempoRespRef.current }]);
    tiempoRespRef.current = 0; setTiempoRespuesta(0);
    if (!esPremium) {
      setPreguntasGratis(g => g + 1);
      if (uid) incrementarPreguntasGratis(uid); // persiste el contador en Firestore
    }
  };

  // Avanza a la siguiente pregunta (o cierra el quiz si ya no hay más). Reutilizable
  // tanto desde el flujo normal como al retomar un quiz después de registrarse.
  const avanzarPregunta = async (sigIdx) => {
    if (sigIdx >= preguntas.length) {
      setTimerOn(false);
      setPuntajeTotal(pt => pt + puntaje);
      const totalCorrectas = aciertos;
      let insigniaGanada = null;
      // Check insignia (≥18/20 preguntas correctas del tema)
      if (totalCorrectas >= 18) {
        setMostrarInsignia(true);
        insigniaGanada = temaActivo.insignia;
        setInsignias(ins => ins.includes(temaActivo.insignia) ? ins : [...ins, temaActivo.insignia]);
      }
      // Persistir resultado en Firestore (puntaje, progreso, insignia, ranking)
      if (uid) {
        try {
          await registrarResultadoQuiz(uid, {
            temaId: temaActivo.id,
            puntaje,
            correctas: totalCorrectas,
            total: preguntas.length,
            insignia: insigniaGanada,
          });
        } catch (e) {
          console.error("Error guardando resultado en Firestore:", e);
        }
      }
      setPantalla("resultado");
    } else {
      setIdx(sigIdx); setSeleccion(null); setRespondida(false);
      tiempoRespRef.current = 0; setTiempoRespuesta(0);
    }
  };

  const siguiente = async () => {
    const sigIdx = idx + 1;
    // Bloqueo freemium: invitados (sin cuenta) tienen un límite más bajo que usuarios registrados
    const limite = uid ? LIMITE_GRATIS : LIMITE_INVITADO;
    if (!esPremium && preguntasGratis >= limite) {
      setTimerOn(false);
      if (uid) {
        // Usuario registrado que agotó sus 10 gratis: paywall de premium
        setPantalla("paywall");
      } else {
        // Invitado que agotó sus 3 gratis: pedir cuenta, guardando dónde retomar
        setIdxPendiente(sigIdx);
        setModoAuth("registro");
        setPantalla("auth");
      }
      return;
    }
    await avanzarPregunta(sigIdx);
  };

  const [cargandoLogin, setCargandoLogin] = useState(false);

  // Crea una orden real de pago con Binance Pay llamando a la función serverless
  const iniciarPagoBinance = async () => {
    if (!uid) { setPantalla("auth"); return; }
    setErrorPago("");
    setCargandoPago(true);
    try {
      const resp = await fetch("/api/crear-orden-binance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planSel, uid, email: usuario?.email }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "No se pudo crear la orden de pago");
      setOrdenBinance(data);
    } catch (e) {
      console.error("Error iniciando pago Binance:", e);
      setErrorPago(idioma === "en" ? "Couldn't start the payment. Please try again." : "No se pudo iniciar el pago. Inténtalo de nuevo.");
    } finally {
      setCargandoPago(false);
    }
  };

  // Consulta periódicamente si el usuario ya completó el pago en Binance
  const verificarPagoBinance = async () => {
    if (!ordenBinance?.merchantTradeNo) return;
    setVerificandoPago(true);
    try {
      const resp = await fetch("/api/verificar-pago-binance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantTradeNo: ordenBinance.merchantTradeNo }),
      });
      const data = await resp.json();
      if (data.estado === "PAID") {
        setEsPremium(true);
        await activarPremium(uid, { plan: planSel, metodoPago: "binance_pay", referenciaPago: ordenBinance.merchantTradeNo });
        setOrdenBinance(null);
        setPantalla("temas");
      } else {
        setErrorPago(idioma === "en" ? "Payment not detected yet. If you already paid, wait a few seconds and check again." : "Aún no detectamos el pago. Si ya pagaste, espera unos segundos y vuelve a verificar.");
      }
    } catch (e) {
      console.error("Error verificando pago:", e);
    } finally {
      setVerificandoPago(false);
    }
  };

  const handleLogin = async () => {
    setLoginError("");
    if (modoAuth === "registro") {
      if (!loginForm.nombre.trim())          { setLoginError("Por favor ingresa tu nombre completo."); return; }
      if (!loginForm.email.trim())           { setLoginError("Por favor ingresa tu correo electrónico."); return; }
      if (!/\S+@\S+\.\S+/.test(loginForm.email)) { setLoginError("El correo electrónico no es válido."); return; }
      if (!loginForm.password)               { setLoginError("Por favor crea una contraseña."); return; }
      if (loginForm.password.length < 6)     { setLoginError("La contraseña debe tener al menos 6 caracteres."); return; }
      if (!loginForm.confirmar)              { setLoginError("Por favor confirma tu contraseña."); return; }
      if (loginForm.password !== loginForm.confirmar) { setLoginError("Las contraseñas no coinciden. Verifícalas."); return; }

      setCargandoLogin(true);
      try {
        const fbUser = await registrarUsuario({
          nombre: loginForm.nombre,
          email: loginForm.email,
          password: loginForm.password,
        });
        setLoginExito("¡Cuenta creada exitosamente! Bienvenida a ContaQuiz 🎉");
        setUid(fbUser.uid);
        setUsuario({ nombre: loginForm.nombre, email: loginForm.email });
        setTimeout(() => {
          setLoginExito("");
          // Si venía de un quiz en curso como invitado, retoma justo donde quedó
          if (idxPendiente !== null && temaActivo) {
            const retomarIdx = idxPendiente;
            setIdxPendiente(null);
            setTimerOn(true);
            setPantalla("quiz");
            avanzarPregunta(retomarIdx);
          } else {
            setPantalla("temas");
          }
        }, 1200);
      } catch (err) {
        setLoginError(traducirErrorFirebase(err.code));
      } finally {
        setCargandoLogin(false);
      }
    } else {
      if (!loginForm.email || !loginForm.password) { setLoginError("Completa todos los campos."); return; }
      setCargandoLogin(true);
      try {
        const fbUser = await iniciarSesion({ email: loginForm.email, password: loginForm.password });
        setUid(fbUser.uid);
        const perfil = await obtenerPerfil(fbUser.uid);
        if (perfil) {
          setUsuario({ nombre: perfil.nombre, email: perfil.email });
          setEsPremium(!!perfil.esPremium);
          setPreguntasGratis(perfil.preguntasGratisUsadas || 0);
          setPuntajeTotal(perfil.puntajeTotal || 0);
          setInsignias(perfil.insignias || []);
        }
        // Si venía de un quiz en curso como invitado, retoma justo donde quedó
        if (idxPendiente !== null && temaActivo) {
          const retomarIdx = idxPendiente;
          setIdxPendiente(null);
          setTimerOn(true);
          setPantalla("quiz");
          avanzarPregunta(retomarIdx);
        } else {
          setPantalla("temas");
        }
      } catch (err) {
        setLoginError(traducirErrorFirebase(err.code));
      } finally {
        setCargandoLogin(false);
      }
    }
  };

  function traducirErrorFirebase(codigo) {
    const mapa = {
      "auth/email-already-in-use": "Este correo ya tiene una cuenta registrada. Intenta iniciar sesión.",
      "auth/invalid-email": "El correo electrónico no es válido.",
      "auth/weak-password": "La contraseña es demasiado débil. Usa al menos 6 caracteres.",
      "auth/user-not-found": "No existe una cuenta con este correo. ¿Quieres registrarte?",
      "auth/wrong-password": "Contraseña incorrecta. Inténtalo de nuevo.",
      "auth/invalid-credential": "Correo o contraseña incorrectos.",
      "auth/too-many-requests": "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
      "auth/network-request-failed": "Error de conexión. Verifica tu internet.",
    };
    return mapa[codigo] || "Ocurrió un error inesperado. Inténtalo de nuevo.";
  }

  // Envía el correo de recuperación de contraseña. Por seguridad, no revelamos
  // si el correo existe o no; mostramos siempre el mismo mensaje de éxito
  // una vez que la solicitud se procesó sin errores de formato.
  const handleRecuperarContrasena = async () => {
    setRecuperarError("");
    setRecuperarExito("");
    const correo = emailRecuperar.trim();
    if (!correo) {
      setRecuperarError("Ingresa tu correo electrónico.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(correo)) {
      setRecuperarError("El correo electrónico no es válido.");
      return;
    }
    setCargandoRecuperar(true);
    try {
      await recuperarContrasena(correo);
      setRecuperarExito(`Si ese correo tiene una cuenta, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada (y spam).`);
    } catch (err) {
      setRecuperarError(traducirErrorFirebase(err.code));
    } finally {
      setCargandoRecuperar(false);
    }
  };

  const pct = preguntas.length ? Math.round((idx + (respondida?1:0)) / preguntas.length * 100) : 0;
  const pregActual = preguntas[idx];
  const porcentajeAciertos = historial.length ? Math.round(aciertos / historial.length * 100) : 0;

  // Trae el ranking real desde Firestore cada vez que se entra a esa pantalla
  useEffect(() => {
    if (pantalla === "ranking") {
      obtenerRankingGlobal(20)
        .then(setRankingReal)
        .catch(e => console.error("Error cargando ranking:", e));
    }
  }, [pantalla]);

  const rankingConUsuario = (() => {
    const lista = rankingReal.length > 0
      ? rankingReal.map(r => ({ nombre:r.nombre, pais:"🌎", pts:r.puntajeTotal || 0, insignias:(r.insignias||[]).length, esUsuario: r.uid === uid }))
      : RANKING_BASE;
    // Garantiza que el usuario actual aparezca aunque no esté aún en el top 20
    if (uid && !lista.some(r => r.esUsuario)) {
      lista.push({ nombre: usuario?.nombre || "Tú", pais:"🇩🇴", pts: puntajeTotal, insignias: insignias.length, esUsuario:true });
    }
    return lista.sort((a,b) => b.pts - a.pts);
  })();

  /* ──── PANTALLA: CARGANDO SESIÓN (Firebase verificando) ──── */
  if (cargandoSesion) return (
    <>
      <FontLoader />
      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0D2137,#1B4F72,#1A5C38)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <Logo size={48} showText={true} variante="oscuro" />
          <div style={{ marginTop:24, width:32, height:32, border:"3px solid rgba(255,255,255,0.2)", borderTopColor:"#2ECC71", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"24px auto 0" }} />
        </div>
      </div>
    </>
  );

  /* ──── PANTALLA: INICIO ──── */
  if (pantalla === "inicio") return (
    <>
      <FontLoader />
      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg, #0D2137 0%, #1B4F72 45%, #1A5C38 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", position:"relative", overflow:"hidden" }}>
        {/* decorative circles */}
        {[...Array(6)].map((_,i) => (
          <div key={i} style={{ position:"absolute", borderRadius:"50%", background:"rgba(255,255,255,0.04)", width: 100+i*80, height:100+i*80, top:`${10+i*12}%`, left:`${-5+i*15}%`, pointerEvents:"none" }} />
        ))}
        <div style={{ position:"absolute", top:0, right:0, width:300, height:300, background:"radial-gradient(circle, rgba(39,174,96,0.15) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div style={{ position:"absolute", top:20, right:20, zIndex:2 }}>
          <SelectorIdioma idioma={idioma} onChange={cambiarIdioma} variante="oscuro" />
        </div>

        <div className="fade-up" style={{ textAlign:"center", maxWidth:600, zIndex:1 }}>
          {/* Logo */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:32 }}>
            <div style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(12px)", borderRadius:24, padding:"20px 32px", border:"1px solid rgba(255,255,255,0.2)" }}>
              <Logo size={56} showText={true} variante="oscuro" />
            </div>
          </div>

          <h1 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:"clamp(28px,6vw,54px)", color:"#fff", lineHeight:1.1, marginBottom:16, letterSpacing:"-1px" }}>
            {t("bienvenida")}<br/>
            <span style={{ background:"linear-gradient(90deg,#27AE60,#2ECC71)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ContaQuiz</span>
          </h1>
          <p style={{ fontSize:"clamp(16px,2.5vw,20px)", color:"rgba(255,255,255,0.8)", marginBottom:12, fontStyle:"italic", fontFamily:"'Inter',sans-serif" }}>
            {t("eslogan1")}<br/>{t("eslogan2")}
          </p>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:14, marginBottom:48, fontFamily:"'Inter',sans-serif" }}>
            {t("subtitulo")}
          </p>

          <button className="btn-primary pulse-btn" onClick={() => { setUsuario({ nombre:"Invitado", email:"" }); setPantalla("temas"); }} style={{ padding:"18px 56px", fontSize:18, borderRadius:18, letterSpacing:1 }}>
            {t("jugarAhora")}
          </button>

          <div style={{ marginTop:16 }}>
            <span onClick={() => { setModoAuth("login"); setPantalla("auth"); }} style={{ cursor:"pointer", textDecoration:"underline", color:"rgba(255,255,255,0.55)", fontSize:13, fontFamily:"'Inter',sans-serif" }}>
              {t("yaTienesCuenta")}
            </span>
          </div>

          <div style={{ display:"flex", justifyContent:"center", gap:32, marginTop:48, flexWrap:"wrap" }}>
            {[["500+",t("statPreguntas")],["5",t("statModulos")],["3",t("statTipos")],["🏆",t("statRanking")]].map(([n,l]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:24, color:"#2ECC71" }}>{n}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", letterSpacing:1 }}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* floating badges */}
        {["📘","📗","📙","📒","📕"].map((e,i) => (
          <div key={i} style={{ position:"absolute", fontSize:28, opacity:0.15, top:`${15+i*16}%`, right:`${5+i*4}%`, transform:`rotate(${-15+i*8}deg)`, pointerEvents:"none" }}>{e}</div>
        ))}

        {/* Footer legal discreto */}
        <div style={{ position:"absolute", bottom:14, left:0, right:0, textAlign:"center", zIndex:2 }}>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", fontFamily:"'Inter',sans-serif", margin:0 }}>
            {t("footerOperadoPor")}
            {"  ·  "}
            <span onClick={() => setPantalla("terminos")} style={{ cursor:"pointer", textDecoration:"underline", color:"rgba(255,255,255,0.45)" }}>{t("footerTerminos")}</span>
          </p>
        </div>
      </div>
    </>
  );

  /* ──── PANTALLA: AUTH ──── */
  if (pantalla === "auth") {
    const passwordSegura = loginForm.password.length >= 6;
    const passwordMuySegura = loginForm.password.length >= 10 && /[0-9]/.test(loginForm.password) && /[A-Z]/.test(loginForm.password);
    const passwordsCoinciden = loginForm.password && loginForm.confirmar && loginForm.password === loginForm.confirmar;
    const passwordsNoCoincidenAun = loginForm.confirmar && loginForm.password !== loginForm.confirmar;

    const nivelPassword = !loginForm.password ? null : passwordMuySegura ? "fuerte" : passwordSegura ? "media" : "débil";
    const colorNivel = { fuerte:"#27AE60", media:"#F1C40F", débil:"#E74C3C" };
    const anchoNivel = { fuerte:"100%", media:"60%", débil:"30%" };

    return (
      <>
        <FontLoader />
        <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0D2137 0%,#1B4F72 50%,#1A5C38 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
          {/* Fondo decorativo */}
          {[...Array(4)].map((_,i) => (
            <div key={i} style={{ position:"absolute", borderRadius:"50%", background:"rgba(255,255,255,0.03)", width:120+i*100, height:120+i*100, bottom:`${5+i*10}%`, right:`${-5+i*8}%`, pointerEvents:"none" }} />
          ))}

          <div style={{ position:"absolute", top:20, right:20, zIndex:2 }}>
            <SelectorIdioma idioma={idioma} onChange={cambiarIdioma} variante="oscuro" />
          </div>

          <div className="card pop" style={{ width:"100%", maxWidth:440, padding:"36px 32px", position:"relative", zIndex:1 }}>
            {/* Header */}
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <Logo size={44} showText={true} />
              {idxPendiente !== null ? (
                <div style={{ marginTop:12, padding:"12px 14px", background:"#F0FDF4", borderRadius:12, border:"1px solid #BBF7D0" }}>
                  <p style={{ color:"#166534", fontSize:14, fontWeight:700, margin:0, fontFamily:"'Montserrat',sans-serif" }}>
                    {t("continuaRegistroTitulo")}
                  </p>
                  <p style={{ color:"#166534", fontSize:12.5, marginTop:4, marginBottom:0, fontFamily:"'Inter',sans-serif" }}>
                    {t("continuaRegistroDesc")}
                  </p>
                </div>
              ) : (
                <p style={{ color:"#64748B", fontSize:14, marginTop:10, fontFamily:"'Inter',sans-serif" }}>
                  {modoAuth === "recuperar" ? t("recuperarTitulo") : modoAuth === "login" ? t("iniciarSesionTitulo") : t("crearCuentaTitulo")}
                </p>
              )}
            </div>

            {modoAuth === "recuperar" ? (
              <>
                <p style={{ color:"#64748B", fontSize:13.5, marginTop:-14, marginBottom:20, fontFamily:"'Inter',sans-serif", textAlign:"center" }}>
                  {t("recuperarDesc")}
                </p>

                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:"#475569", display:"block", marginBottom:6, fontFamily:"'Montserrat',sans-serif" }}>
                    📧 {t("correoElectronico")} <span style={{ color:"#E74C3C" }}>*</span>
                  </label>
                  <input type="email" placeholder={t("placeholderCorreo")} value={emailRecuperar}
                    onChange={e => setEmailRecuperar(e.target.value)}
                    style={{ borderColor: /\S+@\S+\.\S+/.test(emailRecuperar) ? "#27AE60" : "" }} />
                </div>

                {recuperarError && (
                  <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:"10px 14px", marginTop:14, display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:16 }}>⚠️</span>
                    <p style={{ color:"#DC2626", fontSize:13, fontFamily:"'Inter',sans-serif" }}>{recuperarError}</p>
                  </div>
                )}
                {recuperarExito && (
                  <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:"10px 14px", marginTop:14, display:"flex", alignItems:"center", gap:8, animation:"fadeUp .4s ease" }}>
                    <span style={{ fontSize:16 }}>✅</span>
                    <p style={{ color:"#166534", fontSize:13, fontFamily:"'Inter',sans-serif", fontWeight:600 }}>{recuperarExito}</p>
                  </div>
                )}

                <button className="btn-secondary" onClick={handleRecuperarContrasena} disabled={cargandoRecuperar}
                  style={{ width:"100%", padding:"15px", fontSize:15, marginTop:20, opacity: cargandoRecuperar ? 0.7 : 1, cursor: cargandoRecuperar ? "wait" : "pointer" }}>
                  {cargandoRecuperar ? t("procesando") : t("recuperarBtn")}
                </button>

                <div style={{ textAlign:"center", marginTop:16 }}>
                  <span
                    onClick={() => { setModoAuth("login"); setRecuperarError(""); setRecuperarExito(""); }}
                    style={{ cursor:"pointer", textDecoration:"underline", color:"#64748B", fontSize:13, fontFamily:"'Inter',sans-serif" }}>
                    {t("volverALogin")}
                  </span>
                </div>
              </>
            ) : (
              <>
            {/* Tabs */}
            <div style={{ display:"flex", background:"#F0F4F8", borderRadius:12, padding:4, marginBottom:24 }}>
              {[["login",`🔑 ${t("tabLogin")}`],["registro",`✏️ ${t("tabRegistro")}`]].map(([m,l]) => (
                <button key={m} onClick={() => { setModoAuth(m); setLoginError(""); setLoginExito(""); setLoginForm({ email:"", password:"", confirmar:"", nombre:"" }); setVerPassword(false); setVerConfirmar(false); }}
                  style={{ flex:1, padding:"11px 8px", border:"none", borderRadius:10, fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", background: modoAuth===m ? "#fff" : "transparent", color: modoAuth===m ? "#1B4F72" : "#94A3B8", boxShadow: modoAuth===m ? "0 2px 10px rgba(27,79,114,0.15)" : "none", transition:"all .2s" }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Campos */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* Nombre (solo registro) */}
              {modoAuth === "registro" && (
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:"#475569", display:"block", marginBottom:6, fontFamily:"'Montserrat',sans-serif" }}>
                    👤 {t("nombreCompleto")} <span style={{ color:"#E74C3C" }}>*</span>
                  </label>
                  <input type="text" placeholder={t("placeholderNombre")} value={loginForm.nombre}
                    onChange={e => setLoginForm(f => ({...f, nombre:e.target.value}))}
                    style={{ borderColor: loginForm.nombre.trim().length > 1 ? "#27AE60" : "" }} />
                  {loginForm.nombre.trim().length > 1 && (
                    <div style={{ fontSize:12, color:"#27AE60", marginTop:4, display:"flex", alignItems:"center", gap:4 }}>{t("nombreValido")}</div>
                  )}
                </div>
              )}

              {/* Email */}
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:"#475569", display:"block", marginBottom:6, fontFamily:"'Montserrat',sans-serif" }}>
                  📧 {t("correoElectronico")} <span style={{ color:"#E74C3C" }}>*</span>
                </label>
                <input type="email" placeholder={t("placeholderCorreo")} value={loginForm.email}
                  onChange={e => setLoginForm(f => ({...f, email:e.target.value}))}
                  style={{ borderColor: /\S+@\S+\.\S+/.test(loginForm.email) ? "#27AE60" : "" }} />
                {loginForm.email && !/\S+@\S+\.\S+/.test(loginForm.email) && (
                  <div style={{ fontSize:12, color:"#E74C3C", marginTop:4 }}>{t("correoInvalido")}</div>
                )}
                {/\S+@\S+\.\S+/.test(loginForm.email) && (
                  <div style={{ fontSize:12, color:"#27AE60", marginTop:4 }}>{t("correoValido")}</div>
                )}
              </div>

              {/* Contraseña */}
              <CampoPassword
                label={<>🔒 {t("contrasena")} <span style={{ color:"#E74C3C" }}>*</span></>}
                field="password" ver={verPassword} setVer={setVerPassword}
                loginForm={loginForm} setLoginForm={setLoginForm}
                placeholder={t("placeholderPass")}
                extra={
                  <>
                    {/* Barra de fortaleza */}
                    {loginForm.password && (
                      <div style={{ marginTop:8 }}>
                        <div style={{ background:"#E2E8F0", borderRadius:4, height:5, overflow:"hidden" }}>
                          <div style={{ width: anchoNivel[nivelPassword] || "0%", height:"100%", background: colorNivel[nivelPassword], borderRadius:4, transition:"all .4s" }} />
                        </div>
                        <div style={{ fontSize:12, marginTop:4, color: colorNivel[nivelPassword], fontFamily:"'Montserrat',sans-serif", fontWeight:600 }}>
                          {nivelPassword === "fuerte" ? t("passFuerte") : nivelPassword === "media" ? t("passMedia") : t("passDebil")}
                        </div>
                        {modoAuth === "registro" && nivelPassword !== "fuerte" && (
                          <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>
                            {t("passConsejo")}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                }
              />

              {/* Link de recuperación de contraseña (solo en modo login) */}
              {modoAuth === "login" && (
                <div style={{ textAlign:"right", marginTop:-6, marginBottom:10 }}>
                  <span
                    onClick={() => { setRecuperarError(""); setRecuperarExito(""); setEmailRecuperar(loginForm.email || ""); setModoAuth("recuperar"); }}
                    style={{ cursor:"pointer", textDecoration:"underline", color:"#64748B", fontSize:12.5, fontFamily:"'Inter',sans-serif" }}>
                    {t("olvidasteContrasena")}
                  </span>
                </div>
              )}

              {/* Confirmar contraseña (solo registro) */}
              {modoAuth === "registro" && (
                <CampoPassword
                  label={<>🔒 {t("confirmarContrasena")} <span style={{ color:"#E74C3C" }}>*</span></>}
                  field="confirmar" ver={verConfirmar} setVer={setVerConfirmar}
                  loginForm={loginForm} setLoginForm={setLoginForm}
                  placeholder={t("placeholderConfirmar")}
                  extra={
                    <>
                      {passwordsCoinciden && (
                        <div style={{ fontSize:12, color:"#27AE60", marginTop:5, display:"flex", alignItems:"center", gap:4 }}>
                          {t("passCoinciden")}
                        </div>
                      )}
                      {passwordsNoCoincidenAun && (
                        <div style={{ fontSize:12, color:"#E74C3C", marginTop:5, display:"flex", alignItems:"center", gap:4 }}>
                          {t("passNoCoinciden")}
                        </div>
                      )}
                    </>
                  }
                />
              )}
            </div>

            {/* Mensajes */}
            {loginError && (
              <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:"10px 14px", marginTop:14, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:16 }}>⚠️</span>
                <p style={{ color:"#DC2626", fontSize:13, fontFamily:"'Inter',sans-serif" }}>{loginError}</p>
              </div>
            )}
            {loginExito && (
              <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:"10px 14px", marginTop:14, display:"flex", alignItems:"center", gap:8, animation:"fadeUp .4s ease" }}>
                <span style={{ fontSize:16 }}>🎉</span>
                <p style={{ color:"#166534", fontSize:13, fontFamily:"'Inter',sans-serif", fontWeight:600 }}>{loginExito}</p>
              </div>
            )}

            <button className="btn-secondary" onClick={handleLogin} disabled={cargandoLogin}
              style={{ width:"100%", padding:"15px", fontSize:15, marginTop:20, opacity: cargandoLogin ? 0.7 : 1, cursor: cargandoLogin ? "wait" : "pointer" }}>
              {cargandoLogin ? t("procesando") : (modoAuth === "login" ? t("iniciarSesionBtn") : t("crearCuentaBtn"))}
            </button>

            {/* Divisor y botón de invitado: solo si no viene de un quiz ya en curso */}
            {idxPendiente === null && (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:10, margin:"16px 0" }}>
                  <div style={{ flex:1, height:1, background:"#E2E8F0" }} />
                  <span style={{ fontSize:12, color:"#94A3B8", fontFamily:"'Inter',sans-serif" }}>{t("o")}</span>
                  <div style={{ flex:1, height:1, background:"#E2E8F0" }} />
                </div>

                <button onClick={() => { setUsuario({ nombre:"Invitado", email:"" }); setPantalla("temas"); }}
                  className="btn-outline"
                  style={{ width:"100%", padding:"13px", fontSize:14 }}>
                  {t("probarGratis")}
                </button>
              </>
            )}
              </>
            )}

            <div style={{ marginTop:16, padding:"10px 14px", background:"#F0FDF4", borderRadius:10, border:"1px solid #BBF7D0", textAlign:"center" }}>
              <p style={{ fontSize:12, color:"#166534", fontFamily:"'Inter',sans-serif" }}>
                {t("datosSeguros")}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ──── PANTALLA: TEMAS ──── */
  if (pantalla === "temas") return (
    <>
      <FontLoader />
      <div style={{ minHeight:"100vh", background:"#F0F4F8" }}>
        {/* Header */}
        <header style={{ background:"linear-gradient(135deg,#1B4F72,#2E86C1)", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 4px 20px rgba(27,79,114,0.3)" }}>
          <Logo size={36} showText={true} variante="oscuro" />
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <SelectorIdioma idioma={idioma} onChange={cambiarIdioma} variante="oscuro" />
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, color:"#fff", fontSize:14 }}>{usuario?.nombre}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>{esPremium ? `✨ ${t("premium")}` : `🎁 ${LIMITE_GRATIS - preguntasGratis} ${t("preguntasDisponibles")}`}</div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:"50%", width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
              {usuario?.nombre?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <div style={{ maxWidth:900, margin:"0 auto", padding:"24px 16px" }}>
          {/* Stats bar */}
          <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
            {[
              { label:t("puntuacionTotal"), val: puntajeTotal.toLocaleString(), icon:"⭐", color:"#F1C40F" },
              { label:t("insignias"), val: insignias.length, icon:"🏅", color:"#27AE60" },
              { label:t("estado"), val: esPremium ? t("premium") : t("gratis"), icon:"👤", color:"#2E86C1" },
            ].map(s => (
              <div key={s.label} className="card" style={{ flex:"1 1 130px", padding:"14px 16px", display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:24 }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:18, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:11, color:"#94A3B8" }}>{s.label}</div>
                </div>
              </div>
            ))}
            <div className="card" onClick={() => setPantalla("ranking")} style={{ flex:"1 1 130px", padding:"14px 16px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", border:"2px solid transparent", transition:"border .2s" }}
              onMouseEnter={e => e.currentTarget.style.border="2px solid #1B4F72"}
              onMouseLeave={e => e.currentTarget.style.border="2px solid transparent"}>
              <span style={{ fontSize:24 }}>🏆</span>
              <div>
                <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:18, color:"#1B4F72" }}>{t("ranking")}</div>
                <div style={{ fontSize:11, color:"#94A3B8" }}>{t("verPosicion")}</div>
              </div>
            </div>
          </div>

          <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:22, color:"#1E293B", marginBottom:6 }}>{t("seleccionaModulo")}</h2>
          <p style={{ color:"#64748B", fontSize:14, marginBottom:20, fontFamily:"'Inter',sans-serif" }}>
            {esPremium ? t("accesoCompleto") : `${t("modoGratuito")}: ${LIMITE_GRATIS - preguntasGratis} ${t("preguntasDisponibles")}`}
          </p>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {TEMAS.map((tema, ti) => {
              const bloqueado = !esPremium && preguntasGratis >= LIMITE_GRATIS;
              const completado = insignias.includes(tema.insignia);
              return (
                <div key={tema.id} className="card fade-up" style={{ animationDelay:`${ti*0.07}s`, padding:"20px 24px", display:"flex", alignItems:"center", gap:16, borderLeft:`5px solid ${tema.accent}`, cursor: bloqueado ? "not-allowed" : "pointer", opacity: bloqueado ? 0.6 : 1, transition:"transform .2s, box-shadow .2s" }}
                  onClick={() => !bloqueado && iniciarQuiz(tema)}
                  onMouseEnter={e => { if (!bloqueado) e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(27,79,114,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 24px rgba(27,79,114,0.13)"; }}>
                  <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg,${tema.color}22,${tema.accent}22)`, border:`2px solid ${tema.accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{tema.icono}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:16, color:"#1E293B" }}>{tema.nombre}</span>
                      <span style={{ background:`${tema.accent}22`, color:tema.accent, fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:20, fontFamily:"'Montserrat',sans-serif" }}>{tema.nivel}</span>
                      {completado && <span style={{ fontSize:14 }}>✅</span>}
                    </div>
                    <p style={{ color:"#64748B", fontSize:13, fontFamily:"'Inter',sans-serif" }}>{tema.descripcion}</p>
                    <div style={{ fontSize:12, color:"#94A3B8", marginTop:4 }}>🏅 {tema.insignia}</div>
                  </div>
                  <div style={{ textAlign:"center", flexShrink:0 }}>
                    {bloqueado ? <span style={{ fontSize:24 }}>🔒</span> : <span style={{ fontSize:28, color:tema.accent }}>▶</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {!esPremium && (
            <div style={{ marginTop:24, background:"linear-gradient(135deg,#1B4F72,#27AE60)", borderRadius:20, padding:"24px", textAlign:"center", color:"#fff" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>🔓</div>
              <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:18, marginBottom:8 }}>{t("desbloquea")}</h3>
              <p style={{ fontSize:14, opacity:0.85, marginBottom:16, fontFamily:"'Inter',sans-serif" }}>{t("desbloqueaDesc")}</p>
              <button className="btn-primary" onClick={() => setPantalla("paywall")} style={{ padding:"12px 32px", fontSize:15 }}>
                {t("suscribirseDesde")}
              </button>
            </div>
          )}

          <div style={{ marginTop:20, textAlign:"center" }}>
            <button onClick={() => setPantalla("ajustes")} style={{ background:"none", border:"none", color:"#94A3B8", fontSize:13, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>{t("ajustes")}</button>
          </div>
        </div>
      </div>
    </>
  );

  /* ──── PANTALLA: QUIZ ──── */
  if (pantalla === "quiz" && temaActivo && pregActual) {
    const getTipoLabel = () => ({ multiple:idioma==="en"?"Multiple Choice":"Selección Múltiple", vf:idioma==="en"?"True / False":"Verdadero / Falso", caso:idioma==="en"?"Case Study":"Caso Práctico" }[pregActual.tipo] || "Pregunta");
    const getDifColor = () => ({ básico:"#27AE60", intermedio:"#F1C40F", avanzado:"#E74C3C" }[pregActual.dificultad] || "#94A3B8");
    return (
      <>
        <FontLoader />
        <div style={{ minHeight:"100vh", background:"#F0F4F8" }}>
          {/* Quiz Header */}
          <div style={{ background:`linear-gradient(135deg,${temaActivo.color},${temaActivo.accent})`, padding:"14px 20px" }}>
            <div style={{ maxWidth:720, margin:"0 auto" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <button onClick={() => { setTimerOn(false); setPantalla("temas"); }} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:13, fontFamily:"'Montserrat',sans-serif" }}>{t("salir")}</button>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, color:"#fff", fontSize:14 }}>{temaActivo.icono} {temaActivo.nombre}</span>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <span style={{ color:"rgba(255,255,255,0.9)", fontSize:14 }}>⏱ {fmt(tiempo)}</span>
                  <span style={{ background:"rgba(255,255,255,0.2)", color:"#fff", padding:"4px 10px", borderRadius:20, fontSize:13, fontFamily:"'Montserrat',sans-serif", fontWeight:700 }}>
                    {idx+1}/{preguntas.length}
                  </span>
                </div>
              </div>
              <div style={{ background:"rgba(255,255,255,0.25)", borderRadius:4, height:6 }}>
                <div style={{ width:`${pct}%`, height:"100%", background:"#fff", borderRadius:4, transition:"width .4s" }} />
              </div>
            </div>
          </div>

          <div style={{ maxWidth:720, margin:"0 auto", padding:"20px 16px" }}>
            {/* Puntos actuales */}
            <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
              <span style={{ background:"#FFF9C4", color:"#7D6608", padding:"6px 14px", borderRadius:20, fontSize:13, fontFamily:"'Montserrat',sans-serif", fontWeight:700 }}>⭐ {puntaje} {t("ptsLabel")}</span>
              <span style={{ background:`${getDifColor()}22`, color:getDifColor(), padding:"6px 14px", borderRadius:20, fontSize:12, fontFamily:"'Montserrat',sans-serif", fontWeight:600 }}>{pregActual.dificultad?.toUpperCase()}</span>
              <span style={{ background:"#E3F2FD", color:"#1565C0", padding:"6px 14px", borderRadius:20, fontSize:12 }}>{getTipoLabel()}</span>
              {tiempoRespuesta > 0 && tiempoRespuesta <= TIEMPO_RAPIDA && !respondida && (
                <span style={{ background:"#E8F5E9", color:"#1B5E20", padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:700, animation:"pulse 1s infinite" }}>⚡ {t("respondeRapido")}</span>
              )}
            </div>

            {/* Pregunta */}
            <div className="card" style={{ padding:"24px", marginBottom:16, borderTop:`4px solid ${temaActivo.accent}` }}>
              <p style={{ fontSize:"clamp(15px,2.5vw,18px)", lineHeight:1.7, color:"#1E293B", fontFamily:"'Inter',sans-serif", margin:0 }}>
                {pregActual.tipo === "caso" && <span style={{ display:"block", fontSize:12, color:"#94A3B8", marginBottom:8, fontFamily:"'Montserrat',sans-serif", fontWeight:600, letterSpacing:1 }}>{t("casoPractico")}</span>}
                {pregActual.texto}
              </p>
            </div>

            {/* Opciones */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {pregActual.opciones.map((op, i) => {
                const esCorrecta = op.original === pregActual.correcta;
                const seleccionada = seleccion === i;
                let bg = "#fff", border = "2px solid #E2E8F0", color = "#1E293B", icon = "";
                if (respondida) {
                  if (esCorrecta) { bg="#F0FDF4"; border="2px solid #27AE60"; color="#14532D"; icon="✓"; }
                  else if (seleccionada) { bg="#FEF2F2"; border="2px solid #E74C3C"; color="#7F1D1D"; icon="✗"; }
                  else { bg="#FAFAFA"; color="#94A3B8"; border="2px solid #E2E8F0"; }
                }
                return (
                  <button key={i} onClick={() => responder(i)} style={{ background:bg, border, color, padding:"16px 20px", borderRadius:14, textAlign:"left", cursor:respondida?"default":"pointer", fontSize:15, fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", gap:12, transition:"all .15s", boxShadow:respondida?"none":"0 2px 8px rgba(0,0,0,0.06)" }}
                    onMouseEnter={e => { if (!respondida) e.currentTarget.style.borderColor=temaActivo.accent; }}
                    onMouseLeave={e => { if (!respondida) e.currentTarget.style.borderColor="#E2E8F0"; }}>
                    <span style={{ minWidth:32, height:32, borderRadius:"50%", background:respondida && esCorrecta ? "#27AE60" : respondida && seleccionada ? "#E74C3C" : `${temaActivo.accent}22`, color: respondida ? "#fff" : temaActivo.accent, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:13, flexShrink:0 }}>
                      {icon || ["A","B","C","D"][i]}
                    </span>
                    <span style={{ lineHeight:1.5 }}>{op.texto}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback + Siguiente */}
            {respondida && (
              <div className="fade-up" style={{ marginTop:16 }}>
                <div style={{ background: seleccion !== null && pregActual.opciones[seleccion]?.original === pregActual.correcta ? "#F0FDF4" : "#FEF2F2", border:`1px solid ${seleccion !== null && pregActual.opciones[seleccion]?.original === pregActual.correcta ? "#27AE60" : "#E74C3C"}`, borderRadius:12, padding:"12px 16px", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:20 }}>{seleccion !== null && pregActual.opciones[seleccion]?.original === pregActual.correcta ? "🎉" : "💡"}</span>
                  <div>
                    <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:14, color: seleccion !== null && pregActual.opciones[seleccion]?.original === pregActual.correcta ? "#14532D" : "#7F1D1D" }}>
                      {seleccion !== null && pregActual.opciones[seleccion]?.original === pregActual.correcta
                        ? `${t("correcto")} ${historial[historial.length-1]?.pts > PUNTOS_CORRECTA ? `+${historial[historial.length-1]?.pts} ${t("ptsLabel")} ⚡` : `+${PUNTOS_CORRECTA} ${t("ptsLabel")}`}`
                        : `${t("incorrecto")} ${PENALIZACION} ${t("ptsLabel")}. ${t("respuestaCorrectaEs")} "${pregActual.opciones.find(o => o.original === pregActual.correcta)?.texto}"`}
                    </div>
                  </div>
                </div>
                <button className="btn-secondary" onClick={siguiente} style={{ width:"100%", padding:15, fontSize:16 }}>
                  {idx + 1 >= preguntas.length ? t("verResultados") : t("siguientePregunta")}
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ──── PANTALLA: RESULTADO ──── */
  if (pantalla === "resultado") {
    const areas = historial.filter(h => !h.esCorrecta).length > 0 ? [t("area1"), t("area2"), t("area3")] : [];
    const nivel = porcentajeAciertos >= 90 ? { label:t("nivelExcelente"), emoji:"🏆", color:"#27AE60" } : porcentajeAciertos >= 70 ? { label:t("nivelBien"), emoji:"🎓", color:"#2E86C1" } : porcentajeAciertos >= 50 ? { label:t("nivelMejorar"), emoji:"📚", color:"#F1C40F" } : { label:t("nivelPracticar"), emoji:"💪", color:"#E74C3C" };
    return (
      <>
        <FontLoader />
        <div style={{ minHeight:"100vh", background:"#F0F4F8", padding:"24px 16px" }}>
          <div style={{ maxWidth:640, margin:"0 auto" }}>

            {mostrarInsignia && (
              <div className="pop" style={{ background:"linear-gradient(135deg,#1B4F72,#27AE60)", borderRadius:20, padding:"24px", textAlign:"center", color:"#fff", marginBottom:20 }}>
                <div style={{ fontSize:48, marginBottom:8, animation:"badgePop .6s cubic-bezier(.34,1.56,.64,1)" }}>🏅</div>
                <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:18, marginBottom:4 }}>{t("insigniaDesbloqueada")}</div>
                <div style={{ fontSize:15, opacity:0.9 }}>{temaActivo?.insignia}</div>
              </div>
            )}

            <div className="card" style={{ padding:"32px 24px", textAlign:"center" }}>
              <div style={{ fontSize:52, marginBottom:8 }}>{nivel.emoji}</div>
              <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:26, color:nivel.color, marginBottom:4 }}>{nivel.label}</h2>
              <p style={{ color:"#64748B", fontSize:14, marginBottom:28 }}>{temaActivo?.nombre}</p>

              <div style={{ fontSize:68, fontWeight:900, color:nivel.color, fontFamily:"'Montserrat',sans-serif", marginBottom:4 }}>
                {porcentajeAciertos}%
              </div>
              <div style={{ color:"#94A3B8", fontSize:15, marginBottom:28 }}>{t("deAciertos")}</div>

              <div style={{ display:"flex", justifyContent:"center", gap:20, marginBottom:28, flexWrap:"wrap" }}>
                {[
                  { l:t("puntos"), v:puntaje > 0 ? `+${puntaje}` : puntaje, c:"#F1C40F" },
                  { l:t("correctas"), v:`${aciertos}/${historial.length}`, c:"#27AE60" },
                  { l:t("incorrectas"), v:historial.length - aciertos, c:"#E74C3C" },
                  { l:t("tiempo"), v:fmt(tiempo), c:"#2E86C1" },
                ].map(s => (
                  <div key={s.l} style={{ textAlign:"center", minWidth:70 }}>
                    <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:22, color:s.c }}>{s.v}</div>
                    <div style={{ fontSize:12, color:"#94A3B8" }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Progreso detallado */}
              <div style={{ background:"#F8FAFC", borderRadius:14, padding:16, marginBottom:20, textAlign:"left" }}>
                <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:14, color:"#1E293B", marginBottom:10 }}>{t("reporteDesempeno")}</div>
                {historial.map((h,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, fontSize:13 }}>
                    <span style={{ color: h.esCorrecta ? "#27AE60" : "#E74C3C" }}>{h.esCorrecta ? "✓" : "✗"}</span>
                    <span style={{ flex:1, color:"#475569", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h.pregunta}</span>
                    <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, color: h.pts > 0 ? "#27AE60" : "#E74C3C", fontSize:12 }}>{h.pts > 0 ? `+${h.pts}` : h.pts}</span>
                  </div>
                ))}
              </div>

              {areas.length > 0 && (
                <div style={{ background:"#FFF8E1", borderRadius:12, padding:"12px 16px", marginBottom:20, textAlign:"left", border:"1px solid #FDD835" }}>
                  <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:13, color:"#7D6608", marginBottom:8 }}>{t("areasdeMejora")}</div>
                  {areas.map((a,i) => <div key={i} style={{ fontSize:13, color:"#5D4037", marginBottom:4 }}>• {a}</div>)}
                </div>
              )}

              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <button className="btn-primary" onClick={() => iniciarQuiz(temaActivo)} style={{ flex:1, padding:14, fontSize:14 }}>{t("repetir")}</button>
                <button className="btn-secondary" onClick={() => { setMostrarInsignia(false); setPantalla("temas"); }} style={{ flex:1, padding:14, fontSize:14 }}>{t("modulos")}</button>
                <button onClick={() => { setMostrarInsignia(false); setPantalla("ranking"); }} style={{ flex:"0 0 auto", padding:14, fontSize:14, background:"#FFF9C4", border:"2px solid #F1C40F", borderRadius:14, cursor:"pointer", color:"#7D6608", fontFamily:"'Montserrat',sans-serif", fontWeight:700 }}>🏆 {t("ranking")}</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ──── PANTALLA: PAYWALL ──── */
  if (pantalla === "paywall") return (
    <>
      <FontLoader />
      <div style={{ minHeight:"100vh", background:"#F0F4F8", padding:"24px 16px" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"center", position:"relative", marginBottom:8 }}>
            <Logo size={44} showText={true} />
            <div style={{ position:"absolute", right:0, top:0 }}>
              <SelectorIdioma idioma={idioma} onChange={cambiarIdioma} variante="claro" />
            </div>
          </div>
          <div className="card pop" style={{ padding:"32px 24px", textAlign:"center", marginTop:16 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔒</div>
            <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:24, color:"#1E293B", marginBottom:8 }}>
              {t("accesoGratuitoCompletado")}
            </h2>
            <p style={{ color:"#64748B", fontSize:15, marginBottom:20, maxWidth:420, margin:"0 auto 20px", fontFamily:"'Inter',sans-serif" }}>
              {t("desbloqueaTexto")} <strong>500+ {t("statPreguntas")}</strong>, {t("desbloqueaTexto2")}
            </p>

            {/* Aviso: usuarios invitados deben crear cuenta antes de pagar */}
            {(!uid || usuario?.nombre === "Invitado") && (
              <div style={{ background:"#FFF8E1", border:"1px solid #FDD835", borderRadius:14, padding:"16px 20px", marginBottom:24, textAlign:"left" }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:20 }}>👤</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:14, color:"#7D6608", marginBottom:4 }}>
                      {t("primeroCuenta")}
                    </div>
                    <p style={{ fontSize:13, color:"#5D4037", marginBottom:10, lineHeight:1.5 }}>
                      {t("primeroCuentaDesc")}
                    </p>
                    <button onClick={() => setPantalla("auth")} style={{ background:"#1B4F72", color:"#fff", padding:"9px 18px", borderRadius:8, fontSize:13, fontWeight:700, fontFamily:"'Montserrat',sans-serif" }}>
                      {t("crearCuentaAhora")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Plan selector */}
            <div style={{ display:"flex", gap:14, justifyContent:"center", marginBottom:24, flexWrap:"wrap" }}>
              {[
                { id:"mensual", precio:"$4.99", periodo:t("porMes"), etiqueta:"", desc:t("planMensualDesc") },
                { id:"anual", precio:"$46.99", periodo:t("porAnio"), etiqueta:t("planAnualAhorra"), desc:t("planAnualDesc") },
              ].map(p => (
                <div key={p.id} onClick={() => setPlanSel(p.id)} style={{ border:`2px solid ${planSel===p.id ? "#1B4F72":"#E2E8F0"}`, borderRadius:18, padding:"20px 24px", cursor:"pointer", background: planSel===p.id ? "linear-gradient(135deg,#EBF5FB,#E8F8F0)" : "#fff", transition:"all .2s", minWidth:200, position:"relative" }}>
                  {p.etiqueta && <div style={{ position:"absolute", top:-10, right:-10, background:"#27AE60", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, fontFamily:"'Montserrat',sans-serif" }}>{p.etiqueta}</div>}
                  <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:32, color:"#1B4F72" }}>{p.precio}<span style={{ fontSize:14, color:"#94A3B8" }}>{p.periodo}</span></div>
                  <div style={{ fontSize:13, color:"#64748B", marginTop:4 }}>{p.desc}</div>
                  {planSel===p.id && <div style={{ fontSize:18, marginTop:8 }}>✅</div>}
                </div>
              ))}
            </div>

            {/* Beneficios */}
            <div style={{ background:"#F8FAFC", borderRadius:14, padding:"16px 20px", marginBottom:24, textAlign:"left" }}>
              {[t("beneficio1"),t("beneficio2"),t("beneficio3"),t("beneficio4"),t("beneficio5"),t("beneficio6"),t("beneficio7")].map((b,i) => (
                <div key={i} style={{ fontSize:14, color:"#475569", marginBottom:8, fontFamily:"'Inter',sans-serif" }}>{b}</div>
              ))}
            </div>

            {/* Métodos de pago */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, color:"#94A3B8", marginBottom:12, fontFamily:"'Montserrat',sans-serif", fontWeight:600, letterSpacing:1 }}>{t("metodosPago")}</div>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                <button onClick={() => setMetodoPagoSel("paypal")} style={{ background:"#003087", color:"#fff", padding:"10px 20px", borderRadius:10, fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:14, display:"flex", alignItems:"center", gap:6, cursor:"pointer", border: metodoPagoSel==="paypal" ? "3px solid #1B4F72" : "3px solid transparent", opacity: metodoPagoSel && metodoPagoSel!=="paypal" ? 0.5 : 1, transition:"all .2s" }}>
                  <span style={{ fontSize:18 }}>💳</span> PayPal
                </button>
                <button onClick={() => setMetodoPagoSel("binance")} style={{ background:"#F3BA2F", color:"#181A20", padding:"10px 20px", borderRadius:10, fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:14, display:"flex", alignItems:"center", gap:6, cursor:"pointer", border: metodoPagoSel==="binance" ? "3px solid #B7950B" : "3px solid transparent", opacity: metodoPagoSel && metodoPagoSel!=="binance" ? 0.5 : 1, transition:"all .2s" }}>
                  <span style={{ fontSize:18 }}>₿</span> Binance Pay
                </button>
              </div>
              <p style={{ fontSize:12, color:"#94A3B8", marginTop:8 }}>{t("pagoSeguro")}</p>
            </div>

            {/* Aviso: si elige Binance Pay + plan mensual, incentivar el plan anual */}
            {metodoPagoSel === "binance" && planSel === "mensual" && (
              <div className="fade-up" style={{ background:"linear-gradient(135deg,#FFF8E1,#FEF9E7)", border:"1px solid #F3BA2F", borderRadius:14, padding:"16px 20px", marginBottom:20, textAlign:"left" }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:22 }}>₿</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:14, color:"#7D6608", marginBottom:6 }}>
                      {t("avisoCriptoTitulo")}
                    </div>
                    <p style={{ fontSize:13, color:"#5D4037", marginBottom:12, lineHeight:1.5 }}>
                      {t("avisoCriptoTexto")}
                    </p>
                    <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                      <button onClick={() => setPlanSel("anual")} style={{ background:"#1B4F72", color:"#fff", padding:"9px 16px", borderRadius:8, fontSize:13, fontWeight:700, fontFamily:"'Montserrat',sans-serif" }}>
                        {t("avisoCriptoCambiarAnual")}
                      </button>
                      <button onClick={() => {}} style={{ background:"transparent", color:"#7D6608", padding:"9px 16px", borderRadius:8, fontSize:13, fontWeight:600, fontFamily:"'Montserrat',sans-serif", border:"1px solid #F3BA2F" }}>
                        {t("avisoCriptoSeguirMensual")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Aviso general: renovación manual con Binance Pay (se mantiene visible si elige plan anual también) */}
            {metodoPagoSel === "binance" && (
              <p style={{ fontSize:12, color:"#7D6608", marginBottom:16, textAlign:"left", background:"#FFFBEB", padding:"8px 12px", borderRadius:8 }}>
                {t("renuevaManualmente")}
              </p>
            )}

            {errorPago && (
              <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:13, color:"#DC2626" }}>
                ⚠️ {errorPago}
              </div>
            )}

            <button className="btn-primary" disabled={!uid || cargandoPago} style={{ padding:"16px 48px", fontSize:16, borderRadius:16, width:"100%", maxWidth:320, opacity: (!uid || cargandoPago) ? 0.6 : 1, cursor: (!uid || cargandoPago) ? "not-allowed" : "pointer" }}
              onClick={async () => {
                if (!uid) { setPantalla("auth"); return; }
                if (!metodoPagoSel) { setErrorPago(idioma==="en" ? "Please select a payment method above." : "Por favor selecciona un método de pago arriba."); return; }
                if (metodoPagoSel === "binance") {
                  await iniciarPagoBinance();
                } else {
                  setErrorPago(idioma==="en" ? "PayPal will be available soon. Please use Binance Pay for now." : "PayPal estará disponible muy pronto. Por ahora, usa Binance Pay.");
                }
              }}>
              {cargandoPago
                ? (idioma==="en" ? "Creating payment order..." : "Creando orden de pago...")
                : (uid ? `${t("suscribirme")} — ${planSel === "mensual" ? `$4.99${t("porMes")}` : `$46.99${t("porAnio")}`} 🚀` : t("crearCuentaSuscribirte"))
              }
            </button>
            <div style={{ marginTop:12 }}>
              <button onClick={() => setPantalla(uid ? "temas" : "inicio")} style={{ background:"none", border:"none", color:"#94A3B8", fontSize:13, cursor:"pointer" }}>{t("volver")}</button>
            </div>
          </div>
        </div>

        {/* Modal de pago Binance: QR + link + verificación */}
        {ordenBinance && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, zIndex:100 }}>
            <div className="card pop" style={{ maxWidth:380, width:"100%", padding:"28px 24px", textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>₿</div>
              <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:18, color:"#1E293B", marginBottom:6 }}>
                {idioma==="en" ? "Complete your payment" : "Completa tu pago"}
              </h3>
              <p style={{ fontSize:13, color:"#64748B", marginBottom:18 }}>
                {idioma==="en" ? "Scan the QR or tap the button to pay with Binance Pay." : "Escanea el QR o toca el botón para pagar con Binance Pay."}
              </p>
              {ordenBinance.qrcodeLink && (
                <img src={ordenBinance.qrcodeLink} alt="QR Binance Pay" style={{ width:200, height:200, margin:"0 auto 18px", borderRadius:12, border:"1px solid #E2E8F0" }} />
              )}
              <a href={ordenBinance.checkoutUrl} target="_blank" rel="noopener noreferrer" style={{ display:"block", background:"#F3BA2F", color:"#181A20", padding:"13px", borderRadius:12, fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:15, marginBottom:14, textDecoration:"none" }}>
                {idioma==="en" ? "Open in Binance" : "Abrir en Binance"}
              </a>
              <button onClick={verificarPagoBinance} disabled={verificandoPago} style={{ width:"100%", padding:"12px", background:"#1B4F72", color:"#fff", borderRadius:12, fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:14, opacity: verificandoPago ? 0.7 : 1, cursor: verificandoPago ? "wait" : "pointer", marginBottom:10 }}>
                {verificandoPago ? (idioma==="en" ? "Checking..." : "Verificando...") : (idioma==="en" ? "✓ I already paid — check now" : "✓ Ya pagué — verificar ahora")}
              </button>
              <button onClick={() => { setOrdenBinance(null); setErrorPago(""); }} style={{ width:"100%", padding:"10px", background:"none", border:"none", color:"#94A3B8", fontSize:13 }}>
                {idioma==="en" ? "Cancel" : "Cancelar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  /* ──── PANTALLA: RANKING ──── */
  if (pantalla === "ranking") return (
    <>
      <FontLoader />
      <div style={{ minHeight:"100vh", background:"#F0F4F8" }}>
        <div style={{ background:"linear-gradient(135deg,#1B4F72,#27AE60)", padding:"20px 24px" }}>
          <div style={{ maxWidth:640, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <button onClick={() => setPantalla("temas")} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:13 }}>←</button>
              <div>
                <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, color:"#fff", fontSize:20 }}>{t("rankingGlobal")}</h2>
                <p style={{ color:"rgba(255,255,255,0.7)", fontSize:12 }}>{t("competeDesc")}</p>
              </div>
            </div>
            <SelectorIdioma idioma={idioma} onChange={cambiarIdioma} variante="oscuro" />
          </div>
        </div>
        <div style={{ maxWidth:640, margin:"0 auto", padding:"20px 16px" }}>
          {rankingConUsuario.map((r, i) => (
            <div key={i} className="card" style={{ padding:"14px 18px", marginBottom:10, display:"flex", alignItems:"center", gap:14, border: r.esUsuario ? "2px solid #27AE60" : "none", background: r.esUsuario ? "#F0FDF4" : "#fff" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background: i===0?"linear-gradient(135deg,#FFD700,#FFA500)": i===1?"linear-gradient(135deg,#C0C0C0,#A9A9A9)": i===2?"linear-gradient(135deg,#CD7F32,#A0522D)":"#F0F4F8", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:14, color: i<3?"#fff":"#64748B", flexShrink:0 }}>
                {i < 3 ? ["🥇","🥈","🥉"][i] : i+1}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:15, color: r.esUsuario ? "#1B4F72":"#1E293B" }}>
                  {r.pais} {r.nombre} {r.esUsuario && `(${t("tu")})`}
                </div>
                <div style={{ fontSize:12, color:"#94A3B8" }}>🏅 {r.insignias} {t("insignias").toLowerCase()}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:17, color:"#F1C40F" }}>⭐ {r.pts.toLocaleString()}</div>
                <div style={{ fontSize:11, color:"#94A3B8" }}>{t("ptsLabel")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  /* ──── PANTALLA: AJUSTES ──── */
  if (pantalla === "ajustes") return (
    <>
      <FontLoader />
      <div style={{ minHeight:"100vh", background:"#F0F4F8" }}>
        <div style={{ background:"linear-gradient(135deg,#1B4F72,#2E86C1)", padding:"20px 24px" }}>
          <div style={{ maxWidth:640, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <button onClick={() => setPantalla("temas")} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:13 }}>←</button>
              <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, color:"#fff", fontSize:20 }}>{t("ajustesTitulo")}</h2>
            </div>
            <SelectorIdioma idioma={idioma} onChange={cambiarIdioma} variante="oscuro" />
          </div>
        </div>
        <div style={{ maxWidth:640, margin:"0 auto", padding:"20px 16px" }}>
          {[
            { titulo:t("secPerfil"), items:[
              { label:t("lblNombre"), val: usuario?.nombre || "—" },
              { label:t("lblCorreo"), val: usuario?.email || "—" },
              { label:t("lblSuscripcion"), val: esPremium ? t("premium") : t("suscGratuita") },
            ]},
            { titulo:t("secProgreso"), items:[
              { label:t("lblPuntuacionTotal"), val: puntajeTotal.toLocaleString() + " " + t("ptsLabel") },
              { label:t("lblInsigniasObtenidas"), val: insignias.length },
              { label:t("lblPreguntasResp"), val: historial.length },
            ]},
            { titulo:t("secPreferencias"), items:[
              { label:t("lblPregPorSesion"), val:t("valPregPorSesion") },
              { label:t("lblRandom"), val:t("valActivada") },
              { label:t("lblTimer"), val:t("valActivado") },
              { label:t("lblPenalizacion"), val:`${PENALIZACION} ${t("ptsLabel")}` },
              { label:t("lblBonusRapidez"), val:`+${PUNTOS_RAPIDA} ${t("ptsLabel")}` },
            ]},
            { titulo:t("secNotif"), items:[
              { label:t("lblRecordatorio"), val:t("valProximamente") },
              { label:t("lblNovedades"), val:t("valProximamente") },
            ]},
            { titulo:t("secSuscPago"), items:[
              { label:t("lblPlanActual"), val: esPremium ? t("premium").replace(" ✨","") : t("planGratuito") },
              { label:t("lblMetodosAceptados"), val:"PayPal · Binance Pay" },
              { label:t("lblPrecioMensual"), val:"$4.99 USD" },
              { label:t("lblPrecioAnual"), val:"$46.99 USD" },
            ]},
            { titulo:t("secAcerca"), items:[
              { label:t("lblVersion"), val:"1.0.0 Web" },
              { label:t("lblSoporte"), val:"soporte@contaquiz.com" },
              { label:"", val: idioma==="en" ? "Operated by SEPHIRA-APM GLOBAL S.R.L." : "Operado por SEPHIRA-APM GLOBAL S.R.L.", small:true },
              { label:t("lblTerminos"), val:t("valVerDocumento"), onClick: () => setPantalla("terminos") },
            ]},
          ].map(sec => (
            <div key={sec.titulo} className="card" style={{ marginBottom:16, overflow:"hidden" }}>
              <div style={{ background:"linear-gradient(135deg,#F8FAFC,#EBF5FB)", padding:"12px 18px", borderBottom:"1px solid #E2E8F0" }}>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:14, color:"#1B4F72" }}>{sec.titulo}</span>
              </div>
              {sec.items.map((it,i) => (
                it.small ? (
                  <div key={i} style={{ padding:"8px 18px 12px", borderBottom: i < sec.items.length-1 ? "1px solid #F0F4F8":"none" }}>
                    <span style={{ fontSize:11, color:"#94A3B8", fontFamily:"'Inter',sans-serif" }}>{it.val}</span>
                  </div>
                ) : (
                  <div key={i} onClick={it.onClick} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 18px", borderBottom: i < sec.items.length-1 ? "1px solid #F0F4F8":"none", cursor: it.onClick ? "pointer" : "default" }}>
                    <span style={{ fontSize:14, color:"#475569", fontFamily:"'Inter',sans-serif" }}>{it.label}</span>
                    <span style={{ fontSize:14, fontFamily:"'Montserrat',sans-serif", fontWeight:600, color:"#1B4F72", textDecoration: it.onClick ? "underline" : "none" }}>{it.val}</span>
                  </div>
                )
              ))}
            </div>
          ))}

          {/* Selector de idioma como su propia sección */}
          <div className="card" style={{ marginBottom:16, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:14, color:"#1B4F72" }}>{t("lblIdioma")}</span>
            <SelectorIdioma idioma={idioma} onChange={cambiarIdioma} variante="claro" />
          </div>

          {!esPremium && (
            <button className="btn-primary" onClick={() => setPantalla("paywall")} style={{ width:"100%", padding:16, fontSize:15, marginBottom:12 }}>
              {t("actualizarPremium")}
            </button>
          )}
          <button onClick={async () => { await cerrarSesion(); setUsuario(null); setUid(null); setEsPremium(false); setPreguntasGratis(0); setPuntajeTotal(0); setInsignias([]); setIdxPendiente(null); setPantalla("inicio"); }} style={{ width:"100%", padding:14, fontSize:14, background:"#FEF2F2", border:"2px solid #FECACA", borderRadius:14, cursor:"pointer", color:"#DC2626", fontFamily:"'Montserrat',sans-serif", fontWeight:600 }}>
            {t("cerrarSesionBtn")}
          </button>
        </div>
      </div>
    </>
  );

  /* ──── PANTALLA: TÉRMINOS Y CONDICIONES ──── */
  if (pantalla === "terminos") {
    const esEN = idioma === "en";
    return (
      <>
        <FontLoader />
        <div style={{ minHeight:"100vh", background:"#F0F4F8" }}>
          <div style={{ background:"linear-gradient(135deg,#1B4F72,#2E86C1)", padding:"20px 24px" }}>
            <div style={{ maxWidth:720, margin:"0 auto", display:"flex", alignItems:"center", gap:12 }}>
              <button onClick={() => setPantalla(uid ? "ajustes" : "inicio")} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:13 }}>{t("terminosVolver")}</button>
              <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, color:"#fff", fontSize:18 }}>📄 {t("terminosTitulo")}</h2>
            </div>
          </div>

          <div style={{ maxWidth:720, margin:"0 auto", padding:"28px 20px 60px" }}>
            <div className="card" style={{ padding:"28px 26px", fontFamily:"'Inter',sans-serif", color:"#334155", lineHeight:1.7, fontSize:14 }}>

              <p style={{ fontSize:12, color:"#94A3B8", marginBottom:20 }}>
                {esEN ? "Last updated: June 22, 2026" : "Última actualización: 22 de junio de 2026"}
              </p>

              <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:17, color:"#1B4F72", marginBottom:10 }}>
                1. {esEN ? "Operator Identification" : "Identificación del Operador"}
              </h3>
              <p style={{ marginBottom:18 }}>
                {esEN
                  ? <>ContaQuiz is a registered trademark in the Dominican Republic, <strong>operated, administered and commercialized by SEPHIRA-APM GLOBAL S.R.L.</strong> ("the Operator"), a legally constituted company. Official contact: <strong>sephira-operaciones@contaquiz.com</strong>. Official website: <strong>https://contaquiz.com</strong>.</>
                  : <>ContaQuiz es una marca denominativa registrada en la República Dominicana, <strong>operada, administrada y comercializada por SEPHIRA-APM GLOBAL S.R.L.</strong> ("el Operador"), sociedad legalmente constituida. Contacto oficial: <strong>sephira-operaciones@contaquiz.com</strong>. Sitio web oficial: <strong>https://contaquiz.com</strong>.</>
                }
              </p>
              <p style={{ marginBottom:18, background:"#FFFBEB", padding:"12px 16px", borderRadius:10, border:"1px solid #FDE68A" }}>
                {esEN
                  ? <><strong>Billing note:</strong> charges may appear on your statement under the legal name <strong>SEPHIRA-APM GLOBAL</strong> rather than "ContaQuiz". This is normal — SEPHIRA-APM GLOBAL is the legal entity operating the ContaQuiz brand.</>
                  : <><strong>Nota sobre facturación:</strong> los cargos pueden aparecer en tu estado de cuenta bajo la razón social <strong>SEPHIRA-APM GLOBAL</strong> y no como "ContaQuiz". Esto es normal — SEPHIRA-APM GLOBAL es la entidad legal que opera la marca ContaQuiz.</>
                }
              </p>

              <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:17, color:"#1B4F72", marginBottom:10 }}>
                2. {esEN ? "Service Description" : "Descripción del Servicio"}
              </h3>
              <p style={{ marginBottom:18 }}>
                {esEN
                  ? "ContaQuiz is a gamified educational platform for accounting, IFRS/IAS and auditing students and professionals, offering multiple-choice, true/false and case-study questions across five modules, with scoring, global ranking and badges."
                  : "ContaQuiz es una plataforma educativa gamificada dirigida a estudiantes y profesionales de contabilidad, NIC/NIIF y auditoría, que ofrece preguntas de selección múltiple, verdadero/falso y casos prácticos en cinco módulos, con sistema de puntuación, ranking global e insignias."
                }
              </p>

              <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:17, color:"#1B4F72", marginBottom:10 }}>
                3. {esEN ? "Plans and Payment" : "Planes y Condiciones de Pago"}
              </h3>
              <p style={{ marginBottom:8 }}>
                {esEN ? "Free plan: 10 random questions, no payment required." : "Plan gratuito: 10 preguntas aleatorias, sin necesidad de pago."}
              </p>
              <p style={{ marginBottom:8 }}>
                {esEN ? "Monthly plan: USD $4.99/month. Annual plan: USD $46.99/year." : "Plan mensual: USD $4.99/mes. Plan anual: USD $46.99/año."}
              </p>
              <p style={{ marginBottom:18 }}>
                {esEN
                  ? <><strong>PayPal</strong> may support automatic recurring billing. <strong>Binance Pay</strong> does not support automatic recurring charges due to the nature of cryptocurrency payments — renewal requires a manual payment each billing period. We will notify users ahead of expiration.</>
                  : <><strong>PayPal</strong> puede soportar cobro recurrente automático. <strong>Binance Pay</strong> no soporta cobros automáticos recurrentes por la naturaleza de los pagos con criptomonedas — la renovación requiere un pago manual en cada período. Notificaremos al usuario antes del vencimiento.</>
                }
              </p>

              <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:17, color:"#1B4F72", marginBottom:10 }}>
                4. {esEN ? "Intellectual Property" : "Propiedad Intelectual"}
              </h3>
              <p style={{ marginBottom:18 }}>
                {esEN
                  ? "The ContaQuiz brand, logo, question bank and scoring algorithm are property of SEPHIRA-APM GLOBAL and protected under Dominican and international intellectual property law. Reproduction or commercial exploitation without prior written authorization is prohibited."
                  : "La marca ContaQuiz, su logotipo, banco de preguntas y algoritmo de puntuación son propiedad de SEPHIRA-APM GLOBAL y están protegidos por la legislación dominicana e internacional de propiedad intelectual. Queda prohibida su reproducción o explotación comercial sin autorización previa por escrito."
                }
              </p>

              <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:17, color:"#1B4F72", marginBottom:10 }}>
                5. {esEN ? "Acceptable Use" : "Uso Aceptable"}
              </h3>
              <p style={{ marginBottom:18 }}>
                {esEN
                  ? "Users agree not to use bots or scripts to manipulate the scoring system or ranking, not to attempt unauthorized access to administrative panels, and not to redistribute the question bank for purposes other than personal use within the Platform."
                  : "El Usuario se compromete a no utilizar bots o scripts para manipular el sistema de puntuación o ranking, no intentar acceder sin autorización a paneles administrativos, y no redistribuir el banco de preguntas con fines distintos al uso personal dentro de la Plataforma."
                }
              </p>

              <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:17, color:"#1B4F72", marginBottom:10 }}>
                6. {esEN ? "Limitation of Liability" : "Limitación de Responsabilidad"}
              </h3>
              <p style={{ marginBottom:18 }}>
                {esEN
                  ? "ContaQuiz content is for educational purposes and does not replace formal academic training, official accounting standards or professional judgment. The Platform is provided \u201Cas is\u201D without warranty of uninterrupted or error-free service."
                  : "El contenido de ContaQuiz tiene fines educativos y no sustituye la formación académica formal, las normas contables oficiales o el criterio profesional. La Plataforma se ofrece \u201Ctal cual\u201D, sin garantía de servicio ininterrumpido o libre de errores."
                }
              </p>

              <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:17, color:"#1B4F72", marginBottom:10 }}>
                7. {esEN ? "Refund Policy" : "Política de Reembolsos"}
              </h3>
              <p style={{ marginBottom:18 }}>
                {esEN
                  ? "Subscription payments are non-refundable, as this is an immediate-access digital service, except where required by applicable law. Users may cancel at any time, effective at the end of the current billing period."
                  : "Los pagos de suscripción no son reembolsables, al tratarse de un servicio digital de acceso inmediato, salvo disposición legal en contrario. El Usuario puede cancelar en cualquier momento, con efecto al finalizar el período de facturación vigente."
                }
              </p>

              <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:17, color:"#1B4F72", marginBottom:10 }}>
                8. {esEN ? "Governing Law" : "Ley Aplicable"}
              </h3>
              <p style={{ marginBottom:18 }}>
                {esEN
                  ? "These Terms are governed by the laws of the Dominican Republic. Any dispute shall be submitted to the competent courts of the Dominican Republic, without prejudice to consumer protection rights applicable in the user's country of residence."
                  : "Estos Términos se rigen por las leyes de la República Dominicana. Cualquier controversia se sometería a los tribunales competentes de la República Dominicana, sin perjuicio de los derechos de protección al consumidor del país de residencia del Usuario."
                }
              </p>

              <h3 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:17, color:"#1B4F72", marginBottom:10 }}>
                9. {esEN ? "Contact" : "Contacto"}
              </h3>
              <p style={{ marginBottom:6 }}>
                {esEN ? "Email: " : "Correo electrónico: "}<strong>sephira-operaciones@contaquiz.com</strong>
              </p>
              <p>
                {esEN ? "Website: " : "Sitio web: "}<strong>https://contaquiz.com</strong>
              </p>

              <div style={{ marginTop:28, paddingTop:18, borderTop:"1px solid #E2E8F0", textAlign:"center" }}>
                <p style={{ fontSize:12, color:"#94A3B8", fontStyle:"italic" }}>
                  {esEN
                    ? "ContaQuiz is a registered trademark operated by SEPHIRA-APM GLOBAL S.R.L."
                    : "ContaQuiz es una marca registrada operada por SEPHIRA-APM GLOBAL S.R.L."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <div><FontLoader /><div style={{padding:40,textAlign:"center"}}>Cargando...</div></div>;
}
