require('dotenv').config()
const express = require('express');
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const http = require('http');
const { Server } = require('socket.io');
const { Socket } = require('dgram');
const server = http.createServer(app);
const Task = require('./models/task');
const Column = require('./models/column');
const Kanban = require('./models/kanban');
const Node = require('./models/node');
const Node_relation = require('./models/node_relation');
const Chatroom_message = require('./models/chatroom_message');

const { rm } = require('fs');

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'PUT', 'POST'],
        credentials: true
    },
});

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'PUT', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

io.on("connection", (socket) => {
    console.log(`${socket.id} a user connected`);
    //join room
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`${socket.id} join room ${data}`);
    })
    //send message
    socket.on("send_message", async (data) => {
        console.log(data);
        try {
            // 存储消息到数据库
            await Chatroom_message.create({
                message: data.message,
                author : data.author,
                userId: data.creator, // 假设 data.author 存储的是用户 ID
                projectId: data.room // 假设 data.room 存储的是项目 ID
            });
        } catch (error) {
            console.error("保存消息时出错：", error);
        }
        socket.to(data.room).emit("receive_message", data);
    });
    //create card
    socket.on("taskItemCreated", async (data) => {
        try {
            const { selectedcolumn, item, kanbanData } = data;
            const { title, content, labels, assignees } = item;
            const creatTask = await Task.create({
                title: title,
                content: content,
                labels: labels,
                assignees: assignees,
                columnId: kanbanData[selectedcolumn].id
            })
            const addIntoTaskArray = await Column.findByPk(creatTask.columnId)
            addIntoTaskArray.task = [...addIntoTaskArray.task, creatTask.id];
            await addIntoTaskArray.save()
                .then(() => console.log("success"))
            io.sockets.emit("taskItems", addIntoTaskArray);
        } catch (error) {
            console.error("处理 taskItemCreated 时出错：", error);
        }
    })
    //update card
    socket.on("cardUpdated", async (data) => {
        const { cardData, index, columnIndex, kanbanData } = data;
        const updateTask = await Task.update(cardData, {
            where: {
                id: cardData.id
            }
        });
        io.sockets.emit("taskItem", updateTask);
    })
    //drag card
    socket.on("cardItemDragged", async (data) => {
        const { destination, source, kanbanData } = data;
        const dragItem = {
            ...kanbanData[source.droppableId].task[source.index],
        };
        kanbanData[source.droppableId].task.splice(source.index, 1);
        kanbanData[destination.droppableId].task.splice(
            destination.index,
            0,
            dragItem
        );
        io.sockets.emit("dragtaskItem", kanbanData);
        const sourceColumn = kanbanData[source.droppableId].task.map(item => item.id);
        const destinationColumn = kanbanData[destination.droppableId].task.map(item => item.id);
        await Column.update({ task: sourceColumn }, {
            where: {
                id: kanbanData[source.droppableId].id
            }
        });
        await Column.update({ task: destinationColumn }, {
            where: {
                id: kanbanData[destination.droppableId].id
            }
        });
        await Task.update({ columnId: kanbanData[destination.droppableId].id }, {
            where: {
                id: dragItem.id
            }
        });
    });
    //create column
    socket.on("ColumnCreated", async (data) => {
        try {
            const { projectId, newGroupName } = data;
            const createColumn = await Column.create({
                name: newGroupName,
                task: [],
                kanbanId: projectId
            })

            const addIntoColumnArray = await Kanban.findByPk(projectId)
            addIntoColumnArray.column = [...addIntoColumnArray.column, createColumn.id];
            await addIntoColumnArray.save()
                .then(() => console.log("success"))
            io.sockets.emit("ColumnCreatedSuccess", addIntoColumnArray);
        } catch (error) {
            console.error("处理 ColumnCreated 时出错：", error);
        }
    })
    //drag column
    socket.on("columnOrderChanged", async (data) => {
        const { sourceIndex, destinationIndex, kanbanData } = data;

        // 生成新的列顺序
        const movedColumn = kanbanData.splice(sourceIndex, 1)[0];
        kanbanData.splice(destinationIndex, 0, movedColumn);

        // 更新数据库中的列顺序，这里只是一个示例逻辑
        // 实际的实现取决于你的数据库结构和ORM库
        for (let i = 0; i < kanbanData.length; i++) {
            await Column.update({ order: i }, {
                where: {
                    id: kanbanData[i].id
                }
            });
        }

        // 通知所有客户端更新列的顺序
        io.sockets.emit("columnOrderUpdated", kanbanData);
    });
    //create nodes
    socket.on("nodeCreate", async (data) => {
        const { title, content, ideaWallId, owner, from_id } = data;
        const createdNode = await Node.create({
            title: title,
            content: content,
            ideaWallId: ideaWallId,
            owner: owner
        });
        if (from_id) {
            const nodeRelation = await Node_relation.create({
                from_id: from_id,
                to_id: createdNode.id,
                ideaWallId: ideaWallId
            })
        }
        io.sockets.emit("nodeUpdated", createdNode);
    })
    socket.on("nodeUpdate", async (data) => {
        const { title, content, id } = data;
        const createdNode = await Node.update(
            {
                title: title,
                content: content
            },
            {
                where: {
                    id: id
                }
            }
        );
        io.sockets.emit("nodeUpdated", createdNode);
    })
    socket.on("nodeDelete", async (data) => {
        const { id } = data;
        const deleteNode = await Node.destroy(
            {
                where: {
                    id: id
                }
            }
        );
        io.sockets.emit("nodeUpdated", deleteNode);
    })
    //chatroom

    socket.on("disconnect", () => {
        console.log(`${socket.id} a user disconnected`)
    });
});

//api routes
app.use('/users', require('./routes/user'));
app.use('/projects', require('./routes/project'))
app.use('/kanbans', require('./routes/kanban'))
app.use('/ideaWall', require('./routes/ideaWall'))
app.use('/node', require('./routes/node'))
app.use('/daily', require('./routes/daily'))
app.use('/submit', require('./routes/submit'))
app.use('/stage', require('./routes/stage'))
app.use('/chatroom', require('./routes/chatroom'))

//error handling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

// sync database
sequelize.sync({ alter: true })  //{force:true} {alter:true}
    .then(result => {
        console.log("Database connected");
        server.listen(3000);
    })
    .catch(err => console.log(err));

