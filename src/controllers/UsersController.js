const { hash, compare } = require("bcryptjs"); //Depêndencia utilizada para encriptar senhas e compará-las após criptografadas
const AppError = require("../utils/AppError");

const UserRepository = require("../repositories/UserRepository");
const sqliteConnection = require("../database/sqlite");
const UserCreateService = require("../services/UserCreateService");

class usersController {
    async create(req, res) {
        const { name, email, password } = req.body;

        const userRepository = new UserRepository();
        const userCreateService = new UserCreateService(userRepository);

        await userCreateService.execute({ name, email, password });

        return res.status(201).json();
    }

    async update(req, res) {
        const { name, email, password, old_password } = req.body;
        const user_id = req.user.id;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])

        if (!user) {
            throw new AppError("Usuário não encontrado!");
        }

        const checkEmailExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if (checkEmailExists && checkEmailExists.id !== user.id) {
            throw new AppError("E-mail já cadastrado!");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;


        if (password && !old_password) {
            throw new AppError("É necessário informar a senha antiga para alteração da nova senha!");
        }

        if (password && old_password) {
            const checkPassword = await compare(old_password, user.password);

            if (!checkPassword) {
                throw new AppError("Senha inválida!");
            }

            user.password = await hash(password, 8);
        }


        await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE ID = ?`,
            [user.name, user.email, user.password, user_id]);
        return res.json();
    }
}

module.exports = usersController;