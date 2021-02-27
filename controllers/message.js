const { response } = require("express");
const Message = require('../models/message');

const getChat = async (req, res = response) => {
    const uid = req.uid;
    const from = req.params.from;

    const last30Messages = await Message.find({
        $or: [
            { from: uid, to: from },
            { from: from, to: uid },
        ]
    })
        .sort({ createdAt: 'asc' })
        .limit(30);
    return res.status(200).json({
        ok: true,
        messages: last30Messages,
    });
};
module.exports = {
    getChat
};