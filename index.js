require('dotenv').config()
const express = require('express');
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require("cors");
const { Op } = require('sequelize');

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
    //join project
    socket.on("join_project", (data) => {
        socket.join(data);
        console.log(`${socket.id} join project ${data}`);
    })
    //send message
    socket.on("send_message", async (data) => {
        console.log(data);
        try {
            // 存储消息到数据库
            await Chatroom_message.create({
                message: data.message,
                author: data.author,
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
            const { selectedcolumn, item, kanbanData, projectId } = data;
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
            // io.sockets.emit("taskItems", addIntoTaskArray);
            io.to(projectId).emit("taskItems", addIntoTaskArray);
        } catch (error) {
            console.error("处理 taskItemCreated 时出错：", error);
        }
    })
    //update card
    socket.on("cardUpdated", async (data) => {
        const { cardData, index, columnIndex, kanbanData, projectId } = data;
        const updateTask = await Task.update(cardData, {
            where: {
                id: cardData.id
            }
        });
        // io.sockets.emit("taskItem", updateTask);
        io.to(projectId).emit("taskItem", updateTask);
    })
    //Delete card
    socket.on("cardDelete", async (data) => {
        const { cardData, index, columnIndex, kanbanData, projectId } = data;

        // Step 1: Retrieve the column and update it
        try {
            const column = await Column.findOne({
                where: {
                    id: columnIndex
                }
            });

            if (column) {
                // Filter out the task ID from the tasks array

                const updatedTasks = column.task.filter(taskId => taskId !== cardData.id);

                // Update the column with the new tasks array
                await column.update({ task: updatedTasks });

                // Step 2: Destroy the task in the Task table after updating the column
                const updateTask = await Task.destroy({
                    where: {
                        id: cardData.id
                    }
                });

                // Emit the updated task information to all clients
                // io.sockets.emit("taskItem", updateTask);
                io.to(projectId).emit("taskItem", updateTask);

            } else {
                console.error('Column not found or column tasks undefined');
                // Optionally emit an error or handle it as necessary
            }
        } catch (error) {
            console.error('Error handling card delete:', error);
            // Handle errors and possibly emit error information to clients
        }
    });
    //drag card
    socket.on("cardItemDragged", async (data) => {
        const { destination, source, kanbanData, projectId } = data;
        const dragItem = {
            ...kanbanData[source.droppableId].task[source.index],
        };
        kanbanData[source.droppableId].task.splice(source.index, 1);
        kanbanData[destination.droppableId].task.splice(
            destination.index,
            0,
            dragItem
        );
        // io.sockets.emit("dragtaskItem", kanbanData);
        io.to(projectId).emit("dragtaskItem", kanbanData);

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
            // io.sockets.emit("ColumnCreatedSuccess", addIntoColumnArray);
            io.to(projectId).emit("ColumnCreatedSuccess", addIntoColumnArray);

        } catch (error) {
            console.error("处理 ColumnCreated 时出错：", error);
        }
    })
    //drag column
    socket.on("columnOrderChanged", async (data) => {
        const { kanbanData, kanbanId } = data;

        // 发送更新事件以及打印日志
        // io.sockets.emit("columnOrderUpdated", kanbanData);
        io.to(kanbanId).emit("columnOrderUpdated", kanbanData);

        // console.log("kanbanData", kanbanData);
        // console.log("kanbanId", kanbanId);

        // 提取每个列的id到一个数组中
        const columnIds = kanbanData.map(column => column.id);
        // console.log("Column IDs:", columnIds);

        // 更新Kanban表中的columns字段
        try {
            await Kanban.update({ column: columnIds }, {
                where: {
                    id: kanbanId
                }
            });
            console.log("Columns updated successfully in Kanban table.");
        } catch (error) {
            console.error("Error updating columns in Kanban table:", error);
        }
    });
    //Delete column
    socket.on("ColumnDelete", async (data) => {
        const { columnData, kanbanId } = data;
        // console.log("columnData:", columnData);
        // console.log("kanbanId:", kanbanId);

        try {
            // Step 1: Update the Kanban table by removing the column ID from the columns array
            const kanban = await Kanban.findOne({
                where: {
                    id: kanbanId
                }
            });

            if (kanban) {
                const updatedColumns = kanban.column.filter(columnId => columnId !== columnData.id);
                await kanban.update({ column: updatedColumns });

                // Step 2: Delete all tasks associated with the column
                try {
                    // 首先从 columnData.task 中提取所有任务的 ID
                    const taskIds = columnData.task.map(task => task.id);

                    // 然后使用这些 ID 来删除 Task 表中的相关记录
                    const deleteTasks = await Task.destroy({
                        where: {
                            id: {
                                [Op.in]: taskIds // 使用 Op.in 来指定一组 ID
                            }
                        }
                    });

                    console.log("已成功删除任务，任务ID:", taskIds);
                } catch (error) {
                    console.error("删除任务时发生错误:", error);
                }

                // Step 3: Delete the column itself
                const deleteColumn = await Column.destroy({
                    where: {
                        id: columnData.id
                    }
                });

                // Emit the updated kanban and column info to all clients
                // io.sockets.emit("columnDeleted", { kanbanId, updatedColumns, deletedColumnId: columnData.id });
                io.to(kanbanId).emit("columnDeleted", { kanbanId, updatedColumns, deletedColumnId: columnData.id });

                console.log("Column and its tasks deleted successfully.");
            } else {
                console.error("Kanban not found with ID:", kanbanId);
                // Optionally emit an error or handle it as necessary
            }
        } catch (error) {
            console.error("Error handling column delete:", error);
            // Handle errors and possibly emit error information to clients
        }
    });
    //Create Submit
    socket.on('taskSubmitted', (data) => {
        console.log('Task submitted:', data);
        // 将事件广播到所有连接的客户端，除了发送消息的客户端
        // io.sockets.emit("taskItems", addIntoTaskArray);

        socket.broadcast.emit('refreshKanban', data);
    });
    //create nodes
    socket.on("nodeCreate", async (data) => {
        const { title, content, ideaWallId, owner, from_id, projectId } = data;
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
        // io.sockets.emit("nodeUpdated", createdNode);
        io.to(projectId).emit("nodeUpdated", createdNode);

    })
    //Update nodes
    socket.on("nodeUpdate", async (data) => {
        const { title, content, id, projectId } = data;
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
        // io.sockets.emit("nodeUpdated", createdNode);
        io.to(projectId).emit("nodeUpdated", createdNode);

    })
    //Delete nodes
    socket.on("nodeDelete", async (data) => {
        const { id, projectId } = data;
        const deleteNode = await Node.destroy(
            {
                where: {
                    id: id
                }
            }
        );
        io.sockets.emit("nodeUpdated", deleteNode);
        // io.to(projectId).emit("nodeUpdated", deleteNode);


    })

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

