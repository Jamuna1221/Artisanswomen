const ChatGroup = require('../models/ChatGroup');
const GroupMessage = require('../models/GroupMessage');
const User = require('../models/User');
const { getIO } = require('../config/socket');

exports.createGroup = async (req, res) => {
    try {
        const { name, description, category, tags, privacy, image } = req.body;
        let base64Image = image;

        if (req.file) {
            base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }

        const newGroup = await ChatGroup.create({
            name, description, category, privacy,
            tags: tags ? JSON.parse(tags) : [],
            image: base64Image,
            createdBy: req.user._id,
            admins: [req.user._id],
            members: [req.user._id],
            lastMessage: 'Group Created',
            lastMessageAt: Date.now()
        });

        // Auto system message
        await GroupMessage.create({
            groupId: newGroup._id,
            senderName: 'System',
            messageType: 'system',
            content: `${req.user.name} created the group.`
        });

        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ message: 'Error creating group', error: error.message });
    }
};

exports.updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await ChatGroup.findById(groupId);

        if (!group || !group.admins.includes(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { name, description, category, tags, privacy, image } = req.body;
        if (name) group.name = name;
        if (description !== undefined) group.description = description;
        if (category) group.category = category;
        if (privacy) group.privacy = privacy;
        if (tags) group.tags = JSON.parse(tags);
        if (image) group.image = image;

        if (req.file) {
            group.image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }

        await group.save();

        const io = getIO();
        io.to(groupId).emit('group_updated', group);

        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Error updating group', error: error.message });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await ChatGroup.findById(groupId);

        if (!group || String(group.createdBy) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Only creator can delete this group.' });
        }

        group.isDeleted = true;
        await group.save();

        const io = getIO();
        io.to(groupId).emit('group_deleted', groupId);

        res.json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting group', error: error.message });
    }
};

exports.searchGroups = async (req, res) => {
    try {
        const { query, category } = req.query;
        const filter = { isDeleted: false, privacy: 'public' };

        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ];
        }
        if (category) filter.category = category;

        const groups = await ChatGroup.find(filter).sort('-lastMessageAt').limit(50);
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error searching groups', error: error.message });
    }
};

exports.getMyGroups = async (req, res) => {
    try {
        const groups = await ChatGroup.find({
            members: req.user._id,
            isDeleted: false
        }).sort('-lastMessageAt');
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching my groups', error: error.message });
    }
};

exports.joinGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await ChatGroup.findById(groupId);
        if (!group || group.isDeleted) return res.status(404).json({ message: 'Group not found' });

        if (group.privacy === 'private' && !group.admins.includes(req.user._id)) {
            // Logic for request... simple auto-join for now if public
            return res.status(403).json({ message: 'Private group. Request access first.' });
        }

        if (!group.members.includes(req.user._id)) {
            group.members.push(req.user._id);
            await group.save();

            // Auto system message
            const sysMsg = await GroupMessage.create({
                groupId: group._id,
                senderName: 'System',
                messageType: 'system',
                content: `${req.user.name} joined the group.`
            });

            const io = getIO();
            io.to(groupId).emit('member_joined', { user: req.user._id, name: req.user.name });
            io.to(groupId).emit('receive_group_message', sysMsg);
        }
        res.json({ message: 'Joined successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Error joining group', error: error.message });
    }
};

exports.leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await ChatGroup.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        group.members = group.members.filter(m => String(m) !== String(req.user._id));
        await group.save();

        const sysMsg = await GroupMessage.create({
            groupId: group._id,
            senderName: 'System',
            messageType: 'system',
            content: `${req.user.name} left the group.`
        });

        const io = getIO();
        io.to(groupId).emit('member_left', { user: req.user._id, name: req.user.name });
        io.to(groupId).emit('receive_group_message', sysMsg);

        res.json({ message: 'Left successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error leaving group', error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await GroupMessage.find({ groupId: req.params.groupId }).sort('createdAt');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { content, messageType } = req.body;
        const { groupId } = req.params;

        let base64File = null;
        let finalMessageType = messageType || 'text';

        const file = req.files && req.files[0];
        if (file) {
            base64File = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            if (file.mimetype.startsWith('audio')) finalMessageType = 'audio';
            else if (file.mimetype.startsWith('image')) finalMessageType = 'image';
        }

        const msgContent = content || (file ? `Attached a ${finalMessageType}` : '');

        const message = await GroupMessage.create({
            groupId,
            senderId: req.user._id,
            senderName: req.user.name,
            messageType: finalMessageType,
            content: msgContent,
            attachmentUrl: base64File
        });

        await ChatGroup.findByIdAndUpdate(groupId, {
            lastMessage: msgContent.substring(0, 30),
            lastMessageAt: Date.now()
        });

        const io = getIO();
        io.to(groupId).emit('receive_group_message', message);

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};

exports.updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;

        const message = await GroupMessage.findById(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        if (String(message.senderId) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Cannot edit someone else message' });
        }

        message.content = content + ' (edited)';
        await message.save();

        const io = getIO();
        io.to(String(message.groupId)).emit('update_group_message', { messageId, content: message.content });

        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error updating message', error: error.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await GroupMessage.findById(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        if (String(message.senderId) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Cannot delete someone else message' });
        }

        const groupId = message.groupId;
        await GroupMessage.findByIdAndDelete(messageId);

        const io = getIO();
        io.to(String(groupId)).emit('delete_group_message', { messageId });

        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting message', error: error.message });
    }
};
