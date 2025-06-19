from flask import Blueprint, render_template, request
from utils import give_card

views = Blueprint(__name__, "views")

@views.route("/")
def home():

    card1 = give_card()
    card2 = give_card()

    return render_template(
        "index.html",
        card1=card1["value"],
        suit1=card1["suit"],
        color1=card1["color"],
        card2=card2["value"],
        suit2=card2["suit"],
        color2=card2["color"]
    )