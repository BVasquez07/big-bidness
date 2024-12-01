from flask import jsonify
from config import supabase
import logging
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
import logging
from datetime import datetime

#posting product
def product_post():
    try:
        query=request.json
        product_name=query.get("title")
        imageurl=query.get("imageurl")
        min_price=query.get("min_price")
        max_price=query.get("max_price")
        status=query.get("listingstatus", "available")
        price=query.get("price")

        if not product_name or not price:
            return jsonify({"error": "Product name and price are required"}), 400
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401
        user_response=supabase.auth.get_user(token)

        if not user_response or not hasattr(user_response, 'user') or not user_response.user:
            return jsonify({"error": "Authentication failed"}), 401

        user = user_response.user
        email = user.email  

        seller_result=supabase.table("users").select("userid").eq("email", email).execute()
        seller_data=seller_result.data

        if not seller_data:
            return jsonify({"error": "Seller not found"}), 404

        seller_id=seller_data[0]["userid"]

        insert_result = supabase.table("products").insert({

            "sellerid": seller_id,
            "product_name": product_name,
            "imageurl": imageurl,
            "min_price": min_price,
            "max_price": max_price,
            "listingstatus": status,
            "price": price
        
        
        
        }).execute()

        if not insert_result.data:
            return jsonify({"error": "Failed to insert product"}), 500

        inserted_product=supabase.table("products").select("productid").eq("sellerid", seller_id).eq("product_name", product_name).order("productid", desc=True).limit(1).execute()

        if not inserted_product.data or "productid" not in inserted_product.data[0]:
            return jsonify({"error": "Product ID not returned"}), 500

        product_id = inserted_product.data[0]["productid"]

        return jsonify({"message": "Product posted successfully!", "product_id": product_id}), 201

    except Exception as e:
        logging.error(f"Error during product posting: {str(e)}")
        return jsonify({"error": str(e)}), 500

#upadte lisiting status
def update_product_post():
    try:
        query=request.json
        status=query.get("listingstatus")
        product_id=query.get("product_id")

        if not product_id:
            return jsonify({"error":"Product ID is required"}), 400

        if status not in ["available","not available"]:
            return jsonify({"error":"Invalid listing status. It should be 'available' or 'not available'"}), 400
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401
        user_auth=supabase.auth.get_user(token)
        if not user_auth or not hasattr(user_auth,'user') or not user_auth.user:
            return jsonify({"error":"Authentication failed"}), 401

        user = user_auth.user
        email = user.email  
        seller_result = supabase.table("users").select("userid").eq("email", email).execute()
        if not seller_result.data or len(seller_result.data) == 0:
            return jsonify({"error": "Seller not found"}), 404

        seller_data = seller_result.data[0] 
        seller_id = seller_data["userid"] 

        response=supabase.table("products").update({"listingstatus":status}).eq("productid", product_id).execute()

        if "error" in response or not response.data:
            return jsonify({"error": response.get("error", "Failed to update product status")}), 500

        return jsonify({"message": f"Product status updated to {status} successfully"}), 200

    except Exception as e:
        logging.error(f"Error during product updating: {str(e)}")
        return jsonify({"error": str(e)}), 500


#get all products for the front page
def getproducts():
    try:
       
        products=supabase.table("products").select("*").execute()

       
        if products.data:
            return jsonify({"products": products.data}), 200
        else:
            return jsonify({"products": []}), 200

    except Exception as e:
        logging.error(f"Error fetching products: {str(e)}")
        return jsonify({"error": str(e)}), 500





