import prisma from "../db.js";

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

// Get current user profile
export const getProfile = async (req, res) => {
    try{
        //req.user is set by verifyToken middleware
        const user = await prisma.user.findUnique({
            where: {id: req.user.id},
            include: {
                studentProfile: true,
                alumniProfile: true
            }
        });
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        const { password: _, ...userWithoutPassword } = user;
        return res.json({success: true, user: flattenUser(userWithoutPassword)});

    }catch(error){
        console.error("Get Profile Error:", error);
        return res.status(500).json({success:false, message: "Server error retrieving profile"});
    }
};

// Update User Profile
export const updateProfile = async (req, res) =>{
    const {
        name, linkedin, avatarUrl, scholarId, college, branch, gradYear, resumeUrl, // student field
        company, jobTitle, location, openToMentoring, openToReferrals, // Alumni fields
        role
    } = req.body;

    try {
        const targetRole = role || req.user.role;
        // Update user profile fields based on request body
        const updatedUser = await prisma.user.update({
            where: {id: req.user.id},
            data: {
                name,
                linkedin,
                avatarUrl,
                role: targetRole,
                studentProfile: targetRole === 'STUDENT' ? {
                    upsert: {
                        create: { scholarId, college, branch, gradYear, resumeUrl },
                        update: { scholarId, college, branch, gradYear, resumeUrl }
                    }
                } : undefined,
                alumniProfile: targetRole === 'ALUMNI' ? {
                    upsert: {
                        create: { company, jobTitle, location, openToMentoring, openToReferrals },
                        update: { company, jobTitle, location, openToMentoring, openToReferrals }
                    }
                } : undefined
            },
            include: {
                studentProfile: true,
                alumniProfile: true
            }
        });
        const { password: _, ...userWithoutPassword} = updatedUser;
        return res.json({
            success: true,
            message: "Profile updated successfully",
            user: flattenUser(userWithoutPassword)
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({success:false, message: "Server error updating profile"});
    }   
};

// Get a user profile by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                studentProfile: true,
                alumniProfile: true
            }
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const { password: _, ...userWithoutPassword } = user;
        return res.json({ success: true, user: flattenUser(userWithoutPassword) });
    } catch (error) {
        console.error("Get User By Id Error:", error);
        return res.status(500).json({ success: false, message: "Server error retrieving user profile" });
    }
};

// Get dashboard stats (Protected)
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Count connections: status === 'ACCEPTED' and (senderId === userId or receiverId === userId)
        const connectionsCount = await prisma.request.count({
            where: {
                status: 'ACCEPTED',
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            }
        });

        // Count pending incoming requests (where active user is receiver and status is PENDING)
        const pendingCount = await prisma.request.count({
            where: {
                receiverId: userId,
                status: 'PENDING'
            }
        });

        // Total registered users count
        const totalUsersCount = await prisma.user.count();

        return res.json({
            success: true,
            stats: {
                connectionsCount,
                pendingCount,
                totalUsersCount,
                upcomingEvents: 2,
                profileViews: 142
            }
        });
    } catch (error) {
        console.error("Get Dashboard Stats Error:", error);
        return res.status(500).json({ success: false, message: "Server error retrieving dashboard stats" });
    }
};