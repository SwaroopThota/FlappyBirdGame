const bird = document.querySelector(".bird");
const gameDisplay = document.querySelector(".game-container");
let birdBottom, score, isGameOver, gameTimer, obsticleTimer;
const jump = (e) => {
  if (e.key === " " && birdBottom <= 530) {
    birdBottom += 50;
    bird.style.bottom = birdBottom + "px";
    new Audio("Assets/Audio/audio_wing.wav").play();
  }
};
const restartGame = (e) => {
  if (e.key === " ") {
    document.removeEventListener("keyup", restartGame);
    document.removeEventListener("click", restartGame);
    startGame();
  }
};
const startGame = () => {
  bird.style.animation = "birdAnimation .5s linear infinite";
  document.removeEventListener("keyup", startGameEvent);
  document.addEventListener("keyup", jump);
  document.addEventListener("click", jump);
  document.getElementsByClassName("game-info")[0].style.display = "none";
  birdBottom = 350;
  score = 0;
  isGameOver = false; 
  gameTimer = setInterval(birdGravity, 15);
  obsticleTimer = setInterval(generateObsticle, 1000);
};
const birdGravity = () => {
  birdBottom -= 2;
  bird.style.bottom = birdBottom + "px";
  if (birdBottom <= 0) 
  gameOver();
};
const generateObsticle = () => {
  let obsticle = document.createElement("div");
  obsticle.classList.add("obsticle");
  gameDisplay.appendChild(obsticle);
  let topObsticle = document.createElement("div");
  topObsticle.classList.add("top-obsticle");
  gameDisplay.appendChild(topObsticle);
  let obsticleLeft = 500;
  let obsticleBottom = Math.random() * 50;
  obsticle.style.bottom = obsticleBottom + "px";
  topObsticle.style.bottom = 430 + obsticleBottom + "px";
  const moveObsticle = () => {
    obsticleLeft -= 5;
    obsticle.style.left = obsticleLeft + "px";
    topObsticle.style.left = obsticleLeft + "px";
    if (obsticleLeft < -80) {
      clearInterval(obsticleMovementTimer);
      gameDisplay.removeChild(obsticle);
      gameDisplay.removeChild(topObsticle);
    }
    if (
      isGameOver ||
      (obsticleLeft < 200 && obsticleLeft > 70 && (birdBottom < obsticleBottom + 290 || birdBottom > obsticleBottom + 385))
    ) {
      clearInterval(obsticleMovementTimer);
      if(isGameOver){
          gameDisplay.removeChild(obsticle);
         gameDisplay.removeChild(topObsticle);
        }
      if (!isGameOver) gameOver();
    }
    if (obsticleLeft < 100 && obsticleLeft > 90) {
      new Audio("Assets/Audio/audio_point.ogg").play();
      score++;
      displayScore(score);
    }
  };
  const obsticleMovementTimer = setInterval(moveObsticle, 10);
};

const gameOver = () => {
  bird.style.animation = "";
  isGameOver = true;
  new Audio("Assets/Audio/audio_hit.wav").play();
  clearInterval(gameTimer);
  clearInterval(obsticleTimer);
  document.removeEventListener("keyup", jump);
  document.getElementsByClassName("game-over")[0].style.display = "block";
  setTimeout(() => { 
    document.addEventListener("keyup", restartGame);
    bird.style.bottom = '350px';
    let obsticles = document.getElementsByClassName("obsticle");
    let topObsticles = document.getElementsByClassName("top-obsticle");
    gameDisplay.removeChild(obsticles[0]);
    gameDisplay.removeChild(topObsticles[0]);
    document.getElementsByClassName("game-over")[0].style.display = "none";
    document.getElementsByClassName("game-info")[0].style.display = "block";
    document.getElementById("tensDigit").setAttribute("src",`Assets/images/0.png`);
    document.getElementById("onesDigit").setAttribute("src",`Assets/images/0.png`);
  },1000);
};

const displayScore = (score) => {
  if(score>=10)
    document.getElementById("tensDigit").setAttribute("src",`Assets/images/${Math.floor(score/10)}.png`);
  document.getElementById("onesDigit").setAttribute("src",`Assets/images/${score%10}.png`);
};
const startGameEvent = (e)=>{
  if(e.key === ' ') 
  startGame();
};
document.addEventListener("keyup", startGameEvent);
document.addEventListener("click", () => { document.dispatchEvent(new KeyboardEvent("keyup", { key: " " })) });
