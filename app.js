// app.js - TODA LA LÓGICA EN UN SOLO ARCHIVO

// ===============================
// CONFIGURACIÓN INICIAL
// ===============================
const CONFIG = {
    PASSWORD_UNICA: "griego2026",
    CODIGO_ADMIN: "ADMIN2026",
    TOTAL_SEMANAS: 30,
    DIAS_DESBLOQUEO: 7
};

// ===============================
// CLASE PRINCIPAL DE LA APLICACIÓN
// ===============================
class CursoGriegoApp {
    constructor() {
        this.usuarioActual = null;
        this.inicializar();
    }

    inicializar() {
        this.verificarAutenticacion();
        this.inicializarEventos();
    }

    // ===============================
    // AUTENTICACIÓN
    // ===============================
    verificarAutenticacion() {
        const usuario = localStorage.getItem('usuarioActual');
        const autenticado = localStorage.getItem('autenticado');
        
        if (usuario && autenticado === 'true') {
            this.usuarioActual = JSON.parse(usuario);
            this.mostrarDashboard();
        } else {
            this.mostrarLogin();
        }
    }

    mostrarLogin() {
        const estudiantes = [
            "facilitadores","Yordanka Álvarez Pérez","student","student","student","student",
            "student","student","student","student","student",
            "student","student","student","student","student","student","student",
            "student","student","student","student","student","student", "Rolando Desdín",
            "Yurleydy Dominguez", "Profesor: Joel Gutiérrez"
        ];

        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div class="login-container fade-in">
                <div class="login-header">
                    <img src="mas logos.jpeg" alt="Ministerio Vivos para Servir" class="logo-main">
                    <h1>Acceso al Curso de Griego</h1>
                    <p class="text-muted">Ministerio "Vivos para Servir"</p>
                </div>
                
                <div class="form-group">
                    <label for="userSelect">
                        <i class="fas fa-user"></i> Selecciona tu nombre:
                    </label>
                    <select id="userSelect" class="form-control">
                        <option value="">-- Selecciona tu nombre --</option>
                        ${estudiantes.map((est, idx) => 
                            `<option value="${idx + 1}">${est}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="userId">
                        <i class="fas fa-key"></i> ID de usuario:
                    </label>
                    <input type="text" id="userId" class="form-control" 
                           placeholder="Ingresa tu ID numérico asignado">
                    <small class="text-muted">(El ID numérico te fue proporcionado al inicio del curso)</small>
                </div>
                
                <div class="form-group">
                    <label for="password">
                        <i class="fas fa-lock"></i> Contraseña:
                    </label>
                    <input type="password" id="password" class="form-control" 
                           placeholder="Ingresa la contraseña compartida">
                </div>
                
                <button onclick="app.login()" class="btn btn-block">
                    <i class="fas fa-sign-in-alt"></i> Ingresar al Curso
                </button>
                
                <div id="loginError" class="alert alert-danger mt-20 d-none">
                    <i class="fas fa-exclamation-circle"></i>
                    <span id="errorText"></span>
                </div>
            </div>
        `;
    }

    login() {
        const selectedUser = document.getElementById('userSelect').value;
        const userId = document.getElementById('userId').value.trim();
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('loginError');
        
        // Validaciones
        if (!selectedUser) {
            this.mostrarError('Debes seleccionar tu nombre');
            return;
        }
        
        if (!userId) {
            this.mostrarError('Debes ingresar tu ID numérico');
            return;
        }
        
        if (!password) {
            this.mostrarError('Debes ingresar la contraseña');
            return;
        }
        
        // Verificar credenciales
        if (userId === selectedUser && password === CONFIG.PASSWORD_UNICA) {
            const userName = document.getElementById('userSelect').options[document.getElementById('userSelect').selectedIndex].text;
            
            // Crear objeto usuario
            const usuario = {
                id: userId,
                nombre: userName,
                codigoAcceso: userId,
                fechaRegistro: new Date().toISOString(),
                rol: userId === '25' ? 'profesor' : 'estudiante',
                progreso: this.obtenerProgresoUsuario(userId)
            };
            
            // Guardar en localStorage
            localStorage.setItem('usuarioActual', JSON.stringify(usuario));
            localStorage.setItem('autenticado', 'true');
            
            this.usuarioActual = usuario;
            this.mostrarDashboard();
        } else {
            this.mostrarError('Combinación nombre/ID/contraseña incorrecta');
        }
    }

    logout() {
        localStorage.removeItem('usuarioActual');
        localStorage.removeItem('autenticado');
        this.usuarioActual = null;
        this.mostrarLogin();
    }

    // ===============================
    // DASHBOARD
    // ===============================
    mostrarDashboard() {
        const progreso = this.usuarioActual.progreso;
        const semanasHTML = this.generarGridSemanas();
        
        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div class="dashboard fade-in">
                <!-- Header -->
                <div class="dashboard-header">
                    <div class="user-info">
                        <div class="user-avatar">
                            ${this.usuarioActual.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2>Bienvenido, ${this.usuarioActual.nombre}</h2>
                            <p class="text-muted">Curso de Griego Koiné Elemental</p>
                        </div>
                    </div>
                    
                    <div class="user-actions">
                        <button onclick="app.logout()" class="btn btn-danger">
                            <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </button>
                    </div>
                </div>
                
                <!-- Resumen de Progreso -->
                <div class="progress-summary">
                    <div class="section-title">
                        <i class="fas fa-chart-line"></i>
                        <h3>Tu Progreso</h3>
                    </div>
                    
                    <div class="progress-cards">
                        <div class="progress-card">
                            <i class="fas fa-calendar-week"></i>
                            <div class="progress-number">${progreso.semanasCompletadas || 0}/${CONFIG.TOTAL_SEMANAS}</div>
                            <p>Semanas Completadas</p>
                        </div>
                        
                        <div class="progress-card">
                            <i class="fas fa-book"></i>
                            <div class="progress-number">${progreso.leccionesCompletadas || 0}</div>
                            <p>Lecciones</p>
                        </div>
                        
                        <div class="progress-card">
                            <i class="fas fa-gamepad"></i>
                            <div class="progress-number">${progreso.juegosCompletados || 0}</div>
                            <p>Juegos</p>
                        </div>
                        
                        <div class="progress-card">
                            <i class="fas fa-clipboard-check"></i>
                            <div class="progress-number">${progreso.examenesCompletados || 0}</div>
                            <p>Exámenes</p>
                        </div>
                    </div>
                    
                    <div class="mt-20 d-flex gap-10">
                        <button onclick="app.descargarProgreso()" class="btn btn-secondary">
                            <i class="fas fa-download"></i> Descargar Progreso
                        </button>
                        
                        <button onclick="app.mostrarModalDesbloqueo()" class="btn btn-warning">
                            <i class="fas fa-unlock"></i> Desbloquear Semana
                        </button>
                        
                        ${this.usuarioActual.rol === 'profesor' ? 
                            `<button onclick="app.mostrarPanelAdmin()" class="btn btn-info">
                                <i class="fas fa-cogs"></i> Panel Admin
                            </button>` : ''
                        }
                    </div>
                </div>
                
                <!-- Semanas del Curso -->
                <div class="weeks-section">
                    <div class="section-title">
                        <i class="fas fa-road"></i>
                        <h3>Plan de Estudios (${CONFIG.TOTAL_SEMANAS} semanas)</h3>
                    </div>
                    <p class="text-muted mb-20">Haz clic en una semana para acceder a sus contenidos</p>
                    
                    <div class="weeks-grid" id="weeksGrid">
                        ${semanasHTML}
                    </div>
                </div>
                
                <!-- Panel Admin (solo para profesor) -->
                <div id="adminPanel" class="d-none"></div>
            </div>
            
            <!-- Modal Desbloquear -->
            <div class="modal" id="unlockModal">
                <div class="modal-content">
                    <span class="close-modal" onclick="app.cerrarModalDesbloqueo()">&times;</span>
                    <h3><i class="fas fa-unlock-alt"></i> Desbloquear Contenido</h3>
                    
                    <div class="form-group mt-20">
                        <label for="unlockCode">Código de Desbloqueo:</label>
                        <input type="text" id="unlockCode" class="form-control" 
                               placeholder="Código especial proporcionado por el profesor">
                    </div>
                    
                    <div class="form-group">
                        <label for="weekToUnlock">Semana a desbloquear:</label>
                        <select id="weekToUnlock" class="form-control">
                            ${Array.from({length: CONFIG.TOTAL_SEMANAS}, (_, i) => 
                                `<option value="${i + 1}">Semana ${i + 1}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <button onclick="app.desbloquearSemana()" class="btn btn-success btn-block mt-20">
                        <i class="fas fa-check"></i> Desbloquear
                    </button>
                    
                    <div id="unlockError" class="alert alert-danger mt-20 d-none">
                        <i class="fas fa-exclamation-circle"></i>
                        <span id="unlockErrorText"></span>
                    </div>
                </div>
            </div>
        `;
        
        this.inicializarEventosDashboard();
    }

    generarGridSemanas() {
        let html = '';
        const semanasDesbloqueadas = JSON.parse(localStorage.getItem(`semanasDesbloqueadas_${this.usuarioActual.id}`) || '[]');
        const semanasCompletadas = JSON.parse(localStorage.getItem(`semanasCompletadas_${this.usuarioActual.id}`) || '[]');
        
        // Determinar semana actual basada en fecha de inicio
        const fechaInicio = new Date(localStorage.getItem('fechaInicioCurso') || new Date().toISOString());
        const semanaActual = Math.floor((Date.now() - fechaInicio.getTime()) / (CONFIG.DIAS_DESBLOQUEO * 24 * 60 * 60 * 1000)) + 1;
        
        for (let semana = 1; semana <= CONFIG.TOTAL_SEMANAS; semana++) {
            const estaDesbloqueada = semanasDesbloqueadas.includes(semana) || semana <= semanaActual;
            const estaCompletada = semanasCompletadas.includes(semana);
            const esActual = semana === semanaActual && !estaCompletada;
            
            let badge = '';
            if (esActual) {
                badge = '<span class="week-badge">Actual</span>';
            } else if (estaCompletada) {
                badge = '<span class="week-badge" style="background:var(--success);color:white;"><i class="fas fa-check"></i></span>';
            }
            
            const tituloSemana = this.obtenerTituloSemana(semana);
            
            html += `
                <div class="week-card ${estaDesbloqueada ? '' : 'locked'} ${estaCompletada ? 'completed' : ''} ${esActual ? 'current' : ''}" 
                     data-week="${semana}" 
                     ${estaDesbloqueada ? `onclick="app.abrirSemana(${semana})"` : ''}>
                    ${badge}
                    <div class="week-number">${semana}</div>
                    <h4>${tituloSemana.titulo}</h4>
                    <p class="text-muted">${tituloSemana.tema}</p>
                    ${!estaDesbloqueada ? 
                        `<p><small><i class="fas fa-lock"></i> Disponible en ${semana - semanaActual} semanas</small></p>` : ''}
                </div>
            `;
        }
        
        return html;
    }

    obtenerTituloSemana(numero) {
        const semanas = {
            1: { titulo: "Alfabeto Griego", tema: "Introducción al alfabeto" },
            2: { titulo: "Sustantivos y Casos", tema: "Gramática básica" },
            3: { titulo: "Artículo Definido", tema: "Traducción inicial" },
            4: { titulo: "Preposiciones y Eimi", tema: "Verbo ser" },
            5: { titulo: "Adjetivos", tema: "Concordancia" },
            6: { titulo: "Tercera Declinación", tema: "Sustantivos" },
            7: { titulo: "Pronombres Personales", tema: "Primera y segunda" },
            8: { titulo: "Pronombres Personales", tema: "Tercera persona" },
            9: { titulo: "Pronombres Demostrativos", tema: "οὗτος, ἐκεῖνος" },
            10: { titulo: "Verbo - Presente", tema: "Activo Indicativo" },
            11: { titulo: "Verbos Contractos", tema: "Voz pasiva" },
            12: { titulo: "Futuro Activo", tema: "Medio Pasivo" },
            13: { titulo: "Imperfecto", tema: "Indicativo" },
            14: { titulo: "Segundo Aoristo", tema: "Formación" },
            15: { titulo: "Consolidación", tema: "Repaso general" },
            16: { titulo: "Primer Aoristo", tema: "Aoristo sigma" },
            17: { titulo: "Aoristo/Futuro Pasivo", tema: "Formas pasivas" },
            18: { titulo: "Perfecto", tema: "Tiempo perfecto" },
            19: { titulo: "Participios", tema: "Introducción" },
            20: { titulo: "Participios Adverbiales I", tema: "Circunstanciales" },
            21: { titulo: "Participios Adverbiales II", tema: "Causales" },
            22: { titulo: "Participios Adjetivales", tema: "Atributivos" },
            23: { titulo: "Participios Combinativos", tema: "Con artículo" },
            24: { titulo: "Subjuntivo", tema: "Modo subjuntivo" },
            25: { titulo: "Infinitivo", tema: "Oraciones infinitivas" },
            26: { titulo: "Imperativo", tema: "Modo imperativo" },
            27: { titulo: "Conjugaciones Atemáticas", tema: "Verbos irregulares" },
            28: { titulo: "Consolidación Final", tema: "Repaso completo" },
            29: { titulo: "Lectura Guiada I", tema: "Juan 1:1-18" },
            30: { titulo: "Lectura Guiada II", tema: "1 Juan 1:1-10" }
        };
        
        return semanas[numero] || { titulo: `Semana ${numero}`, tema: "Contenido del curso" };
    }

    // ===============================
    // GESTIÓN DE SEMANAS
    // ===============================
    abrirSemana(numero) {
        // Guardar la semana actual
        localStorage.setItem('semanaActual', numero);
        
        // Redirigir a la página de contenido
        window.location.href = `semana.html?semana=${numero}`;
    }

    // ===============================
    // PROGRESO Y DESBLOQUEO
    // ===============================
    obtenerProgresoUsuario(userId) {
        return JSON.parse(localStorage.getItem(`progreso_${userId}`)) || {
            semanasCompletadas: 0,
            leccionesCompletadas: 0,
            juegosCompletados: 0,
            examenesCompletados: 0,
            ultimaActividad: new Date().toISOString()
        };
    }

    guardarProgreso() {
        if (this.usuarioActual) {
            localStorage.setItem(`progreso_${this.usuarioActual.id}`, JSON.stringify(this.usuarioActual.progreso));
        }
    }

    desbloquearSemana() {
        const codigo = document.getElementById('unlockCode').value.trim();
        const semana = parseInt(document.getElementById('weekToUnlock').value);
        
        // Códigos especiales
        if (codigo === 'DESBLOQUEAR_TODO') {
            this.desbloquearTodasSemanas();
            this.mostrarExito('¡Todas las semanas han sido desbloqueadas!');
        } 
        else if (codigo.startsWith('DESBLOQUEAR_')) {
            const semanaCodigo = parseInt(codigo.replace('DESBLOQUEAR_', ''));
            if (semanaCodigo >= 1 && semanaCodigo <= CONFIG.TOTAL_SEMANAS) {
                this.agregarSemanaDesbloqueada(semanaCodigo);
                this.mostrarExito(`¡Semana ${semanaCodigo} desbloqueada!`);
            } else {
                this.mostrarErrorDesbloqueo('Código inválido');
            }
        }
        else if (codigo === this.generarCodigoDesbloqueo(semana)) {
            this.agregarSemanaDesbloqueada(semana);
            this.mostrarExito(`¡Semana ${semana} desbloqueada!`);
        }
        else {
            this.mostrarErrorDesbloqueo('Código de desbloqueo inválido');
        }
    }

    agregarSemanaDesbloqueada(semana) {
        const semanasDesbloqueadas = JSON.parse(localStorage.getItem(`semanasDesbloqueadas_${this.usuarioActual.id}`) || '[]');
        if (!semanasDesbloqueadas.includes(semana)) {
            semanasDesbloqueadas.push(semana);
            localStorage.setItem(`semanasDesbloqueadas_${this.usuarioActual.id}`, JSON.stringify(semanasDesbloqueadas));
            this.mostrarDashboard(); // Refrescar
        }
    }

    desbloquearTodasSemanas() {
        const todasSemanas = Array.from({length: CONFIG.TOTAL_SEMANAS}, (_, i) => i + 1);
        localStorage.setItem(`semanasDesbloqueadas_${this.usuarioActual.id}`, JSON.stringify(todasSemanas));
    }

    generarCodigoDesbloqueo(semana) {
        // Código simple basado en semana y usuario
        return `SEMANA_${semana}_${this.usuarioActual.id}`;
    }

    descargarProgreso() {
        const progreso = {
            usuario: this.usuarioActual.nombre,
            id: this.usuarioActual.id,
            fechaRegistro: this.usuarioActual.fechaRegistro,
            progreso: this.usuarioActual.progreso,
            semanasCompletadas: JSON.parse(localStorage.getItem(`semanasCompletadas_${this.usuarioActual.id}`) || '[]'),
            ultimaActualizacion: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(progreso, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `progreso_${this.usuarioActual.nombre}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ===============================
    // ADMINISTRACIÓN
    // ===============================
    mostrarPanelAdmin() {
        const panel = document.getElementById('adminPanel');
        panel.innerHTML = `
            <div class="admin-panel">
                <div class="section-title">
                    <i class="fas fa-cogs"></i>
                    <h3>Panel de Administración</h3>
                </div>
                
                <div class="admin-controls">
                    <div class="control-group">
                        <h4><i class="fas fa-calendar-alt"></i> Configurar Fecha de Inicio</h4>
                        <input type="date" id="fechaInicio" class="form-control mt-10" 
                               value="${new Date().toISOString().split('T')[0]}">
                        <button onclick="app.configurarFechaInicio()" class="btn btn-secondary mt-10">
                            <i class="fas fa-save"></i> Establecer Fecha
                        </button>
                    </div>
                    
                    <div class="control-group">
                        <h4><i class="fas fa-key"></i> Generar Códigos de Acceso</h4>
                        <input type="number" id="cantidadCodigos" class="form-control mt-10" 
                               placeholder="Número de códigos" min="1" max="100" value="10">
                        <button onclick="app.generarCodigos()" class="btn btn-success mt-10">
                            <i class="fas fa-key"></i> Generar Códigos
                        </button>
                        <div id="codigosGenerados" class="mt-10"></div>
                    </div>
                    
                    <div class="control-group">
                        <h4><i class="fas fa-chart-bar"></i> Estadísticas</h4>
                        <button onclick="app.verEstadisticas()" class="btn btn-info mt-10">
                            <i class="fas fa-chart-pie"></i> Ver Estadísticas
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        panel.classList.remove('d-none');
    }

    configurarFechaInicio() {
        const fecha = document.getElementById('fechaInicio').value;
        localStorage.setItem('fechaInicioCurso', new Date(fecha).toISOString());
        alert('Fecha de inicio actualizada correctamente');
        this.mostrarDashboard();
    }

    generarCodigos() {
        const cantidad = parseInt(document.getElementById('cantidadCodigos').value);
        const codigos = [];
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        
        for (let i = 0; i < cantidad; i++) {
            let codigo = 'GRIEGO_';
            for (let j = 0; j < 8; j++) {
                codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
            }
            codigos.push(codigo);
        }
        
        const contenedor = document.getElementById('codigosGenerados');
        contenedor.innerHTML = `
            <h5>Códigos generados (${cantidad}):</h5>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; max-height: 200px; overflow-y: auto; font-family: monospace;">
                ${codigos.map(c => `<div>${c}</div>`).join('')}
            </div>
            <button onclick="this.parentElement.innerHTML=''" class="btn btn-sm btn-danger mt-10">
                <i class="fas fa-times"></i> Ocultar
            </button>
        `;
        
        // Guardar códigos válidos
        const codigosValidos = JSON.parse(localStorage.getItem('codigosValidos') || '[]');
        codigosValidos.push(...codigos);
        localStorage.setItem('codigosValidos', JSON.stringify(codigosValidos));
    }

    // ===============================
    // MODALES Y MENSAJES
    // ===============================
    mostrarModalDesbloqueo() {
        document.getElementById('unlockModal').classList.add('active');
    }

    cerrarModalDesbloqueo() {
        document.getElementById('unlockModal').classList.remove('active');
    }

    mostrarError(mensaje) {
        const error = document.getElementById('loginError');
        document.getElementById('errorText').textContent = mensaje;
        error.classList.remove('d-none');
        setTimeout(() => error.classList.add('d-none'), 5000);
    }

    mostrarErrorDesbloqueo(mensaje) {
        const error = document.getElementById('unlockError');
        document.getElementById('unlockErrorText').textContent = mensaje;
        error.classList.remove('d-none');
        setTimeout(() => error.classList.add('d-none'), 5000);
    }

    mostrarExito(mensaje) {
        this.cerrarModalDesbloqueo();
        alert(mensaje);
        this.mostrarDashboard();
    }

    // ===============================
    // EVENTOS
    // ===============================
    inicializarEventos() {
        // Enter para login
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' && document.getElementById('password')) {
                this.login();
            }
        });
        
        // Cerrar modal al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }

    inicializarEventosDashboard() {
        // Los eventos se manejan con onclick en los elementos
    }
}

// ===============================
// INICIALIZAR APLICACIÓN
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CursoGriegoApp();
});