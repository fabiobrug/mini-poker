// Botões principais de ação do jogador
let btnBet = document.getElementById("btnBet");
let btnCheck = document.getElementById("btnCheck");
let btnFold = document.getElementById("btnFold");

// Exibição dos valores apostados
let playerValue = document.getElementById("pla");
let iaValue = document.getElementById("comp");
let pot = document.getElementById("potQnt");

let potQnt;

// Controle de aposta do jogador (botões + e -)
let minus = document.getElementById("minus");
let plus = document.getElementById("plus");

// Valor atual da aposta e fichas do jogador
let value = document.getElementById("value");
let chipQnt = document.getElementById("chipQnt");
let currentValue = parseInt(value.innerText);
let currentChip = parseInt(chipQnt.innerText);

//Valor atual da aposta e fichas do computador
let compChipQnt = document.getElementById("compChipQnt");
let currentCompChip = parseInt(compChipQnt.innerText);

// Carta do turn (será mostrada dinamicamente)
const turnCard = document.getElementById("turn-card");

// Estados de jogo
let preFlopTest = true;
let foldOn = true;
let turn = false;

// Desativa o botão "-" inicialmente
minus.disabled = true;

// Fichas iniciais da IA
let iaChips = 640;

// =======================
// Funções Auxiliares
// =======================

// Desativa o botão de diminuir aposta caso já esteja no mínimo
function minValue() {
  if (currentValue <= 20) {
    minus.disabled = true;
  }
}

// Desativa o botão de aumentar aposta quando chega no limite possível
function maxValue() {
  if (currentValue == currentChip + currentValue) {
    plus.disabled = true;
  }
}

// Diminui a aposta pela metade
minus.addEventListener("click", () => {
  plus.disabled = false;
  currentChip = currentValue / 2 + currentChip;
  currentValue = currentValue / 2;
  chipQnt.innerHTML = currentChip;
  value.innerHTML = currentValue;
  minValue();
});

// Dobra o valor da aposta
plus.addEventListener("click", () => {
  minus.disabled = false;
  currentChip = currentChip - currentValue;
  currentValue += currentValue;
  chipQnt.innerHTML = currentChip;
  value.innerHTML = currentValue;
  maxValue();
});

// Simula o valor da aposta da IA com base em chance
function randomIaValue() {
  let choice;

  const valueOptions65 = [20, 40];
  const valueOptions20 = [80, 160];
  const valueOptions10 = 320;
  const valueOptions5 = 640;

  const luck = Math.random();

  if (luck < 0.65) {
    const index = Math.floor(Math.random() * valueOptions65.length);
    choice = valueOptions65[index];
  } else if (luck < 0.85) {
    const index = Math.floor(Math.random() * valueOptions20.length);
    choice = valueOptions20[index];
  } else if (luck < 0.95) {
    choice = valueOptions10;
  } else {
    choice = valueOptions5;
  }

  return choice;
}

// Controla a ativação do botão Fold (desativa após o jogador apostar)
function foldTest() {
    if(foldOn && turn){
    btnFold.disabled = true;
    btnFold.style.backgroundColor = "gray";
    currentCompChip = potQnt + currentCompChip
    compChipQnt.innerHTML = currentCompChip;
    pot.innerHTML = `Pot:`;
    playerValue.innerHTML = `Player:`;
    iaValue.innerHTML = `Computer:`;
    }
    else if (foldOn && !turn) {
    btnFold.disabled = true;
    btnFold.style.backgroundColor = "gray";
  } else {
    btnFold.disabled = false;
    btnFold.style.backgroundColor = " #E74C3C";
  }
}

// =======================
// Evento: Jogador aposta (BET)
// =======================
btnBet.addEventListener("click", async (event) => {
  event.preventDefault();

  // Jogador apostou, então não pode mais dar fold
  foldOn = false;
  foldTest();

  // Ativa visual do botão Check
  btnCheck.style.opacity = 1;

  // Mostra cartas comunitárias viradas (flop)
  let flopCards = document.querySelectorAll(".mesa-carta");
  flopCards.forEach((el) => {
    el.classList.add("mesa-cartaPos");
  });

  // Calcula apostas e atualiza pot
  const iaBet = randomIaValue();
  console.log(compChipQnt)
  console.log(iaBet)
  currentCompChip = currentCompChip - iaBet;
  compChipQnt.innerHTML = currentCompChip;
  potQnt = currentValue + iaBet;
  chipQnt.innerHTML = currentChip;
  pot.innerHTML = `Pot: ${potQnt}`;
  playerValue.innerHTML = `Player: ${currentValue}`;
  iaValue.innerHTML = `Computer: ${iaBet}`;

  // Reinicia aposta mínima para próxima jogada
  currentValue = 20;
  value.innerHTML = currentValue;
  minValue();

  // Solicita carta do turn ao servidor
  const response = await fetch("/bet", { method: "POST" });
  const data = await response.json();

  // Se o servidor retornou carta do Turn, exibe na mesa
  if (data.turn) {
    const tableCards = document.getElementById("tableCardsEl");

    // Verifica se já existe o turn-card
    let turnCard = document.getElementById("turn-card");

    // Se não existe, cria o elemento
    if (!turnCard) {
      turnCard = document.createElement("div");
      turnCard.classList.add("mesa-carta");
      turnCard.id = "turn-card";
      tableCards.appendChild(turnCard);
    }

    // Atualiza conteúdo da carta do turn
    turnCard.innerHTML = `
      <span class="value">${data.turn.value}</span>
      <span class="suit ${data.turn.color}">${data.turn.suit}</span>
    `;
  }

  turn = true;

  // (espaço para lógica do river ou showdown futuramente)

  console.log(potQnt); // depuração
});

// =======================
// Evento: Jogador desiste (FOLD)
// =======================
btnFold.addEventListener("click", async (event) => {
  event.preventDefault();

  const response = await fetch("/fold", { method: "POST" });
  const data = await response.json();

  console.log(data.player_cards, data.ia_cards);

  // Seleciona elementos onde as cartas serão exibidas
  const playerCard1 = document.getElementById("card1El");
  const playerCard2 = document.getElementById("card2El");

  // Limpa cartas anteriores
  playerCard1.innerHTML = "";
  playerCard2.innerHTML = "";
  // (precisa ainda exibir cartas da IA)

  // Renderiza carta 1 do jogador
  const card1 = data.player_cards[0];
  const div1 = document.createElement("div");
  div1.classList.add("player-cards");
  div1.innerHTML = `<span class="value">${card1.value}</span>
                    <span class="suit ${card1.color}">${card1.suit}</span>`;
  playerCard1.appendChild(div1);

  // Renderiza carta 2 do jogador
  const card2 = data.player_cards[1];
  const div2 = document.createElement("div");
  div2.classList.add("player-cards");
  div2.innerHTML = `<span class="value">${card2.value}</span>
                    <span class="suit ${card2.color}">${card2.suit}</span>`;
  playerCard2.appendChild(div2);

  foldOn = true;
  foldTest(); // desativa botão fold novamente

});

// =======================
// Pré-flop, flop, turn e river (em desenvolvimento)
// =======================
// TODO: implementar lógica do flop, turn e river completos

