import { Router } from "express";
import { PrismaClient } from "@prisma/client";


export const groupRouter = Router();
const prisma = new PrismaClient();


// POST
groupRouter.post('/', async (req, res) => {
  const groups = await prisma.group.create({
    data : {
      name:req.body.data.name,
    }

  });
  res.status(201).json(groups);
})



// GET
groupRouter.get("/", async (req, res) => {
  const groups = await prisma.group.findMany();
  res.json(groups);
})

//GET ID
groupRouter.get("/:id", async (req, res) => {
  const groupId = parseInt(req.params.id);

  if (isNaN(groupId)) {
    return res.status(400).json({ message: "Invalid group ID" });
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  res.json(group);
});

//DELETE
groupRouter.delete("/:id", async (req, res) => {
  const groupId = parseInt(req.params.id);

  if (isNaN(groupId)) {
    return res.status(400).json({ message: "Invalid group ID" });
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  await prisma.group.delete({
    where: { id: groupId },
  });

  res.json({ message: "Group deleted" });
});


//PUT 
groupRouter.put("/:id", async (req, res) => {
  const groupId = parseInt(req.params.id);

  if (isNaN(groupId)) {
    return res.status(400).json({ message: "Invalid group ID" });
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  const updatedGroup = await prisma.group.update({
    where: { id: groupId },
    data: {
        name:req.body.data.name,

    },
  });

  res.json(updatedGroup);
});




