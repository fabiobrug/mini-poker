import random

cards = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]
blackSuits = ["♠", "♣"]
redSuits = ["♥", "♦"]
allSuits = blackSuits + redSuits

def give_card():
    value = random.choice(cards)
    suit = random.choice(allSuits)
    color = "red" if suit in redSuits else "black"
    return {"value": value, "suit": suit, "color": color}

def give_deck():
    deck = []
    for value in cards:
        for suit in allSuits:
            color = "red" if suit in redSuits else "black"
            deck.append({
                "value": value,
                "suit": suit,
                "color": color
            })
    return deck

def current_chip():
    currentChip = 640
    chip = currentChip
    