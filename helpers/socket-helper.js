const io = require("socket.io");

let socketServer;

//calling init one time to bring expressListener from app.js
function init(expressListener) {
    socketServer = io(expressListener, { cors: { origin: "http://localhost:3000" } });
    //this is just a test to see who is connected to the SOCKET
    socketServer.sockets.on("connection", socket => {
        console.log("Client Connected. Total Users: ", socketServer.engine.clientsCount);
        socket.on("disconnect", () => console.log("Client Disconnected. Total Users: ", socketServer.engine.clientsCount - 1));
    });
}

//send to front the added object from the controller
function vacationAdded(addedVacation) {
    socketServer.sockets.emit("msg-from-server-vacation-added", addedVacation);
}

function vacationUpdated(updatedVacation) {
    socketServer.sockets.emit("msg-from-server-vacation-updated", updatedVacation);
}

function vacationDeleted(id) {
    socketServer.sockets.emit("msg-from-server-vacation-deleted", id);
}

module.exports = {
    init,
    vacationAdded,
    vacationUpdated,
    vacationDeleted
};
