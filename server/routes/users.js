const express = require('express');
const router = express.Router()
const User = require('../model/user')
const jwt = require('jsonwebtoken');
const config = require('../config/')


//get:データを取得する post:データを送る
router.post('/login', function(req,res){
    const { email, password } = req.body

    if(!email){
        return res.status(422).send({errors: [{title: 'User error', detail: 'メールアドレスを入力してください。'}]})
      }
    if(!password){
        return res.status(422).send({errors: [{title: 'User error', detail: 'パスワードを入力してください。'}]})
      }

    User.findOne({email},function(err,foundUser){
    if(err){
        return res.status(422).send({errors: [{title: 'User error', detail: '問題が発生しました。'}]})
      }
    if(!foundUser){
        return res.status(422).send({errors: [{title: 'User error', detail: 'ユーザーが見つかりません。'}]})
      }
    if(!foundUser.hasSamePassword(password)){
        return res.status(422).send({errors: [{title: 'User error', detail: 'パスワードが違います。'}]})
      }

    const token = jwt.sign({
        userId: foundUser.id,
        username: foundUser.username
      }, config.SECRET, { expiresIn: '1h' });

    return res.json(token)
    })



})

router.post('/register', function(req,res){
  //const { username, email, password, confirmPassword } = req.body
// 　　↓同じ意味↑
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  //!username=usernameが空っぽだった時は…
  if(!username){
    return res.status(422).send({errors: [{title: 'User error', detail: 'お名前を入力してください。'}]})
  }
  if(!email){
    return res.status(422).send({errors: [{title: 'User error', detail: 'メールアドレスを入力してください。'}]})
  }
  if(!password){
    return res.status(422).send({errors: [{title: 'User error', detail: 'パスワードを入力してください。'}]})
  }
  if(password !== confirmPassword){
    return res.status(422).send({errors: [{title: 'User error', detail: 'パスワードが一致しません。'}]})
  }

   User.findOne({email},function(err,foundUser){
    if(err){
        return res.status(422).send({errors: [{title: 'User error', detail: '問題が発生しました。'}]})
       }
    if(foundUser){
        return res.status(422).send({errors: [{title: 'User error', detail: 'そのEメールアドレスは既に存在しています。'}]})
       }

       const user = new User({username,email,password})
       user.save(function(err){
           if(err){
            return res.status(422).send({errors: [{title: 'User error', detail: '問題が発生しました。'}]})
           }
           return res.json({"registered": true})
       })
       
      })

})

module.exports = router