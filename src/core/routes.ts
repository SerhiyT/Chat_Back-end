import bodyParser from 'body-parser';
import express from 'express';
import socket from 'socket.io';

import {
    UserCtrl,
    DialogsCtrl,
    MessagesCtrl
} from '../controllers';

import { LastSeen, checkAuth } from '../middleware';
import { loginValidation, registerValidation } from '../helpers/validations';


const createRoutes = (app: express.Express, io: socket.Server) => {

    const UserController = new UserCtrl(io);
    const DialogsController = new DialogsCtrl(io);
    const MessagesController = new MessagesCtrl(io);

    let cors = require('cors')
    app.use(cors())

    app.use(bodyParser.json())
    app.use(checkAuth);
    app.use(LastSeen);

    app.get("/user/me", UserController.getMe)//-----------Routs--------------
    app.get("/user/verify", UserController.verify)
    app.post("/user/signup", registerValidation, UserController.create)
    app.post("/user/signin", loginValidation, UserController.login)
    app.get("/user/:id", UserController.show)
    app.delete("/user/:id", UserController.delete)

    app.get("/dialogs", DialogsController.index)
    app.post("/dialogs", DialogsController.create)
    app.delete("/dialogs/:id", DialogsController.delete)

    app.get("/messages", MessagesController.index)
    app.post("/messages", MessagesController.create)
    app.delete("/messages/:id", MessagesController.delete)
}

export default createRoutes;
