let cindex = 0;
let true_anwsers = 0;
let false_anwsers = 0;
let answerSelected = false;
let filteredQuestions = [];

const quest = document.querySelector('.question');
const anwsr = document.querySelector('.anwsers');

function getQuestions() {
    answerSelected = false;

    let request = new XMLHttpRequest();

    // Get the category from the URL
    const urlP = new URLSearchParams(window.location.search);
    const category = urlP.get('category');

    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let questionObject = JSON.parse(this.responseText);
            
            // Filter questions by category
            filteredQuestions = questionObject.filter(question => question.question_category === category);
            
            const count = document.getElementById('nq');
            const len = document.getElementById('len');

            let qLen = filteredQuestions.length;
            len.innerHTML = qLen;

            // Add the first question
            addData(filteredQuestions[cindex], qLen);

            // Set the current question number
            count.innerHTML = cindex + 1;
        }
    };

    request.open('GET', 'questions.json', true);
    request.send();
}

getQuestions();

function addData(obj, len) {
    // Initialize
    quest.innerHTML = '';
    anwsr.innerHTML = '';

    // Create question html
    quest.innerHTML = obj.question_label;

    // Create answers
    for (let i = 0; i < 4; i++) {
        let anwBtn = document.createElement('button');
        let key = Object.keys(obj.question_answers[i]);

        anwBtn.setAttribute('data-anw', obj.question_answers[i][key]);

        // Add event listener for the button click
        anwBtn.addEventListener('click', getPlayerAnwser);

        anwBtn.innerText = key;

        anwsr.appendChild(anwBtn);
    }
}

const btnNext = document.getElementById('next');
btnNext.addEventListener('click', function() {
    mark_false(); // Check if no answer was selected before moving to the next question

    cindex++;

    if (cindex < filteredQuestions.length) {
        addData(filteredQuestions[cindex], filteredQuestions.length);

        // Reset the answer selection flag and update the question number
        answerSelected = false;
        document.getElementById('nq').innerHTML = cindex + 1;
    } else {
        let wrp = document.querySelector('.wrapper');
        wrp.innerHTML='';

        let h2 = document.createElement('h2');
        h2.innerText = 'Game Over!';

        let score = document.createElement('p');
        score.innerText = true_anwsers + '/' + filteredQuestions.length;

        wrp.appendChild(h2);
        wrp.appendChild(score);

        wrp.style.margin = 'auto';
        wrp.style.paddingTop = '150px';

        if (true_anwsers < filteredQuestions.length) {
            score.style.border = '5px solid red'; 
        } else {
            score.style.border = '5px solid green'; 
        }

        setTimeout(function() {
            window.location.href = "index.html"; 
        }, 5000);
    }
});

function getPlayerAnwser(e) {
    e.preventDefault(); // Prevent form submission

    if (this.getAttribute('data-anw') === "true") {
        true_anwsers++;
        this.style.backgroundColor = '#1b8826c0';
    } else {
        false_anwsers++;
        this.style.backgroundColor = '#9b2424c3';
    }

    // Set answerSelected to true to indicate an answer has been chosen
    answerSelected = true;

    // Disable all answer buttons after selection
    const buttons = document.querySelectorAll('.anwsers button');
    buttons.forEach(button => button.disabled = true);

    console.log("Correct answers: " + true_anwsers);
    console.log("Incorrect answers: " + false_anwsers);
}

function mark_false() {
    // If no answer was selected for this question, mark it as false
    if (!answerSelected) {
        false_anwsers++;
    }
}