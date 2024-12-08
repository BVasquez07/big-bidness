from config import supabase
from flask import jsonify, request
from routes.auth import access_token


def addbalance():
    try:
        query = request.json
        card = query.get("card")
        date = query.get("date")
        cvv = query.get("cvv")
        balance = query.get("balance")

        if not card or not date or not cvv or not balance:
            return jsonify({"error": "Fill in all information"}), 400

        try:
            balance=float(balance)
        except ValueError:
            return jsonify({"error": "Invalid balance value"}), 400
        

        email=access_token()
        if not email:
            return jsonify({"error": "Invalid access token"}), 401

        update_balance=supabase.table("users").update({"accountbalance": balance}).eq("email", email).execute()
        if not update_balance.data or len(update_balance.data) == 0:
            return jsonify({"error": "Account not found"}), 404

        return jsonify({"message": "Account balance posted successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def updatebalance(product_price):
    try:
        email=access_token()
        if not email:
            return jsonify({"error": "Invalid access token"}), 401
        
        account_info=supabase.table("users").select("accountbalance").eq("email",email).execute()
        if not account_info.data or len(account_info.data) == 0:
            return jsonify({"error": "Account not found"}), 404
        
        account_balance=account_info.data[0]["accountbalance"]


        if account_balance < product_price:
            return jsonify({"error": "Insufficient balance"}), 400


        new_price=account_balance-product_price
                
        update_balance=supabase.table("users").update({"accountbalance": new_price}).eq("email", email).execute()
        if not update_balance.data or len(update_balance.data) == 0:
            return jsonify({"error": "Failed to update account balance"}), 500
        

        return jsonify({"message": "Account balance posted successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        

def changeBalance(product_price):
    try:
        email=access_token()
        if not email:
            return jsonify({"error": "Invalid access token"}), 401
        
        account_info=supabase.table("users").select("accountbalance").eq("email",email).execute()
        if not account_info.data or len(account_info.data) == 0:
            return jsonify({"error": "Account not found"}), 404
        
        update_balance=supabase.table("users").update({"accountbalance": product_price}).eq("email", email).execute()
        if not update_balance.data or len(update_balance.data) == 0:
            return jsonify({"error": "Failed to update account balance"}), 500
        

        return jsonify({"message": "Account balance posted successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500



    

