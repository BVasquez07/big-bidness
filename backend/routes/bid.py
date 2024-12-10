from config import supabase
import logging
from flask import jsonify, request
from datetime import datetime
from routes.auth import access_token
from routes.product import update_product_post
from routes.accountbalance import updatebalance

#bid for proudct
def postbid():
    try:

        query=request.json
        product_id=query.get("product_id")
        bidamount=query.get("bidamount")
        biddeadline = query.get("biddeadline") 

        if not bidamount or not product_id:
            return jsonify({"error": "bid details and product ID are required"}), 400
        
        biddeadline = datetime.strptime(biddeadline, '%Y-%m-%d %H:%M:%S')

        email=access_token()

        user_query = supabase.table("users").select("userid").eq("email", email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404

        userid = user_query.data[0]["userid"]
        product_query=supabase.table("products").select("is_available").eq("product_id",product_id ).execute()
        product_bool= product_query.data[0]["is_available"]

        seller_query=supabase.table("products").select("sellerid").eq("product_id",product_id).execute()
        sellerid=seller_query.data[0]["sellerid"]
        if product_bool:
            bid_result=supabase.table("bids").insert({
                "product_id": product_id, 
                "userid": userid, 
                "sellerid":sellerid,
                "bidamount":bidamount,
                "biddeadline": biddeadline.strftime('%Y-%m-%d %H:%M:%S'),
                "bid_accepted":False


            }).execute()

            if not bid_result.data or len(bid_result.data) == 0:
                return jsonify({"error": "Failed to insert the bid"}), 500
        else:
            return jsonify({"message": "Product no longer availabe"}), 201


        return jsonify({"message": "Bid posted successfully", "bid_id": bid_result.data[0]["bidid"]}), 201



    except Exception as e:
        logging.error(f"Error posting bid: {str(e)}")
        return jsonify({"error": str(e)}), 500

def getallbids():
    try:
       

        now=datetime.now()
        bid=supabase.table("bids").select("*").gte("biddeadline", now.strftime('%Y-%m-%d %H:%M:%S')).execute()
       
        if bid.data:
            return jsonify({"products": bid.data}), 200
        else:
            return jsonify({"products": []}), 200

    except Exception as e:
        logging.error(f"Error fetching products: {str(e)}")
        return jsonify({"error": str(e)}), 500


#get all the bid that are not expired
def getproductbid():
    try:
        product_id = request.args.get("product_id")
        if not product_id:
            return jsonify({"error": "Product ID is required"}), 400

        now=datetime.now()


        bid_result = (
            supabase.table("bids")
            .select("*")
            .eq("product_id", product_id)
            .gte("biddeadline", now.strftime('%Y-%m-%d %H:%M:%S'))  
            .execute()
        )

        if not bid_result.data or len(bid_result.data) == 0:
            return jsonify({"bids": []}), 200
        bids= []
        for bid in bid_result.data:
            product_id=bid.get("product_id")
            buyerid=bid.get("userid")
            sellerid=bid.get("sellerid")
            bidamount=bid.get("bidamount")
            biddeadline=bid.get("biddeadline")
            bid_accepted=bid.get("bid_accepted")
            product_result=supabase.table("products").select("product_name").eq("product_id", product_id).execute()
            buyer_result=supabase.table("users").select("username","firstname","lastname").eq("userid", buyerid).execute()
            seller_result=supabase.table("users").select("username").eq("userid", sellerid).execute()

            product_name=product_result.data[0].get("product_name")
            buyer_name=buyer_result.data[0].get("username")
            firstname=buyer_result.data[0].get("firstname")
            lastname=buyer_result.data[0].get("lastname")
            seller_name=seller_result.data[0].get("username")

        
            bids.append({
                "productname": product_name,
                "buyername": buyer_name,
                "fisrstname":firstname,
                "lastname":lastname,
                "buyerid":buyerid,
                "sellername": seller_name,
                "sellerid":sellerid,
                "bidamount": bidamount,
                "biddeadline":biddeadline,
                "bid_accepted":bid_accepted
                
            })

        return jsonify({"bids": bids}), 200

    except Exception as e:
        logging.error(f"Error fetching bids: {str(e)}")
        return jsonify({"error": str(e)}), 500

def getuserbid():
    try:
        email=access_token()
        user_query = supabase.table("users").select("userid").eq("email", email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404
        userid=user_query.data[0]["userid"]

        now=datetime.now()

        bid_result = (
            supabase.table("bids")
            .select("*")
            .eq("userid", userid)
            .gte("biddeadline", now.strftime('%Y-%m-%d %H:%M:%S'))  #
            .execute()
        )

        if not bid_result.data or len(bid_result.data) == 0:
            return jsonify({"bids": []}), 200
        
        bids= []
        for bid in bid_result.data:
            product_id=bid.get("product_id")
            sellerid=bid.get("sellerid")
            bidamount=bid.get("bidamount")
            biddeadline=bid.get("biddeadline")
            bid_accepted=bid.get("bid_accepted")

            product_result=supabase.table("products").select("product_name").eq("product_id", product_id).execute()
            user_result=supabase.table("users").select("username","firstname","lastname").eq("userid", userid).execute()
            seller_result=supabase.table("users").select("username").eq("userid", sellerid).execute()

            product_name=product_result.data[0].get("product_name")
            username=user_result.data[0].get("username")
            firstname=user_result.data[0].get("firstname")
            lastname=user_result.data[0].get("lastname")
            seller_name=seller_result.data[0].get("username")

        
            bids.append({
                "productname": product_name,
                "username": username,
                "fisrstname":firstname,
                "lastname":lastname,
                "userid":userid,
                "sellername": seller_name,
                "sellerid":sellerid,
                "bidamount": bidamount,
                "biddeadline":biddeadline,
                "bid_accepted":bid_accepted
                
            })


        return jsonify({"bids": bids}), 200
        

    except Exception as e:
        logging.error(f"Error fetching bids: {str(e)}")
        return jsonify({"error": str(e)}), 500

def getpastbid():
    try:
        email=access_token()
        user_query = supabase.table("users").select("userid").eq("email", email).execute()
        if not user_query.data or len(user_query.data) == 0:
            return jsonify({"error": "User not found"}), 404
        userid=user_query.data[0]["userid"]

        now=datetime.now()

        bid_result = (
            supabase.table("bids")
            .select("*")
            .eq("userid", userid)
            .lt("biddeadline", now.strftime('%Y-%m-%d %H:%M:%S'))  #
            .execute()
        )

        if not bid_result.data or len(bid_result.data) == 0:
            return jsonify({"bids": []}), 200
        
        bids= []
        for bid in bid_result.data:
            product_id=bid.get("product_id")
            sellerid=bid.get("sellerid")
            bidamount=bid.get("bidamount")
            biddeadline=bid.get("biddeadline")
            bid_accepted=bid.get("bid_accepted")

            product_result=supabase.table("products").select("product_name").eq("product_id", product_id).execute()
            user_result=supabase.table("users").select("username","firstname","lastname").eq("userid", userid).execute()
            seller_result=supabase.table("users").select("username").eq("userid", sellerid).execute()

            product_name=product_result.data[0].get("product_name")
            username=user_result.data[0].get("username")
            firstname=user_result.data[0].get("firstname")
            lastname=user_result.data[0].get("lastname")
            seller_name=seller_result.data[0].get("username")

        
            bids.append({
                "productname": product_name,
                "username": username,
                "fisrstname":firstname,
                "lastname":lastname,
                "userid":userid,
                "sellername": seller_name,
                "sellerid":sellerid,
                "bidamount": bidamount,
                "biddeadline":biddeadline,
                "bid_accepted":bid_accepted
                
            })

        return jsonify({"bids": bids}), 200
        

    except Exception as e:
        logging.error(f"Error fetching bids: {str(e)}")
        return jsonify({"error": str(e)}), 500



def acceptbid():
    try:
        
        query=request.json
        product_id = query.get("product_id")
        if not product_id:
            return jsonify({"error": "Product ID is required"}), 400

        now=datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        email=access_token()

        signin_query = supabase.table("users").select("userid").eq("email", email).execute()
        if not signin_query.data or len(signin_query.data) == 0:
            return jsonify({"error": "User not found"}), 404

        signinid = signin_query.data[0]["userid"]
        product_query=supabase.table("products").select("is_available").eq("product_id",product_id ).execute()
        product_bool= product_query.data[0]["is_available"]
        print(product_bool)

        seller_query=supabase.table("bids").select("sellerid").eq("product_id",product_id ).execute()
        sellerid= seller_query.data[0]["sellerid"]

        buyer_query=supabase.table("bids").select("userid").eq("product_id",product_id ).execute()
        buyerid= buyer_query.data[0]["userid"]

        price_query=supabase.table("bids").select("bidamount").eq("product_id",product_id).eq("userid",buyerid).execute()
        price=price_query.data[0]["bidamount"]

        if signinid != sellerid:
            return jsonify({"error": "You are not the seller"}), 201
        else:
            print("looks good")

        if product_bool:
            accept=supabase.table("bids").update({"bid_accepted":True}).eq("product_id",product_id).eq("userid",buyerid).execute()
            if not accept.data or len(accept.data) == 0:
                logging.error(f"Error accepting bid: {accept.error}")
                return jsonify({"error": f"Error accepting bid: {accept.error}"}), 500
        else:
            logging.error("Product not available for bid acceptance.")
            return jsonify({"error": "Product not available"}), 400



        account_info=supabase.table("users").select("accountbalance").eq("email",email).execute()
        if not account_info.data or len(account_info.data) == 0:
            return jsonify({"error": "Account not found"}), 404
        
        account_balance=account_info.data[0]["accountbalance"]


        if account_balance < price:
            return jsonify({"error": "Insufficient balance"}), 400
        
        bid_response=supabase.table("transactions").insert({
            "product_id":product_id,
            "sellerid":sellerid,
            "buyerid":buyerid,
            "buytime":now,
            "price":price,
            "rating_posted":False
        }).execute()



        if not bid_response.data or len(bid_response.data) == 0:
            return jsonify({"error": "did not accept bid"}), 404
        
        update_product=update_product_post()

        if not update_product:
            return jsonify({"error": "did not update product"}), 404
        
        update_balance=updatebalance(price,sellerid)
        if not update_balance:
            return jsonify({"error": "Inussficent balance"}), 403

        return jsonify({"message": "Transaction posted successfully"}), 201
        

        


    except Exception as e:
        logging.error(f"Error fetching bids: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500
