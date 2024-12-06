from flask import jsonify
from config import supabase
import logging
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
import logging
from datetime import datetime
from routes.auth import access_token

def grant_admin():
    try:
        query = request.json
        username = query.get("username")
        email = access_token()

        requester_response=supabase.table("users").select("role").eq("email", email).single().execute()
        if not requester_response.data:
            return jsonify({"error": "Requester not found"}), 404

        if requester_response.data.get("role")!="Admin":
            return jsonify({"error": "Unauthorized action. Admin privileges required."}), 403
        


        target_user_response=supabase.table("users").select("role").eq("username", username).single().execute()
        if not target_user_response.data:
            return jsonify({"error": "Target user not found"}), 404

        if target_user_response.data.get("role")=="Admin":
            return jsonify({"message": "User is already an admin"}), 200




        update_response = supabase.table("users").update({"role": "Admin"}).eq("username", username).execute()
        if not update_response.data:
            return jsonify({"error": "Failed to update user role"}), 500
        
        return jsonify({"message": f"User '{username}' has been granted admin privileges by {email} "}), 200






    except Exception as e:
        logging.error(f"Error granting admin privileges: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    


def approve_user():
    try:
        query=request.json
        username=query.get("username")
        email=access_token()

        requester_response=supabase.table("users").select("role, userid").eq("email", email).single().execute()
        if not requester_response.data:
            return jsonify({"error": "Requester not found"}), 404

        requester_role=requester_response.data.get("role")
        admin_id=requester_response.data.get("userid")
        if requester_role!="Admin":
            return jsonify({"error": "Unauthorized action. Admin privileges required."}), 403

        target_user_response = supabase.table("approvals").select("applicationdetails").eq("username", username).single().execute()
        if not target_user_response.data:
            return jsonify({"error": "Target user not found in approvals"}), 404

        approval_status=target_user_response.data.get("applicationdetails")
        if approval_status=="Approved":
            return jsonify({"message": f"User '{username}' is already approved"}), 200


        update_response=(
            supabase.table("approvals")
            .update({"applicationdetails": "Approved", "approvedby": admin_id})
            .eq("username", username)
            .execute()
        )

        if not update_response.data:
            return jsonify({"error": "Failed to approve user"}), 500

        logging.info(f"User '{username}' approved successfully by admin {admin_id}")
        return jsonify({"message": f"User '{username}' has been approved by Admin"}), 200

    except Exception as e:
        logging.error(f"Error approving user: {str(e)}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500








