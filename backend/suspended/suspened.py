from flask import jsonify
from config import supabase
import logging
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import os
import logging
from datetime import datetime



def getsuspended():
    try:
       
        suspended=supabase.table("user_suspensions").select("*").eq("is_suspended",True).execute()

       
        if suspended.data:
            return jsonify({"Suspended": suspended.data}), 200
        else:
            return jsonify({"Suspended": []}), 200

    except Exception as e:
        logging.error(f"Error fetching suspended: {str(e)}")
        return jsonify({"error": str(e)}), 500