import prisma from '../db.js';

// 1. Create a Post
export const createPost = async (req, res) => {
    const { content, imageUrl, videoUrl, tags } = req.body;
    const authorId = req.user.id;

    if (!content) {
        return res.status(400).json({ success: false, message: "Post content cannot be empty" });
    }

    try {
        const post = await prisma.post.create({
            data: {
                authorId,
                content,
                imageUrl,
                videoUrl,
                tags: tags || []
            },
            include: {
                author: {
                    include: {
                        alumniProfile: {
                            select: { company: true }
                        }
                    }
                }
            }
        });

        const formattedPost = {
            ...post,
            author: post.author ? {
                id: post.author.id,
                name: post.author.name,
                avatarUrl: post.author.avatarUrl,
                role: post.author.role,
                company: post.author.alumniProfile?.company || null
            } : null
        };

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: formattedPost
        });
    } catch (error) {
        console.error("Create Post Error:", error);
        return res.status(500).json({ success: false, message: "Server error creating post" });
    }
};

// 2. Get Feed Posts (Ordered by newest)
export const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    include: {
                        alumniProfile: {
                            select: { company: true }
                        }
                    }
                },
                likes: {
                    select: { userId: true } // Used to check if the current user liked it and count likes
                },
                comments: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        user: {
                            select: { id: true, name: true, avatarUrl: true }
                        }
                    }
                }
            }
        });

        // Format posts to include like counts, likedByMe flag, and author company
        const currentUserId = req.user.id;
        const formattedPosts = posts.map(post => {
            const likeCount = post.likes.length;
            const likedByMe = post.likes.some(like => like.userId === currentUserId);
            
            const author = post.author ? {
                id: post.author.id,
                name: post.author.name,
                avatarUrl: post.author.avatarUrl,
                role: post.author.role,
                company: post.author.alumniProfile?.company || null
            } : null;

            // Remove the raw likes array from payload for efficiency
            const { likes, author: _, ...postDetails } = post;
            return {
                ...postDetails,
                author,
                likeCount,
                likedByMe
            };
        });

        return res.json({ success: true, posts: formattedPosts });
    } catch (error) {
        console.error("Get Posts Error:", error);
        return res.status(500).json({ success: false, message: "Server error fetching feed posts" });
    }
};

// 3. Toggle Like (Like / Unlike)
export const toggleLike = async (req, res) => {
    const { id: postId } = req.params;
    const userId = req.user.id;

    try {
        // Check if the like already exists
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: { postId, userId }
            }
        });

        if (existingLike) {
            // Unlike: remove from database
            await prisma.like.delete({
                where: {
                    postId_userId: { postId, userId }
                }
            });
            return res.json({ success: true, liked: false, message: "Post unliked successfully" });
        } else {
            // Like: add to database
            await prisma.like.create({
                data: { postId, userId }
            });
            return res.json({ success: true, liked: true, message: "Post liked successfully" });
        }
    } catch (error) {
        console.error("Toggle Like Error:", error);
        return res.status(500).json({ success: false, message: "Server error toggling like" });
    }
};

// 4. Add Comment
export const addComment = async (req, res) => {
    const { id: postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
        return res.status(400).json({ success: false, message: "Comment content cannot be empty" });
    }

    try {
        const comment = await prisma.comment.create({
            data: {
                postId,
                userId,
                content
            },
            include: {
                user: {
                    select: { id: true, name: true, avatarUrl: true }
                }
            }
        });

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment
        });
    } catch (error) {
        console.error("Add Comment Error:", error);
        return res.status(500).json({ success: false, message: "Server error adding comment" });
    }
};
