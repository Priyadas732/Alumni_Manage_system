import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './db.js';
import userRoutes from './routes/userRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import postRoutes from './routes/postRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Resolve directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Initializing the application
const app = express();
const server = http.createServer(app);

// Determine allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.ALLOWED_ORIGIN].filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});

// Store io instance on app to access inside controllers
app.set('io', io);

// Enable CORS middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/requests", requestRoutes);
app.use("/posts", postRoutes);
app.use("/conversations", chatRoutes);

// Socket.io Connection Logic
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join personal room based on user ID
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined socket room ${userId}`);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

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

// Creating an API Endpoint
app.get('/api/welcome', (request, response) => {
    response.json({
        message: "The server is successfully running!"
    });
});

// Database connectivity check endpoint
app.get('/api/db-check', async (request, response) => {
    try {
        await prisma.user.findMany({ take: 1 });
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

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
    const frontendDistPath = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendDistPath));
    
    // SPA catch-all: serve index.html for any unmatched GET request
    // API routes are registered above, so they match first
    app.use((req, res, next) => {
        if (req.method !== 'GET') return next();
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
}

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error("Global Error Handler caught:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

// Defining a port number
const PORT = process.env.PORT || 5001;

// Starting the server and listening for network traffic
server.listen(PORT, () => {
    console.log(`Server is actively listening on port ${PORT}`);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
// Cleanly close the server on SIGTERM/SIGINT so the port is released before
// the process exits — prevents EADDRINUSE on rapid restarts.

function shutdown(signal) {
    console.log(`\n[${signal}] Gracefully shutting down...`);
    server.close(async () => {
        await prisma.$disconnect().catch(() => {});
        console.log('Server closed.');
        process.exit(0);
    });

    // Force exit after 5s if connections are still open
    setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
// Trigger restart

