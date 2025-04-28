// script.js
/**
 * Giới hạn số lần đoán (ví dụ: 10 lần).(done)

Hiển thị lịch sử các lượt đoán.(done)

Cho phép chơi lại ("Play Again" button).(done)

Hiệu ứng thắng cuộc (như confetti rơi).

Chọn mức độ khó: 4 màu, 5 màu, 6 màu...

Giao diện đẹp hơn (drag-drop chọn màu),

Thêm bộ đếm số lượt đoán,


 */
const colors = ["1", "2", "3", "4"];
let answer = [];

function init() {
    const selects = document.querySelectorAll('.choice');
    selects.forEach(select => {
        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.text = color;
            select.appendChild(option);
        });
    });

    generateAnswer();
}

function generateAnswer() {
    answer = [];
    for (let i = 0; i < 4; i++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        answer.push(randomColor);
    }
    console.log("Answer (for testing):", answer); 
}
let countNum = 0;
function submitGuess() {
    const selects = document.querySelectorAll('.choice');
    let guess = Array.from(selects).map(select => select.value);

    let correctPosition = 0;
    let correctColor = 0;

    let answerCopy = [...answer];
    let guessCopy = [...guess];


    // Bước 1: Đếm đúng vị trí
    for (let i = 0; i < 4; i++) {
        if (guess[i] === answer[i]) {
            correctPosition++;
            answerCopy[i] = null;
            guessCopy[i] = null;
        }

    }

    // Bước 2: Đếm đúng màu sai vị trí
    for (let i = 0; i < 4; i++) {
        if (guessCopy[i] && answerCopy.includes(guessCopy[i])) {
            correctColor++;
            answerCopy[answerCopy.indexOf(guessCopy[i])] = null;
        }
    }

    countNum++;
    // Bước 3: Hiển thị kết quả
    const feedback = document.getElementById('feedback');
    feedback.innerHTML += `<div>Bạn chọn: ${guess.join(", ")} 
  <br>Kết quả: ${correctPosition} vị trí chính xác</div><hr>`;
    if (countNum === 11) {
        alert("Bạn đã hết lượt chơi, reset đê👌");
        location.reload();
        
    }

    // Thắng cuộc
    if (correctPosition === 4) {
        feedback.innerHTML += `<h2>🎉 Ảo thật đấy! 🎉</h2>`;
    }


}
function resetGame() {
    confirm("Chơi lại game nha bạn ╰(*°▽°*)╯") && location.reload();
}
window.onload = init;
