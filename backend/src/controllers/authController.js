import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_me_later';

//1. Register logic
export const register = async (req, res) => {
    const {name, email, password, role} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({success:false, message: "Please fill all required fields"});
    }

    try{
        //check if user already exists
        const existingUser = await prisma.user.findUnique({where: {email}});
        if(existingUser) {
            return res.status(400).json({success:false, message:"User with this email already exists"});
        }

        //Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //craete the user in the database
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'STUDENT'            
            }
        });
        // Exclude password from the returned user object
        const {password: _, ...userWithoutPassword} = newUser;

        return res.status(201).json({
            success:true,
            message: "User registered successfully",
            user: userWithoutPassword
        });
    }catch(error){
        console.error("Register Error:", error);
        return res.status(500).json({success:false, message:"Server error during registration"});
    }
};

// 2. Login controller
export const login = async (req, res) => {
    const {email, password} =req.body;
    if(!email || !password){
        return res.status(400).json({success:false, message:"Please provide email and password"});
    }
    try{
        // Find user by email
        const user = await prisma.user.findUnique({where: {email}});
        if(!user){
            return res.status(400).json({success:false, message:"Invalid credentials"});
        }
        // Compare password hashes
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({success:false, message:"Invalid credentials"});
        }
        //Create a JWT token containing user id and role
        const token = jwt.sign(
            {id: user.id, role: user.role},
            JWT_SECRET,
            {expiresIn: '1d'} //Token expires in 24 hours
        );
        const { password: _, ...userWithoutPassword } = user;

        return res.json({
            success: true,
            message: "Logged in successfully",
            token,
            user: userWithoutPassword
        });

    }catch(error){
        console.error("Login Error:", error);
        return res.status(500).json({success:false, message:"Server error during login"});  
    }
};