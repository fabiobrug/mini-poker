import random
from flask import Blueprint, render_template, request

views = Blueprint(__name__, "views")

cards = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]
blackSuits = ["♠", "♣"]
redSuits = ["♥", "♦"]
allSuits = blackSuits + redSuits


@views.route("/")
def home():

    card1 = random.choice(cards)
    suit1 = random.choice(allSuits)
    color1 = "red" if suit1 in redSuits else "black"


    card2 = random.choice(cards)
    suit2 = random.choice(allSuits)
    color2 = "red" if suit2 in redSuits else "black"
    
    return render_template("index.html", card1=card1, suit1=suit1, color1=color1, card2=card2, suit2=suit2, color2=color2)