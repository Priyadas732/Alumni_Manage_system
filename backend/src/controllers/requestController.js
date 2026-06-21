import prisma from '../db.js';

// 1. Get Directory of Users (with optional filters)
export const getUsersDirectory = async (req, res) => {
    const { role, company, branch, search } = req.query;

    try {
        const users = await prisma.user.findMany({
            where: {
                role: role ? role : undefined, // Filter by STUDENT or ALUMNI
                company: company ? { contains: company, mode: 'insensitive' } : undefined,
                branch: branch ? { contains: branch, mode: 'insensitive' } : undefined,
                OR: search ? [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ] : undefined
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                linkedin: true,
                avatarUrl: true,
                company: true,
                jobTitle: true,
                location: true,
                openToMentoring: true,
                openToReferrals: true,
                branch: true
            }
        });

        return res.json({ success: true, users });
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
                    select: { id: true, name: true, email: true, company: true, jobTitle: true }
                }
            }
        });

        // Fetch requests received by this user (targeted to them)
        const received = await prisma.request.findMany({
            where: { receiverId: userId },
            include: {
                sender: {
                    select: { id: true, name: true, email: true, branch: true, resumeUrl: true }
                }
            }
        });

        return res.json({
            success: true,
            sent,
            received
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
