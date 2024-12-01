from flask import jsonify
from config import supabase
import logging
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
import logging
from datetime import datetime



def getsuspended():
    try:
       
        suspended=supabase.table("user_suspensions").select("*").eq("is_suspended",True).execute()

       
        if suspended.data:
            return jsonify({"Suspended": suspended.data}), 200
        else:
            return jsonify({"Suspended": []}), 200

    except Exception as e:
        logging.error(f"Error fetching suspended: {str(e)}")
        return jsonify({"error": str(e)}), 500

def updatesuspended():
    try:
        query=request.json
        card=query.get("card")
        date=query.get("date")
        cvv=query.get("cvv")
        email=query.get("email")
        password=query.get("password")

        if not card or not date or not cvv:
            return jsonify({"error": "Fill in all information"}), 400

        if not email or not password:
            return jsonify({"error": "Please provide email and password"}), 400

        #uses supabase authorization to login as this gives a acccess token
        user_response=supabase.auth.sign_in_with_password({"email": email, "password": password})

        if not user_response or not hasattr(user_response, 'user') or not user_response.user:
            return jsonify({"error": "Authentication failed"}), 401

        user=user_response.user
        email = user.email  

        user_query=supabase.table("users").select("userid").eq("email", email).execute()
        user_data=user_query.data

        if not user_data:
            return jsonify({"error": "Seller not found"}), 404

        userid=user_data[0]["userid"]


        user_response = supabase.table("users").select("*").eq("userid", userid).execute()
        if not user_response.data or len(user_response.data) == 0:
            return jsonify({"error": "User not found"}), 404
        userid = user_response.data[0]["userid"]
        now=datetime.now()
        today=now.date().isoformat()
        current_time=now.time().isoformat() 

        update_suspension = supabase.table("user_suspensions").update({
            "is_suspended": False,
            "suspended_at": current_time,
            "suspended_date": today
            }).eq("userid", userid).execute()
        if not update_suspension.data or len(update_suspension.data) == 0:
            return jsonify({"error": "Failed to update suspension for this user"}), 500

        return jsonify({"message": "50 dollars paid.You can sign in now"}), 200
    except Exception as e:
        logging.error(f"Error fetching suspended: {str(e)}")
        return jsonify({"error": str(e)}), 500