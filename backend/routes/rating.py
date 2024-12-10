from config import supabase
import logging
from flask import jsonify, request
from datetime import datetime
from backend.routes.suspended import issuspended
from routes.auth import access_token
from datetime import datetime, date



def rating():
    try:
        query=request.json
        rating=query.get("rating")
        username=query.get("username")
        buyid=query.get("buyid")

        if rating is None:
            return jsonify({"error": "Rating is required"}), 400
        if not username:
            return jsonify({"error": "Username is required"}), 400

        user_response = supabase.table("users").select("*").eq("username", username).execute()
        if not user_response.data or len(user_response.data) == 0:
            return jsonify({"error": "User not found"}), 404
        userid = user_response.data[0]["userid"]

        now=datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        email=access_token()
        user_query = supabase.table("users").select("userid").eq("email", email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404
        
        #needs to check who is rating it 
        ratedby= user_query.data[0]["userid"]

        valid_transaction=supabase.table("transactions").select("*").eq("buyerid", ratedby).eq("buyid", buyid).execute()
        if not valid_transaction.data or len(valid_transaction.data) == 0:
            # Check if the seller can rate the buyer (reverse case)
            valid_transaction=supabase.table("transactions").select("*").eq("sellerid", ratedby).eq("buyid", buyid).execute()
            if not valid_transaction.data or len(valid_transaction.data) == 0:
                return jsonify({"error": "No valid transaction found for this rating"}), 400
            update_rate_bool = supabase.table("transactions").update({"seller_rated": True}).eq("buyid", buyid).execute()
            if not update_rate_bool.data or len(update_rate_bool.data) == 0:
                return jsonify({"error": "Failed to insert suspension for this user"}), 500
        else:
            update_rate_bool = supabase.table("transactions").update({"buyer_rated": True}).eq("buyid", buyid).execute()
            if not update_rate_bool.data or len(update_rate_bool.data) == 0:
                return jsonify({"error": "Failed to insert suspension for this user"}), 500

        #inserts in rating table
        rating_result=supabase.table("ratings").insert({
            "userid": userid, 
            "rating":rating,
            "ratedby":ratedby,
            "created_at":now,

        }).execute()
        if not rating_result.data or len(rating_result.data) == 0:
            return jsonify({"error": "Failed to insert suspension for this user"}), 500


        suspension_query=supabase.table("user_suspensions").select("suspended_at", "is_suspended").eq("userid", userid).execute()

        if not suspension_query.data or len(suspension_query.data) == 0:
            insert_suspension = supabase.table("user_suspensions").insert({
                "userid": userid,
                "is_suspended": False,
                "suspended_at": datetime.combine(date.min, datetime.min.time()).isoformat() # edit here
            }).execute()
            if not insert_suspension.data or len(insert_suspension.data) == 0:
                return jsonify({"error": "Failed to insert suspension for this user"}), 500
        
        is_suspended=issuspended(userid,suspension_query,now)
        if type(is_suspended) != bool: # here it would mean that the user has been deleted from the system due to multiple suspensions
            return jsonify({"message": "The user has been deleted due to too many suspension from bad ratings"}), 201

            
        product_query=supabase.table("transactions").select("product_id").eq("buyid",buyid).execute()
        product_id=product_query.data[0]["product_id"]
       

        #updates usertable
        total_ratings_query = supabase.table("ratings").select("*").eq("userid", userid).execute()
        all_ratings = [r["rating"] for r in total_ratings_query.data]

        # Calculate the average rating
        if len(all_ratings)!=0:
            total_avg = sum(all_ratings) / len(all_ratings)
        else:
            total_avg = 0

        rating_update=supabase.table("users").update({"rating": total_avg}).eq("userid", userid).execute()

        if not rating_update.data or len(rating_update.data) == 0:
            return jsonify({"error": f"Failed to update rating. Status Code: {rating_update.status_code}"}), 500

        logging.info(f"User rating updated successfully. New rating: {total_avg}")




        return jsonify({"message": "Review posted successfully"}), 201

    except Exception as e:
        logging.error(f"Error posting posting review: {str(e)}")
        return jsonify({"error": str(e)}), 500
