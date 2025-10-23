// js/progress.js

const STORAGE_KEY = 'quizMestreProgress';

const defaultProgress = {
    achievements: [],
    settings: {
        volume: 0.8,
        lowQuality: false
    },
    phasesCompleted: {
        // Ex: "matematica_facil": 3 (significa que completou até a fase 3)
    }
};

/**
 * Carrega o progresso do usuário do localStorage.
 * @returns {object} O objeto de progresso.
 */
function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return JSON.parse(JSON.stringify(defaultProgress)); // Retorna uma cópia do padrão
}

/**
 * Salva o objeto de progresso no localStorage.
 * @param {object} progressData - O objeto de progresso.
 */
function saveProgress(progressData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
}

/**
 * Marca uma fase como concluída e salva.
 * @param {string} subject 
 * @param {string} difficulty 
 * @param {number} phase 
 */
function completePhase(subject, difficulty, phase) {
    const progress = loadProgress();
    const key = `${subject}_${difficulty}`;
    
    // Salva apenas a fase mais alta concluída
    if (!progress.phasesCompleted[key] || progress.phasesCompleted[key] < phase) {
        progress.phasesCompleted[key] = phase;
    }
    
    saveProgress(progress);
    
    // Após salvar, checamos por novas conquistas
    checkAndUnlockAchievements();
}

/**
 * Concede uma conquista se ela ainda não foi ganha.
 * @param {string} achievementId - O ID da conquista.
 * @returns {boolean} - True se a conquista foi desbloqueada agora, false se já a possuía.
 */
function unlockAchievement(achievementId) {
    const progress = loadProgress();
    if (!progress.achievements.includes(achievementId)) {
        progress.achievements.push(achievementId);
        saveProgress(progress);
        
        // ADICIONE ISTO:
        // Chama o feedback visual
        if (typeof showAchievementPopup === 'function') {
            showAchievementPopup(achievementId);
        }
        // FIM DA ADIÇÃO

        return true; // Acabou de desbloquear
    }
    return false; // Já possuía
}
