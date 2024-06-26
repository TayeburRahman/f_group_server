 
const groupsModels = require("../models/groups.models")


//  response  
const createGroup = async (req, res) => {
    try {
        const { title, description, type, avatar } = req.body?.formData
        const { _id, displayName } = req.body?.user
        const creator = _id

        const group = await groupsModels.create({
            avatar,
            title,
            date: Date.now(),
            description,
            creator_name: displayName,
            creator,
            members: [creator],
            type
        })

        return res.status(201).json({
            group,
            status: "success",
            message: 'Group Created successfully'
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error })
    }
}

const getGroupById = async (req, res) => {
    try {
        const { ID } = req.params;
        const group = await groupsModels.findById(ID).populate('members').populate('joinRequests.user');

        return res.status(201).json({
            group,
            status: "success",
            message: 'Group Found successfully'
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error })
    }
}

const joinGroup = async (req, res) => {
    const { ID } = req.params;
    const { _id } = req.body?.user   // Assuming you have user authentication in place
    const userId = _id;
    try {
        const group = await groupsModels.findById(ID).populate("joinRequests.user"); // Populate user data in join requests

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        if (group.type === 'public') {
            // Public group: Add user directly
            if (!group.members.includes(userId)) {
                group.members.push(userId);
            }
            await group.save();
            res.status(200).json({ message: 'Joined group successfully!' });
        } else {
            // Private group: Send join request
            const existingRequest = group.joinRequests.find(request => request.user._id.toString() === userId); // Use populated user object
            if (!existingRequest) {
                const newUserRequest = { user: userId }; // Use user ID as reference
                group.joinRequests.push(newUserRequest);
                await group.save();
                res.status(200).json({ message: 'Join request sent!' });
            } else {
                res.status(400).json({ message: 'Join request already sent.' });
            }
        }
    } catch (error) {
        return res.status(500).json({ status: "error", message: error })
    }
};

const acceptJoinRequest = async (req, res) => {
    const { ID } = req.params;
    const memberToAccept = req.body?.memberToAccept;
    const { _id } = req.body?.user   // Assuming you have user authentication in place
    const userId = _id;
    try {
        const group = await groupsModels.findById(ID).populate("joinRequests.user"); // Populate user data in join requests

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }
        // Check if the user making the request is the creator
        if (group.creator !== userId) {
            return res.status(401).json({ message: 'Unauthorized to accept members.' });
        }


        // Find the join request by member ID
        const requestIndex = group.joinRequests.findIndex(request => request.user._id.toString() === memberToAccept);

        if (requestIndex < 0) {
            return res.status(400).json({ message: 'Join request not found.' });
        }

        // Add member to group if not already a member
        if (!group.members.includes(memberToAccept)) {
            group.members.push(memberToAccept);
        }

        // Remove the accepted join request
        group.joinRequests.splice(requestIndex, 1);

        await group.save();
        res.status(200).json({ message: 'Joined Request accepted successfully!' });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error })
    }
}

const cancelJoinRequest = async (req, res) => {
    const { ID } = req.params;
    const memberToCancel = req.body?.memberToCancel;
    const { _id } = req.body?.user   // Assuming you have user authentication in place
    const userId = _id;
    try {
        const group = await groupsModels.findById(ID).populate("joinRequests.user"); // Populate user data in join requests

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }
        // Check if the user making the request is not the creator or is not the user him/herself


        if (group.creator !== userId && userId !== memberToCancel) {
            return res.status(401).json({ message: 'Unauthorized to cancel members.' });

        }


        // Find the join request by member ID
        const requestIndex = group.joinRequests.findIndex(request => request.user._id.toString() === memberToCancel);

        if (requestIndex < 0) {
            return res.status(400).json({ message: 'Join request not found.' });
        }

        // Remove the  join request
        group.joinRequests.splice(requestIndex, 1);

        await group.save();
        res.status(200).json({ message: 'Joined Request canceled successfully!' });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error })
    }
}

const leaveGroup = async (req, res) => {
    const { ID } = req.params;
    const { _id } = req.body?.user  // Assuming you have user authentication in place
    const userId = _id;
    console.log("ws ghhehr")
    try {
        const group = await groupsModels.findById(ID);

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        if (!group.members.includes(userId)) {
            return res.status(400).json({ message: 'You are not a member of this group.' });
        }

        // Remove user from the members array
        const memberIndex = group.members.indexOf(userId);
        group.members.splice(memberIndex, 1);

        await group.save();

        res.status(200).json({ message: 'Left group successfully!' });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error })
    }
}


const kickUser = async (req, res) => {
    const { ID } = req.params;
    const { _id } = req.body.user; // Assuming you have user authentication in place
    const userId = _id;
    const memberToKick = req.body.memberToKick;

    console.log("GroupId: ", ID);
    console.log("userId: ", userId);
    console.log("user to kick: ", memberToKick);

    try {
        const group = await groupsModels.findById(ID);

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        // Check if the user making the request is the creator
        if (group.creator !== userId) {
            return res.status(401).json({ message: 'Unauthorized to kick members.' });
        }

        if (!group.members.includes(memberToKick)) {
            return res.status(400).json({ message: 'User is not a member of this group.' });
        }

        // Remove the user from the members array
        const memberIndex = group.members.indexOf(memberToKick);
        group.members.splice(memberIndex, 1);

        await group.save();

        res.status(200).json({ message: 'User kicked from the group successfully!' });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error })
    }
};


const deleteGroup = async (req, res) => {
    const { ID } = req.params;
    const { _id } = req.body?.user; // Assuming you have user authentication in place
    const userId = _id;
    try {
        const group = await groupsModels.findById(ID);

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        // Check if the user making the request is the creator
        if (group.creator !== userId) {
            return res.status(401).json({ message: 'Unauthorized to delete group.' });
        }

        // Delete the group
        await groupsModels.deleteOne({ _id: ID });

        res.status(200).json({ message: 'Group deleted successfully!' });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error })
    }
};

const getGroups = async (req, res) => {
    console.log("I was here")
    try {
        const groups = await groupsModels.find({});

        return res.status(200).json({
            groups,
            status: "success",
            message: 'Groups found successfully'
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error })
    }
}

const getGroupsByUserId = async (req, res) => {
    const { ID } = req.params;
    console.log("I was getGroupsByUserId")
    try {
        // const userId = mongoose.Types.ObjectId(ID);
        const groups = await groupsModels.find({ members: { $in: [ID] } });

        return res.status(200).json({
            groups,
            status: "success",
            message: 'Groups found successfully'
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error })
    }
}

const updateGroup = async (req, res) => {
    const { ID } = req.params;
    const { _id } = req.body?.user;
    const userId = _id;
    const { title, description, type, avatar } = req.body?.formData

    try {

        const group = await groupsModels.findById(ID);
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        // Check if the user making the request is the creator
        if (group.creator !== userId) {
            return res.status(401).json({ message: 'Unauthorized to update group.' });
        }

        const updatedGroup = await groupsModels.updateOne({ _id: ID }, { $set: { title, description, type, avatar } });
        
        return res.status(201).json({
            group: updatedGroup,
            status: "success",
            message: 'Group updated successfully'
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error })
    }
}


// const updateGroupAvatar = async (req, res) => {

//     try {
//         const { title, date, description, type } = req.body?.formData

//         const { ID } = req.params


//         let avatar = ''
//         if (req.file) {
//             avatar = req.file.path
//         }


//         const group = await eventsModels.updateOne({ _id: ID }, { $set: { avatar, title, date, description, type } })

//         return res.status(201).json({
//             group,
//             status: "success",
//             message: 'Group Updated successfully'
//         });
//     } catch (error) {
//         return res.status(500).json({ status: "error", message: error })
//     }
// }




module.exports = { createGroup, joinGroup, leaveGroup, kickUser, deleteGroup, getGroups, getGroupById, getGroupsByUserId, updateGroup, acceptJoinRequest, cancelJoinRequest }