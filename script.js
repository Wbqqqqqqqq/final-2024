const questions = [
    { question: "Question 1: What is the primary characteristic of a fully autonomous vehicle?", options: ["Requires a human operator for complex navigation", "Operates without any human intervention in all conditions", "Uses only basic sensors for driving assistance", "Requires external control from traffic management systems"], correct: 1 },
    { question: "Question 2: Which technology is essential for enabling vehicular automation?", options: ["Basic road infrastructure", "High-definition maps", "Manual driving controls", "Traditional navigation systems"], correct: 1 },
    { question: "Question 3: Which SAE level corresponds to Conditional Automation?", options: ["Level 2", "Level 3", "Level 4", "Level 5"], correct: 1 },
    { question: "Question 4: What is the greatest challenge faced by autonomous road vehicles compared to other modes of transportation?", options: ["Limited fuel efficiency", "Unpredictable and diverse road environments", "Lack of global navigation systems", "Dependence on driver assistance"], correct: 1 },
    { question: "Question 5: What is the role of Advanced Driver-Assistance Systems (ADAS) in semi-autonomous vehicles?", options: ["Fully replacing the human driver in all conditions", "Allowing the vehicle to make independent decisions without human input", "Assisting or replacing certain driving tasks under specific circumstances", "Operating the vehicle only in emergency situations"], correct: 2 }
];


let currentQuestion = 0;
let userAnswers = [];

function showMoreInfo() {
    const moreInfo = document.getElementById('more-info');
    if (moreInfo.style.display === 'none' || moreInfo.style.display === '') {
        moreInfo.style.display = 'block';
    } else {
        moreInfo.style.display = 'none';
    }
}

document.querySelectorAll('.description-item').forEach(item => {
    let timeout;

    item.addEventListener('mouseover', function() {
        const tooltip = document.querySelector('.tooltip');
        tooltip.textContent = this.getAttribute('data-description');
        tooltip.style.display = 'block';
        tooltip.style.left = `${this.offsetLeft + this.offsetWidth + 10}px`;
        if (timeout) clearTimeout(timeout);
    });

    item.addEventListener('mouseleave', function() {
        const tooltip = document.querySelector('.tooltip');
        timeout = setTimeout(() => {
            tooltip.style.display = 'none';
        }, 500);
    });

    const tooltip = document.querySelector('.tooltip');
    tooltip.addEventListener('mouseover', function() {
        if (timeout) clearTimeout(timeout);
    });

    tooltip.addEventListener('mouseleave', function() {
        timeout = setTimeout(() => {
            tooltip.style.display = 'none';
        }, 500);
    });
});

function loadQuestion() {
    const questionContainer = document.getElementById("question-container");
    const answersContainer = document.getElementById("answers-container");

    questionContainer.innerHTML = `<p>${questions[currentQuestion].question}</p>`;
    answersContainer.innerHTML = questions[currentQuestion].options
        .map((option, index) => `
            <label>
                <input type="radio" name="answer" value="${index}" id="option${index}" /> 
                <span class="custom-radio"></span>
                ${option}
            </label>
            <br>
        `).join('');
    document.getElementById("error-message").style.display = 'none';
    const button = document.getElementById("submit-btn");
    if (currentQuestion === questions.length - 1) {
        button.textContent = "Submit";
    } else {
        button.textContent = "Next Question";
    }

    document.getElementById("quit-btn").style.display = 'inline-block';
}

document.getElementById("submit-btn").addEventListener("click", () => {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    
    if (!selectedOption) {
        document.getElementById("error-message").textContent = "Please select an answer before proceeding to the next question.";
        document.getElementById("error-message").style.display = 'block';
        return;
    }

    userAnswers.push(parseInt(selectedOption.value));
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function showResults(isQuit = false) {
    let score = 0;
    const resultContainer = document.getElementById("result-container");
    if (isQuit) {
        resultContainer.innerHTML = "<h2>Quiz Results (You quit early)</h2>";
    } else {
        resultContainer.innerHTML = "<h2>Your Final Results</h2>";
    }
    userAnswers.forEach((answer, index) => {
        const correctAnswer = questions[index].correct;
        if (answer === correctAnswer) {
            score++;
            resultContainer.innerHTML += `<p>Question ${index + 1}: Correct! - ${questions[index].question}</p>`;
        } else {
            resultContainer.innerHTML += `<p>Question ${index + 1}: Incorrect! - Correct answer: ${questions[index].options[correctAnswer]}</p>`;
        }
    });
    resultContainer.innerHTML += `<p>You got ${score} out of ${questions.length} correct!</p>`;
    document.getElementById("submit-btn").style.display = 'none';
    document.getElementById("quit-btn").style.display = 'none';
    document.getElementById("retry-container").style.display = 'block';
}

document.getElementById("quit-btn").addEventListener("click", () => {
    showResults(true);
});
document.getElementById("try-again-btn").addEventListener("click", () => {
    currentQuestion = 0;
    userAnswers = [];
    loadQuestion();
    document.getElementById("result-container").innerHTML = '';
    document.getElementById("retry-container").style.display = 'none';
    document.getElementById("submit-btn").style.display = 'block'; // Show the submit button
    document.getElementById("quit-btn").style.display = 'inline-block'; // Show quit button again
});

document.getElementById("back-home-btn").addEventListener("click", () => {
    window.location.href = "index.html";
});

loadQuestion();
