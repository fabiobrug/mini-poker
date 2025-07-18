// Mesa
let tableEl = document.getElementById("tableEl");

// Sons
let flipSound = new Audio("static/sounds/flipcard-91468.mp3");
let foldSound = new Audio("static/sounds/carddrop2-92718.mp3");
let chipSound = new Audio("static/sounds/allinpushchips-96121.mp3");

// Botões principais de ação do jogador
let btnBet = document.getElementById("btnBet");
let btnCheck = document.getElementById("btnCheck");
let btnFold = document.getElementById("btnFold");

// Exibir na tela
let flopCards = document.querySelectorAll(".mesa-carta");
let betText = document.createElement("h3");
let checkText = document.createElement("h3");
let callText = document.createElement("h3");
let foldText = document.createElement("h3");

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
let maxChip;

//Valor atual da aposta e fichas do computador
let compChipQnt = document.getElementById("compChipQnt");
let currentCompChip = parseInt(compChipQnt.innerText);

// Carta do turn (será mostrada dinamicamente)
const turnCard = document.getElementById("turn-card");

// Estados de jogo
let preFlopTest = true;
let foldOn = true;
let turn = false;
let move = 1;
let flop = false;
let choice;

// Desativa o botão "-" inicialmente
minus.disabled = true;

// Fichas iniciais da IA
let iaChips = 640;
let iaBet;

// IA loading
let loading = document.getElementById("loading");

// Jogadas IA
let check = false;
let fold = false;
let bet = false;
let call = false;
let raise = false;

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
  let maxValue;

  maxValue = currentChip + currentValue;

  if (currentChip <= 0) {
    currentValue = maxValue;
    currentChip = 0;
    plus.disabled = true;
    btnBet.innerHTML = "All in";
  }
}

// Diminui a aposta pela metade
minus.addEventListener("click", () => {
  if (flop) {
    btnBet.innerHTML = "Raise";
  } else {
    btnBet.innerHTML = "Bet";
  }
  plus.disabled = false;
  currentChip = currentValue / 2 + currentChip;
  currentValue = currentValue / 2;
  chipQnt.innerHTML = Math.floor(currentChip);
  value.innerHTML = Math.floor(currentValue);
  minValue();
});

// Dobra o valor da aposta
plus.addEventListener("click", () => {
  minus.disabled = false;
  currentChip = currentChip - currentValue;
  currentValue += currentValue;
  maxValue();
  chipQnt.innerHTML = Math.floor(currentChip);
  value.innerHTML = Math.floor(currentValue);
});

// Simula o valor da aposta da IA com base em chance
function randomIaValue() {
  let choice;

  const valueOptions65 = [Math.floor(currentCompChip / 16)];
  const valueOptions20 = [
    Math.floor(currentCompChip / 8),
    Math.floor(currentCompChip / 4),
  ];
  const valueOptions10 = Math.floor(currentCompChip / 2);
  const valueOptions5 = currentCompChip;

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

// Jogadas no turn
/*function turn(){
  
}*/

// Jogadas flop

// Controla a ativação do botão Fold (desativa após o jogador apostar)
function foldTest() {
  if (flop) {
    currentCompChip = potQnt + currentCompChip;
    compChipQnt.innerHTML = currentCompChip;
    btnCheck.style.opacity = 1;
    btnCheck.innerHTML = "Check";
    btnBet.innerHTML = "Bet";
    pot.innerHTML = `Pot :`;
    playerValue.innerHTML = `Player :`;
    iaValue.innerHTML = `Computer :`;
    betText.innerHTML = "";
    btnFold.disabled = false;
    btnFold.style.backgroundColor = " #E74C3C";
    flopCards.forEach((el) => {
      el.classList.add("mesa-carta");
      el.classList.remove("mesa-cartaPos");
      btnCheck.style.opacity = 0;
    });
    flop = false;
  }
  if (foldOn) {
    btnFold.disabled = true;
    btnFold.style.backgroundColor = "gray";
    pot.innerHTML = `Pot :`;
    playerValue.innerHTML = `Player :`;
    iaValue.innerHTML = `Computer :`;
    flopCards.forEach((el) => {
      el.classList.add("mesa-carta");
      el.classList.remove("mesa-cartaPos");
      btnCheck.style.opacity = 0;
    });
  } else {
    btnFold.disabled = false;
    btnFold.style.backgroundColor = " #E74C3C";
  }
}

async function iaPlay() {
  const response = await fetch("/fold", { method: "POST" });
  const data = await response.json();

  const iaCard1 = data.ia_cards[0];
  const iaCard2 = data.ia_cards[1];

  //Para esse primeiro caso, mais para frente adicionar resposta da IA com base na quantidade de fichas apostadas pelo jogador tambem!!!
  if (move == 1) {
    if (iaCard1.value == iaCard2.value) {
      const luck = Math.random();

      if (luck < 0.6) {
        call = true;
      } else if (luck < 0.95) {
        raise = true;
      } else {
        fold = true;
      }
    } else if (
      ["A", "K", "Q", "J", "10"].includes(iaCard1.value) &&
      ["A", "K", "Q", "J", "10"].includes(iaCard2.value)
    ) {
      const luck = Math.random();

      if (luck < 0.6) {
        call = true;
      } else if (luck < 0.9) {
        raise = true;
      } else {
        fold = true;
      }
    } else if (
      (["A", "K", "Q", "J", "10"].includes(iaCard1.value) &&
        ["9", "8", "7", "6", "5", "4", "3", "2"].includes(iaCard2.value)) ||
      (["A", "K", "Q", "J", "10"].includes(iaCard2.value) &&
        ["9", "8", "7", "6", "5", "4", "3", "2"].includes(iaCard1.value))
    ) {
      const luck = Math.random();

      if (luck < 0.5) {
        call = true;
      } else if (luck < 0.7) {
        raise = true;
      } else {
        fold = true;
      }
    } else if (
      ["9", "8", "7", "6", "5", "4", "3", "2"].includes(iaCard1.value) &&
      ["9", "8", "7", "6", "5", "4", "3", "2"].includes(iaCard2.value)
    ) {
      const luck = Math.random();

      if (luck < 0.2) {
        call = true;
      } else if (luck < 0.4) {
        raise = true;
      } else {
        fold = true;
      }
    } else {
      call = true;
    }

    if (call) {
      choice = "call";
      return choice;
    } else if (raise) {
      choice = "raise";
      return choice;
    } else if (fold) {
      choice = "fold";
      return choice;
    }

    return choice;
  } else {
    if (iaCard1.value == iaCard2.value) {
      const luck = Math.random();

      if (luck < 0.6) {
        check = true;
      } else if (luck < 0.95) {
        bet = true;
      } else {
        fold = true;
      }
    } else if (
      ["A", "K", "Q", "J", "10"].includes(iaCard1.value) &&
      ["A", "K", "Q", "J", "10"].includes(iaCard2.value)
    ) {
      const luck = Math.random();

      if (luck < 0.6) {
        check = true;
      } else if (luck < 0.9) {
        bet = true;
      } else {
        fold = true;
      }
    } else if (
      (["A", "K", "Q", "J", "10"].includes(iaCard1.value) &&
        ["9", "8", "7", "6", "5", "4", "3", "2"].includes(iaCard2.value)) ||
      (["A", "K", "Q", "J", "10"].includes(iaCard2.value) &&
        ["9", "8", "7", "6", "5", "4", "3", "2"].includes(iaCard1.value))
    ) {
      const luck = Math.random();

      if (luck < 0.5) {
        check = true;
      } else if (luck < 0.7) {
        bet = true;
      } else {
        fold = true;
      }
    } else if (
      ["9", "8", "7", "6", "5", "4", "3", "2"].includes(iaCard1.value) &&
      ["9", "8", "7", "6", "5", "4", "3", "2"].includes(iaCard2.value)
    ) {
      const luck = Math.random();

      if (luck < 0.2) {
        check = true;
      } else if (luck < 0.4) {
        bet = true;
      } else {
        fold = true;
      }
    } else {
      check = true;
    }

    if (bet) {
      choice = "bet";
      return choice;
    } else if (fold) {
      choice = "fold";
      return choice;
    } else if (check) {
      choice = "check";
      return choice;
    }

    return choice;
  }
}

function iaPlayBet() {
  // Calcula apostas e atualiza pot
  iaBet = randomIaValue();
  currentCompChip = currentCompChip - iaBet;
  compChipQnt.innerHTML = currentCompChip;
  potQnt = currentValue + iaBet;
  //currentChip = currentChip - currentValue;
  currentChip = currentChip - 20;
  chipQnt.innerHTML = currentChip;
  pot.innerHTML = `Pot: ${potQnt}`;
  playerValue.innerHTML = `Player: ${currentValue}`;
  iaValue.innerHTML = `Computer: ${iaBet}`;

  // Reinicia aposta mínima para próxima jogada
  currentValue = 20;
  value.innerHTML = currentValue;
  minValue();

  let call = iaBet - currentValue;
  iaValue.innerHTML = `Computer: ${iaBet}`;
  betText.classList.add("cab4_active");
  betText.innerHTML = `Computer Bet <strong>${iaBet}<strong>!`;
  tableEl.appendChild(betText);
  btnCheck.innerHTML = `Call (${call})`;
  btnBet.innerHTML = "Raise";
  potQnt = potQnt + iaBet;
  pot.innerHTML = `Pot: ${potQnt}`;
  currentCompChip = currentCompChip;
  compChipQnt.innerHTML = currentCompChip;
  move++;
}

function iaPlayRaise() {
  iaBet = randomIaValue();
  betText.classList.add("cab4_active");
  betText.innerHTML = `Computer Raise to <strong>${iaBet}<strong>!`;
  tableEl.appendChild(betText);

  setTimeout(async () => {
    chipSound.play();

    if (iaBet > currentValue) {
      currentCompChip = currentCompChip - iaBet;
      compChipQnt.innerHTML = currentCompChip;

      potQnt = currentValue + iaBet;
      //currentChip = currentChip - currentValue;
      currentChip = currentChip - 20;
      chipQnt.innerHTML = currentChip;
      pot.innerHTML = `Pot: ${potQnt}`;
      playerValue.innerHTML = `Player: ${currentValue}`;
      iaValue.innerHTML = `Computer: ${iaBet}`;

      // Reinicia aposta mínima para próxima jogada
      currentValue = 20;
      value.innerHTML = currentValue;
      minValue();

      let call = iaBet - currentValue;
      btnCheck.innerHTML = `Call (${call})`;
      btnBet.innerHTML = "Raise";
      currentCompChip = currentCompChip;
      compChipQnt.innerHTML = currentCompChip;
      move++;
      betText.style.opacity = 0;
    } else {
      iaPlayCall();
    }
  }, 1500);
}

function iaPlayCall() {
  callText.classList.add("cab4_active");
  callText.innerHTML = "Computer Call!";

  tableEl.appendChild(callText);
   
       
  setTimeout(async () => {
    chipSound.play();
    currentChip = currentChip - currentValue;
    currentCompChip = currentCompChip - currentValue;
    chipQnt.innerHTML = currentChip;
    compChipQnt.innerHTML = currentCompChip;
    potQnt = currentValue * 2;

    pot.innerHTML = `Pot: ${potQnt}`;
    playerValue.innerHTML = `Player: ${currentValue}`;
    iaValue.innerHTML = `Computer: ${currentValue}`;
    callText.style.opacity = 0;

    flop = false;
      setTimeout(async () =>{
          flipSound.play()
          turnMove();
        }, 1000)
        
  }, 1500);

  move++;
  return;
}

function iaPlayCheck() {
  //--------------VAI PRECISAR SER REFORMULADO!!!!!!!!-------------
  checkText.innerHTML = "Computer Check!";
  setTimeout(async () => {
    currentChip = currentChip - currentValue;
    currentCompChip = currentCompChip - currentValue;
    chipQnt.innerHTML = currentChip;
    compChipQnt.innerHTML = currentCompChip;
    potQnt = currentValue * 2;

    pot.innerHTML = `Pot: ${potQnt}`;
    playerValue.innerHTML = `Player: ${currentValue}`;
    iaValue.innerHTML = `Computer: ${currentValue}`;

    flop = false;
  }, 1500);
  move++;
  return;
}

function iaPlayFold() {
  foldText.style.opacity = 1;
  foldText.classList.add("cab4_active");
  foldText.innerHTML = `Computer Fold!`;
  tableEl.appendChild(foldText);

  setTimeout(async () => {
    foldSound.play();
    currentChip = currentChip;
    chipQnt.innerHTML = currentChip;
    btnCheck.style.opacity = 0;
    btnCheck.innerHTML = "Check";
    btnBet.innerHTML = "Bet";
    pot.innerHTML = `Pot :`;
    playerValue.innerHTML = `Player :`;
    iaValue.innerHTML = `Computer :`;
    betText.innerHTML = "";
    btnFold.disabled = false;
    btnFold.style.backgroundColor = " #E74C3C";
    foldText.style.opacity = 0;
    flopCards.forEach((el) => {
      el.classList.add("mesa-carta");
      el.classList.remove("mesa-cartaPos");
    });
    flop = false;
  }, 1500);
}

async function turnMove(){
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
        turnCard.style.opacity = 1;
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
}

// =======================
// Evento: Jogador aposta (BET)
// =======================
btnBet.addEventListener("click", async (event) => {
  chipSound.play();
  event.preventDefault();
  // Jogador apostou, então não pode mais dar fold
  foldOn = false;
  foldTest();

  // Ativa visual do botão Check
  btnCheck.style.opacity = 1;

  // Mostra cartas comunitárias viradas (flop)
  flopCards.forEach((el) => {
    el.classList.add("mesa-cartaPos");
  });

  // All in
  if (currentChip == 0) {
    btnBet.disabled = true;
    btnCheck.disabled = true;
    btnFold.disabled = true;
    btnBet.style.backgroundColor = "gray";
    btnCheck.style.backgroundColor = "gray";
    btnFold.style.backgroundColor = "gray";
  } else if (move == 1) {
    flop = true;
    loading.classList.add("cab4_active");
    btnBet.disabled = true;
    btnCheck.disabled = true;
    btnFold.disabled = true;
    setTimeout(async () => {
      btnBet.disabled = false;
      btnCheck.disabled = false;
      btnFold.disabled = false;
      loading.classList.remove("cab4_active");
      loading.classList.add("cab4");
      await iaPlay();

      if (call) {
        iaPlayCall();
      } else if (raise) {
        iaPlayRaise();
      } else if (fold) {
        iaPlayFold();
        fold = false;
      }

      ////////////////////////////////////////
      /* if (bet) {
        iaPlayBet();
      } else if (check) {
        iaPlayCheck();
      } else if (fold) {
        iaPlayFold();
      } */ //-----------------------CASO JOGADOR APERTE CHECK!!!!!!!!

      //////////////////////////////////////////
    }, 1000);
  } else if (move == 2) {
return
    
  } else if (move == 3) {
    return;
  }

  // (espaço para lógica do river ou showdown futuramente)
});

// =======================
// Evento: Jogador passa (CHECK)
// =======================

async function checkPlay() {}

// =======================
// Evento: Jogador desiste (FOLD)
// =======================

async function foldPlay() {
  foldSound.play();
  const response = await fetch("/fold", { method: "POST" });
  const data = await response.json();

  // Seleciona elementos onde as cartas serão exibidas
  const playerCard1 = document.getElementById("card1El");
  const playerCard2 = document.getElementById("card2El");
  const flopCard1 = document.getElementById("flop1");
  const flopCard2 = document.getElementById("flop2");
  const flopCard3 = document.getElementById("flop3");

  // Limpa cartas anteriores
  playerCard1.innerHTML = "";
  playerCard2.innerHTML = "";
  flopCard1.innerHTML = "";
  flopCard2.innerHTML = "";
  flopCard3.innerHTML = "";

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

  // Renderiza carta 1 do flop
  const flop1 = data.flop_cards[0];
  const div3 = document.createElement("div");
  div3.classList.add("tableCards");
  div3.innerHTML = `<span class="value">${flop1.value}</span>
                    <span class="suit ${flop1.color}">${flop1.suit}</span>`;
  flopCard1.appendChild(div3);

  // Renderiza carta 2 do flop
  const flop2 = data.flop_cards[1];
  const div4 = document.createElement("div");
  div4.classList.add("tableCards");
  div4.innerHTML = `<span class="value">${flop2.value}</span>
                    <span class="suit ${flop2.color}">${flop2.suit}</span>`;
  flopCard2.appendChild(div4);

  // Renderiza carta 3 do flop
  const flop3 = data.flop_cards[2];
  const div5 = document.createElement("div");
  div5.classList.add("tableCards");
  div5.innerHTML = `<span class="value">${flop3.value}</span>
                    <span class="suit ${flop3.color}">${flop3.suit}</span>`;
  flopCard3.appendChild(div5);

  if (!flop) {
    foldOn = true;
  }
  foldTest(); // desativa botão fold novamente
}

btnFold.addEventListener("click", async (event) => {
  event.preventDefault();

  foldPlay();
});

 

   

btnCheck.addEventListener("click", async (event) => {
  event.preventDefault();
    console.log("Bet:", bet);
    console.log("Check:", check);
    console.log("Call:", call);
    console.log("Raise:", raise);
    console.log("Fold:", fold);
  checkPlay()
   if (call) {
      turnMove();
   
    }
        
   });
      