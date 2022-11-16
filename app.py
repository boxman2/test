from flask import Flask, render_template, jsonify, request, session, redirect, url_for

app = Flask(__name__)

from pymongo import MongoClient
import certifi

ca=certifi.where()
client = MongoClient('mongodb+srv://test:sparta@cluster0.zhmj7xm.mongodb.net/AtlasCluster?retryWrites=true&w=majority')
db = client.dbsparta
# JWT 토큰을 만들 때 필요한 비밀문자열입니다. 아무거나 입력해도 괜찮습니다.
# 이 문자열은 서버만 알고있기 때문에, 내 서버에서만 토큰을 인코딩(=만들기)/디코딩(=풀기) 할 수 있습니다.
SECRET_KEY = 'SPARTA'

# JWT 패키지를 사용합니다. (설치해야할 패키지 이름: PyJWT)
import jwt

# 토큰에 만료시간을 줘야하기 때문에, datetime 모듈도 사용합니다.
import datetime

# 회원가입 시엔, 비밀번호를 암호화하여 DB에 저장해두는 게 좋습니다.
# 그렇지 않으면, 개발자(=나)가 회원들의 비밀번호를 볼 수 있으니까요.^^;
import hashlib

@app.route('/')
def home():
   return render_template('secret.html')
@app.route('/comment', methods=['POST'])
def web_comment_post():
    comment_receive = request.form['commentContent_give']
    ID_receive = request.form['ID_give']
    num_receive = request.form['num_give']

    doc = {"comment":comment_receive, "id":ID_receive, "num":num_receive}
    db.comment.insert_one(doc)
    return jsonify({'msg':'코멘트 완료!'})

@app.route("/comment", methods=["GET"])
def web_comment_get():
    num_receive = request.args.get('num_give')
    comment_list = list(db.comment.find({"num":num_receive}, {'_id': False}))
    return jsonify({'comments': comment_list})

@app.route("/user", methods=["GET"])
def web_users_get():
    user_list = list(db.user.find({"isSecret":"true"}, {'_id': False}))
    return jsonify({'user': user_list})
@app.route('/user', methods=['POST'])
def web_users_post():
    like_receive = request.form['like_give']
    num_receive = request.form['num_give']
    print(num_receive)

    db.user.update_one({'num': num_receive}, {'$set': {'like': like_receive}})
    return jsonify({'like':like_receive})

# @app.route('/like', methods=['POST'])
# def web_comment_post():
#     like_receive = request.form['like_give']
#     ID_receive = request.form['ID_give']
#     num_receive = request.form['num_give']
#     if
#     doc = {"like":int(like_receive+1), "id":ID_receive, "num":num_receive}
#     db.like.insert_one(doc)
#     return jsonify({'msg':'코멘트 완료!'})

if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)
