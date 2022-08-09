from calendar import month
from django.shortcuts import redirect
from flask import Flask, render_template,request
from datetime import datetime,timedelta
from flask import redirect

app = Flask(__name__)
@app.route("/")
def index():
    return redirect("/lionking/2022-02-01")
    
@app.route("/lionking/<date>")
def calendar(date):
    print("in lion king server")
    return render_template("calendar.html",dstr=date)

app.run(debug=True,port=9520)