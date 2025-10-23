// js/game.js

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let currentQuizInfo = {
    subject: null,
    difficulty: null,
    phase: null
};

const quizScreen = document.getElementById('screen-quiz');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionCounter = document.getElementById('question-counter');
const timerDisplay = document.getElementById('timer');

/**
 * Inicia um novo quiz.
 * @param {string} subject 
 * @param {string} difficulty 
 * @param {number} phase 
 */
function startQuiz(subject, difficulty, phase) {
    currentQuestions = getQuestions(subject, difficulty, phase);
    // Salva as informações do quiz atual
    currentQuizInfo = { subject, difficulty, phase };
    
    if (!currentQuestions || currentQuestions.length === 0) {
        console.error("Nenhuma pergunta encontrada!");
        // (Aqui deveríamos voltar ao mapa e dar um erro)
        return;
    }
    
    currentQuestionIndex = 0;
    score = 0;
    
    // Navega para a tela do quiz (o main.js fará isso)
    // showScreen('screen-quiz'); 
    
    loadQuestion();
}

/**
 * Carrega a pergunta atual ou finaliza o quiz.
 */
function loadQuestion() {
    // Limpa o timer anterior
    clearInterval(timerInterval);
    
    if (currentQuestionIndex < currentQuestions.length) {
        const q = currentQuestions[currentQuestionIndex];
        
        questionText.textContent = q.q;
        questionCounter.textContent = `${currentQuestionIndex + 1} / ${currentQuestions.length}`;
        optionsContainer.innerHTML = ''; // Limpa opções anteriores
        
        // Cria os botões de opção
        q.o.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'btn-option';
            button.textContent = option;
            button.dataset.index = index;
            button.addEventListener('click', selectAnswer);
            optionsContainer.appendChild(button);
        });
        
        // Inicia o timer
        startTimer();
    } else {
        // Fim do Quiz
        endQuiz();
    }
}

function startTimer() {
    let timeLeft = 15; // 15 segundos por pergunta
    timerDisplay.textContent = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // (Considera resposta errada e passa para a próxima)
            handleAnswer(false, null);
        }
    }, 1000);
}

/**
 * Chamado quando o usuário clica em uma opção.
 * @param {Event} e 
 */
function selectAnswer(e) {
    clearInterval(timerInterval); // Para o timer
    
    const selectedButton = e.target;
    const selectedIndex = parseInt(selectedButton.dataset.index);
    const correctIndex = currentQuestions[currentQuestionIndex].a;

    const isCorrect = (selectedIndex === correctIndex);
    
    handleAnswer(isCorrect, selectedButton, correctIndex);
}

/**
 * Processa a resposta (correta ou incorreta)
 */
function handleAnswer(isCorrect, selectedButton, correctIndex = null) {
    if (isCorrect) {
        score++;
        selectedButton.classList.add('correct');
    } else if (selectedButton) {
        selectedButton.classList.add('wrong');
        // Mostra a correta
        if (correctIndex !== null) {
            optionsContainer.children[correctIndex].classList.add('correct');
        }
    }
    
    // Desabilita todos os botões
    Array.from(optionsContainer.children).forEach(btn => {
        btn.classList.add('disabled');
    });
    
    // Espera 1.5s antes de ir para a próxima pergunta
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1500);
}


/**
 * Chamado quando o quiz termina.
 */
/**
 * Chamado quando o quiz termina.
 */
function endQuiz() {
    console.log(`Quiz finalizado! Pontuação: ${score} / ${currentQuestions.length}`);

    // Pega as informações da fase que acabamos de jogar
    const { subject, difficulty, phase } = currentQuizInfo;
    
    // 1. O jogador passou? (Ex: 70% de acerto - 7 de 10)
    const passed = (score / currentQuestions.length) >= 0.7; 
    
    // 2. Pega os elementos da tela de resultados
    const resultsTitle = document.getElementById('results-title');
    const resultsScore = document.getElementById('results-score');
    const resultsTrophy = document.getElementById('results-trophy-icon');
    const btnNext = document.getElementById('btn-next-phase');
    const btnBack = document.getElementById('btn-back-to-map');

    if (passed) {
        // 3. Salva o progresso
        completePhase(subject, difficulty, phase);
        
        // 4. Configura a tela de Vitória
        resultsTitle.textContent = "Fase Concluída!";
        resultsTrophy.src = ""; // (Coloque o caminho de um ícone de troféu dourado aqui, ex: 'assets/icons/trophy-gold.png')
        resultsTrophy.alt = "Troféu Dourado";
        btnNext.style.display = 'block'; // Mostra o botão "Próxima Fase"
        
        // Configura o botão "Próxima Fase" para ir para a fase seguinte
        // (Nota: Isso é uma lógica simplificada. Não checa se a fase 10 é a última)
        btnNext.onclick = () => {
            appState.currentPhase = phase + 1; // Atualiza o estado global
            startQuiz(subject, difficulty, phase + 1);
            showScreen('screen-quiz');
        };

    } else {
        // 4. Configura a tela de Derrota
        resultsTitle.textContent = "Tente Novamente!";
        resultsTrophy.src = ""; // (Coloque o caminho de um ícone de troféu quebrado/prata aqui)
        resultsTrophy.alt = "Troféu de Participação";
        btnNext.style.display = 'none'; // Esconde o botão "Próxima Fase"
    }
    
    // 5. Atualiza o placar e os botões
    resultsScore.textContent = `Você acertou ${score} de ${currentQuestions.length}!`;
    
    btnBack.onclick = () => {
        // Atualiza o mapa de fases (agora que o progresso foi salvo)
        populatePhaseMap(); 
        showScreen('screen-phases');
    };

    // 6. Mostra a tela de resultados
    showScreen('screen-results');
}