from flask import Flask

app = Flask(__name__)

# Storage API route
@app.route("/track", methods=['GET'])
def track():
  return "Server working"

if __name__ == "__main__":
  app.run(debug=True)