const { hash, compare } = require("bcryptjs"); //Depêndencia utilizada para encriptar senhas e compará-las após criptografadas
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");

class usersController {
    async create(req, res) {
        const { name, email, password } = req.body;

        const database = await sqliteConnection();

        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if (checkUserExists) {
            throw new AppError("E-mail já cadastrado!");
        }

        const hashedPassword = await hash(password, 8)

        await database.run("INSERT INTO users (name, email, password) VALUES(?,?,?)", [name, email, hashedPassword]);

        return res.status(201).json();
    }

    async update(req, res) {
        const { name, email, password, old_password } = req.body;
        const { id } = req.params;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

        const checkUserExists = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

        if (!checkUserExists) {
            throw new AppError("Usuário não encontrado!");
        }

        const checkEmailExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if (checkEmailExists && checkEmailExists.id !== user.id) {
            throw new AppError("E-mail já cadastrado!");
        }
        if (password && old_password) {
            const checkPassword = await compare(old_password, user.password);

            if (password && !old_password) {
                throw new AppError("É necessário informar a senha antiga para alteração da nova senha!");
            }

            if (!checkPassword) {
                throw new AppError("Senha inválida!");
            }

            user.password = await hash(password, 8);
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE ID = ?`,
            [user.name, user.email, user.password, id]);
        return res.json();
    }
}

module.exports = usersController;