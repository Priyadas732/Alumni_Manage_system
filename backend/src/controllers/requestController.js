import prisma from '../db.js';

function flattenUser(user) {
    if (!user) return null;
    const { studentProfile, alumniProfile, ...rest } = user;
    const profile = studentProfile || alumniProfile || {};
    const { id: profileId, userId: _, ...profileRest } = profile;
    return {
        ...rest,
        ...profileRest,
        profileId
    };
}

// 1. Get Directory of Users (with optional filters)
export const getUsersDirectory = async (req, res) => {
    const { role, company, branch, search } = req.query;

    try {
        const users = await prisma.user.findMany({
            where: {
                role: role ? role : undefined, // Filter by STUDENT or ALUMNI
                alumniProfile: company ? {
                    company: { contains: company, mode: 'insensitive' }
                } : undefined,
                studentProfile: branch ? {
                    branch: { contains: branch, mode: 'insensitive' }
                } : undefined,
                OR: search ? [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ] : undefined
            },
            include: {
                studentProfile: true,
                alumniProfile: true
            }
        });

        // Flatten users for frontend compatibility
        const flattenedUsers = users.map(user => {
            return flattenUser(user);
        });

        return res.json({ success: true, users: flattenedUsers });
    } catch (error) {
        console.error("Get Users Directory Error:", error);
        return res.status(500).json({ success: false, message: "Server error fetching user directory" });
    }
};

// 2. Send a Referral or Mentorship Request
export const createRequest = async (req, res) => {
    const { receiverId, type, jobLink, resumeUrl, message } = req.body;
    const senderId = req.user.id; // Active user from verifyToken middleware

    if (!receiverId || !type) {
        return res.status(400).json({ success: false, message: "Receiver ID and Request Type are required" });
    }

    try {
        // Create request database record
        const requestRecord = await prisma.request.create({
            data: {
                senderId,
                receiverId,
                type, // 'REFERRAL' or 'MENTORSHIP'
                jobLink,
                resumeUrl,
                message
            }
        });

        return res.status(201).json({
            success: true,
            message: "Request sent successfully",
            request: requestRecord
        });
    } catch (error) {
        console.error("Create Request Error:", error);
        return res.status(500).json({ success: false, message: "Server error sending request" });
    }
};

// 3. Get Sent and Received Requests for Active User
export const getMyRequests = async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch requests sent by this user
        const sent = await prisma.request.findMany({
            where: { senderId: userId },
            include: {
                receiver: {
                    include: {
                        studentProfile: true,
                        alumniProfile: true
                    }
                }
            }
        });

        const formattedSent = sent.map(item => {
            const receiverObj = flattenUser(item.receiver);
            const { receiver, ...requestDetails } = item;
            return {
                ...requestDetails,
                receiver: receiverObj
            };
        });

        // Fetch requests received by this user (targeted to them)
        const received = await prisma.request.findMany({
            where: { receiverId: userId },
            include: {
                sender: {
                    include: {
                        studentProfile: true,
                        alumniProfile: true
                    }
                }
            }
        });

        const formattedReceived = received.map(item => {
            const senderObj = flattenUser(item.sender);
            const { sender, ...requestDetails } = item;
            return {
                ...requestDetails,
                sender: senderObj
            };
        });

        return res.json({
            success: true,
            sent: formattedSent,
            received: formattedReceived
        });
    } catch (error) {
        console.error("Get Requests Error:", error);
        return res.status(500).json({ success: false, message: "Server error retrieving requests" });
    }
};

// 4. Update Request Status (Accept / Reject)
export const updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // PENDING, ACCEPTED, REJECTED, COMPLETED
    const userId = req.user.id;

    try {
        // Find request
        const requestRecord = await prisma.request.findUnique({
            where: { id }
        });

        if (!requestRecord) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        // Verify that the logged-in user is the receiver of this request
        if (requestRecord.receiverId !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this request" });
        }

        // Update request status
        const updatedRequest = await prisma.request.update({
            where: { id },
            data: { status }
        });

        return res.json({
            success: true,
            message: `Request status updated to ${status}`,
            request: updatedRequest
        });
    } catch (error) {
        console.error("Update Request Error:", error);
        return res.status(500).json({ success: false, message: "Server error updating request status" });
    }
};
