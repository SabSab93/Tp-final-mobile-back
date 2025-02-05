import { Router } from "express";
import { PrismaClient } from "@prisma/client";


export const classRoomRouter = Router();
const prisma = new PrismaClient();


// POST
classRoomRouter.post('/', async (req, res) => {
  const classRooms = await prisma.classRoom.create({
    data : {
      name:req.body.data.name
    }

  });
  res.status(201).json(classRooms);
})



// GET
classRoomRouter.get("/", async (req, res) => {
  const classRooms = await prisma.classRoom.findMany();
  res.json(classRooms);
})

//GET ID
classRoomRouter.get("/:id", async (req, res) => {
  const classRoomId = parseInt(req.params.id);

  if (isNaN(classRoomId)) {
    return res.status(400).json({ message: "Invalid classRoom ID" });
  }

  const classRoom = await prisma.classRoom.findUnique({
    where: { id: classRoomId },
  });

  if (!classRoom) {
    return res.status(404).json({ message: "ClassRoom not found" });
  }

  res.json(classRoom);
});

//DELETE
classRoomRouter.delete("/:id", async (req, res) => {
  const classRoomId = parseInt(req.params.id);

  if (isNaN(classRoomId)) {
    return res.status(400).json({ message: "Invalid classRoom ID" });
  }

  const classRoom = await prisma.classRoom.findUnique({
    where: { id: classRoomId },
  });

  if (!classRoom) {
    return res.status(404).json({ message: "ClassRoom not found" });
  }

  await prisma.classRoom.delete({
    where: { id: classRoomId },
  });

  res.json({ message: "ClassRoom deleted" });
});


//PUT 
classRoomRouter.put("/:id", async (req, res) => {
  const classRoomId = parseInt(req.params.id);

  if (isNaN(classRoomId)) {
    return res.status(400).json({ message: "Invalid classRoom ID" });
  }

  const classRoom = await prisma.classRoom.findUnique({
    where: { id: classRoomId },
  });

  if (!classRoom) {
    return res.status(404).json({ message: "ClassRoom not found" });
  }

  const updatedClassRoomId = await prisma.classRoom.update({
    where: { id: classRoomId },
    data: {
      name: req.body.data.name

    },
  });

  res.json(updatedClassRoomId);
});




