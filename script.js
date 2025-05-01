let nums = [];
let answer = [];
let difficulty = "";
let countNum = 0;
let numChoices = 4;
let endTime;
let totalTime;
let score = 0;
let startTime = null;
let timerStarted = false;


function selectDifficulty() {
    const selected = document.querySelector('input[name="difficulty"]:checked');
    if (!selected) return;

    difficulty = selected.value;
    localStorage.setItem('selectedDifficulty', difficulty); // Lưu lại chế độ
    location.reload(); // Reload lại trang
}

function init() {
    const guessArea = document.getElementById('guess-area');
    guessArea.innerHTML = ''; // Xóa cũ

    for (let i = 0; i < numChoices; i++) {
        const select = document.createElement('select');
        select.className = 'choice';
        select.addEventListener('change', () => {
            if (!timerStarted) {
                startTime = new Date();
                timerStarted = true;
                console.log("⏱ Bắt đầu tính thời gian!");
            }
        });
        nums.forEach(num => {
            const option = document.createElement('option');
            option.value = num;
            option.text = num;
            select.appendChild(option);
        });
        guessArea.appendChild(select);
    }

    generateAnswer();
    

}

function generateAnswer() {
    answer = [];

    if (difficulty === "easy") {
        // Không trùng
        let temp = [...nums];
        for (let i = 0; i < 4; i++) {
            const idx = Math.floor(Math.random() * temp.length);
            answer.push(temp[idx]);
            temp.splice(idx, 1);
        }
    } else {
        // Có thể trùng
        for (let i = 0; i < numChoices; i++) {
            const randomNumber = nums[Math.floor(Math.random() * nums.length)];
            answer.push(randomNumber);
        }
    }
    console.log("Answer (for testing):", answer);
}

function submitGuess() {
    const selects = document.querySelectorAll('.choice');
    let guess = Array.from(selects).map(select => select.value);
    let correctPosition = 0;
    let correctColor = 0;

    let answerCopy = [...answer];
    let guessCopy = [...guess];

    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === answer[i]) {
            correctPosition++;
            answerCopy[i] = null;
            guessCopy[i] = null;
        }
    }

    for (let i = 0; i < guess.length; i++) {
        if (guessCopy[i] && answerCopy.includes(guessCopy[i])) {
            correctColor++;
            answerCopy[answerCopy.indexOf(guessCopy[i])] = null;
        }
    }

    countNum++;
    const feedback = document.getElementById('feedback');
    if (difficulty === "easy") {
        feedback.innerHTML += `<div class="response">Lần ${countNum}: Bạn chọn: ${guess.join(", ")} 
        <br>Kết quả: ${correctPosition} vị trí chính xác</div><hr>`;

    } else {
        feedback.innerHTML += `<div class="response">Lần ${countNum}: Bạn chọn: ${guess.join(", ")} 
    <br>Kết quả: ${correctPosition} vị trí chính xác, ${correctColor} số đúng nhưng sai vị trí</div><hr>`;
    }
    feedback.scrollTop = feedback.scrollHeight;

    if (countNum === 21 && difficulty === "hard") {
        playAlertSound();
        setTimeout(() => {
            alert("Bạn đã hết lượt chơi, reset thoai!"); location.reload();

        }, 300);
    }

    else if (countNum === 11 && (difficulty === "easy" || difficulty === "medium")) {
        playAlertSound();
        setTimeout(() => {
            alert("Bạn đã hết lượt chơi, reset thoai!"); location.reload();

        }, 300);
    }

    if (correctPosition === answer.length) {
        playWinSound();
        triggerWinEffect();

    }
}
// Reset game
function resetGame() {
    location.reload();
}
// Âm thanh thông báo
function playAlertSound() {
    const sound = document.getElementById("alertSound");
    sound.currentTime = 0;
    sound.play();
}
function playWinSound() {
    const sound = document.getElementById("winSound");
    sound.currentTime = 0;
    sound.play();
}
// Hiện popup
function showPopup() {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('popup-overlay').style.display = 'block';
}
// Đóng popup
function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popup-overlay').style.display = 'none';
}
function closewPopup() {
    document.getElementById("winPopup").style.display = "none";
}
// Hiệu ứng chiến thắngthắng
function triggerWinEffect() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }, i * 300);
    }
    endTime = new Date();
    totalTime = Math.floor((endTime - startTime) / 1000); // Tính thời gian chơi (giây)

    // Tính điểm: bạn có thể tự chỉnh theo mức độ
    // Ví dụ: điểm = (số lượt tối đa - số lượt đã dùng + 1) * hệ số theo độ khó - thời gian
    let maxTurns = (difficulty === "hard") ? 21 : 11;
    let baseScore = (maxTurns - countNum + 1) * 10;

    if (difficulty === "medium") baseScore *= 1.5;
    if (difficulty === "hard") baseScore *= 2;

    score = Math.max(0, Math.floor(baseScore - totalTime));

    // Hiển thị thời gian và điểm
    document.getElementById("winPopup").innerHTML += `
    <h2>🎉 Chúc mừng bạn đã chiến thắng!</h2>
    <div>⏱ Thời gian chơi: ${totalTime} giây</div>
    <div>🏆 Điểm của bạn: ${score} điểm</div>
    <button onclick="resetGame()" class="reset">Chơi lại</button>
`;
    // Hiển thị popup thắng
    document.getElementById("winPopup").style.display = "block";
}

window.onload = () => {
    const savedDifficulty = localStorage.getItem('selectedDifficulty');

    difficulty = savedDifficulty;
    document.getElementById('game').style.display = 'block';

    // Bật lại radio đã chọn
    const radios = document.querySelectorAll('input[name="difficulty"]');
    radios.forEach(radio => {
        if (radio.value === difficulty) {
            radio.checked = true;
        }
    });

    if (difficulty === "easy") {
        nums = ["1", "2", "3", "4"];
        numChoices = 4;
    } else if (difficulty === "medium") {
        nums = ["1", "2", "3", "4", "5", "6", "7"];
        numChoices = 4;
    } else if (difficulty === "hard") {
        nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        numChoices = 6;
    }

    init();

};
