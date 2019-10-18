// variables for modal
const modal = document.querySelector(".modal");
const modalButton = document.querySelector(".play-again");
const body = document.querySelector("body");

// variables for score panel
const resetButton = document.querySelector(".restart");
const hearts = document.querySelector(".hearts");

// timer variables
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
let sec = 0,
  min = 0;
let timer;

// deck of all cards
const deck = document.querySelector(".deck");

// cards array holds all cards
const cardList = document.querySelectorAll(".card");
const cards = [...cardList];

// counter variables
const counter = document.querySelector(".moves");
let moves = 0;
let incorrectGuess = 0;

// array for open cards and matches
let openCards = [];
let matches = [];

// track number of times player clicks on a card
let clicks = 0;

window.onload = newGame();

deck.addEventListener("click", flipCard);
resetButton.addEventListener("click", newGame);
modalButton.addEventListener("click", playAgain);

function newGame() {
  // 1. reset cards to face down
  for (const card of cards) {
    card.classList.remove("open", "show", "match");
  }
  // 2. shuffle cards
  let shuffledCards = shuffle(cards);
  // 3. append cards to board
  shuffledCards.forEach(function(card) {
    deck.appendChild(card);
  });
  // 4. reset move counter
  moves = 0;
  counter.innerHTML = moves;
  // 5. reset matches array and open cards array
  matches = [];
  openCards = [];
  // 6. reset heart rating
  resetHeartRating();
  // 7. reset timer
  stopTimer();
  sec = 0;
  min = 0;
  minutes.innerHTML = "00";
  seconds.innerHTML = "00";
  clicks = 0;
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function flipCard(e) {
  // 1. flip card and check for match
  const thisCard = e.target;
  if (thisCard.className === "card") {
    thisCard.classList.add("open", "show");
    checkForMatch(e);
  }
  // 2. start timer when first card is clicked
  clicks++;
  if (clicks === 1) {
    setTimer();
  }
}

function checkForMatch(e) {
  // 1. add to open cards array and check for match
  openCards.push(e.target);
  if (openCards.length === 2) {
    moveCounter();
    if (openCards[0].innerHTML === openCards[1].innerHTML) {
      openCards[0].classList.add("match");
      openCards[1].classList.add("match");
      // 2. add match to matches array
      matches = [...matches, ...openCards];
      // 3. empty open cards and check for winner
      emptyOpenCards();
      verifyWinner();
    } else {
      notMatch();
    }
  }
}

function emptyOpenCards() {
  openCards = [];
}

function notMatch() {
  // 1. disable cards for animation
  disableCards();
  openCards[0].classList.add("incorrect");
  openCards[1].classList.add("incorrect");
  // 2. animate wobble after flipInY
  setTimeout(function() {
    openCards[0].classList.add("wobble");
    openCards[1].classList.add("wobble");
  }, 500);
  // 3. reset cards after wobble animation
  setTimeout(function() {
    openCards[0].classList.remove("open", "show", "incorrect", "wobble");
    openCards[1].classList.remove("open", "show", "incorrect", "wobble");
    enableCards();
    emptyOpenCards();
  }, 1000);
  // 4. update rating
  heartRating();
}

function moveCounter() {
  moves++;
  counter.innerHTML = moves;
}

function heartRating() {
  incorrectGuess++;
  let heartNumber = incorrectGuess / 4;
  if (incorrectGuess % 4 === 0 && heartNumber <= 4) {
    hearts.children[4 - heartNumber].classList.add("inactive");
  }
}

function resetHeartRating() {
  hearts.innerHTML = `<i class="fa fa-heart"></i>
  <i class="fa fa-heart"></i>
  <i class="fa fa-heart"></i>
  <i class="fa fa-heart"></i>`;
}

function disableCards() {
  for (const card of cards) {
    card.classList.add("disabled");
  }
}

function enableCards() {
  for (const card of cards) {
    card.classList.remove("disabled");
  }
}

function verifyWinner() {
  if (matches.length === 16) {
    // 1. stop timer
    stopTimer();
    // 2. populate and show modal
    let heartCount = hearts.innerHTML;
    let timeCount = document
      .querySelector(".timer")
      .innerText.split("\n")
      .join("");
    document.querySelector(".modal-rating").innerHTML = heartCount;
    document.querySelector(".modal-moves").innerHTML = moves;
    document.querySelector(".modal-time").innerHTML = timeCount;
    setTimeout(toggleModal, 750);
  }
}

function toggleModal() {
  if (modal.classList.contains("visible")) {
    modal.classList.remove("visible");
    body.classList.remove("modal-open");
    setTimeout(function() {
      modal.classList.remove("display");
    }, 500);
  } else {
    modal.classList.add("visible", "display");
    body.classList.add("modal-open");
  }
}

function playAgain() {
  toggleModal();
  newGame();
}

function setTimer() {
  timer = setInterval(function() {
    sec++;
    sec = sec % 60;
    seconds.innerHTML = pad(sec);
    if (sec == 0) {
      min++;
      min = min % 100; // reset to 0 if timer exceeds 99 min
    }
    minutes.innerHTML = pad(min);
  }, 1000);
}

// add "0" before second/minute
function pad(val) {
  if (val < 10) {
    return "0" + val;
  } else {
    return val;
  }
}

function stopTimer() {
  clearInterval(timer);
}
