let btnBet = document.getElementById("btnBet");
let btnCheck = document.getElementById("btnCheck");
let btnFold = document.getElementById("btnFold");

let playerValue = document.getElementById("pla");
let iaValue = document.getElementById("comp");

let pot = document.getElementById("potQnt");

let minus = document.getElementById("minus");
let plus = document.getElementById("plus");

let value = document.getElementById("value");
let chipQnt = document.getElementById("chipQnt");

let currentValue = parseInt(value.innerText);
let currentChip = parseInt(chipQnt.innerText);

const turnCard = document.getElementById("turn-card");

let preFlopTest = true;

let foldOn = true;

minus.disabled = true;

let iaChips = 640;

function minValue() {
  if (currentValue <= 20) {
    minus.disabled = true;
  }
}

function maxValue() {
  if (currentValue == currentChip + currentValue) {
    plus.disabled = true;
  }
}

minus.addEventListener("click", () => {
  plus.disabled = false;
  currentChip = currentValue / 2 + currentChip;
  currentValue = currentValue / 2;
  chipQnt.innerHTML = currentChip;
  value.innerHTML = currentValue;
  minValue();
});

plus.addEventListener("click", () => {
  minus.disabled = false;
  currentChip = currentChip - currentValue;
  currentValue += currentValue;
  chipQnt.innerHTML = currentChip;
  value.innerHTML = currentValue;
  maxValue();
});

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


    function foldTest(){
        if(foldOn){
            btnFold.disabled = true;
            btnFold.style.backgroundColor = ("gray")
        }
        else{
            btnFold.disabled = false;
            btnFold.style.backgroundColor = (" #E74C3C")
        }
        
    }

    btnBet.addEventListener("click", async (event) => {
    event.preventDefault();

    foldOn = false;
    console.log(foldOn)
    foldTest();

    btnCheck.style.opacity = 1;
    let flopCards = document.querySelectorAll(".mesa-carta");
    flopCards.forEach((el) => {
        el.classList.add("mesa-cartaPos");
    });

    const iaBet = randomIaValue();
    let potQnt = currentValue + iaBet;
    chipQnt.innerHTML = currentChip;
    pot.innerHTML = `Pot: ${potQnt}`;
    playerValue.innerHTML = `Player: ${currentValue}`;
    iaValue.innerHTML = `Computer: ${iaBet}`;
    currentValue = 20;
    value.innerHTML = currentValue;
    minValue();

    const response = await fetch("/bet", { method: "POST" });
    const data = await response.json();

    if (data.turn) {
        const tableCards = document.getElementById("tableCardsEl");

        // Verifica se já existe o turn-card
        let turnCard = document.getElementById("turn-card");

        // Se não existe, cria e adiciona
        if (!turnCard) {
        turnCard = document.createElement("div");
        turnCard.classList.add("mesa-carta");
        turnCard.id = "turn-card";
        tableCards.appendChild(turnCard);
        }

        // Atualiza o conteúdo
        turnCard.innerHTML = `
                    <span class="value">${data.turn.value}</span>
                    <span class="suit ${data.turn.color}">${data.turn.suit}</span>
                `;
    }

    if(preFlopTest){
        
    }
    console.log(potQnt)
    });

        
    btnFold.addEventListener("click", async (event) => {
        event.preventDefault();

        const response = await fetch("/fold", { method: "POST" });
        const data = await response.json();

        console.log(data.player_cards, data.ia_cards);

        const playerCard1 = document.getElementById("card1El");
        const playerCard2 = document.getElementById("card2El");

        playerCard1.innerHTML = "";
        playerCard2.innerHTML = "";
        //precisa fazer a carta da IA tambem

        const card1 = data.player_cards[0];
        const card2 = data.player_cards[1];

        const div1 = document.createElement("div");
        div1.classList.add("player-cards")
        div1.innerHTML = `<span class="value">${card1.value}</span>
                            <span class="suit ${card1.color}">${card1.suit}</span>`;
        playerCard1.appendChild(div1);

        const div2 = document.createElement("div");
        div2.classList.add("player-cards")
        div2.innerHTML = `<span class="value">${card2.value}</span>
                            <span class="suit ${card2.color}">${card2.suit}</span>`;
        playerCard2.appendChild(div2);
        foldTest()
    });

//pre-flop



//flop

//turn

//river
