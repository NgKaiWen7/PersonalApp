from database import init_db
from flask import Flask

app = Flask(__name__)
init_db()


@app.get("/")
def index():
    return "Hello, Flask!"


if __name__ == "__main__":
    app.run(debug=True)
