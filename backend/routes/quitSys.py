from config import supabase
import logging
from flask import jsonify, request
from datetime import datetime


"""
        There are two different cases
            - the user has been forced to quit the system due to too many suspensions
                - the user will not be able to use this email again
            - a user is voluntarily deciding to quit the system
                - they can still use this email since they will be erased from the system  (delete user in user table and cascade that.)
            



"""
def getquittingsysvoluntary():
    try:
        quitting=supabase.table("voluntary_remove_user").select("removal_id, users(*), application, removed_at").execute()
        return jsonify({"Suspended_v": quitting.data}), 200
        
    except Exception as e:
        logging.error(f"Error fetching suspended: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
def getquittingsysinvoluntary():
    try:
        quitting=supabase.table("involuntary_remove_user").select("removal_id, users(*), removed_at").execute()
        return jsonify({"Suspended_inv": quitting.data}), 200

    except Exception as e:
        logging.error(f"Error fetching suspended: {str(e)}")
        return jsonify({"error": str(e)}), 500
#adding users who WANT to quit the system to a table that on sign in will need to be check if their username and quit(true) is in the table
def updatequitsysvoluntary():
    #we will be passed a specific user here.
    try:
        quitting=supabase.table("voluntary_remove_user").select("removal_id, users(*), application, removed_at").execute()
        return jsonify({"Suspended": quitting.data}), 200

    except Exception as e:
        logging.error(f"Error fetching suspended: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

#adding users who have been forced to quit the system to a table that cannot sign in again with the email.

def updatequitsysinvoluntary():
    request_data=request.json
    username=request_data.get("username")
    try:
        quitting=supabase.table("involuntary_remove_user").update("removal_id, users(*), removed_at").execute()
        return jsonify({"Suspended": quitting.data}), 200

    except Exception as e:
        logging.error(f"Error fetching suspended: {str(e)}")
        return jsonify({"error": str(e)}), 500

    return True