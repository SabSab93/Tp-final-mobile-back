import { Router } from "express";
import { PrismaClient } from "@prisma/client";


export const userRouter = Router();
const prisma = new PrismaClient();


// POST
userRouter.post('/register', async (req, res) => {
  const users = await prisma.user.create({
    data : {
      firstname:req.body.data.firstname,
      lastname: req.body.data.lastname,
      email: req.body.data.firstname + "." + req.body.data.lastname + "@gmail.com",
      mtp: req.body.data.mtp
    }

  });
  res.status(201).json(users);
})


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

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      lastname: req.body.data.lastname,
      firstname: req.body.data.firstname,
      email: req.body.data.email,
      mtp: req.body.data.mtp
    },
  });

  res.json(updatedUser);
});
