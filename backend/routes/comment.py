from config import supabase
import logging
from flask import jsonify, request
from datetime import datetime
from routes.auth import access_token



def postcomment():
    try:
        
        query=request.json
        text=query.get("text")
        product_id=query.get("product_id")

        now=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        if not text or not product_id:
            return jsonify({"error": "Comment details and product ID are required"}), 400

        email=access_token()
        
        commenter_result=supabase.table("users").select("userid").eq("email", email).execute()

        if not commenter_result.data or len(commenter_result.data) == 0:
            return jsonify({"error":"User not found"}), 404

        commenterid=commenter_result.data[0].get("userid") 
        
        comment_result=supabase.table("comments").insert({
            "product_id": product_id, 
            "userid": commenterid, 
            "text": text,
            "created_at":now
        }).execute()

        
        if not comment_result.data or len(comment_result.data) == 0:
            return jsonify({"error": "Failed to post the complaint"}), 500

    
        return jsonify({
            "message": "comment posted successfully",
            "comment_id": comment_result.data[0].get("comment_id")
        }), 200

    except Exception as e:
        logging.error(f"Error posting comment: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
def get_product_comment():
    try:
        product_id=request.args.get("product_id")


        comment_result = supabase.table("comments").select("*").eq("product_id", product_id).execute()


        if not comment_result.data or len(comment_result.data) == 0:
            return jsonify({"complaints": []}), 200

        return jsonify({"complaints": comment_result.data}), 200

    
    except Exception as e:
        logging.error(f"Error fetching complaints: {str(e)}")
        return jsonify({"error": str(e)}), 500



