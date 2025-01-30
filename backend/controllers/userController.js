const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

exports.signUp = async (req, res) => {
    try {
        console.log('Received signup request:', req.body);
        const {userName, email, password, role, twoFactorEnabled} = req.body;

        const existingUser = await User.findOne({ 
            $or: [
                { userName: userName },
                { email: email }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email 
                    ? "Email already exists"
                    : 'Username already exists'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            role,
            twoFactorEnabled
        });

        if (twoFactorEnabled) {
            const secret = speakeasy.generateSecret({
                name: `Auction:${email}`
            });
            newUser.tempSecret = secret.base32;
            
            const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
            
            await newUser.save();
            
            res.json({
                requiresOTP: true,
                qrCode: qrCodeUrl,
                tempSecret: secret.base32,
                user: newUser
            });
        } else {
            await newUser.save();

            res.status(201).json({
                success: true,
                message: 'User added successfully',
                user: newUser
            });
        }
        
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
        
        const userFound = await User.findOne({userName});

        if (!userFound) {
            return res.status(400).json({
                success: false,
                message: "No User"
            });
        }

        if (!userName || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        //find user by username
        const user = await User.findOne({ userName }).select('+password');

        //check for credentials
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        if (user.twoFactorEnabled) {
            return res.json({ 
                requiresOTP: true,
                userId: user._id,
                message: '2FA verification required'
            });
        }

        const payload = { 
            userId: user._id, 
            userName: user.userName,
            role: user.role,
        }

        //Generate jwt token
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { 
                expiresIn: '24h',
                algorithm: 'HS256' // Explicitly specify the algorithm
            }
        );

        
        if(user.currentSession !== token) {
            res.status(401);
        }

        user.currentSession = token;
        await user.save();

        res.cookie("token", token, {
            httpOnly: false,     // Helps prevent XSS - browser can't read the cookie via JavaScript
            secure: false,       // Ensures the browser only sends the cookie over HTTPS
            maxAge: 3600000,    // optional - cookie expiration in ms (e.g., 1 hour)
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user
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

exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: 'No session to log out' });
        }

        // Decode the token to find the user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (user) {
            // Clear the current session
            user.currentSession = null;
            await user.save();
        }

        // Clear the cookie
        res.clearCookie('token');
        res.json({ success: true, message: 'Logged out' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

exports.getInfoProfile = async (req, res) => {
    try {
        const token = req.cookies.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user) {
            throw new Error("User not found");
        }

        res.json({ success: true, user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

exports.balance = async (req, res) => {
    try {
        const token = req.cookies.token;
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user) {
            throw new Error("User not found");
        }

        const { amount } = req.body;

        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }

        user.balance = parseInt(amount) + Number(user.balance);

        const balance = user.balance;

        await user.save();

        res.json({ success: true, balance });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

exports.updateInfo = async (req, res) => {
    try {
        const token = req.cookies.token;
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user) {
            throw new Error("User not found");
        }

        const { userName, password } = req.body;

        user.userName = userName;
        user.password = await bcrypt.hash(password, 10);

        await user.save();

        res.json({ success: true, user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

exports.verify2FA = async (req, res) => {
    const { userId, token } = req.body;
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.tempSecret) {
            return res.status(400).json({ message: 'No temporary secret found. Please register again.' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.tempSecret,
            encoding: 'base32',
            token: token,
            window: 2
        });

        if (verified) {
            // Save the secret and mark 2FA as enabled
            user.twoFactorSecret = user.tempSecret;
            user.twoFactorEnabled = true;
            user.tempSecret = undefined;
            await user.save();

            // Generate JWT token
            const payload = { 
                userId: user._id, 
                userName: user.userName,
                role: user.role,
            }

            const jwtToken = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { 
                    expiresIn: '24h',
                    algorithm: 'HS256'
                }
            );

            // Set the cookie and send response
            res.cookie("token", jwtToken, {
                httpOnly: false,
                secure: false,
                maxAge: 3600000,
            });

            return res.status(200).json({ 
                success: true,
                message: '2FA verification successful'
            });
        } else {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid verification code' 
            });
        }
    } catch (err) {
        console.error('Server error:', err.message);
        return res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: err.message 
        });
    }
};

exports.verify2FALogin = async (req, res) => {
    const { userId, token } = req.body;
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        if (!user.twoFactorSecret) {
            return res.status(400).json({ 
                success: false,
                message: 'Two-factor authentication is not set up for this user' 
            });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token,
            window: 2
        });

        if (verified) {
            const payload = { 
                userId: user._id, 
                userName: user.userName,
                role: user.role,
            }

            const jwtToken = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { 
                    expiresIn: '24h',
                    algorithm: 'HS256'
                }
            );

            user.currentSession = jwtToken;
            await user.save();

            res.cookie("token", jwtToken, {
                httpOnly: false,
                secure: false,
                maxAge: 3600000,
            });

            return res.status(200).json({ 
                success: true,
                message: 'Login successful',
                token: jwtToken
            });
            
        } else {
            res.status(400).json({ message: 'Invalid verification code' });
        }
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};