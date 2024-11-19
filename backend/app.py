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



        
@app.route("/signup", methods=["POST"]) 
def signup():
    try:

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
        if username_check.data:
            return jsonify({"error": "Username is taken"}), 400

        email_check = supabase.table("users").select("email").eq("email", email).execute()
        if email_check.data:
            return jsonify({"error": "Email is already being used"}), 400

        new_user = supabase.table("users").insert({
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "username": username,
            "password": password,
            "role": role,
            "vipstatus": vipstatus,
            "accountbalance": accountbalance,
            "suspensioncount": suspensioncount,
            "rating": rating
        }).execute()

        if hasattr(new_user, 'error') and new_user.error:
            return jsonify({"error": new_user.error.message}), 500
        if not new_user.data:
            raise Exception("Failed to insert new user. No data returned.")

        new_userid = new_user.data[0].get("userid")
        if not new_userid:
            raise Exception("Failed to retrieve userid for the new user.")


        approval_response = supabase.table("approvals").insert({
            "userid": new_userid,
            "applicationdetails": "Approval Pending", 
            "approvedby": None
        }).execute()


        logging.debug(f"Approval Response: {approval_response}")

        if hasattr(approval_response, 'error') and approval_response.error:
            return jsonify({"error": approval_response.error.message}), 500
        if not approval_response.data:
            raise Exception("Failed to insert approval entry. No data returned.")


        return jsonify({"message": "User signed up successfully and is awaiting approval."}), 200

    except Exception as e:
        logging.error(f"Error during signup: {str(e)}")
        return jsonify({"error": str(e)}), 500
    






if __name__ == "__main__":
    app.run(host="localhost", debug=True, port=8080)
