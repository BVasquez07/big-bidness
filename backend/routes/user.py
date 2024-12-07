from config import supabase
import logging
from flask import jsonify, request

#this gets the user info 
def personalinfo():
    try:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401
        user_response = supabase.auth.get_user(token)

        if not user_response or not hasattr(user_response, "user") or not user_response.user:
            return jsonify({"error": "Authentication failed"}), 401

        user = user_response.user
        email = user.email

        user_query = supabase.table("users").select("*").eq("email", email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"user": user_query.data[0]}), 200
    except Exception as e:
        logging.error(f"Error getting user: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
#gets any user info the user clicks ons
def userinfo():
    try:
        username = request.args.get("username")
        if not username:
            return jsonify({"error": "Username is required"}), 400

        user_query = supabase.table("users").select("*").eq("username", username).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"user": user_query.data[0]}), 200
    except Exception as e:
        logging.error(f"Error getting user: {str(e)}")
        return jsonify({"error": str(e)}), 500
