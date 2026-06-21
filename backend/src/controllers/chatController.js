import prisma from '../db.js';

// 1. Start or Fetch a 1-on-1 Conversation
export const startConversation = async (req, res) => {
    const recipientId = req.body.recipientId || req.body.participantId;
    const senderId = req.user.id;

    if (!recipientId) {
        return res.status(400).json({ success: false, message: "Recipient ID or Participant ID is required" });
    }

    if (senderId === recipientId) {
        return res.status(400).json({ success: false, message: "You cannot start a conversation with yourself" });
    }

    try {
        // Check if a conversation between these two users already exists
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { userId: senderId } } },
                    { participants: { some: { userId: recipientId } } }
                ]
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatarUrl: true, role: true }
                        }
                    }
                }
            }
        });

        if (existingConversation) {
            return res.json({ success: true, conversation: existingConversation });
        }

        // Create a new conversation and add both participants
        const newConversation = await prisma.conversation.create({
            data: {
                participants: {
                    create: [
                        { userId: senderId },
                        { userId: recipientId }
                    ]
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatarUrl: true, role: true }
                        }
                    }
                }
            }
        });

        return res.status(201).json({ success: true, conversation: newConversation });
    } catch (error) {
        console.error("Start Conversation Error:", error);
        return res.status(500).json({ success: false, message: "Server error starting conversation" });
    }
};

// 2. Get All Conversations for Logged-In User
export const getConversations = async (req, res) => {
    const userId = req.user.id;

    try {
        const conversations = await prisma.conversation.findMany({
            where: {
                participants: { some: { userId } }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatarUrl: true, role: true }
                        }
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1 // Fetch only the last message for the inbox preview
                }
            }
        });

        return res.json({ success: true, conversations });
    } catch (error) {
        console.error("Get Conversations Error:", error);
        return res.status(500).json({ success: false, message: "Server error fetching conversations" });
    }
};

// 3. Send a Message
export const sendMessage = async (req, res) => {
    const { id: conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    if (!content) {
        return res.status(400).json({ success: false, message: "Message content cannot be empty" });
    }

    try {
        // Verify user is part of the conversation
        const isParticipant = await prisma.participant.findUnique({
            where: {
                conversationId_userId: { conversationId, userId: senderId }
            }
        });

        if (!isParticipant) {
            return res.status(403).json({ success: false, message: "Not authorized to send messages to this conversation" });
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId,
                content
            },
            include: {
                sender: {
                    select: { id: true, name: true, avatarUrl: true }
                }
            }
        });

        return res.status(201).json({ success: true, message });
    } catch (error) {
        console.error("Send Message Error:", error);
        return res.status(500).json({ success: false, message: "Server error sending message" });
    }
};

// 4. Get Conversation Messages Thread
export const getMessages = async (req, res) => {
    const { id: conversationId } = req.params;
    const userId = req.user.id;

    try {
        // Verify user is part of this conversation
        const isParticipant = await prisma.participant.findUnique({
            where: {
                conversationId_userId: { conversationId, userId }
            }
        });

        if (!isParticipant) {
            return res.status(403).json({ success: false, message: "Not authorized to read this conversation thread" });
        }

        // Fetch thread messages
        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: { id: true, name: true, avatarUrl: true }
                }
            }
        });

        return res.json({ success: true, messages });
    } catch (error) {
        console.error("Get Messages Error:", error);
        return res.status(500).json({ success: false, message: "Server error retrieving message thread" });
    }
};
