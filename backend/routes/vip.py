from config import supabase
import logging
from flask import jsonify, request
from datetime import datetime
from routes.auth import access_token

#posting product
def vip_product_post():
    try:
        query=request.json
        product_name=query.get("productname")
        imageurl=query.get("imageurl")
        min_price=query.get("min_price")
        max_price=query.get("max_price")
        price=query.get("price")
        postdeadline = query.get("postdeadline") 

        email=access_token()

        role_response=supabase.table("users").select("role").eq("email", email).execute()
        role=role_response.data[0]["role"]

        if role != "Vip":
            return jsonify({"error": "You are not a vip, cannot sell"}), 404
        
        postdeadline=datetime.strptime(postdeadline, '%Y-%m-%d %H:%M:%S')

        seller_result=supabase.table("users").select("userid").eq("email", email).execute()
        seller_data=seller_result.data

        if not seller_data:
            return jsonify({"error": "Seller not found"}), 404

        seller_id=seller_data[0]["userid"]

        insert_result = supabase.table("vipproducts").insert({

            "vipsellerid": seller_id,
            "product_name": product_name,
            "imageurl": imageurl,
            "min_price": min_price,
            "max_price": max_price,
            "is_available": True,
            "price": price,
            "deadline":postdeadline.strftime('%Y-%m-%d %H:%M:%S')
        
        
        
        }).execute()

        if not insert_result.data:
            return jsonify({"error": "Failed to insert product"}), 500

        inserted_product=supabase.table("vipproducts").select("vipproduct_id").eq("vipsellerid", seller_id).eq("product_name", product_name).order("vipproduct_id", desc=True).limit(1).execute()

        if not inserted_product.data or "vipproduct_id" not in inserted_product.data[0]:
            return jsonify({"error": "Product ID not returned"}), 500

        product_id = inserted_product.data[0]["vipproduct_id"]

        return jsonify({"message": "Product posted successfully!", "product_id": product_id}), 201

    except Exception as e:
        logging.error(f"Error during product posting: {str(e)}")
        return jsonify({"error": str(e)}), 500

#upadte lisiting status
def update_product_post():
    try:
        query=request.json
        product_id=query.get("vipproduct_id")

        if not product_id:
            return jsonify({"error":"Product ID is required"}), 400

        response=supabase.table("vipproducts").update({"is_available":False}).eq("vipproduct_id", product_id).execute()

        if "error" in response or not response.data:
            return jsonify({"error": response.get("error", "Failed to update product status")}), 500

        return jsonify({"message": f"Product status updated to false successfully"}), 200

    except Exception as e:
        logging.error(f"Error during product updating: {str(e)}")
        return jsonify({"error": str(e)}), 500


#get all products for the front page
def getvipproducts():
    try:

        products=supabase.table("vipproducts").select("*").execute()

       
        if products.data:
            return jsonify({"products": products.data}), 200
        else:
            return jsonify({"products": []}), 200

    except Exception as e:
        logging.error(f"Error fetching products: {str(e)}")
        return jsonify({"error": str(e)}), 500




def vipuser_completed_products():
    try:
        email=access_token()

        user_query=supabase.table("users").select("userid").eq("email",email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404
        userid=user_query.data[0]["userid"]

        role_response=supabase.table("users").select("role").eq("email", email).execute()
        role=role_response.data[0]["role"]

        if role != "Vip":
            return jsonify({"error": "You are not a vip, cannot sell"}), 404

        products=supabase.table("vipproducts").select("*").eq("vipsellerid",userid).eq("is_available",False).execute()

        if products.data:
            return jsonify({"products": products.data}), 200
        else:
            return jsonify({"products": []}), 200

    except Exception as e:
        logging.error(f"Error fetching products: {str(e)}")
        return jsonify({"error": str(e)}), 500

def vipuser_current_products():
    try:
        email=access_token()

        user_query=supabase.table("users").select("userid").eq("email",email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404
        userid=user_query.data[0]["userid"]

        role_response=supabase.table("users").select("role").eq("email", email).execute()
        role=role_response.data[0]["role"]

        if role != "Vip":
            return jsonify({"error": "You are not a vip, cannot sell"}), 404
        products=supabase.table("vipproducts").select("*").eq("vipsellerid",userid).eq("is_available",True).execute()

        if products.data:
            return jsonify({"products": products.data}), 200
        else:
            return jsonify({"products": []}), 200



    except Exception as e:
        logging.error(f"Error fetching products: {str(e)}")
        return jsonify({"error": str(e)}), 500

