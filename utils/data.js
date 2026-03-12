const roles = [
    {
        _id: '60d5ec49f53e6a1a7ca74a5e',
        name: 'Admin',
        description: 'Administrator with full privileges',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '60d5ec49f53e6a1a7ca74a5f',
        name: 'User',
        description: 'Standard user with limited access',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const users = [
    {
        _id: '60d5ed49f53e6a1a7ca74a60', 
        username: 'admin_user',
        password: 'securePassword123', 
        email: 'admin@example.com',
        fullName: 'Admin FullName',
        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
        status: true, 
        role: '60d5ec49f53e6a1a7ca74a5e', 
        loginCount: 5,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '60d5ed49f53e6a1a7ca74a61',
        username: 'john_doe',
        password: 'userPassword456',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
        status: false, // inactive
        role: '60d5ec49f53e6a1a7ca74a5f', // Refers to User role _id
        loginCount: 10,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '60d5ed49f53e6a1a7ca74a62',
        username: 'jane_smith',
        password: 'userPassword789',
        email: 'jane.smith@example.com',
        fullName: '', // Default empty string
        avatarUrl: 'https://i.sstatic.net/l60Hf.png',
        status: true,
        role: '60d5ec49f53e6a1a7ca74a5f', // Refers to User role _id
        loginCount: 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

module.exports = {
    roles,
    users,
};