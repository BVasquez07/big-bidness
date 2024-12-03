from flask import jsonify
from config import supabase
import logging
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
import logging
from datetime import datetime
from routes.suspened import issuspended
from routes.auth import access_token




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
        print(userid)
        now=datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        email=access_token()

        user_query = supabase.table("users").select("userid").eq("email", email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404
        
        #needs to check who is rating it 
        ratedby= user_query.data[0]["userid"]
        print(ratedby)
        valid_transaction = supabase.table("transactions").select("buyerid").eq("buyerid", ratedby).eq("sellerid", userid).execute()
        print(valid_transaction)
        if not valid_transaction.data or len(valid_transaction.data) == 0:
            return jsonify({"error": "No valid transaction found for this rating"}), 400
        #inserts in rating table
        rating_result=supabase.table("ratings").insert({
            "userid": userid, 
            "rating":rating,
            "ratedby":ratedby,
            "created_at":now,

        }).execute()


        suspension_query=supabase.table("user_suspensions").select("suspended_at", "is_suspended").eq("userid", userid).execute()

        if not suspension_query.data or len(suspension_query.data) == 0:
            insert_suspension = supabase.table("user_suspensions").insert({
                "userid": userid,
                "is_suspended": False,
                "suspended_at": now
            }).execute()
            if not insert_suspension.data or len(insert_suspension.data) == 0:
                return jsonify({"error": "Failed to insert suspension for this user"}), 500
        
        is_suspended=issuspended(userid,suspension_query,now)
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