const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signUp = async (req, res) => {
    try {
        const {userName, email, password, role} = req.body;

        const existingUser = await User.findOne({ 
            $or: [
                { userName: userName },
                { email: email }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.userName === userName 
                    ? 'Username already exists' 
                    : 'Email already exists'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'User added successfully',
            user: userResponse
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during registration',
            error: error.message
        });
    }
}

exports.signIn = async (req, res) => {
    try {
        const { userName, password } = req.body;
        
        //find user by username
        const user = await User.findOne({ userName }).select('+password');

        if (!userName || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        //check for credentials
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        //Generate jwt token
        const token = jwt.sign(
            { 
                userId: user._id, 
                userName: user.userName,
                role: user.role
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: '24h',
                algorithm: 'HS256' // Explicitly specify the algorithm
            }
        );

        // Remove password from user object
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
}