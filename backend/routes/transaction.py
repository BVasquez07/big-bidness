from config import supabase
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
import logging
from datetime import datetime
from routes.auth import access_token
from routes.product import update_product_post


def submittransaction():
    try:
        query=request.json
        product_id=query.get("product_id")
        price=query.get("price")
        now=datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        email=access_token()
        logging.info(f"Retrieved email from access token: {email}")
        buyer_result=supabase.table("users").select("userid").eq("email", email).execute()

        if not buyer_result.data or len(buyer_result.data) == 0:
            return jsonify({"error":"User not found"}), 404
        
        buyerid=buyer_result.data[0].get("userid") 

        product_result=supabase.table("products").select("sellerid").eq("productid", product_id).execute()
        if not product_result.data or len(product_result.data) == 0:
            return jsonify({"error": "Product not found"}), 404

        sellerid = product_result.data[0].get("sellerid")
       
        if isinstance(sellerid, str): 
            return jsonify({"error": "Seller ID is in UUID format, expected integer"}), 400
        
        product_query = supabase.table("products").select("is_available").eq("productid", product_id).execute()
        product_bool = product_query.data[0]["is_available"]
        logging.info(f"Product availability: {product_bool}")

        if not product_bool:  # Check if product is available
            return jsonify({"message": "Product isn't available"}), 403
        transaction_query = supabase.table("transactions").insert({
            "sellerid": sellerid,
            "buyerid": buyerid,
            "productid": product_id,
            "buytime": now,
            "price": price,
            "rating_posted":False
        }).execute()
        
        logging.info(f"Transaction result: {transaction_query.data}")

        update=update_product_post()

        if not update:
            return jsonify({"error": "Product is not available for purchase"}), 403

        return jsonify({"message": "Transaction posted successfully"}), 201


    except Exception as e:
        logging.error(f"Error inserting transaction: {str(e)}")
        logging.error(f"Exception details: {e}")  # Capture more information about the exception
        return jsonify({"error": str(e)}), 500
