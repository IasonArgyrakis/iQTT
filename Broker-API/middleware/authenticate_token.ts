import {jwt} from "jsonwebtoken"

function authenticateToken(req, res, next) {
  //neeed to hande the reqest and next() or not 
  if(req.signedCookies.Jas)
  {
    console.log("if")
    next()
  }else {res.redirect("/login")}

}

function generateToken(req, res, next) {
  let cookie_Conf={maxAge:86400,Secure:true}

  res.cookie('Tolken',"",cookie_Conf)
  next()
}
export {authenticateToken,generateToken}
