const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const users = {};
let namearray=[];

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    // console.log("new-user", name);
    users[socket.id] = name;
    
    namearray.push(name);
    socket.broadcast.emit('new',namearray);
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id]
    });
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    namearray=namearray.filter(function(naam){
      return naam !==username;
    });
    delete users[socket.id];
    socket.broadcast.emit("left", username);
  });
});