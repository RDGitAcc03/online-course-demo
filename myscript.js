// DOM elements
const video = document.querySelector('video');
const playBtn = document.querySelector('#play');
const pauseBtn = document.querySelector('#pause');
const poll = document.querySelector('form#poll');
const pollAnswers = document.querySelector('div.pollAnswers').children;
const screenStatus = document.querySelectorAll("input[name='radioBtn'");
// Actions
const playVid = () => video.play();
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
        answersNotClicked.push(ans);
        const text = 'תשובה 2';
        if (!isCorrect && ans.innerText === text) {
            correctAns = ans;
            isCorrect = true;
        }
        const handleClick = () => {
            return (e) => {
                e.preventDefault();
                handleAnswer(ans, answersNotClicked, correctAns);
            }
        }
        ans.addEventListener('click', handleClick());
    }
}
const handleEndedVid = () => {
    poll.style.visibility = 'visible';
    handlePollAnswers();
};

const ListenToEvents = () => {
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
