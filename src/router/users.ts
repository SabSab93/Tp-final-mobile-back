import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const userRouter = Router();
const prisma = new PrismaClient();


// POST
userRouter.post('/register', async (req, res) => {
  const { firstname, lastname } = req.body.data;  
  const email = `${firstname}.${lastname}@gmail.com`;
  const userWithEmail = await prisma.user.findFirst({ where: { email } });
  if (userWithEmail) {
      return res.status(400).json("Email already exists");  
  } else {
      const hashedPassword = await bcrypt.hash(req.body.data.mtp, 10);
      const newUser = await prisma.user.create({
          data: {
              firstname: req.body.data.firstname,
              lastname: req.body.data.lastname,
              email: req.body.data.firstname + "." + req.body.data.lastname + "@gmail.com",
              mtp: hashedPassword 
          }
      });

      const token = jwt.sign({ email }, process.env.JWT_SECRET!);
      return res.status(201).json({token});
  }
});

// GET
userRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
})


//GET ID
userRouter.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});


//DELETE
userRouter.delete("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  res.json({ message: "User deleted" });
});



//PUT 
userRouter.put("/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
  
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
  
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    let hashedPassword = user.mtp; 
  
    if (req.body.data.mtp) {
      hashedPassword = await bcrypt.hash(req.body.data.mtp, 10);
    }
  

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        lastname: req.body.data.lastname,
        firstname: req.body.data.firstname,
        email: req.body.data.email,
        mtp: hashedPassword,
      },
    });
  
    res.json(updatedUser);
  });
  
