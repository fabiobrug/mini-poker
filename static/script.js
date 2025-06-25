let btnBet =  document.getElementById("btnBet")

const turnCard = document.getElementById('turn-card');

let pot = document.getElementById("potQnt")

let minus = document.getElementById("minus")
let plus =  document.getElementById("plus")

let value = document.getElementById("value")
let chipQnt = document.getElementById("chipQnt")


let currentValue = parseInt(value.innerText)
let currentChip = parseInt(chipQnt.innerText)

minus.disabled = true;

let iaChips = 640

function minValue(){
    if (currentValue <= 20){
        minus.disabled = true;
    }
}

function maxValue(){
    if (currentValue == currentChip + currentValue){
        plus.disabled = true;
    }
}


minus.addEventListener('click', () => {
    plus.disabled = false;
    currentChip = currentValue/2 + currentChip;
    currentValue = currentValue/2
    chipQnt.innerHTML = currentChip;
    value.innerHTML = currentValue;
    minValue()
})

plus.addEventListener('click', () => { 
    minus.disabled = false;
    currentChip = currentChip - currentValue;
    currentValue += currentValue;
    chipQnt.innerHTML = currentChip;
    value.innerHTML = currentValue;
    maxValue()
})

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

btnBet.addEventListener('click', async (event) => {
    event.preventDefault();

    const iaBet =  randomIaValue();
    let potQnt = currentValue + iaBet
    currentChip = currentChip - currentValue;
    chipQnt.innerHTML = currentChip;
    currentValue = 20;
    value.innerHTML = currentValue
    minValue()
    pot.innerHTML = `Pot: ${potQnt}`;

    const response = await fetch('/bet', { method: 'POST' });
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
})
