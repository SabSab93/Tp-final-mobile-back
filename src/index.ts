import cors from "cors";
import "dotenv/config";
import express from "express";
import bcrypt from "bcrypt";



import { studentRouter } from "./router/students";
import { PrismaClient } from "@prisma/client";
import { classRoomRouter } from "./router/classRooms";
import { userRouter } from "./router/users";
import { compare } from "bcrypt";
import { groupRouter } from "./router/groups";
import jwt from 'jsonwebtoken';

export const prisma = new PrismaClient();


const app = express();

// export const monMiddleware = async (req: any, res: any, next: any) => {
//   if (!req.headers.authorization) {
//     return res.status(401).json({ message: 'Authorization header missing' });
//   }

//   const authHeader = req.headers.authorization.split(' ');
//   if (authHeader[0] !== 'Basic' || authHeader.length !== 2) {
//     return res.status(401).json({ message: 'Invalid authorization format' });
//   }

//   const b64auth = authHeader[1];
//   const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
//   if (!login || !password) {
//     return res.status(401).json({ message: 'Invalid login or password format' });
//   }

//   const user = await prisma.user.findFirst({ where: { email: login } });

//   if (!user) {
//     return res.status(401).json({ message: 'Invalid login or password' });
//   }

//   const passwordMatch = await bcrypt.compare(password, user.mtp);

//   if (!passwordMatch) {
//     return res.status(401).json({ message: 'Invalid login or password' });
//   }
//   next();
// };



// export const monMiddlewareBearer = async (req: any, res: any, next: any) => {

//   if (!req.headers.authorization) {
//     return res.status(401).json({ message: 'Authorization header missing' });
//   }
//   const authHeader = req.headers.authorization.split(' ');

//   if (authHeader[0] !== 'Bearer' || authHeader.length !== 2) {
//     return res.status(401).json({ message: 'Invalid authorization format' });
//   }

//   const token = authHeader[1];
//   const jwtSecret = process.env.JWT_SECRET;
//   if (!jwtSecret) {
//     return res.status(500).json({ message: 'JWT_SECRET is not defined in the environment' });
//   }
//   const decoded = jwt.verify(token, jwtSecret) as unknown as { email: string };
//   const user = await prisma.user.findFirst({
//     where: { email: decoded.email }, 
//   });

//   if (!user) {
//     return res.status(401).json({ message: 'Invalid token or user not found' });
//   }
//   next();
// };


export const monMiddlewareBearer = async (req: any, res: any, next: any) => {
  const fullToken = req.headers.authorization;
  if (!fullToken) {
      res.status(401).send("No token provided");
  }
  else {

      const [typeToken, token] = fullToken.split(" ");
      if(typeToken !== "Bearer"){
          res.status(401).send("Invalid token type");
      }
      else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        if (decoded) {
          req.token = token;
          next();
      }
      else {
        res.status(401).send("Invalid token");
      }
  }
};



app.use(cors()); // tout le monde à le droit de se connecter
app.use(express.json());

const apiRouter = express.Router();


apiRouter.use("/auth", userRouter)
apiRouter.use("/students", monMiddlewareBearer, studentRouter)
apiRouter.use("/classRooms",monMiddlewareBearer, classRoomRouter)
apiRouter.use("/groups",monMiddlewareBearer, groupRouter)



app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
