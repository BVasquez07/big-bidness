from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging


load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
if not url or not key:
    raise ValueError("Environment variables SUPABASE_URL or SUPABASE_KEY are not set.")
print(f"Supabase URL: {url}")
print(f"Supabase Key: {key}")

supabase: Client = create_client(url, key)


app = Flask(__name__)
CORS(app)


@app.route("/")
def hello():
    return "Hello World!"



        
@app.route("/register", methods=["POST"]) 
def register():
    try:
        query=request.json
        firstname=query.get("firstname")
        lastname=query.get("lastname")
        email=query.get("email")
        username=query.get("username")
        password=query.get("password")
        role=query.get("role", "User")
        vipstatus=query.get("vipstatus", False)
        accountbalance=query.get("accountbalance", 0.0)
        suspensioncount=query.get("suspensioncount", 0)
        rating=query.get("rating", 0.0)

        username_check = supabase.table("users").select("username").eq("username", username).execute()
        if username_check.data:
            return jsonify({"error": "Username is taken"}), 400

        email_check = supabase.table("users").select("email").eq("email", email).execute()
        if email_check.data:
            return jsonify({"error": "Email is already being used"}), 400
        
        sign_up_response=supabase.auth.sign_up({"email": email, "password": password})
        logging.debug(f"Sign-up response: {sign_up_response}")



        new_user = supabase.table("users").insert({
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "username": username,
            "password": password,
            "role": role,
            "vipstatus": vipstatus,
            "accountbalance": accountbalance,
            "suspensioncount": suspensioncount,
            "rating": rating
        }).execute()

        if hasattr(new_user, 'error') and new_user.error:
            return jsonify({"error": new_user.error.message}), 500
        if not new_user.data:
            raise Exception("Failed to insert new user. No data returned.")

        new_userid = new_user.data[0].get("userid")
        if not new_userid:
            raise Exception("Failed to retrieve userid for the new user.")


        approval_response = supabase.table("approvals").insert({
            "userid": new_userid,
            "applicationdetails": "Approval Pending", 
            "approvedby": None
        }).execute()


        logging.debug(f"Approval Response: {approval_response}")

        if hasattr(approval_response, 'error') and approval_response.error:
            return jsonify({"error": approval_response.error.message}), 500
        if not approval_response.data:
            raise Exception("Failed to insert approval entry. No data returned.")


        return jsonify({"message": "User signed up successfully and is awaiting approval."}), 200

    except Exception as e:
        logging.error(f"Error during signup: {str(e)}")
        return jsonify({"error": str(e)}), 500
    


    
@app.route("/signin", methods=["POST"])
def signin():
    try:
        query=request.json
        email=query.get('email')
        password=query.get('password')



        if not email or not password:
            return jsonify({"error": "Please provide email and password"}), 400

        user_response=supabase.auth.sign_in_with_password({"email": email, "password": password})

        # Check if the user_response contains a valid user and session
        if not user_response or not hasattr(user_response, 'user') or not user_response.user:
            return jsonify({"error": "Authentication failed"}), 401
        user=user_response.user 
 
        approval_result = supabase.table("approvals").select("email", "applicationdetails").eq("email", user.email).execute()
        approval_data = approval_result.data

        if not approval_data:
            return jsonify({"error": "No approval record found"}), 404
        
        approval_status = approval_data[0]["applicationdetails"]
        
        if approval_status=="Approval Pending":
            return jsonify({"error": "Approval Needed"}), 403
        elif approval_status=="Approval Rejected":
            return jsonify({"error": "Approval Rejected"}), 403

        access_token=user_response.session.access_token 

        return jsonify({
            "message": "Login Successful!",
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role
            },
            "access_token": access_token
        }), 200

    except Exception as e:
        logging.error(f"Error during signin: {str(e)}")
        return jsonify({"error": str(e)}), 500






@app.route("/post", methods=["POST"])
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

        user_response=supabase.auth.get_user()

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


@app.route("/update-post", methods=["POST"])
def update_product_post():
    try:
        query=request.json
        status=query.get("listingstatus")
        product_id=query.get("product_id")

        if not product_id:
            return jsonify({"error":"Product ID is required"}), 400

        if status not in ["available","not available"]:
            return jsonify({"error":"Invalid listing status. It should be 'available' or 'not available'"}), 400

        user_auth=supabase.auth.get_user()
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


@app.route("/get-all-products", methods=["GET"])
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


    except Exception as e:
        logging.error(f"Error fetching products: {str(e)}")
        return jsonify({"error": str(e)}), 500






@app.route("/postcomplaint", methods=["POST"])
def postcomplaint():
    try:
        
        query=request.json
        complaintdetails=query.get("complaintdetails")
        status=query.get("status", "pending")
        product_id=query.get("product_id")

       
        if not complaintdetails or not product_id:
            return jsonify({"error": "Complaint details and product ID are required"}), 400

      
        user_response=supabase.auth.get_user()

        if not user_response or not hasattr(user_response, "user") or not user_response.user:
            return jsonify({"error": "Authentication failed"}), 401

        user=user_response.user
        email=user.email

        
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

       
        complaint_result=supabase.table("complaints").insert({
            "buyerid": buyerid, 
            "sellerid": sellerid, 
            "complaintdetails": complaintdetails,
            "status": status,
            "product_id": product_id
        }).execute()

        
        if not complaint_result.data or len(complaint_result.data) == 0:
            return jsonify({"error": "Failed to post the complaint"}), 500

    
        return jsonify({
            "message": "Complaint posted successfully",
            "complaint_id": complaint_result.data[0].get("complaintid")
        }), 201

    except Exception as e:
        logging.error(f"Error posting complaint: {str(e)}")
        return jsonify({"error": str(e)}), 500








if __name__ == "__main__":
    app.run(host="localhost", debug=True, port=8080)
