const User = require("../models/User");

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmPassword } = req.body;
    
        if(!name){
            res.status(422).json({ message: 'O nome é obrigatorio'})
            return
        }
        
        if(!email){
            res.status(422).json({ message: 'O email é obrigatorio'})
            return
        }
        
        if(!phone){
            res.status(422).json({ message: 'O telefone é obrigatorio'})
            return
        }
        
        if(!password){
            res.status(422).json({ message: 'O senha é obrigatoria'})
            return
        }
        
        if(!confirmPassword){
            res.status(422).json({ message: 'A confirmação de senha é obrigatoria'})
            return
        }

        if(password !== confirmPassword){
            res.status(422).json({ message: 'A senha e a confirmação de senha devem ser iguais'})
            return
        }

        //check id user exists
        const userExists = await User.findOne({ email: email})

        if(userExists){
            res.status(422).json({ message: 'Por favor, utilize outro e-mail'})
            return
        }
    }
};
