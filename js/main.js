// js/main.js

// Estado global da aplicação (simples)
const appState = {
    currentSubject: null,
    currentDifficulty: null,
    currentPhase: null
};

// Mapeamento de todas as telas
const screens = document.querySelectorAll('.screen');
const appContainer = document.getElementById('app-container');

/**
 * Gerenciador de navegação. Esconde todas as telas e mostra a alvo.
 * @param {string} targetScreenId - O ID da <section> para mostrar.
 */
function showScreen(targetScreenId) {
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(targetScreenId).classList.add('active');
}

/**
 * Inicializa todos os event listeners da aplicação.
 */
function initApp() {
    // ===== Navegação Geral (Botões de Ícone, Voltar, Fechar Modal) =====
    appContainer.addEventListener('click', (e) => {
        const target = e.target.closest('[data-target]');
        if (target) {
            const targetScreen = target.dataset.target;
            showScreen(targetScreen);

            // Lógica Específica ao abrir certas telas
            if (targetScreen === 'screen-achievements') {
                const progress = loadProgress();
                const container = document.getElementById('achievements-list');
                renderAchievements(container, progress);
            }
        }
    });

    // ===== Navegação HUB -> Dificuldade =====
    document.querySelector('.subject-grid').addEventListener('click', (e) => {
        const subjectButton = e.target.closest('.btn-subject');
        if (subjectButton) {
            appState.currentSubject = subjectButton.dataset.subject;
            document.getElementById('difficulty-title').textContent = subjectButton.textContent;
            showScreen('screen-difficulty');
        }
    });

    // ===== Navegação Dificuldade -> Mapa de Fases =====
    document.querySelector('.difficulty-list').addEventListener('click', (e) => {
        const difficultyButton = e.target.closest('.btn-difficulty');
        if (difficultyButton) {
            appState.currentDifficulty = difficultyButton.dataset.difficulty;
            
            // Atualiza o título do mapa de fases
            const subjectText = document.getElementById('difficulty-title').textContent;
            const difficultyText = difficultyButton.textContent;
            document.getElementById('phases-title').textContent = `${subjectText} - ${difficultyText}`;
            
            // Popula o mapa de fases (Vamos implementar isso a seguir)
            populatePhaseMap();
            showScreen('screen-phases');
        }
    });

    // ===== Lógica de Configurações =====
    const volumeSlider = document.getElementById('volume-slider');
    volumeSlider.addEventListener('input', (e) => {
        const progress = loadProgress();
        progress.settings.volume = e.target.value;
        saveProgress(progress);
        
        // Checa a conquista de "Engenheiro de Som"
        if (unlockAchievement("engenheiro_de_som")) {
            console.log("DESBLOQUEADO: Engenheiro de Som");
            // (Mostrar pop-up)
        }
    });
    
    // (Adicionar lógica para o Quiz e Resultados aqui)
}

/**
 * Popula o mapa de fases (screen-phases) com os 10 botões.
 */
function populatePhaseMap() {
    const container = document.querySelector('.phases-path-container');
    container.innerHTML = ''; // Limpa
    
    const progress = loadProgress();
    const key = `${appState.currentSubject}_${appState.currentDifficulty}`;
    const highestPhaseCompleted = progress.phasesCompleted[key] || 0;

    for (let i = 1; i <= 10; i++) {
        const button = document.createElement('button');
        button.className = 'btn-phase';
        button.dataset.phase = i;
        
        const isUnlocked = (i <= highestPhaseCompleted + 1);
        
        if (isUnlocked) {
            button.innerHTML = `<i class="fas fa-play-circle"></i> Fase ${i}`;
            if (i <= highestPhaseCompleted) {
                // Já completou
                button.classList.add('completed');
                button.innerHTML = `<i class="fas fa-check-circle"></i> Fase ${i}`;
            }
        } else {
            // Bloqueado
            button.innerHTML = `<i class="fas fa-lock"></i> Fase ${i}`;
            button.classList.add('locked');
            button.disabled = true;
        }

        // Adiciona o listener para iniciar o quiz
        button.addEventListener('click', () => {
            appState.currentPhase = i;
            // (Chamar a função de iniciar o quiz)
             startQuiz(appState.currentSubject, appState.currentDifficulty, appState.currentPhase);
             showScreen('screen-quiz');
            
            // Placeholder por enquanto:
            //alert(`Iniciando Quiz: ${appState.currentSubject}/${appState.currentDifficulty}/Fase ${i}`);
        });
        
        container.appendChild(button);
    }
    
    // (Adicionar CSS para .btn-phase.locked e .btn-phase.completed)
}


// Inicia a aplicação quando o DOM estiver pronto.
document.addEventListener('DOMContentLoaded', initApp);