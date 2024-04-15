const Daily_personal = require('../models/daily_personal');
const Daily_team = require('../models/daily_team');

exports.getPersonalDaily = async (req, res) => {
    const { userId, projectId } = req.query;
    const personalDaily = await Daily_personal.findAll({
        where: {
            projectId: projectId,
            userId: userId
        }
    })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => console.log(err));

}

exports.createPersonalDaily = async (req, res) => {
    const { userId, projectId, title, content } = req.body;
    if (!title) {
        return res.status(404).send({ message: 'please enter title!' })
    }

    const fs = require('fs').promises; // 使用 Promise 接口

    if (!content) {
        return res.status(404).send({ message: 'please fill in the form !' })
    }
    if (req.files.length > 0) {
        try {
            await Promise.all(req.files.map(async (item) => {
                // const fileData = item.fileData;
                console.log("CreateItem:", item)

                const fileData = await fs.readFile(item.path);

                req.files.map(item => {
                    const filename = item.filename
                    Daily_personal.create({
                        userId: userId,
                        projectId: projectId,
                        title: title,
                        content: content,
                        fileData: fileData,
                        filename: filename
                    })
                        .then(() => {
                            return res.status(200).send({ message: 'create success!' })
                        })
                        .catch(err => {
                            console.log(err)
                            return res.status(500).send({ message: 'create failed!' });
                        });
                })
            }));
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'create failed!' });
        }
    } else {
        await Daily_personal.create({
            userId: userId,
            projectId: projectId,
            title: title,
            content: content,
        })
            .then(() => {
                return res.status(200).send({ message: 'create success!' });
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send({ message: 'create failed!' });
            });
    }
}

exports.getTeamDaily = async (req, res) => {
    const { projectId } = req.query;
    const teamDaily = await Daily_team.findAll({
        where: {
            projectId: projectId,
        }
    })
        .then(result => {
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => console.log(err));
}

exports.createTeamDaily = async (req, res) => {
    const { userId, projectId, title, content, stage, type } = req.body;
    if (!title) {
        return res.status(404).send({ message: 'please enter title!' })
    }
    if (req.files.length > 0) {
        try {
            await Promise.all(req.files.map(async (item) => {
                // const fileData = item.fileData;
                console.log("CreateItem:", item)

                const fileData = await fs.readFile(item.path);

                req.files.map(item => {
                    const filename = item.filename
                    Daily_team.create({
                        userId: userId,
                        projectId: projectId,
                        title: title,
                        content: content,
                        fileData: fileData,
                        filename: filename,
                        stage: stage,
                        type: type
                    })
                        .then(() => {
                            return res.status(200).send({ message: 'create success!' })
                        })
                        .catch(err => {
                            console.log(err)
                            return res.status(500).send({ message: 'create failed!' });
                        });
                })
            }));
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'create failed!' });
        }
    } else {
        await Daily_team.create({
            userId: userId,
            projectId: projectId,
            title: title,
            content: content,
            stage: stage,
            type: type
        })
            .then(() => {
                return res.status(200).send({ message: 'create success!' });
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send({ message: 'create failed!' });
            });
    }

}