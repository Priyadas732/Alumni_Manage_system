import prisma from "../db.js";

// Get current user profile
export const getProfile = async (req, res) => {
    try{
        //req.user is set by verifyToken middleware
        const user = await prisma.user.findUnique({
            where: {id: req.user.id} 
        });
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        const { password: _, ...userWithoutPassword } = user;
        return res.json({success: true, user: userWithoutPassword});

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
        // Update user profile fields based on request body
        const updatedUser = await prisma.user.update({
            where: {id: req.user.id},
            data: {
                name,
                linkedin,
                avatarUrl,
                scholarId,
                college,
                branch,
                gradYear,
                resumeUrl,
                company,
                jobTitle,
                location,
                openToMentoring,
                openToReferrals,
                role
            }
        });
        const { password: _, ...userWithoutPassword} = updatedUser;
        return res.json({
            success: true,
            message: "Profile updated successfully",
            user: userWithoutPassword
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
            where: { id }
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const { password: _, ...userWithoutPassword } = user;
        return res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error("Get User By Id Error:", error);
        return res.status(500).json({ success: false, message: "Server error retrieving user profile" });
    }
};