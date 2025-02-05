import cors from "cors";
import "dotenv/config";
import express from "express";


// import { userRouter } from "./router/users";
import { studentRouter } from "./router/students";
import { PrismaClient } from "@prisma/client";
import { classRoomRouter } from "./router/classRooms";
import { userRouter } from "./router/users";

export const prisma = new PrismaClient();


const app = express();

export const monMiddleware =  async (req: any, res: any, next: any) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Invalid token' });
  } else {
    console.log(req.headers.authorization);
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    console.log(login, password);
    const user = await prisma.user.findMany({ 
      where: { 
        email: login, 
        mtp: password 
      }});

    if (!user) {
      return res.status(401).json({ message: 'Invalid login or password' });
    } else {
      next(); 
    }
  }
};


// app.use(cors()); // tout le monde à le droit de se connecter
app.use(express.json());

const apiRouter = express.Router();


apiRouter.use("/auth", userRouter)
apiRouter.use("/students", studentRouter)
apiRouter.use("/classRooms", classRoomRouter)



app.use("/api", apiRouter);


app.use("/api",monMiddleware, apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
