// js/db.js

// Estrutura:
// { materia: { dificuldade: [ { phase: 1, questions: [...] }, { phase: 2, ... } ] } }

const questionsDB = {
    "matematica": {
        "muito_facil": [
            {
                phase: 1,
                questions: [
                    { q: "Quanto é 1 + 1?", o: ["1", "2", "3", "4"], a: 1 },
                    { q: "Que forma tem 3 lados?", o: ["Quadrado", "Círculo", "Triângulo", "Retângulo"], a: 2 },
                    { q: "Quanto é 5 - 3?", o: ["1", "2", "3", "4"], a: 1 },
                    // ... mais 7 perguntas
                ]
            },
            { phase: 2, questions: [/* ... */] }
        ],
        "facil": [
            {
                phase: 1,
                questions: [
                    { q: "Qual é a raiz quadrada de 81?", o: ["7", "8", "9", "10"], a: 2 },
                    { q: "Quanto é 12 * 12?", o: ["124", "134", "144", "154"], a: 2 },
                    { q: "Resolva: 3x = 15. Qual o valor de x?", o: ["3", "4", "5", "6"], a: 2 },
                    // ... mais 7 perguntas
                ]
            }
        ],
        "medio": [
            {
                phase: 1,
                questions: [
                    { q: "Qual é a fórmula de Bhaskara?", o: ["x = -b ± √(b²-4ac) / 2a", "a² + b² = c²", "S = So + vt", "F = ma"], a: 0 },
                    { q: "Qual o valor de log₂(8)?", o: ["2", "3", "4", "8"], a: 1 },
                    // ... mais 8 perguntas
                ]
            }
        ],
        "dificil": [
            {
                phase: 1,
                questions: [
                    { q: "Qual é a derivada de x³?", o: ["3x", "3x²", "x²/2", "3x³"], a: 1 },
                    { q: "Qual o valor da integral de 1/x dx?", o: ["ln(x) + C", "1/x² + C", "x + C", "eˣ + C"], a: 0 },
                    // ... mais 8 perguntas
                ]
            }
        ],
        "impossivel": [
            {
                phase: 1,
                questions: [
                    { q: "Qual é o último dígito de 3¹⁰⁰?", o: ["1", "3", "7", "9"], a: 0 },
                    { q: "Resolva a Equação do Teorema de Fermat para n=2.", o: ["a+b=c", "a²+b²=c²", "a³+b³=c³", "Não tem solução"], a: 1 },
                    // ... mais 8 perguntas
                ]
            }
        ]
    },
    "fisica": {
        // ... (mesma estrutura)
    },
    // ... (outras matérias)
};

/**
 * Busca as perguntas para um nível específico.
 * @param {string} subject - Ex: "matematica"
 * @param {string} difficulty - Ex: "facil"
 * @param {number} phase - Ex: 1
 * @returns {Array|null} - Array de perguntas ou null se não encontrado.
 */
function getQuestions(subject, difficulty, phase) {
    try {
        const phaseData = questionsDB[subject][difficulty].find(p => p.phase === phase);
        if (phaseData) {
            return phaseData.questions;
        }
        return null;
    } catch (e) {
        console.error(`Erro ao buscar perguntas: ${subject}/${difficulty}/${phase}`, e);
        return null;
    }
}