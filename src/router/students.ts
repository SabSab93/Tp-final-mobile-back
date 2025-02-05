import { Router } from "express";
import { PrismaClient } from "@prisma/client";


export const studentRouter = Router();
const prisma = new PrismaClient();


// POST
studentRouter.post('/', async (req, res) => {
  const students = await prisma.student.create({
    data : {
      firstname:req.body.data.firstname,
      lastname: req.body.data.lastname,
      age: req.body.data.age,
      classRoomId: req.body.data.classRoomId,

    }

  });
  res.status(201).json(students);
})



// GET
studentRouter.get("/", async (req, res) => {
  const students = await prisma.student.findMany();
  res.json(students);
})

//GET ID
studentRouter.get("/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);

  if (isNaN(studentId)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});

//DELETE
studentRouter.delete("/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);

  if (isNaN(studentId)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  await prisma.student.delete({
    where: { id: studentId },
  });

  res.json({ message: "Student deleted" });
});


//PUT 
studentRouter.put("/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);

  if (isNaN(studentId)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const updatedStudent = await prisma.student.update({
    where: { id: studentId },
    data: {
      lastname: req.body.data.lastname,
      firstname: req.body.data.firstname,
      age: req.body.data.age,
      classRoomId: req.body.data.classRoomId,
      // studentGroups: req.body.data.studentGroups
    },
  });

  res.json(updatedStudent);
});



//////////////////GROUP////////////////////

studentRouter.post('/:idStudent/groups/:idGroup', async (req, res) => {
  const group_Id = parseInt(req.params.idGroup);
  const student_Id = parseInt(req.params.idStudent);
  if (isNaN(student_Id)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  const mystudent = await prisma.student.findUnique({
    where: { id: student_Id },
  });

  if (!mystudent) {
    return res.status(404).json({ message: "Student not found" });
  }

  const studentGroup = await prisma.studentGroup.create({
    data : {
      studentId : student_Id,
      groupId : group_Id,
    }

  });
  res.status(201).json(`Letudiant numéro ${studentGroup.studentId} appartient maintenant au groupe ${studentGroup.groupId}`);
})
