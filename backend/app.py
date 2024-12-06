from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import supabase
from dotenv import load_dotenv
import logging
from datetime import datetime
from routes import *


app = Flask(__name__)
CORS(app)


@app.route("/")
def hello():
    return jsonify({"res": "Hello World!"})



        
@app.route("/register", methods=["POST"])
def register_route():
    return auth.register() 
    


    
@app.route("/signin", methods=["POST"])#checks all condtions, if everythign is okay, logs in
def signin_route():
    return auth.signin()

@app.route("/signout", methods=["POST"])
def signout_route():
    return auth.signout()


@app.route("/grant-admin", methods=["POST"])
def grant_admin_route():
    return admin.grant_admin()

@app.route("/approve-user", methods=["POST"])
def approve_user_route():
    return admin.approve_user()


@app.route("/personalinfo", methods=["GET"])#this gets the user info 
def personalinfo_route():
    return user.personalinfo()
    
@app.route("/userinfo", methods=["GET"])#gets any user info the user clicks ons
def userinfo_route():
    return user.userinfo


@app.route("/post", methods=["POST"])#posting product
def product_post_route():
    return product.product_post()

@app.route("/vippost", methods=["POST"])#posting product
def vip_product_post_route():
    return vip.vip_product_post()


@app.route("/update-post", methods=["POST"])#upadte lisiting status
def update_product_post_route():
    return product.update_product_post()

@app.route("/update-vip-post", methods=["POST"])#upadte lisiting status
def update_product_vip_post_route():
    return vip.update_product_post()

@app.route("/vipuser-current-products", methods=["GET"])
def vipuserproducts_route():
    return vip.vipuser_current_products()

@app.route("/vipuser-completed-products", methods=["GET"])
def vipuser_completed_route():
    return vip.vipuser_completed_products()

@app.route("/get-all-products", methods=["GET"])#get all products for the front page
def getproducts_route():
    return product.getproducts()

@app.route("/get-all-vip-products", methods=["GET"])
def getvipproducts_route():
    return vip.getvipproducts()




@app.route("/postcomplaint", methods=["POST"])#get all complaints
def postcomplaint_route():
    return complaint.postcomplaint()


@app.route("/get-product-complaint", methods=["GET"])#get complainst based on product only
def getproductcomplaint_route():
    return complaint.getproductcomplaint()


@app.route("/get-seller-complaint", methods=["GET"])#get onlby seller complaint
def getsellercomplaint_route():
    return complaint.getsellercomplaint()

@app.route("/postbid", methods=["POST"])#bid for proudct
def postbid_route():
    return bid.postbid()



@app.route("/get-product-bid", methods=["GET"])#get all the bid that are not expired
def getproductbid_route():
    return bid.getproductbid()



@app.route("/submitrating", methods=["POST"])  # this submits rating and checks for suspension
def rating_route():
    return rating.rating()

@app.route("/get-suspended", methods=["GET"])
def getsuspended_route():
    return suspended.getsuspended()


@app.route("/update-suspended", methods=["POST"])
def updatesuspended_route():
    return suspended.updatesuspended()

@app.route("/submittransaction", methods=["POST"])
def submittransaction_route():
    return transaction.submittransaction()

@app.route("/acceptbid", methods=["POST"])
def acceptbid_route():
    return bid.acceptbid()

@app.route("/addbalance", methods=["POST"])
def addbalance_route():
    return accountbalance.addbalance()

@app.route("/getuserbid", methods=["GET"])
def getuserbid_route():
    return bid.getuserbid()
@app.route("/getallbids", methods=["GET"])
def getallbid_route():
    return bid.getallbids()

@app.route("/getpastbid", methods=["GET"])
def getpastbid_route():
    return bid.getpastbid()







if __name__ == "__main__":
    app.run(host="localhost", debug=True, port=8080)
