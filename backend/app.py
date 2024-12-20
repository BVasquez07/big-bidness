from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
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

@app.route("/signout", methods=["POST"])#checks all condtions, if everythign is okay, logs in
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
    return user.userinfo()

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

@app.route("/user-current-products", methods=["GET"])
def userproducts_route():
    return product.user_current_products()

@app.route('/getcompletedproducts', methods=["GET"])
def getcompletedproducts_route():
    return product.getcompletedproducts()

@app.route("/vipuser-completed-products", methods=["GET"])
def vipuser_completed_route():
    return vip.vipuser_completed_products()

@app.route("/get-all-products", methods=["GET"])#get all products for the front page
def getproducts_route():
    return product.getproducts()

@app.route("/get-all-vip-products", methods=["GET"])
def getvipproducts_route():
    return vip.getvipproducts()

@app.route("/approval-list", methods=["GET"])
def approval_list_route():
    return admin.approval_list()

@app.route("/postcomplaint", methods=["POST"])
def postcomplaint_route():
    return complaint.postcomplaint()

@app.route("/postcomment", methods=["POST"])
def postcomment_route():
    return comment.postcomment()

@app.route("/get-product-comment", methods=["GET"])
def get_product_comment_route():
    return comment.get_product_comment()

@app.route("/get-product-complaint", methods=["GET"])#get complainst based on product only
def getproductcomplaint_route():
    return complaint.getproductcomplaint()

@app.route("/get-seller-complaint", methods=["GET"])#get onlby seller complaint
def getsellercomplaint_route():
    return complaint.getsellercomplaint()

@app.route("/get-all-complaint", methods=["GET"])
def getallcomplaint_route():
    return complaint.getallcomplaint()

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
def admin_suspenion_upadte_route():
    return suspended.admin_suspenion_update()

@app.route("/get-specific-product", methods=["GET"])
def get_specific_product_route():
    return product.getspecificproduct()

@app.route("/update-pay-suspended", methods=["POST"])
def updatesuspended_route():
    return suspended.updatesuspended()

# @app.route("/submittransaction", methods=["POST"])
# def submittransaction_route():
#     return transaction.submittransaction()

@app.route("/acceptbid", methods=["POST"])
def acceptbid_route():
    return bid.acceptbid()

@app.route("/updatebalance", methods=["POST"])
def updatebalance():
    newPrice = request.json.get("newPrice")
    return accountbalance.changeBalance(newPrice)

@app.route("/addbalance", methods=["POST"])
def addbalance_route():
    return accountbalance.addbalance()

@app.route("/withdrawbalance", methods=["POST"])
def withdrawbalance_route():
    return accountbalance.withdrawbalance()
@app.route("/getuserbid", methods=["GET"])
def getuserbid_route():
    return bid.getuserbid()

@app.route('/getuserbidproduct', methods=["GET"])
def getuserbidproduct_route():
    return bid.getuserbidproduct()

@app.route("/getallbids", methods=["GET"])
def getallbid_route():
    return bid.getallbids()

@app.route("/getpastbid", methods=["GET"])
def getpastbid_route():
    return bid.getpastbid()

@app.route("/query", methods=["GET"])
def query_products_route():
    return product.query_products()

@app.route("/getquittingsys", methods=["GET"])
def getquittingsys_route():
    return quitSys.getquittingsys() 

@app.route("/updatequitsys", methods=["POST"])
def updatequittingsys_route():
    return quitSys.updatequitsysvoluntary() 

@app.route("/deletefromsys", methods=["POST"])
def deletequittingsys_route():
    return quitSys.deleteQuitSysvoluntary() 

@app.route("/valid-token", methods=["GET"])
def valid_token_route():
    return auth.valid_token()

@app.route("/getcompletedbids", methods=["GET"])
def getcompletedbids_route():
    return bid.getCompletedBids()

if __name__ == "__main__":
    app.run(host="localhost", debug=True, port=5000)
