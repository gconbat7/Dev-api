import express from "express";
import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

//Cadastro
router.post("/cadastro", async (req, res) => {
  try {
    const user = req.body;

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(user.password, salt);

    const userDB = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashPassword,
      },
    });

    res.status(201).json(userDB);
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor, tente novamente" });
  }
});

//Login

router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body;

    const user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    if(!user){
        return res.status(400).json({ message: "Usuário não encontrado"})
    }

    const isMatch = await bcrypt.compare(userInfo.password, user.password)

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor, tente novamente" });
  }
});

export default router;

//USUÁRIO E SENHA MONGODB
//User: gildocode7
//Senha: 19831986
// mongodb+srv://gildocode7:19831986@users.rgxq6kj.mongodb.net/?retryWrites=true&w=majority&appName=Users
