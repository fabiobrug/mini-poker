from flask import Blueprint, render_template, request
from utils import give_deck
import random

views = Blueprint(__name__, "views")

@views.route("/")
def home():

    deck = give_deck()
    cards = random.sample(deck, 2)
    card1 = cards[0]
    card2 = cards[1]
    tableCards = random.sample(deck, 3)
    flop1 = tableCards[0]
    flop2 = tableCards[1]
    flop3 = tableCards[2]
    


    return render_template(
        "index.html",
        card1=card1["value"],
        suit1=card1["suit"],
        color1=card1["color"],
        card2=card2["value"],
        suit2=card2["suit"],
        color2=card2["color"],
        flop1=flop1["value"],
        flop1_suit=flop1["suit"],
        flop1_color=flop1["color"],
        flop2=flop2["value"],
        flop2_suit=flop2["suit"],
        flop2_color=flop2["color"],
        flop3=flop3["value"],
        flop3_suit=flop3["suit"],
        flop3_color=flop3["color"],
    )