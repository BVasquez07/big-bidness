from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return "Hello World!"



        
@app.route("/singup", methods=["POST"])
def singUp():

    query=request.json
    firstname=query.get("firstname")
    lastname=query.get("lastname")
    email=query.get("email")
    username=query.get("username")
    password=query.get("password")
    role=query.get("role", "User")
    vipstatus=query.get("vipstatus", False)
    accountbalance=query.get("accountbalance", 0.0)
    suspensioncount=query.get("suspensioncount", 0)
    rating=query.get("rating", 0.0)

    username_check =supabase.table("user").select("username").execute()
    email_check=supabase.table("user").select("email").execute()

    if username_check:
        return jsonify({("error:Username is taken")}),400
    
    if email_check:
        return jsonify({("error:Email is already being used")}),400
    
    

    approval_check=supabase.table("approvalid").select("userid").execute()

    if approval_check:
        return jsonify({"error": "Email is already awaiting approval."}), 400
    
    
    new_user=response = (
    supabase.table("admin")
    .insert({"firstname": firstname, "lastname":lastname, "email": email,"username": username, "password": password,
             "role":role, "vipstatus": vipstatus, "accountbalance": accountbalance,"suspensioncount":suspensioncount, "rating": rating })
    .execute()
)
    try:
        if response.error:
            return jsonify({"error": response.error}), 400

        return jsonify({"message": "Sign up successful!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    










if __name__ == "__main__":
    app.run(host="localhost", debug=True, port=8080)
