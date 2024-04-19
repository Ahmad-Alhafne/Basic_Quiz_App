let countSpan = document.querySelector('.quiz-info .count span');
let bulletSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.submit-button');
let bullets = document.querySelector('.bullets');
let resultsContainer = document.querySelector('.results');
let countdownElement = document.querySelector('.countdown');
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;

function getDataQuestions() {
    let myReq = new XMLHttpRequest();
    myReq.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            questionsObject = JSON.parse(this.responseText);
            qCount = questionsObject.length;
            countSpan.innerHTML = qCount;
            createBullets(qCount);
            addDataQuestions(questionsObject[currentIndex], qCount);
            countdown(10000, qCount);
            submitButton.onclick = () => {
                let rAnswer = questionsObject[currentIndex].right_answer;
                checkAnswer(rAnswer, qCount);
                currentIndex++;
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';
                addDataQuestions(questionsObject[currentIndex], qCount);
                addClassBullets(qCount);
                clearInterval(countdownInterval);
                countdown(50, qCount);
                showResults(qCount);
            }
        }
    }
    myReq.open("GET", 'html-questions.json', true);
    myReq.send();
}
getDataQuestions();

function addDataQuestions(obj, count) {
    if (currentIndex < count) {
        let h2 = document.createElement('h2');
        h2.appendChild(document.createTextNode(obj.title));
        quizArea.appendChild(h2);
        for (let i = 1; i <= 4; i++) {
            let div = document.createElement('div');
            div.className = 'answer';
            let input = document.createElement('input');
            input.name = 'question';
            input.type = 'radio';
            input.id = `answer_${i}`;
            if (i === 1) {
                input.checked = true;
            };
            let label = document.createElement('label');
            label.htmlFor = `answer_${i}`;
            label.appendChild(document.createTextNode(obj[`answer_${i}`]));
            input.dataset.answer = obj[`answer_${i}`];
            div.append(input, label);
            answersArea.appendChild(div);
        }
    }
};
function createBullets(count) {
    for (let i = 0; i < count; i++) {
        let span = document.createElement('span');
        bulletSpanContainer.appendChild(span);
        if (i === 0) {
            span.className = 'on';
        }
    }
}
function addClassBullets(count) {
    let spans = document.querySelectorAll('.bullets .spans span');
    let arrSpans = Array.from(spans);
    arrSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'on';
        }
    })
};
function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName('question');
    let theChossenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChossenAnswer = answers[i].dataset.answer;
        }
    }
    if (theChossenAnswer === rAnswer) {
        rightAnswer++;
    }
}


function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        if (rightAnswer > (count / 2) && rAnswer < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswer} From ${count} `;
        } else if (rightAnswer === count) {
            theResults = `<span class="perfect">Perfect</span> All Answers Is Right`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswer} From ${count}`;
        }
        resultsContainer.innerHTML = theResults;
    }
}
function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdownElement.innerHTML = `${minutes} : ${seconds}`;
            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000)
    }
}
