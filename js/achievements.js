// js/achievements.js

// Definição de todas as conquistas do jogo
const allAchievements = {
    "primeiros_passos": {
        title: "Primeiros Passos",
        description: "Complete sua primeira fase em qualquer dificuldade.",
        icon: "fa-shoe-prints"
    },
    "nerd_basico": {
        title: "Nerd Básico",
        description: "Complete a Fase 1 de Matemática (Muito Fácil).",
        icon: "fa-calculator"
    },
    "engenheiro_de_som": {
        title: "Engenheiro de Som",
        description: "Ajuste o volume nas configurações.",
        icon: "fa-volume-high"
    },
    // ... (mais conquistas)
};

const achievementTooltip = document.getElementById('achievement-tooltip');

/**
 * Popula a lista de conquistas na tela de conquistas.
 * @param {HTMLElement} container - O elemento <div> para popular.
 * @param {object} progress - O objeto de progresso do usuário.
 */
function renderAchievements(container, progress) {
    container.innerHTML = ''; // Limpa a lista
    
    for (const id in allAchievements) {
        const data = allAchievements[id];
        const isUnlocked = progress.achievements.includes(id);

        const item = document.createElement('div');
        item.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        item.dataset.id = id; // Para o tooltip
        
        item.innerHTML = `
            <i class="fas ${data.icon} icon"></i>
            <div class="info">
                <h4>${data.title}</h4>
                <p>${isUnlocked ? 'Desbloqueada!' : '???'}</p>
            </div>
        `;
        
        // Event listener para o "HUDzinho" (tooltip)
        item.addEventListener('click', (e) => showAchievementTooltip(e, id));
        container.appendChild(item);
    }
}

/**
 * Mostra o tooltip (HUD) da conquista.
 */
function showAchievementTooltip(event, achievementId) {
    const data = allAchievements[achievementId];
    
    document.getElementById('tooltip-title').textContent = data.title;
    document.getElementById('tooltip-description').textContent = data.description;
    
    // Posiciona o tooltip perto do mouse/clique
    // (Numa implementação real, isso seria mais robusto para não sair da tela)
    achievementTooltip.style.top = `${event.clientY + 10}px`;
    achievementTooltip.style.left = `${event.clientX - 100}px`; // Ajusta para centralizar
    achievementTooltip.classList.add('active');
    
    // Esconde o tooltip ao clicar em qualquer lugar
    setTimeout(() => {
        document.addEventListener('click', () => {
            achievementTooltip.classList.remove('active');
        }, { once: true }); // O listener é removido após o primeiro clique
    }, 100);
}


/**
 * Verifica todas as condições de conquista e desbloqueia se necessário.
 */
function checkAndUnlockAchievements() {
    const progress = loadProgress();
    
    // 1. Conquista: "Primeiros Passos"
    const totalPhases = Object.keys(progress.phasesCompleted).length;
    if (totalPhases > 0) {
        if (unlockAchievement("primeiros_passos")) {
            // (Aqui poderíamos mostrar um pop-up de "Conquista Desbloqueada!")
            console.log("DESBLOQUEADO: Primeiros Passos");
        }
    }

    // 2. Conquista: "Nerd Básico"
    if (progress.phasesCompleted["matematica_muito_facil"] >= 1) {
        if (unlockAchievement("nerd_basico")) {
            console.log("DESBLOQUEADO: Nerd Básico");
        }
    }
    
    /**
 * Mostra o pop-up (toast) de conquista desbloqueada.
 * @param {string} achievementId - O ID da conquista (ex: "primeiros_passos")
 */
function showAchievementPopup(achievementId) {
    const data = allAchievements[achievementId];
    if (!data) return;

    // Popula o pop-up
    document.getElementById('popup-icon').className = `fas ${data.icon}`;
    document.getElementById('popup-description').textContent = data.title;
    
    // Mostra o pop-up
    const popup = document.getElementById('achievement-popup');
    popup.classList.add('show');
    
    // Esconde após 4 segundos
    setTimeout(() => {
        popup.classList.remove('show');
    }, 4000);
}
}