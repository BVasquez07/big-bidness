from flask import jsonify
from config import supabase
import logging
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
import logging
from datetime import datetime
from routes.auth import access_token

#posting product
def product_post():
    try:
        query=request.json
        product_name=query.get("title")
        imageurl=query.get("imageurl")
        min_price=query.get("min_price")
        max_price=query.get("max_price")
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
            "is_available": True,
            "price": price
        
        
        
        }).execute()

        if not insert_result.data:
            return jsonify({"error": "Failed to insert product"}), 500

        inserted_product=supabase.table("products").select("product_id").eq("sellerid", seller_id).eq("product_name", product_name).order("product_id", desc=True).limit(1).execute()

        if not inserted_product.data or "product_id" not in inserted_product.data[0]:
            return jsonify({"error": "Product ID not returned"}), 500

        product_id = inserted_product.data[0]["product_id"]

        return jsonify({"message": "Product posted successfully!", "product_id": product_id}), 201

    except Exception as e:
        logging.error(f"Error during product posting: {str(e)}")
        return jsonify({"error": str(e)}), 500

#upadte lisiting status
def update_product_post():
    try:
        query=request.json
        product_id=query.get("product_id")

        if not product_id:
            return jsonify({"error":"Product ID is required"}), 400

        response=supabase.table("products").update({"is_available":False}).eq("product_id", product_id).execute()

        if "error" in response or not response.data:
            return jsonify({"error": response.get("error", "Failed to update product status")}), 500

        return jsonify({"message": f"Product status updated to false successfully"}), 200

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


def user_completed_products():
    try:
        email=access_token()

        user_query=supabase.table("users").select("userid").eq("email",email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404
        userid=user_query.data[0]["userid"]

        products=supabase.table("products").select("*").eq("sellerid",userid).eq("is_available",False).execute()

        if products.data:
            return jsonify({"products": products.data}), 200
        else:
            return jsonify({"products": []}), 200

    except Exception as e:
        logging.error(f"Error fetching products: {str(e)}")
        return jsonify({"error": str(e)}), 500

def user_current_products():
    try:
        email=access_token()

        user_query=supabase.table("users").select("userid").eq("email",email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404
        userid=user_query.data[0]["userid"]

        products=supabase.table("products").select("*").eq("sellerid",userid).eq("is_available",True).execute()

        if products.data:
            return jsonify({"products": products.data}), 200
        else:
            return jsonify({"products": []}), 200



    except Exception as e:
        logging.error(f"Error fetching products: {str(e)}")
        return jsonify({"error": str(e)}), 500

