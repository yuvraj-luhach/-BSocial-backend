import jwt from "jsonwebtoken";

const secret = "test";

// ************** auth middleware is important since it will verify is the user exists in database and has a valid jwt ****************

// click like button => auth middleware (NEXT) => like controller

const auth = async (req, res, next) => {
  try {
    console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    // if we have a token and its our own CustomAuth
    if (token && isCustomAuth) {
      // gives data from each specific token
      decodedData = jwt.verify(token, secret);

      console.log(`${decodedData} custom auth`);

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      console.log(`${decodedData} google auth`);

      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
