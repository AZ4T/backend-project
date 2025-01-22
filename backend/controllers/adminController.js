const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await User.findByIdAndDelete(id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { userName, email, role } = req.body;
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (userName) user.userName = userName;
        if (email) user.email = email;
        if (role) user.role = role;

        const validRoles = ['User', 'Admin'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid role specified' 
            });
        }

        await user.save();
        res.json({ success: true, message: 'User updated successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}