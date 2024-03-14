const { Router } = require("express");

const usersRouter = require("./users.routes");
const sessionsRouter = require("./sessions.routes");
const notesRouter = require("./notes.routes");
const tagsRouter = require("./tags.routes");

//Incluir rotas aqui

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/notes', notesRouter);
routes.use('/tags', tagsRouter);
routes.use('/sessions', sessionsRouter);

module.exports = routes;