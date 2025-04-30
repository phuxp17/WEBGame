let nums = [];
let answer = [];
let difficulty = "";
let countNum = 0;
let numChoices = 4;

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
        confirm("🎉 Tuyệt vời! 🎉\nBạn có muốn chơi tiếp không?") && location.reload();
    }
}

function resetGame() {
    localStorage.removeItem('selectedDifficulty');
    location.reload();
}
function playAlertSound() {
    const sound = document.getElementById("alertSound");
    sound.currentTime = 0;
    sound.play();
}
function showPopup() {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('popup-overlay').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popup-overlay').style.display = 'none';
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
        nums = ["1", "2", "3", "4", "5", "6"];
        numChoices = 4;
    } else if (difficulty === "hard") {
        nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        numChoices = 6;
    }

    init();

};
