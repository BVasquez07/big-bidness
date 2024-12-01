from flask import jsonify
from config import supabase
import logging
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
import logging
from datetime import datetime



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


        ratings_query=supabase.table("ratings").select("rating", "created_at","created_date").eq("userid", userid).execute()
        if not ratings_query.data or len(ratings_query.data) == 0:
            return jsonify({"error": "No ratings found for this user"}), 404
        
        if suspension_query.data and len(suspension_query.data) > 0:
            suspended_date= suspension_query.data[0]["suspended_date"]
            suspended_at=suspension_query.data[0]["suspended_at"]
        else:
            suspended_date=None
            suspended_at=None

        ratings=[]
        for r in ratings_query.data:
            created_at=r["created_at"]
            created_date=r["created_date"]
            if suspended_date is not None and suspended_at is not None:
                if created_date>=suspended_date and created_at >= suspended_at:
                    ratings.append(r["rating"])
            else:
                ratings.append(r["rating"])

        if len(ratings)==0:
            recent_avg=0
        else:
            recent_avg=sum(ratings)/len(ratings)
        print(f"Ratings: {ratings}")
        print(f"Recent avg: {recent_avg}")


        if len(ratings)>=3:
            if recent_avg < 2 or recent_avg > 4:
                update_suspension = supabase.table("user_suspensions").update({
                    "is_suspended": True,
                    "suspended_at": current_time,
                    "suspended_date": today
                }).eq("userid", userid).execute()
                if not update_suspension.data or len(update_suspension.data) == 0:
                    return jsonify({"error": "Failed to update suspension for this user"}), 500
                print("we updated")


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
