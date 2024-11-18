from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
if not url or not key:
    raise ValueError("Environment variables SUPABASE_URL or SUPABASE_KEY are not set.")
print(f"Supabase URL: {url}")
print(f"Supabase Key: {key}")

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

    username_check = supabase.table("users").select("username").eq("username", username).execute()
    email_check = supabase.table("users").select("email").eq("email", email).execute()


    if username_check.data:
        return jsonify({("error:Username is taken")}),400
    
    if email_check.data:
        return jsonify({("error:Email is already being used")}),400
    
    

    approval_check=supabase.table("approvals").select("userid").execute()

    if approval_check:
        return jsonify({"error": "Email is already awaiting approval."}), 400
    
    try:
        new_user= (
        supabase.table("admin")
        .insert({"firstname": firstname, "lastname":lastname, "email": email,"username": username, "password": password,
                "role":role, "vipstatus": vipstatus, "accountbalance": accountbalance,"suspensioncount":suspensioncount, "rating": rating })
        .execute()
)
        if new_user.error:
            return jsonify({"error": new_user.error.message}), 500

    
        new_userid = new_user.data[0]["userid"]


        approval_response = supabase.table("approvals").insert({"userID": new_userid,"applicationdetails":"Approval Pending","approvedby": None}).execute()

        if approval_response.error:
            return jsonify({"error": approval_response.error.message}), 500

        return jsonify({"message": "User signed up successfully and is awaiting approval."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "User signed up successfully and is awaiting approval."}), 200




if __name__ == "__main__":
    app.run(host="localhost", debug=True, port=8080)