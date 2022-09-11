// import dotenv from 'dotenv';
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
import { NextFunction, Request, Response } from 'express';
const cors = require('cors');
// import cors from 'cors';
const morgan = require('morgan');
// import morgan from 'morgan';
const helmet = require('helmet');
// import helmet from 'helmet';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import User from './model/User';
const bcrypt = require('bcryptjs');
// import bcrypt from 'bcryptjs';
import Message from './model/Message';
import { createTypeReferenceDirectiveResolutionCache } from 'typescript';

const app = express();
const corsOpt = {
  origin: [
    'https://langexchangeweb.netlify.app',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
  ],
  credentials: true,
};
app.use(cors(corsOpt));
app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));

mongoose
  .connect(process.env.MONGODB_URL, { dbName: 'chat' })
  .then(() => console.log('Mongo DB Connected!!'))
  .catch((error) => console.error(error));

// test alert sleep
app.get(
  '/api/test',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json('heroku alert sleep code');
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

app.post(
  '/api/signup',
  async (req: Request, res: Response, next: NextFunction) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      email: req.body.email,
      password: hashedPwd,
    });

    try {
      const savedUser = await newUser.save();
      const { password, ...data } = savedUser._doc;
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

app.post(
  '/api/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      let checkedPwd;
      if (user == null) {
        res.status(401).json('Wrong Credentials');
      } else {
        checkedPwd = await bcrypt.compare(req.body.password, user.password);

        if (!checkedPwd) {
          res.status(401).json('Invalid Id and Pwd');
        } else {
          const { password, ...sendUser } = user._doc;
          res.status(200).json({ sendUser });
        }
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

app.post(
  '/api/sendMessage',
  async (req: Request, res: Response, next: NextFunction) => {
    const newMessage = new Message({
      from: req.body.from,
      room: req.body.room,
      text: req.body.text,
    });
    try {
      const savedNewMessage = await newMessage.save();
      res.status(201).json({ savedNewMessage });
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

app.get(
  '/api/getEditedMsg/:msgId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundMsg = await Message.findById(req.params.msgId);
      res.status(200).json(foundMsg);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

app.get(
  '/api/getMessage/:room',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundMessages = await Message.find({ room: req.params.room });
      res.status(200).json(foundMessages);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

app.put(
  '/api/editMessage/:msgId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const editedMessage = await Message.findByIdAndUpdate(req.params.msgId, {
        text: req.body.text,
      });
      res.status(201).json(editedMessage);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

app.delete(
  '/api/removeMessage/:msgId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Message.findByIdAndDelete(req.params.msgId);
      res.status(204).json('삭제함');
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(404);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.sendStatus(500);
});

const server = app.listen(process.env.PORT || 8080, () => {
  console.log('Hi Seong Eun Lee!');
  console.log('Started!');
});

const io = new Server(server, {
  cors: corsOpt,
});
// io는 socketIO 설정된 서버.

io.on('connection', (socket) => {
  // socket은 각 클라이언트마다 배치된 것임.
  // when connect
  console.log('A user connected!');

  // join room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    io.emit('joinRoomNum', `Joined Room Num ${room}`);
  });

  // leave room
  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    io.emit('leaveRoomNum', `Leaved Room Num ${room}`);
  });

  // send and get message
  socket.on('sendMessage', (newMessage) => {
    io.to(newMessage.room).emit('getMessage', newMessage);
  });

  // delete message
  socket.on('afterDelMsg', (afterDel) => {
    io.to(afterDel.room).emit('getAfterDelMsg', afterDel.afterDelBol);
  });

  // edit message
  socket.on('afterEditMsg', (afterEdit) => {
    console.log(afterEdit);
    io.to(afterEdit.room).emit('getAfterEditMsg', afterEdit.afterEditBol);
  });
});
