import express from 'express';
import cors from 'cors'
import prisma from './db.js';
import userRoutes from './routes/userRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import postRoutes from './routes/postRoutes.js';
import chatRoutes from './routes/chatRoutes.js';


// Import Routes
import authRoutes from './routes/authRoutes.js';

// 2. Initializing the application
const app = express();

//Enable CORS middleware
app.use(cors({
    origin: 'http://localhost:5173', //Allows my react frontend to connect
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
//API Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/requests", requestRoutes);
app.use("/posts", postRoutes);
app.use("/conversations", chatRoutes);


//3. Defining a port number
const PORT = 5001;

// Test connection to Supabase database on startup
async function testDbConnection() {
    try {
        await prisma.$connect();
        console.log("Connected to Supabase PostgreSQL database successfully!");
    } catch (error) {
        console.error("Failed to connect to Supabase database:", error);
    }
}
testDbConnection();

//4. Creating an API Endpoint (The "Menu" item) //GET, POST, DELETE, PUT
app.get('/api/welcome', (request, response) =>{
    // This code executes when a GET request hits the '/api/welcome' URL
    response.json({
        message: "The server is successfully running!"
    });
});

// Database connectivity check endpoint
app.get('/api/db-check', async (request, response) => {
    try {
        await prisma.$connect();
        response.json({
            success: true,
            message: "Successfully connected to Supabase PostgreSQL database!"
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: "Failed to connect to Supabase database",
            error: error.message
        });
    }
});


// 5. Starting the server and listening for network traffic
app.listen(PORT, () => {
    console.log(`Server is actively listening on port ${PORT}`);
});
// Nodemon trigger reload