require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const http = require('http');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully! '))
  .catch(err => console.error('MongoDB connection error:', err));

const mongoTestRoutes = require('./routes/mongoTests.routes');
app.use('/mongo-tests', mongoTestRoutes);

const authMiddleware = require('./middleware/auth');

const testsRoutes = require('./routes/tests.routes');
app.use('/tests', testsRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes); 

const Message = require('./models/Message');

const testsController = require('./controllers/tests.controller');
app.post('/generate', authMiddleware, testsController.generateTest);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Маршрут ${req.method} ${req.url} не найден`
    });
});

app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

io.on('connection', (socket) => {
  const userEmail = socket.handshake.auth.email || 'Гость';
  console.log('User connected:', userEmail);

  socket.currentRoom = 'general';

  socket.on('join room', async (room) => {
    socket.leave(socket.currentRoom);
    socket.currentRoom = room;
    socket.join(room);
    
    socket.to(room).emit('user connected', userEmail);

    try {
      const history = await Message.find({ room }).sort({ createdAt: 1 }).limit(50);
      socket.emit('chat history', history);
    } catch (err) {
      console.error('Ошибка загрузки истории:', err);
    }
  });

  socket.on('chat message', async (data) => {
    io.to(data.room).emit('chat message', data); 
    
    try {
      await Message.create({
        room: data.room,
        author: data.author,
        text: data.text
      });
    } catch (err) {
      console.error('Ошибка сохранения сообщения:', err);
    }
  });

  socket.on('typing', (data) => {
    socket.broadcast.to(data.room).emit('typing', data.email);
  });

  socket.on('stop typing', (data) => {
    socket.broadcast.to(data.room).emit('stop typing');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', userEmail);
    socket.to(socket.currentRoom).emit('user disconnected', userEmail);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📋 GET    /tests         - все тесты`);
    console.log(` GET    /tests/:id     - тест по ID`);
    console.log(` POST   /tests         - создать тест`);
    console.log(` PUT    /tests/:id     - обновить тест`);
    console.log(` DELETE /tests/:id     - удалить тест`);
    console.log(` POST   /generate      - генерация ИИ`);
    console.log(` POST   /auth/register     - регистрация`);
    console.log(`📋 POST   /auth/login         - вход`);
    console.log(`📋 GET    /auth/profile       - профиль (защищённый)`);
    console.log(`-----------------------------------`);
    console.log(`📋 MongoDB CRUD:`);
    console.log(` GET    /mongo-tests   - все тесты (Mongo)`);
    console.log(` POST   /mongo-tests   - создать тест (Mongo)`);
});