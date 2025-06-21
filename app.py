from flask import Flask, session
from views import views

app = Flask(__name__)
app.register_blueprint(views, url_prefix="/")
app.secret_key = "127060"


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)