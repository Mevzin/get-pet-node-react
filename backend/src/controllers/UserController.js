const createUserToken = require("../helpers/create_user_token");
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name) {
      res.status(422).json({ message: "O nome é obrigatorio" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "O email é obrigatorio" });
      return;
    }

    if (!phone) {
      res.status(422).json({ message: "O telefone é obrigatorio" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "O senha é obrigatoria" });
      return;
    }

    if (!confirmPassword) {
      res.status(422).json({ message: "A confirmação de senha é obrigatoria" });
      return;
    }

    if (password !== confirmPassword) {
      res
        .status(422)
        .json({ message: "A senha e a confirmação de senha devem ser iguais" });
      return;
    }

    //check id user exists
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(422).json({ message: "Por favor, utilize outro e-mail" });
      return;
    }

    //Creating a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //create a user
    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
      return;
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "O email é obrigatorio" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha é obrigatoria" });
      return;
    }
    //check id user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(422).json({ message: "Não ha usuario cadastrado com este email" });
      return;
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        res.status(422).json({ message: "Senha invalida" });
        return;
    }

    await createUserToken(user, req, res);
  }
};
