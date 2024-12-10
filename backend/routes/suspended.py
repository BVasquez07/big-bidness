from config import supabase
import logging
from flask import jsonify, request
from datetime import datetime


def issuspended(userid,suspension_query,now):
    try:
        ratings_query=supabase.table("ratings").select("rating", "created_at").eq("userid", userid).execute()
        if not ratings_query.data or len(ratings_query.data) == 0:
            return jsonify({"error": "No ratings found for this user"}), 404
        print(ratings_query.data)
        if suspension_query.data and len(suspension_query.data) > 0:
            suspended_at=suspension_query.data[0]["suspended_at"]
        else:
            suspended_at=None

        ratings=[]
        for r in ratings_query.data:
            created_at=r["created_at"]
            if suspended_at is not None:
                if created_at >= suspended_at:
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
                    "suspended_at": now
                }).eq("userid", userid).execute()
                if not update_suspension.data or len(update_suspension.data) == 0:
                    return jsonify({"error": "Failed to update suspension for this user"}), 500
    
                return True 
            return False 
    except Exception as e:
        logging.error(f"Error submiting suspended: {str(e)}")
        return jsonify({"error": str(e)}), 500


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

        #get user to login and add their credit card
        user_response=supabase.auth.sign_in_with_password({"email": email, "password": password})

        access_token=user_response.session.access_token
        if not access_token:
            return jsonify({"error": "Access Token Failure"}), 401

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
        role = user_response.data[0]["role"]
        now=datetime.now().isoformat()

        update_suspension = supabase.table("user_suspensions").update({
            "is_suspended": False,
            "suspended_at": now,
            }).eq("userid", userid).execute()
        if not update_suspension.data or len(update_suspension.data) == 0:
            return jsonify({"error": "Failed to update suspension for this user"}), 500

        return jsonify({"role": role, "token": access_token, "message": "50 dollars paid.You can sign in now"}), 200
    except Exception as e:
        logging.error(f"Error fetching suspended: {str(e)}")
        return jsonify({"error": str(e)}), 500