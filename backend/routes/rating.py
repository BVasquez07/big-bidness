from flask import jsonify
from config import supabase
import logging
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
import logging
from datetime import datetime
from routes.suspened import issuspended





def rating():
    try:
        query=request.json
        rating=query.get("rating")
        username=query.get("username")

        if rating is None:
            return jsonify({"error": "Rating is required"}), 400
        if not username:
            return jsonify({"error": "Username is required"}), 400

        user_response = supabase.table("users").select("*").eq("username", username).execute()
        if not user_response.data or len(user_response.data) == 0:
            return jsonify({"error": "User not found"}), 404
        userid = user_response.data[0]["userid"]
        now=datetime.now()
        today=now.date().isoformat()
        current_time=now.time().isoformat() 

        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401

        user_response=supabase.auth.get_user(token)
        if not user_response or not hasattr(user_response, "user") or not user_response.user:
            return jsonify({"error": "Authentication failed"}), 401

        user=user_response.user
        email=user.email

        user_query = supabase.table("users").select("userid").eq("email", email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404
        
        #needs to check who is rating it 
        ratedby= user_query.data[0]["userid"]

        #inserts in rating table
        rating_result=supabase.table("ratings").insert({
            "userid": userid, 
            "rating":rating,
            "ratedby":ratedby,
            "created_at":current_time,
            "created_date":today

        }).execute()


        suspension_query=supabase.table("user_suspensions").select("suspended_date", "suspended_at", "is_suspended").eq("userid", userid).execute()

        if not suspension_query.data or len(suspension_query.data) == 0:
            insert_suspension = supabase.table("user_suspensions").insert({
                "userid": userid,
                "is_suspended": False,
                "suspended_at": current_time,
                "suspended_date": today
            }).execute()
            if not insert_suspension.data or len(insert_suspension.data) == 0:
                return jsonify({"error": "Failed to insert suspension for this user"}), 500
        
        is_suspended=issuspended(userid,suspension_query,current_time,today)
        if is_suspended:
            logging.info("User has been suspended.")

        #updates usertable
        total_ratings_query=supabase.table("ratings").select("*").eq("userid", userid).execute()
        all_ratings = []
        for r in total_ratings_query.data:
            all_ratings.append(r["rating"])
        
        if len(all_ratings)!=0:
            total_avg= sum(all_ratings)/len(all_ratings)
        else:
            total_avg=0



        rating_update=supabase.table("users").update({"rating":total_avg}).eq("userid", userid).execute()
        if "error" in rating_update or not rating_update.data:
            return jsonify({"error":"Failed to update  status"}), 500


        return jsonify({"message": "Review posted successfully"}), 201

    except Exception as e:
        logging.error(f"Error posting posting review: {str(e)}")
        return jsonify({"error": str(e)}), 500