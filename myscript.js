// DOM elements
const video = document.querySelector('video');
const playBtn = document.querySelector('#play');
const pauseBtn = document.querySelector('#pause');
const poll = document.querySelector('form#poll');
const pollAnswers = document.querySelector('div.pollAnswers').children;
const screenStatus = document.querySelectorAll("input[name='radioBtn']");
const bar = document.querySelector('div#bar');
const progressBar = document.querySelector('#progressBar');
const timer = document.querySelector('#timer');

let mode = 'ניסוי';
const getScreenStatus = () => {
    const handleScreenStatus = (e) => {
        const s = e.target;
        if (s.value === 'ניסוי') {
            mode = 'ניסוי';
            s.checked = true;
        } else if (s.value === 'עבודה') {
            mode = 'עבודה';
            s.checked = true;
        }
    }

    for (const status of [...screenStatus]) {
        status.addEventListener('mouseup', e => handleScreenStatus(e))
    }
}

let timePassed = 0;
let progressBarIntervalId;
const runProgressBar = (onComplete) => {
    bar.style.display = 'block';
    let progress = 0;
    progressBar.style.width = `${progress}%`;

    const totalSeconds = 30; // Total time to reach 100% (30 seconds)
    const updateFrequency = 100; // Update progress every 100 milliseconds
    const steps = totalSeconds * (1000 / updateFrequency); // Number of steps to reach 100%

    progressBarIntervalId = setInterval(() => {
        progress += 100 / steps;
        progressBar.style.width = `${progress}%`;
        timePassed = Math.round((progress / 100) * totalSeconds);
        timer.innerText = `${timePassed} s`;
        if (progress >= 100) {
            clearInterval(progressBarIntervalId);
            progress = 0;
            onComplete();
        }
    }, updateFrequency);
}

const stopProgressBar = (onAnswering) => {
    clearInterval(progressBarIntervalId);
    onAnswering();
}


// Actions
const playVid = () => {
    pauseBtn.disabled = false;
    bar.style.display = 'none';
    video.play();
};
const pauseVid = () => video.pause();
const handleAnswer = (clicked, unclicked, correctAns) => {
    const correctStyle = '2px solid green';
    const incorrectStyle = '2px solid red';
    const match = clicked.innerText === correctAns.innerText;
    correctAns && (correctAns.style.border = correctStyle);
    clicked.style.border = match ? correctStyle : incorrectStyle;
    unclicked = unclicked.filter(a => a.innerText !== clicked.innerText);
    unclicked.forEach(a => a.disabled = true);
};
const handlePollAnswers = () => {
    let answersNotClicked = [], correctAns, isCorrect = false;
    for (const ans of [...pollAnswers]) {
        ans.style.border = 'initial';
        ans.disabled = false;
        pauseBtn.disabled = true;
        answersNotClicked.push(ans);
        const text = 'תשובה 2';
        if (!isCorrect && ans.innerText === text) {
            correctAns = ans;
            isCorrect = true;
        }
        const handleClick = () => {
            return (e) => {
                e.preventDefault();
                stopProgressBar(onAnswerClicked);
                handleAnswer(ans, answersNotClicked, correctAns);
            }
        }
        ans.addEventListener('click', handleClick());
    }
}
const onBarCompletion = () => {
    poll.style.visibility = 'hidden';
    playBtn.disabled = false;
    pauseBtn.disabled = true;
}

const onAnswerClicked = () => {
    playBtn.disabled = false;
    pauseBtn.disabled = true;
}

const handleEndedVid = () => {
    if (mode === 'ניסוי') {
        poll.style.visibility = 'visible';
        handlePollAnswers();
    } else if (mode === 'עבודה') {
        poll.style.visibility = 'visible';
        playBtn.disabled = true;
        pauseBtn.disabled = true;
        runProgressBar(onBarCompletion);
        handlePollAnswers();
    }
};

const ListenToEvents = () => {
    getScreenStatus();
    // Events
    playBtn.addEventListener('click', () => {
        poll.style.visibility = 'hidden ';
        playVid();
    });
    pauseBtn.addEventListener('click', pauseVid);
    video.addEventListener('ended', handleEndedVid);
}

// Excection Point
ListenToEvents();
