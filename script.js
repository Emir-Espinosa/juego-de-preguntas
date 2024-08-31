const questions = [
    { question: "¿Cuál es la capital de Japón?", type: "multiple-choice", options: ["Tokio", "Osaka", "Kioto"], answer: "Tokio" },
    { question: "¿Cuántos planetas hay en nuestro Sistema Solar?", type: "multiple-choice", options: ["Hay ocho planetas", "Hay nueve planetas", "Hay siete planetas"], answer: "Hay nueve planetas" },
    { question: "El sol es un planeta.", type: "true-false", answer: "Falso" },
    { question: "La capital de Francia es _____", type: "fill-in-the-blank", answer: "París" },
    { question: "Cuál es el monte más alto de Europa", type: "fill-in-the-blank", answer: "El monte Elbrus" },
    { question: "¿Qué instrumento se utiliza para medir la temperatura?", type: "fill-in-the-blank", answer: "Termómetro" },
    { question: "¿Cuál es la lengua oficial de Brasil?", type: "fill-in-the-blank", answer: "Portugués" },
    { question: "¿Quién pintó la Mona Lisa?", type: "fill-in-the-blank", answer: "Leonardo da Vinci" },
    { question: "¿Cuál es la capital de Australia?", type: "fill-in-the-blank", answer: "Canberra" },
    { question: "¿Qué gas forma la mayor parte de la atmósfera terrestre?", type: "fill-in-the-blank", answer: "Nitrógeno" },
    { question: "¿En qué continente se encuentra Egipto?", type: "fill-in-the-blank", answer: "África" },
    { question: "¿¿Cuánto tiempo dura el movimiento de rotación de la Tierra?", type: "fill-in-the-blank", answer: "24 horas" }
];

let availableQuestions = [...questions];
let scores = { player1: 0, player2: 0 };
let currentPlayer = 'player1';
let totalQuestions = questions.length;
let questionsAnswered = 0;
let timer;
let timeLeft;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('restart-game-btn').addEventListener('click', restartGame);
});

function startGame() {
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();
    const avatar1 = document.getElementById('avatar1').value;
    const avatar2 = document.getElementById('avatar2').value;

    if (name1 === '' || name2 === '') {
        alert('Por favor, ingresa los nombres de ambos jugadores.');
        return;
    }

    document.getElementById('game').style.display = 'block';
    document.getElementById('setup').style.display = 'none';

    document.getElementById('player1-name').textContent = name1;
    document.getElementById('player2-name').textContent = name2;
    document.getElementById('avatar1-img').src = `images/${avatar1}`;
    document.getElementById('avatar2-img').src = `images/${avatar2}`;

    startTimer();
    nextQuestion();
}

function getRandomQuestion() {
    if (availableQuestions.length === 0) {
        availableQuestions = [...questions];
    }
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions.splice(randomIndex, 1)[0];
    return question;
}

function updateQuestion() {
    const questionObj = getRandomQuestion();
    document.getElementById('question').textContent = questionObj.question;
    const answerContainer = document.getElementById('answer-container');
    answerContainer.innerHTML = '';

    if (questionObj.type === 'multiple-choice') {
        questionObj.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'multiple-choice-btn';
            button.onclick = () => checkAnswer(option);
            answerContainer.appendChild(button);
        });
    } else if (questionObj.type === 'true-false') {
        const trueButton = document.createElement('button');
        trueButton.textContent = 'Verdadero';
        trueButton.onclick = () => checkAnswer('Verdadero');
        answerContainer.appendChild(trueButton);

        const falseButton = document.createElement('button');
        falseButton.textContent = 'Falso';
        falseButton.onclick = () => checkAnswer('Falso');
        answerContainer.appendChild(falseButton);
    } else if (questionObj.type === 'fill-in-the-blank') {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'answer';
        input.placeholder = 'Tu respuesta aquí';
        answerContainer.appendChild(input);

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Enviar';
        submitButton.onclick = () => checkAnswer(input.value.trim());
        answerContainer.appendChild(submitButton);
    }

    updatePlayerTurn();
    startTimer();
}

function checkAnswer(selectedAnswer) {
    clearInterval(timer);

    const correctAnswer = questions.find(q => q.question === document.getElementById('question').textContent).answer;

    if (selectedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        scores[currentPlayer]++;
        alert('¡Respuesta correcta!');
    } else {
        alert(`Respuesta incorrecta. La respuesta correcta era: ${correctAnswer}`);
    }

    questionsAnswered++;
    updateScores();

    if (questionsAnswered >= totalQuestions) {
        endGame();
    } else {
        setTimeout(nextQuestion, 1000);
    }
}

function nextQuestion() {
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
    updateQuestion();
}

function updateScores() {
    document.getElementById('score1').textContent = scores.player1;
    document.getElementById('score2').textContent = scores.player2;
}

function updatePlayerTurn() {
    if (currentPlayer === 'player1') {
        document.getElementById('player1-board').style.backgroundColor = '#b2dfdb';
        document.getElementById('player2-board').style.backgroundColor = '#ffffff';
    } else {
        document.getElementById('player2-board').style.backgroundColor = '#b2dfdb';
        document.getElementById('player1-board').style.backgroundColor = '#ffffff';
    }
}

function startTimer() {
    clearInterval(timer); // Limpiar cualquier temporizador anterior
    timeLeft = 30;
    document.getElementById('time').textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('Se acabó el tiempo para esta pregunta.');
            nextQuestion();
        }
    }, 1000);
}

function endGame() {
    console.log('Ejecutando endGame');
    console.log('Puntuaciones:', scores);

    document.getElementById('game').style.display = 'none'; // Oculta la pantalla de juego
    document.getElementById('end-game').style.display = 'block'; // Muestra la pantalla de fin de juego

    let winner;
    if (scores.player1 > scores.player2) {
        winner = 'Jugador 1 ha ganado';
    } else if (scores.player1 < scores.player2) {
        winner = 'Jugador 2 ha ganado';
    } else {
        winner = '¡Es un empate!';
    }

    console.log('Ganador:', winner);

    document.getElementById('winner').textContent = winner; // Muestra el ganador
    document.getElementById('final-score1').textContent = scores.player1; // Muestra puntaje del jugador 1
    document.getElementById('final-score2').textContent = scores.player2; // Muestra puntaje del jugador 2
}

function restartGame() {
    scores = { player1: 0, player2: 0 };
    questionsAnswered = 0;
    availableQuestions = [...questions];
    document.getElementById('end-game').style.display = 'none';
    document.getElementById('setup').style.display = 'block';
}
