from flask import jsonify
from config import supabase
import logging
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
import logging
from datetime import datetime
from routes.auth import access_token
from routes.product import update_product_post


#bid for proudct
def postbid():
    try:

        query=request.json
        product_id=query.get("product_id")
        bidamount=query.get("bidamount")
        biddeadline = query.get("biddeadline") 

        if not bidamount or not product_id:
            return jsonify({"error": "bid details and product ID are required"}), 400
        
        biddeadline = datetime.strptime(biddeadline, '%Y-%m-%d %H:%M:%S')

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

        userid = user_query.data[0]["userid"]
        product_query=supabase.table("products").select("is_available").eq("productid",product_id ).execute()
        product_bool= product_query.data[0]["is_available"]

        seller_query=supabase.table("products").select("sellerid").eq("productid",product_id).execute()
        sellerid=seller_query.data[0]["sellerid"]
        if product_bool:
            bid_result=supabase.table("bids").insert({
                "product_id": product_id, 
                "userid": userid, 
                "sellerid":sellerid,
                "bidamount":bidamount,
                "biddeadline": biddeadline.strftime('%Y-%m-%d %H:%M:%S'),
                "bid_accepted":False


            }).execute()

            if not bid_result.data or len(bid_result.data) == 0:
                return jsonify({"error": "Failed to insert the bid"}), 500
        else:
            return jsonify({"message": "Product no longer availabe"}), 201


        return jsonify({"message": "Bid posted successfully", "bid_id": bid_result.data[0]["bidid"]}), 201



    except Exception as e:
        logging.error(f"Error posting bid: {str(e)}")
        return jsonify({"error": str(e)}), 500




#get all the bid that are not expired
def getproductbid():
    try:
        product_id = request.args.get("product_id")
        if not product_id:
            return jsonify({"error": "Product ID is required"}), 400

        now=datetime.now()


        bid_result = (
            supabase.table("bids")
            .select("*")
            .eq("product_id", product_id)
            .gte("biddeadline", now.strftime('%Y-%m-%d %H:%M:%S'))  #
            .execute()
        )

        if not bid_result.data or len(bid_result.data) == 0:
            return jsonify({"bids": []}), 200
        
        return jsonify({"bids": bid_result.data}), 200

    except Exception as e:
        logging.error(f"Error fetching bids: {str(e)}")
        return jsonify({"error": str(e)}), 500

def acceptbid():
    try:
        
        query=request.json
        product_id = query.get("product_id")
        if not product_id:
            return jsonify({"error": "Product ID is required"}), 400

        now=datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        email=access_token()

        signin_query = supabase.table("users").select("userid").eq("email", email).execute()
        if not signin_query.data or len(signin_query.data) == 0:
            return jsonify({"error": "User not found"}), 404

        signinid = signin_query.data[0]["userid"]
        product_query=supabase.table("products").select("is_available").eq("productid",product_id ).execute()
        product_bool= product_query.data[0]["is_available"]
        print(product_bool)

        seller_query=supabase.table("bids").select("sellerid").eq("product_id",product_id ).execute()
        sellerid= seller_query.data[0]["sellerid"]

        buyer_query=supabase.table("bids").select("userid").eq("product_id",product_id ).execute()
        buyerid= buyer_query.data[0]["userid"]

        price_query=supabase.table("bids").select("bidamount").eq("product_id",product_id).eq("userid",buyerid).execute()
        price=price_query.data[0]["bidamount"]

        if signinid != sellerid:
            return jsonify({"error": "You are not the seller"}), 201
        else:
            print("looks good")

        if product_bool:
            accept=supabase.table("bids").update({"bid_accepted":True}).eq("product_id",product_id).eq("userid",buyerid).execute()
            if not accept.data or len(accept.data) == 0:
                logging.error(f"Error accepting bid: {accept.error}")
                return jsonify({"error": f"Error accepting bid: {accept.error}"}), 500
        else:
            logging.error("Product not available for bid acceptance.")
            return jsonify({"error": "Product not available"}), 400

        
        bid_response=supabase.table("transactions").insert({
            "productid":product_id,
            "sellerid":sellerid,
            "buyerid":buyerid,
            "buytime":now,
            "price":price,
            "rating_posted":False
        }).execute()



        if not bid_response.data or len(bid_response.data) == 0:
            return jsonify({"error": "did not accept bid"}), 404
        
        update_product=update_product_post()

        if not update_product_post:
            return jsonify({"error": "did not update product"}), 404
        
        return jsonify({"message": "Bid accepted successfully"}),200
        


    except Exception as e:
        logging.error(f"Error fetching bids: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500
