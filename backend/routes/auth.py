from config import supabase
import logging
from flask import jsonify, request


def register():
    try:
        #parameters
        query=request.json
        firstname=query.get("firstname")
        lastname=query.get("lastname")
        email=query.get("email")
        username=query.get("username")
        password=query.get("password")
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
            "role": "User",
            "accountbalance":0.0,
            "rating": 0.00,
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
    


    
#checks all condtions, if everythign is okay, logs in
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
        print(user_response)

        user=user_response.user
        email = user.email  

        user_query=supabase.table("users").select("userid").eq("email", email).execute()
        user_data=user_query.data

        if not user_data:
            return jsonify({"error": "Seller not found"}), 404

        userid=user_data[0]["userid"]

        # check suspended status
        suspended_result=supabase.table("user_suspensions").select("is_suspended").eq("userid", userid).execute()
        suspended_data=suspended_result.data if suspended_result.data else []

        if not suspended_data:
            suspended_status= False
        else:
            suspended_status=suspended_data[0]["is_suspended"]
         #suspended conditions
        if suspended_status is True:
            return jsonify({"error": "Account Suspended", "redirect_to": "/suspended"}), 403

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

        role_response=supabase.table("users").select("role").eq("userid",userid).execute()
        if role_response.data and len(role_response.data) > 0:
            role = role_response.data[0]["role"]
        else:
            return jsonify({"error": "Role not found"}), 404

        if role!="Admin":
            #get ratings with created_at and created_date
            rating_result = supabase.table("ratings").select("rating, created_at").eq("userid", userid).execute()
            rating_data = rating_result.data if rating_result.data else []

            #sort by created_at and created_date
            ratings_sorted = sorted(
                rating_data, 
                key=lambda r: (r.get("created_at"))
            )

            #extract the top 4 ratings
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


def access_token():
    try:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401
        user_auth=supabase.auth.get_user(token)
        if not user_auth or not hasattr(user_auth,'user') or not user_auth.user:
            return jsonify({"error":"Authentication failed"}), 401

        user = user_auth.user
        email = user.email  
        return email
    
    except Exception as e:
        logging.error(f"Error during token: {str(e)}")
        return jsonify({"error": str(e)}), 500


