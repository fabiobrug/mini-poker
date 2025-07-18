from flask import Blueprint, render_template, request, session, redirect, url_for, jsonify
from utils import give_deck
import random

views = Blueprint(__name__, "views")

@views.route("/")
def home():

    deck = give_deck()
    random.shuffle(deck)
    session["deck"] = deck

    card1 = session["deck"].pop()
    card2 = session["deck"].pop() 
    ia_card1 = session["deck"].pop()
    ia_card2 = session["deck"].pop()

    flop = [session["deck"].pop(), session["deck"].pop(), session["deck"].pop()]
    session["flop"] = flop

    
    session["card1"] = card1
    session["card2"] = card2
    session["ia_card1"] = ia_card1
    session["ia_card2"] = ia_card2
    
    
    return render_template(
        "index.html",
        card1=card1["value"],
        suit1=card1["suit"],
        color1=card1["color"],
        card2=card2["value"],
        suit2=card2["suit"],
        color2=card2["color"],
        flop1=flop[0]["value"],
        flop1_suit=flop[0]["suit"],
        flop1_color=flop[0]["color"],
        flop2=flop[1]["value"],
        flop2_suit=flop[1]["suit"],
        flop2_color=flop[1]["color"],
        flop3=flop[2]["value"],
        flop3_suit=flop[2]["suit"],
        flop3_color=flop[2]["color"],
        ia_card1=ia_card1["value"],
        ia_suit1=ia_card1["suit"],
        ia_color1=ia_card1["color"],
        ia_card2=ia_card2["value"],
        ia_suit2=ia_card2["suit"],
        ia_color2=ia_card2["color"],
        turn=None
    )

@views.route("/bet", methods=["POST"])
def bet():
    deck = session.get("deck", [])
    
    if len(deck) == 0:
        return redirect(url_for("views.home"))
    
    flop = session.get("flop", [])
    card1 = session.get("card1")
    card2 = session.get("card2")
    ia_card1 = session.get("ia_card1")
    ia_card2 = session.get("ia_card2")

    if "turn" in session:
        turn = session["turn"]
    else:
        turn = deck.pop()
        session["deck"] = deck
        session["turn"] = turn

    return jsonify(
        card1=card1["value"],
        suit1=card1["suit"],
        color1=card1["color"],
        card2=card2["value"],
        suit2=card2["suit"],
        color2=card2["color"],

        flop1=flop[0]["value"],
        flop1_suit=flop[0]["suit"],
        flop1_color=flop[0]["color"],
        flop2=flop[1]["value"],
        flop2_suit=flop[1]["suit"],
        flop2_color=flop[1]["color"],
        flop3=flop[2]["value"],
        flop3_suit=flop[2]["suit"],
        flop3_color=flop[2]["color"],

        ia_card1=ia_card1["value"],
        ia_suit1=ia_card1["suit"],
        ia_color1=ia_card1["color"],
        ia_card2=ia_card2["value"],
        ia_suit2=ia_card2["suit"],
        ia_color2=ia_card2["color"],

        turn=turn,
    )

@views.route("/fold", methods=["POST"])
def fold():
    deck = give_deck()
    random.shuffle(deck)

    if len(deck) < 0:
        return jsonify({"error": "Deck vazio"}), 400
    
    card1 = session["deck"].pop()
    card2 = session["deck"].pop()
    ia_card1 = session["deck"].pop()
    ia_card2 = session["deck"].pop()
    flop_card1 = session["deck"].pop()
    flop_card2 = session["deck"].pop()
    flop_card3 = session["deck"].pop()
    session["deck"] = deck

    return jsonify( 
        player_cards=[
            {
                "value": card1["value"],
                "suit": card1["suit"],
                "color": card1["color"],
            },
            {
                "value": card2["value"],
                "suit": card2["suit"],
                "color": card2["color"],
            }
        ],
        ia_cards=[
            {
                "value": ia_card1["value"],
                "suit": ia_card1["suit"],
                "color": ia_card1["color"],
            },
            {
                "value": ia_card2["value"],
                "suit": ia_card2["suit"],
                "color": ia_card2["color"],
            }
        ],
        flop_cards=[
             {
                "value": flop_card1["value"],
                "suit": flop_card1["suit"],
                "color": flop_card1["color"],
            },
            {
                "value": flop_card2["value"],
                "suit": flop_card2["suit"],
                "color": flop_card2["color"],
            },
            {
                "value": flop_card3["value"],
                "suit": flop_card3["suit"],
                "color": flop_card3["color"],
            }
        ]
    )
