import {jwt} from "jsonwebtoken"


function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // if there isn't any token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next() // pass the execution off to whatever request the client intended
  })
}
function generateToken(req, res, next) {
  let cookie_Conf={maxAge:86400,Secure:true}

  res.cookie('Tolken',,cookie_Conf)
  next()
}
export {authenticateToken,generateToken}
