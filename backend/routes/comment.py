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
        comments= []
        for comment in comment_result.data:
            comment_id=comment.get("comment_id")
            product_id=comment.get("product_id")
            userid=comment.get("userid")
            created_at=comment.get("created_at")
            text=comment.get("text")

        
            product_result=supabase.table("products").select("product_name").eq("product_id", product_id).execute()
            user_result=supabase.table("users").select("username").eq("userid", userid).execute()

            product_name=product_result.data[0].get("product_name")
            username=user_result.data[0].get("username")

            comments.append({
                "comment_id":comment_id,
                "product_id": product_id,
                "product_name":product_name,
                "username": username,
                "created_at":created_at,
                "text":text
            })

            
        if not comments or len(comments) == 0:
            return jsonify({"ccomment": []}), 200

        return jsonify({"comment": comments}), 200

    
    except Exception as e:
        logging.error(f"Error fetching complaints: {str(e)}")
        return jsonify({"error": str(e)}), 500



