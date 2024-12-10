from config import supabase
import logging
from flask import jsonify, request
from routes.quitSys import deleteQuitSysInvoluntary
from datetime import datetime
from routes.auth import access_token


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
            if suspended_at != None:##possible issue around here.....
                if created_at > suspended_at: #previously >= but this causes user suspension to be triggered when user has 2 ratings since the initial 3rd rating will be ofc equal to suspended_at.
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
                    "suspended_at": now #datetime.combine(date.min, datetime.min.time())
                }).eq("userid", userid).execute()
                if not update_suspension.data or len(update_suspension.data) == 0:
                        return jsonify({"error": "Failed to update suspension for this user"}), 500
                
                prev_suspension_count = supabase.table("users").select("suspension_count").eq("userid", userid).execute() ##fetch the previous suspension count
                if not prev_suspension_count.data or len(prev_suspension_count.data) == 0:
                    return jsonify({"error": "Failed to fetch previous suspension count"}), 500   
                
                if prev_suspension_count.data[0]["suspension_count"] < 3: ##check if user has been suspended less than 3 times
                    user_response_update = supabase.table("users").update({"suspension_count": prev_suspension_count.data[0]["suspension_count"] + 1}).eq("userid", userid).execute() ##increment & update
                    if not user_response_update.data or len(user_response_update.data) == 0:
                        return jsonify({"error": "Failed to update suspension for this user"}), 500
                else:
                    return deleteQuitSysInvoluntary(userid)
                return True 
        return False 
    except Exception as e:
        logging.error(f"Error submiting suspended: {str(e)}")
        return jsonify({"error": str(e)}), 500


def getsuspended():
    try:
        suspended_result=supabase.table("user_suspensions").select("*").eq("is_suspended",True).execute()

        suspended= []
        for sus in suspended_result.data:
            userid=sus.get("userid")
            suspensionid=sus.get("suspensionid")
            suspended_at=sus.get("suspended_at")
            is_suspended=sus.get("is_suspended")

        
            user_result=supabase.table("users").select("username").eq("userid", userid).execute()

            username=user_result.data[0].get("username")
            suspended.append({
                "userid":userid,
                "username": username,
                "suspensionid":suspensionid,
                "suspended_at":suspended_at,
                "is_suspended":is_suspended
            })
        if not suspended or len(suspended) == 0:
            return jsonify({"suspended": []}), 200

        return jsonify({"suspendded": suspended}), 200

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
            "suspended_at": now,
            }).eq("userid", userid).execute()
        if not update_suspension.data or len(update_suspension.data) == 0:
            return jsonify({"error": "Failed to update suspension for this user"}), 500

        return jsonify({"message": "50 dollars paid.You can sign in now"}), 200
    except Exception as e:
        logging.error(f"Error fetching suspended: {str(e)}")
        return jsonify({"error": str(e)}), 500


def admin_suspenion_upadte():
    try:
        query=request.json
        suspended_id=query.get("userid")
        email=access_token()

        requester_response=supabase.table("users").select("role, userid").eq("email", email).single().execute()
        if not requester_response.data:
            return jsonify({"error": "Requester not found"}), 404

        admin_role=requester_response.data.get("role")
        if admin_role!="Admin":
            return jsonify({"error": "Unauthorized action. Admin privileges required."}), 403


        user_response = supabase.table("users").select("*").eq("userid", suspended_id).execute()
        now=datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        update_suspension = supabase.table("user_suspensions").update({
            "is_suspended": False,
            "suspended_at": now,
            }).eq("userid", suspended_id).execute()
        if not update_suspension.data or len(update_suspension.data) == 0:
            return jsonify({"error": "Failed to update suspension for this user"}), 500

        return jsonify({"message": "User is unsuspended"}), 200
    except Exception as e:
        logging.error(f"Error fetching suspended: {str(e)}")
        return jsonify({"error": str(e)}), 500