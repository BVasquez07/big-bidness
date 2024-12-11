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
        account_result=supabase.table("users").select("accountbalance").eq("email", email).execute()
        account_balance=account_result.data[0]["accountbalance"]
        balance=account_balance+balance

        update_balance=supabase.table("users").update({"accountbalance": balance}).eq("email", email).execute()
        if not update_balance.data or len(update_balance.data) == 0:
            return jsonify({"error": "Account not found"}), 404

        return jsonify({"message": "Account balance posted successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def updatebalance(product_price, sellerid, buyerid):
    try:
        account_info = supabase.table("users").select("accountbalance").eq("userid", buyerid).execute()
        if not account_info.data or len(account_info.data) == 0:
            return {"error": "Buyer account not found", "status": 404}
        account_balance=account_info.data[0]["accountbalance"]

        if account_balance < product_price:
            return {"error": "Insufficient balance", "status": 400}

        new_price=account_balance-product_price

        seller_account_info=supabase.table("users").select("accountbalance").eq("userid", sellerid).execute()
        if not seller_account_info.data or len(seller_account_info.data) == 0:
            return {"error": "Seller account not found", "status": 404}

        seller_account_balance=seller_account_info.data[0]["accountbalance"]
        seller_newprice=seller_account_balance + product_price
        supabase.table("users").update({"accountbalance": new_price}).eq("userid", buyerid).execute()
        supabase.table("users").update({"accountbalance": seller_newprice}).eq("userid", sellerid).execute()

        return {"message": "Balances updated successfully", "status": 200}

    except Exception as e:
        return {"error": str(e), "status": 500}

        

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



def withdrawbalance():
    try:
        query = request.json
        account_number= query.get("account_number")
        routing_number= query.get("routing_number")
        balance = query.get("balance")

        if not account_number or not routing_number or not balance:
            return jsonify({"error": "Fill in all information"}), 400

        try:
            balance=float(balance)
        except ValueError:
            return jsonify({"error": "Invalid balance value"}), 400
        

        email=access_token()
        if not email:
            return jsonify({"error": "Invalid access token"}), 401
        account_result=supabase.table("users").select("accountbalance").eq("email", email).execute()
        account_balance=account_result.data[0]["accountbalance"]
        balance=account_balance-balance
        update_balance=supabase.table("users").update({"accountbalance": balance}).eq("email", email).execute()
        if not update_balance.data or len(update_balance.data) == 0:
            return jsonify({"error": "Account not found"}), 404

        return jsonify({"message": "Account balance posted successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

