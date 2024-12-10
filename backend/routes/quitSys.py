from config import supabase
import logging
from flask import jsonify, request
from datetime import datetime

def getquittingsys():
    try:
        quitting=supabase.table("voluntary_remove_user").select("removal_id, users(*), application, removed_at").execute()
        return jsonify({"Quitting": quitting.data}), 200
    except Exception as e:
        logging.error(f"Error fetching suspended: {str(e)}")
        return jsonify({"error": str(e)}), 500

#adding users who WANT to quit the system to a table that on sign in will need to be check if their username and quit(true) is in the table
def updatequitsysvoluntary():
    #we will be passed a specific user here.
    #assuming we are recieving a userid in the request body.
    query=request.json
    userid=query.get("userid")

    if not userid:  
        return jsonify({"error": "Request missing information: check that userid has been sent in the request body"}), 400
    
    PAYLOAD = {
        "user_id": userid
    }

    try:
        quitting_users=supabase.table("voluntary_remove_user").select("user_id").execute()

        if quitting_users.data:
            for user in quitting_users.data:
                if user.get("user_id") == userid:
                    return jsonify({"error": "User already applied to delete"}), 400
                
        quitting=supabase.table("voluntary_remove_user").insert(PAYLOAD).execute()
        return jsonify({"Added": quitting.data}), 200
    except Exception as e:
        logging.error(f"Error fetching removed users: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
def deleteQuitSysvoluntary():
    #assuming we recieve the userid and the application in the request body.
    query=request.json
    userid=query.get("userid")
    application=query.get("application")

    if not userid or not application:
        return jsonify({"error": "Request missing information: check that userid and application has been sent in the request body"}), 400
    elif application == True: #  delete the user from user table (the system).
        try:
            remove_user=supabase.table("users").delete().eq("userid", userid).execute()
            return jsonify({"Removed from system": remove_user.data}), 200
        except Exception as e:
            logging.error(f"Error fetching user data: {str(e)}")
            return jsonify({"error": str(e)}), 500
    else: #remove the row from the quitSys table (not the system).
        try:
            remove_user=supabase.table("voluntary_remove_user").delete().eq("user_id", userid).execute()
            return jsonify({"Keeping in system": remove_user.data}), 200
        except Exception as e:
            logging.error(f"Error fetching user data: {str(e)}")
            return jsonify({"error": str(e)}), 500

def deleteQuitSysInvoluntary(userid: str): # we will automatically just delete them no need to store them
    #this function will be used within issuspended since it does a check to see whether or not someone should be suspended. 
    try:
        remove_user=supabase.table("users").delete().eq("userid", userid).execute()
        return jsonify({"Removed from system": remove_user.data}), 200
    except Exception as e:
        logging.error(f"Error fetching user data: {str(e)}")
        return jsonify({"error": str(e)}), 500