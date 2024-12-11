from config import supabase
import logging
from flask import jsonify, request
from routes.auth import access_token

#posting product
"""
expected json format:
{
    "productname": "product name",
    "imageurl": "image url",
    "min_price": "min price",
    "max_price": "max price",
    "price": "price",
    "listing_type": "listing type"
}

returns:
{
    "message": "Product posted successfully!",
    "product_id": "product id"
}
OR
{
    "error": "error message"
} 
"""
import os
import uuid
from werkzeug.utils import secure_filename

import tempfile

def product_post():
    try:
        product_name = request.form.get("productname")
        min_price = request.form.get("min_price")
        max_price = request.form.get("max_price")
        price = request.form.get("price")
        listing_type = request.form.get("listing_type")
        image_file = request.files.get("file")  

        if not product_name or not price and not min_price and not max_price:
            return jsonify({"error": "Product name and price are required"}), 400

        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401
        
        user_response = supabase.auth.get_user(token)
        if not user_response or not hasattr(user_response, 'user') or not user_response.user:
            return jsonify({"error": "Authentication failed"}), 401

        user = user_response.user
        email = user.email


        seller_result = supabase.table("users").select("userid").eq("email", email).execute()
        seller_data = seller_result.data

        if not seller_data:
            return jsonify({"error": "Seller not found"}), 404

        seller_id = seller_data[0]["userid"]

        image_url = None
        if image_file:
            unique_filename = f"{uuid.uuid4().hex}_{secure_filename(image_file.filename)}"
            temp_dir = tempfile.gettempdir()  # Use platform-specific temp directory
            temp_path = os.path.join(temp_dir, unique_filename)

            # Save the file temporarily
            with open(temp_path, "wb") as temp_file:
                temp_file.write(image_file.read())

            bucket_name = "product-images"
            try:
                with open(temp_path, "rb") as temp_file:
                    upload_response = supabase.storage.from_(bucket_name).upload(unique_filename, temp_file)

                if not upload_response:  
                    return jsonify({"error": "Failed to upload file to Supabase"}), 500

                image_url = supabase.storage.from_(bucket_name).get_public_url(unique_filename)
            except Exception as e:
                return jsonify({"error": f"Failed to upload file to Supabase: {str(e)}"}), 500
            finally:
                if os.path.exists(temp_path):
                    os.remove(temp_path)


        insert_result = supabase.table("products").insert({
            "sellerid": seller_id,
            "product_name": product_name,
            "imageurl": image_url,  
            "min_price": min_price,
            "max_price": max_price,
            "is_available": True,
            "price": price,
            "listing_type": listing_type
        }).execute()

        if not insert_result.data:
            return jsonify({"error": "Failed to insert product"}), 500

        inserted_product = supabase.table("products").select("product_id").eq("sellerid", seller_id).eq("product_name", product_name).order("product_id", desc=True).limit(1).execute()

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


def query_products():
    try:
        query=request.args
        text=query.get("product_title")
        
        if text:
            query_response = (
                supabase.table("products")
                .select("*")
                .text_search("product_name", text, options={"config": "english"})
                .execute()
            )

            if not query_response.data:
                return jsonify({"error": "Failed to find product"}), 400
            
            return jsonify({"products": query_response.data}), 200
        else:
            return getproducts()
        
    except Exception as e:
        logging.error(f"Error fetching products: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

def getcompletedproducts():
    try:
        email = access_token()
        user_query = supabase.table("users").select("userid").eq("email", email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404
        userid = user_query.data[0]["userid"]

        completedSales = supabase.table("transactions").select("*").eq("sellerid", userid).execute()
        if not completedSales.data or len(completedSales.data) == 0:
            return jsonify({"sales": []}), 200

        sales = []
        for sale in completedSales.data:
            product_id = sale.get("product_id")
            buyerid = sale.get("buyerid")
            buyid = sale.get("buyid")

            if not product_id or not isinstance(product_id, int):
                logging.error("Invalid product_id in transaction record")
                continue
            if not buyerid or not isinstance(buyerid, int):
                logging.error("Invalid buyerid in transaction record")
                continue

            rating_posted = sale.get("seller_rated")

            product_result = supabase.table("products").select("*").eq("product_id", product_id).execute()
            if not product_result.data or len(product_result.data) == 0:
                logging.error(f"No product found for product_id: {product_id}")
                continue

            buyer_result = supabase.table("users").select("username").eq("userid", buyerid).execute()
            if not buyer_result.data or len(buyer_result.data) == 0:
                logging.error(f"No buyer found for buyerid: {buyerid}")
                continue
            buyer_name = buyer_result.data[0].get("username")

            sales.append({
                "product": product_result.data,
                "userid": userid,
                "ratedname": buyer_name,
                "ratedid": buyerid,
                "rating_posted": rating_posted,
                "buyid": buyid,
                "price": sale.get("price"),
            })

        return jsonify({"sales": sales}), 200
    except Exception as e:
        logging.error(f"Error fetching sales: {str(e)}")
        return jsonify({"error": str(e)}), 500
