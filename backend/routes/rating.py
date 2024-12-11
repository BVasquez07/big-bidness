from config import supabase
import logging
from flask import jsonify, request
from datetime import datetime
from backend.routes.suspended import issuspended
from routes.auth import access_token
from datetime import datetime, date
from routes.complaint import postcomplaint



def rating():
    try:
        query=request.json
        rating=query.get("rating") # rating value 
        userid=query.get("userID") # person who's rating 
        buyid=query.get("buyid") # transaction id
        product_id=query.get("productID") # product id
        complaintDetails = query.get("complaintdetails")
        raterType = query.get("raterType")
        ratedID = query.get("ratedID") # buyerID

        if rating is None:
            return jsonify({"error": "Rating is required"}), 400
        
        if userid is None:
            return jsonify({"error": "User ID is required"}), 400


        now=datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        email=access_token()

        if complaintDetails:
            postcomplaint(product_id, complaintDetails, email)
            print("complaint posted successfully")


        #needs to check who is rating it 
        ratedby = userid

        print("Retrieving transaction")
        if raterType == "seller":
            valid_transaction=supabase.table("transactions").select("*").eq("sellerid", ratedby).eq("buyid", buyid).execute()
        else:
            valid_transaction=supabase.table("transactions").select("*").eq("buyerid", ratedby).eq("buyid", buyid).execute()
        print("Transaction Retrieved Successfully")
        if valid_transaction.data:
            if raterType == "seller":
                print("Updating seller_rated")
                update_rate_bool = supabase.table("transactions").update({"seller_rated": True}).eq("buyid", buyid).execute()
                print("seller_rated updated successfully")
                if not update_rate_bool.data or len(update_rate_bool.data) == 0:
                    return jsonify({"error": "Failed to update seller_rated"}), 500
            else:
                print("Updating buyer_rated")
                update_rate_bool = supabase.table("transactions").update({"buyer_rated": True}).eq("buyid", buyid).execute()
                print("buyer_rated updated successfully")
                if not update_rate_bool.data or len(update_rate_bool.data) == 0:
                    return jsonify({"error": "Failed to update buyer_rated"}), 500


        rating_result=supabase.table("ratings").insert({
            "userid": ratedID, 
            "rating":rating,
            "ratedby":ratedby,
            "created_at":now,

        }).execute()
        print("Rating inserted successfully")
        if not rating_result.data or len(rating_result.data) == 0:
            return jsonify({"error": "Failed to insert rating for this user"}), 500

        print("Retrieving suspension")
        suspension_query=supabase.table("user_suspensions").select("suspended_at", "is_suspended").eq("userid", ratedID).execute()
        print("Suspension Retrieved Successfully")

        if not suspension_query.data or len(suspension_query.data) == 0:
            insert_suspension = supabase.table("user_suspensions").insert({
                "userid": ratedID,
                "is_suspended": False,
                "suspended_at": datetime.combine(date.min, datetime.min.time()).isoformat() # edit here
            }).execute()
            if not insert_suspension.data or len(insert_suspension.data) == 0:
                return jsonify({"error": "Failed to insert suspension for this user"}), 500
        
        is_suspended=issuspended(ratedID,suspension_query,now)
        if type(is_suspended) != bool: # here it would mean that the user has been deleted from the system due to multiple suspensions
            return jsonify({"message": "The user has been deleted due to too many suspension from bad ratings"}), 201

       
        #updates usertable
        total_ratings_query = supabase.table("ratings").select("*").eq("userid", ratedID).execute()
        all_ratings = [r["rating"] for r in total_ratings_query.data]

        # Calculate the average rating
        if len(all_ratings)!=0:
            total_avg = sum(all_ratings) / len(all_ratings)
        else:
            total_avg = 0

        rating_update=supabase.table("users").update({"rating": total_avg}).eq("userid", ratedID).execute()

        if not rating_update.data or len(rating_update.data) == 0:
            return jsonify({"error": f"Failed to update rating. Status Code: {rating_update.status_code}"}), 500

        logging.info(f"User rating updated successfully. New rating: {total_avg}")




        return jsonify({"message": "Review posted successfully"}), 201

    except Exception as e:
        logging.error(f"Error posting posting review: {str(e)}")
        return jsonify({"error": str(e)}), 500
