from flask import jsonify
from config import supabase
import logging
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
import logging
from datetime import datetime

#get all complaints
def postcomplaint():
    try:
        
        query=request.json
        complaintdetails=query.get("complaintdetails")
        status=query.get("status", "pending")
        product_id=query.get("product_id")

       
        if not complaintdetails or not product_id:
            return jsonify({"error": "Complaint details and product ID are required"}), 400

        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401
            
        user_response=supabase.auth.get_user(token)

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

#get complainst based on product only
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

#get onlby seller complaint
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
