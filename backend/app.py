from flask import Flask, abort, jsonify, request
from flask_cors import CORS
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import supabase
from dotenv import load_dotenv
import logging
from datetime import datetime
from auth.auth import register, signin
from user.user import personalinfo, userinfo
from suspended.suspened import getsuspended,updatesuspended
from rating.rating import rating
from product.product import product_post,update_product_post,getproducts
from complaints.complaint import postcomplaint,getproductcomplaint,getsellercomplaint
from bid.bid import postbid,getproductbid
from auth.auth import hello,register,signin


app = Flask(__name__)
CORS(app)


@app.route("/")
def hello():
    return 



        
@app.route("/register", methods=["POST"])
def register_route():
    return register()
    


    
@app.route("/signin", methods=["POST"])#checks all condtions, if everythign is okay, logs in
def signin_route():
    return signin()




@app.route("/personalinfo", methods=["GET"])#this gets the user info 
def personalinfo_route():
    return personalinfo()
    
@app.route("/userinfo", methods=["GET"])#gets any user info the user clicks ons
def userinfo_route():
    return userinfo


@app.route("/post", methods=["POST"])#posting product
def product_post_route():
    return product_post()


@app.route("/update-post", methods=["POST"])#upadte lisiting status
def update_product_post_route():
    return update_product_post()

@app.route("/get-all-products", methods=["GET"])#get all products for the front page
def getproducts_route():
    return getproducts()





@app.route("/postcomplaint", methods=["POST"])#get all complaints
def postcomplaint_route():
    return postcomplaint()


@app.route("/get-product-complaint", methods=["GET"])#get complainst based on product only
def getproductcomplaint_route():
    return getproductcomplaint()


@app.route("/get-seller-complaint", methods=["GET"])#get onlby seller complaint
def getsellercomplaint_route():
    return getsellercomplaint()

@app.route("/postbid", methods=["POST"])#bid for proudct
def postbid_route():
    return postbid()



@app.route("/get-product-bid", methods=["GET"])#get all the bid that are not expired
def getproductbid_route():
    return getproductbid()



@app.route("/submitrating", methods=["POST"])  # this submits rating and checks for suspension
def rating_route():
    return rating()

@app.route("/get-suspended", methods=["GET"])
def getsuspended_route():
    return getsuspended()


@app.route("/update-suspended", methods=["POST"])
def updatesuspended_route():
    return updatesuspended()


if __name__ == "__main__":
    app.run(host="localhost", debug=True, port=8080)
