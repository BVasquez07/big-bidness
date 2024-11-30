from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging
from datetime import datetime

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
        #parameters
        query=request.json
        firstname=query.get("firstname")
        lastname=query.get("lastname")
        email=query.get("email")
        username=query.get("username")
        password=query.get("password")
        role=query.get("role", "User")
        vipstatus=query.get("vipstatus", False)
        accountbalance=query.get("accountbalance", 0.0)
        suspended=query.get("suspended", False)
        rating=query.get("rating", 0.00)
        question=query.get("question")
        answer=query.get("answer")
        
        #checks the table if username is already in use
        username_check = supabase.table("users").select("username").eq("username", username).execute() 
        if username_check.data:
            return jsonify({"error": "Username is taken"}), 400
        
        #checks the table if email is already in use
        email_check = supabase.table("users").select("email").eq("email", email).execute()
        if email_check.data:
            return jsonify({"error": "Email is already being used"}), 400
        
        #the Auhtorization for email
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
            "suspended": suspended,
            "rating": rating,
        }).execute()

        if hasattr(new_user, 'error') and new_user.error:
            return jsonify({"error": new_user.error.message}), 500
        if not new_user.data:
            raise Exception("Failed to insert new user. No data returned.")
        #gets userid
        new_username= new_user.data[0].get("username")
        if not new_username:
            raise Exception("Failed to retrieve userid for the new user.")

        #sends userid and other relevant information to approval table
        approval_response = supabase.table("approvals").insert({
            "username": new_username,
            "applicationdetails": "Approval Pending",
            "email":email, 
            "approvedby": None,
            "question":question,
            "answer":answer
        }).execute()


        logging.debug(f"Approval Response: {approval_response}")

        if hasattr(approval_response, 'error') and approval_response.error:
            return jsonify({"error": approval_response.error.message}), 500
        if not approval_response.data:
            raise Exception("Failed to insert approval entry. No data returned.")


        return jsonify({"message": "User signed up successfully and is awaiting approval.Please check email for authorization"}), 200

    except Exception as e:
        logging.error(f"Error during signup: {str(e)}")
        return jsonify({"error": str(e)}), 500
    


    
@app.route("/signin", methods=["POST"])#checks all condtions, if everythign is okay, logs in
def signin():
    try:
        query=request.json
        email=query.get("email")
        password=query.get("password")

        if not email or not password:
            return jsonify({"error": "Please provide email and password"}), 400

        #uses supabase authorization to login as this gives a acccess token
        user_response=supabase.auth.sign_in_with_password({"email": email, "password": password})

        if not user_response or not hasattr(user_response, 'user') or not user_response.user:
            return jsonify({"error": "Authentication failed"}), 401

        user=user_response.user

        # check suspended status
        suspended_result=supabase.table("users").select("email", "suspended").eq("email", user.email).execute()
        suspended_data=suspended_result.data if suspended_result.data else []

        if not suspended_data:
            return jsonify({"error": "No suspended record found"}), 404

        suspended_status=suspended_data[0]["suspended"]
         #suspended conditions
        if suspended_status is True:
            return jsonify({"error": "Suspended. Pay up"}), 403

        #finds info from approval table
        approval_result=supabase.table("approvals").select("email", "applicationdetails").eq("email", user.email).execute()
        approval_data=approval_result.data if approval_result.data else []

        if not approval_data:
            return jsonify({"error": "No approval record found"}), 404


        approval_status = approval_data[0]["applicationdetails"]

        #approval conditions
        if approval_status=="Approval Pending":
            return jsonify({"error": "Approval Needed"}), 403
        elif approval_status=="Approval Rejected":
            return jsonify({"error": "Approval Rejected"}), 403

        # get access token
        access_token=user_response.session.access_token
        if not access_token:
            return jsonify({"error": "Verify your email. Check your inbox"}), 401

        # get userid
        user_result=supabase.table("users").select("userid").eq("email", user.email).execute()
        user_data=user_result.data if user_result.data else []

        if not user_data:
            return jsonify({"error": "User ID not found"}), 404

        userid = user_data[0]['userid']

        #get ratings with created_at and created_date
        rating_result = supabase.table("ratings").select("rating, created_at, created_date").eq("userid", userid).execute()
        rating_data = rating_result.data if rating_result.data else []

        #sort by created_at and created_date
        ratings_sorted = sorted(
            rating_data, 
            key=lambda r: (r.get("created_at", ""), r.get("created_date", ""))
        )

        #extract the top 4 ratings
        ratings = [r["rating"] for r in ratings_sorted[:4]]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0

        ratings = [r["rating"] for r in ratings_sorted[:4]]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0

        balance_result = supabase.table("users").select("accountbalance").eq("email", email).execute()
        balance_data = balance_result.data if balance_result.data else []
        balance = balance_data[0].get("accountbalance", 0) if balance_data else 0

        complaints_result=supabase.table("complaints").select("*").eq("sellerid", userid).execute()
        total_complaints=len(complaints_result.data) if complaints_result.data else 0

        role = "User"

        #update role based on conditions
        if len(rating_data)>=5:
            if 2 <= avg_rating <= 4 and balance >= 5000 and total_complaints == 0:
                role = "Vip"
            else:
                role = "User"

            update_result = supabase.table("users").update({"role": role}).eq("userid", userid).execute()

            if not update_result.data:  
                return jsonify({"error": "Failed to update user role"}), 500



        return jsonify({
            "message": "Login Successful!",
            "user": {
                "id": user.id,
                "email": user.email,
                "role": role
            },
            "access_token": access_token
        }), 200


    except Exception as e:
        logging.error(f"Error during signin: {str(e)}")
        return jsonify({"error": str(e)}), 500




@app.route("/personalinfo", methods=["GET"])#this gets the user info 
def personalinfo():
    try:
        user_response = supabase.auth.get_user()

        if not user_response or not hasattr(user_response, "user") or not user_response.user:
            return jsonify({"error": "Authentication failed"}), 401

        user = user_response.user
        email = user.email

        user_query = supabase.table("users").select("*").eq("email", email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"user": user_query.data[0]}), 200
    except Exception as e:
        logging.error(f"Error getting user: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route("/userinfo", methods=["GET"])#gets any user info the user clicks ons
def userinfo():
    try:
        username = request.args.get("username")
        if not username:
            return jsonify({"error": "Username is required"}), 400

        user_query = supabase.table("users").select("*").eq("username", username).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"user": user_query.data[0]}), 200
    except Exception as e:
        logging.error(f"Error getting user: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/post", methods=["POST"])#posting product
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


@app.route("/update-post", methods=["POST"])#upadte lisiting status
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


@app.route("/get-all-products", methods=["GET"])#get all products for the front page
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






@app.route("/postcomplaint", methods=["POST"])#get all complaints
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

@app.route("/get-product-complaint", methods=["GET"])#get complainst based on product only
def getproductcomplaint():
    try:

        product_id=request.args.get("product_id")

        complaints_result = supabase.table("complaints").select("*").eq("product_id", product_id).execute()


        if not complaints_result.data or len(complaints_result.data) == 0:
            return jsonify({"complaints": []}), 200

        return jsonify({"complaints": complaints_result.data}), 200

    except Exception as e:
        logging.error(f"Error fetching complaints: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/get-seller-complaint", methods=["GET"])#get onlby seller complaint
def getsellercomplaint():
    try:

        sellerid=request.args.get("sellerid")

        complaints_result = supabase.table("complaints").select("*").eq("sellerid", sellerid).execute()


        if not complaints_result.data or len(complaints_result.data) == 0:
            return jsonify({"complaints": []}), 200

        return jsonify({"complaints": complaints_result.data}), 200

    except Exception as e:
        logging.error(f"Error fetching complaints: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/postbid", methods=["POST"])#bid for proudct
def postbid():
    try:

        query=request.json
        product_id=query.get("product_id")
        bidamount=query.get("bidamount")
        biddeadline = query.get("biddeadline")

        if not bidamount or not product_id:
            return jsonify({"error": "Complaint details and product ID are required"}), 400
        
        user_response=supabase.auth.get_user()

        if not user_response or not hasattr(user_response, "user") or not user_response.user:
            return jsonify({"error": "Authentication failed"}), 401

        user=user_response.user
        email=user.email

        user_query = supabase.table("users").select("userid").eq("email", email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404

        userid = user_query.data[0]["userid"]

        bid_result=supabase.table("bids").insert({
            "product_id": product_id, 
            "userid": userid, 
            "bidamount":bidamount,
            "biddeadline": biddeadline

        }).execute()

        if not bid_result.data or len(bid_result.data) == 0:
            return jsonify({"error": "Failed to insert the bid"}), 500


        return jsonify({"message": "Bid posted successfully", "bid_id": bid_result.data[0]["bidid"]}), 201



    except Exception as e:
        logging.error(f"Error posting bid: {str(e)}")
        return jsonify({"error": str(e)}), 500




@app.route("/get-product-bid", methods=["GET"])#get all the bid that are not expired
def getproductbid():
    try:
        product_id = request.args.get("product_id")
        if not product_id:
            return jsonify({"error": "Product ID is required"}), 400

        now=datetime.now()
        today=now.date().isoformat()
        current_time=now.time().isoformat() 

        bid_result = (
            supabase.table("bids")
            .select("*")
            .eq("product_id", product_id)
            .lte("enddate", today)
            .lte("biddeadline", current_time)
            .execute()
        )

        if not bid_result.data or len(bid_result.data) == 0:
            return jsonify({"bids": []}), 200
        
        return jsonify({"bids": bid_result.data}), 200

    except Exception as e:
        logging.error(f"Error fetching bids: {str(e)}")
        return jsonify({"error": str(e)}), 500



@app.route("/submitrating", methods=["POST"])  # this submits rating and checks for suspension
def rating():
    try:
        query=request.json
        rating=query.get("rating")
        username=query.get("username")

        if rating is None:
            return jsonify({"error": "Rating is required"}), 400
        if not username:
            return jsonify({"error": "Username is required"}), 400

        user_response = supabase.table("users").select("*").eq("username", username).execute()
        if not user_response.data or len(user_response.data) == 0:
            return jsonify({"error": "User not found"}), 404
        userid = user_response.data[0]["userid"]
        now=datetime.now()
        today=now.date().isoformat()
        current_time=now.time().isoformat() 

        user_response=supabase.auth.get_user()
        if not user_response or not hasattr(user_response, "user") or not user_response.user:
            return jsonify({"error": "Authentication failed"}), 401

        user=user_response.user
        email=user.email

        user_query = supabase.table("users").select("userid").eq("email", email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404
        
        #needs to check who is rating it 
        ratedby= user_query.data[0]["userid"]

        #inserts in rating table
        rating_result=supabase.table("ratings").insert({
            "userid": userid, 
            "rating":rating,
            "ratedby":ratedby,
            "created_at":current_time,
            "created_date":today

        }).execute()

        ratings_query=supabase.table("ratings").select("rating").eq("userid", userid).execute()
        if not ratings_query.data or len(ratings_query.data) == 0:
            return jsonify({"error": "No ratings found for this user"}), 404
        
        #get rating average
        ratings = []
        for r in ratings_query.data:
            ratings.append(r["rating"])

        length=len(ratings)
        avg_rating=sum(ratings)/length

        #updates usertable
        rating_update=supabase.table("users").update({"rating":avg_rating}).eq("userid", userid).execute()
        if "error" in rating_update or not rating_update.data:
            return jsonify({"error": rating_update.get("error", "Failed to update product status")}), 500
        
        #checks for ban     
        if length>=3:#has to have atleast 3 reviews
            if avg_rating<2 or avg_rating>4:#conditions
                suspension_bool= True
        
                insert_suspension=supabase.table("user_suspensions").insert({
                    "userid": userid,
                    "is_suspended": suspension_bool,
                    "suspended_at": current_time,
                    "suspended_date": today
                }).execute()

                if not insert_suspension.data or len(insert_suspension.data) == 0:
                    return jsonify({"error": "No suspensions added for this user"}), 404

        #gets all suspension count for the user
        suspension_query= supabase.table("user_suspensions").select("*").eq("userid", userid).execute()
        if not suspension_query.data or len(suspension_query.data) == 0:
            logging.info(f"No suspension record found for user {userid}. Continuing...")
            suspension_count = 0 
        else:
            suspension_count = len(suspension_query.data)

        #three suspension count and they are then susepended
        if suspension_count>=3:
            update_suspended=supabase.table("users").update({"suspended":True}).eq("userid", userid).execute()
        
            if "error" in update_suspended or not update_suspended.data:
                return jsonify({"error": update_suspended.get("error", "Failed to update product status")}), 500

        
        return jsonify({"message": "Review posted successfully"}), 201


    except Exception as e:
        logging.error(f"Error posting posting review: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="localhost", debug=True, port=8080)
