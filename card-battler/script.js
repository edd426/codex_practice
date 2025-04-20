const cards = [
  { name: 'Fox', emoji: '🦊', attack: 4, defense: 2 },
  { name: 'Bear', emoji: '🐻', attack: 2, defense: 5 },
  { name: 'Deer', emoji: '🦌', attack: 3, defense: 3 },
  { name: 'Rabbit', emoji: '🐇', attack: 1, defense: 1 },
  { name: 'Wolf', emoji: '🐺', attack: 5, defense: 3 },
  { name: 'Squirrel', emoji: '🐿️', attack: 2, defense: 2 }
];

let deck = [];
let playerHand = [];
let aiHand = [];
let playerScore = 0;
let aiScore = 0;
let round = 0;
let maxRounds = 0;
let gameStarted = false;

const playerScoreEl = document.getElementById('player-score');
const aiScoreEl = document.getElementById('ai-score');
const roundEl = document.getElementById('round');
const maxRoundsEl = document.getElementById('max-rounds');

const playerCardEmoji = document.querySelector('#player-card-content .emoji');
const playerAttackEl = document.getElementById('player-attack');
const playerDefenseEl = document.getElementById('player-defense');
const aiCardEmoji = document.querySelector('#ai-card-content .emoji');
const aiAttackEl = document.getElementById('ai-attack');
const aiDefenseEl = document.getElementById('ai-defense');

const drawButton = document.getElementById('draw-button');
const resetButton = document.getElementById('reset-button');
const resultEl = document.getElementById('round-result');

const playerHandEl = document.getElementById('player-hand');
const gameLogEl = document.getElementById('game-log');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateScores() {
  playerScoreEl.textContent = playerScore;
  aiScoreEl.textContent = aiScore;
  roundEl.textContent = round;
  maxRoundsEl.textContent = maxRounds;
}

function logMessage(msg) {
  const p = document.createElement('p');
  p.textContent = msg;
  gameLogEl.appendChild(p);
  gameLogEl.scrollTop = gameLogEl.scrollHeight;
}

function renderPlayerHand() {
  playerHandEl.innerHTML = '';
  playerHand.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('hand-card');
    cardDiv.innerHTML = `
      <span class="emoji">${card.emoji}</span>
      <div class="stats">
        <div>${card.name}</div>
        <div>ATK: ${card.attack}</div>
        <div>DEF: ${card.defense}</div>
      </div>
    `;
    cardDiv.addEventListener('click', () => handleCardClick(index));
    playerHandEl.appendChild(cardDiv);
  });
}

function startGame() {
  deck = [...cards, ...cards];
  shuffle(deck);
  playerHand = deck.splice(0, deck.length / 2);
  aiHand = deck.splice(0, deck.length);
  playerScore = 0;
  aiScore = 0;
  round = 0;
  maxRounds = playerHand.length;
  gameStarted = true;
  drawButton.disabled = true;
  resetButton.disabled = false;
  resultEl.textContent = '';
  gameLogEl.innerHTML = '';
  updateScores();
  renderPlayerHand();
  logMessage('Game started! Choose a card to play.');
}

function handleCardClick(index) {
  if (!gameStarted) return;

  const playerCard = playerHand.splice(index, 1)[0];
  const aiIndex = Math.floor(Math.random() * aiHand.length);
  const aiCard = aiHand.splice(aiIndex, 1)[0];

  // Display cards
  playerCardEmoji.textContent = playerCard.emoji;
  playerAttackEl.textContent = playerCard.attack;
  playerDefenseEl.textContent = playerCard.defense;
  aiCardEmoji.textContent = aiCard.emoji;
  aiAttackEl.textContent = aiCard.attack;
  aiDefenseEl.textContent = aiCard.defense;

  // Critical hit chance
  let playerAttackValue = playerCard.attack;
  let aiAttackValue = aiCard.attack;
  const playerCrit = Math.random() < 0.1;
  const aiCrit = Math.random() < 0.1;
  if (playerCrit) {
    playerAttackValue *= 2;
    logMessage(`💥 Your ${playerCard.name} lands a critical hit!`);
  }
  if (aiCrit) {
    aiAttackValue *= 2;
    logMessage(`💥 AI's ${aiCard.name} lands a critical hit!`);
  }

  const playerDamageToAi = Math.max(0, playerAttackValue - aiCard.defense);
  const aiDamageToPlayer = Math.max(0, aiAttackValue - playerCard.defense);

  let roundResult = '';
  if (playerDamageToAi > aiDamageToPlayer) {
    playerScore++;
    roundResult = 'You win this round!';
  } else if (aiDamageToPlayer > playerDamageToAi) {
    aiScore++;
    roundResult = 'AI wins this round!';
  } else {
    roundResult = 'This round is a tie!';
  }

  round++;
  updateScores();
  resultEl.textContent = roundResult;
  logMessage(`Round ${round}: You played ${playerCard.name} vs AI's ${aiCard.name}. ${roundResult}`);

  // Highlight winning card
  document.getElementById('player-card').classList.remove('winner');
  document.getElementById('ai-card').classList.remove('winner');
  if (playerDamageToAi > aiDamageToPlayer) {
    document.getElementById('player-card').classList.add('winner');
  } else if (aiDamageToPlayer > playerDamageToAi) {
    document.getElementById('ai-card').classList.add('winner');
  }

  renderPlayerHand();

  if (round >= maxRounds) {
    endGame();
  }
}

function endGame() {
  gameStarted = false;
  Array.from(playerHandEl.children).forEach(cardDiv => cardDiv.classList.add('disabled'));
  if (playerScore > aiScore) {
    logMessage('🎉 You win the game!');
  } else if (aiScore > playerScore) {
    logMessage('🤖 AI wins the game!');
  } else {
    logMessage("🤝 It's a tie game!");
  }
}

function resetGame() {
  deck = [];
  playerHand = [];
  aiHand = [];
  playerScore = 0;
  aiScore = 0;
  round = 0;
  maxRounds = 0;
  gameStarted = false;
  drawButton.disabled = false;
  resetButton.disabled = true;
  playerCardEmoji.textContent = '❔';
  playerAttackEl.textContent = '-';
  playerDefenseEl.textContent = '-';
  aiCardEmoji.textContent = '❔';
  aiAttackEl.textContent = '-';
  aiDefenseEl.textContent = '-';
  resultEl.textContent = '';
  roundEl.textContent = '0';
  maxRoundsEl.textContent = '0';
  playerScoreEl.textContent = '0';
  aiScoreEl.textContent = '0';
  playerHandEl.innerHTML = '';
  gameLogEl.innerHTML = '';
  document.getElementById('player-card').classList.remove('winner');
  document.getElementById('ai-card').classList.remove('winner');
}

drawButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);