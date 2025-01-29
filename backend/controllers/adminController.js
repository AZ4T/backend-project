const User = require('../models/User');
const Lot = require('../models/Lot');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
        res.status(200).json({ success: true, users });
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

exports.getLots = async (req, res) => {
    try {
        const lots = await Lot.find();
        res.json({ success: true, lots });
    }
    catch (error) {
        console.error(error, "Error during getting Lots");
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.deleteLot = async (req, res) => {
    const { id } = req.params;

    try {
        const lot = await Lot.findById(id);
        if (!lot) {
            return res.status(404).json({ success: false, message: 'Lot not found' });
        }

        await Lot.findByIdAndDelete(id);
        res.json({ success: true, message: 'Lot deleted successfully' });
    } catch (error) {
        console.error('Error deleting lot:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

exports.updateLot = async (req, res) => {
    try {
        const { category, title, description, price, photo, billOption, information } = req.body;
        const lotId = req.params.id;

        const lot = await Lot.findById(lotId);
        if (!lot) {
            return res.status(404).json({ success: false, message: 'Lot not found' });
        }

        if (category) lot.category = category;
        if (title) lot.title = title;
        if (description) lot.description = description;
        if (price) lot.price = price;
        if (photo) lot.photo = photo;
        if (billOption) lot.billOption = billOption;
        if (information) lot.information = information;

        await lot.save();
        res.json({ success: true, message: 'Lot updated successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.auction = async (req, res) => {
    try {
        const lots = await Lot.find();
        res.json({ success: true, lots });
    }
    catch (error) {
        console.error(error, "Error during getting auction lots");
        res.status(500).json({ success: false, message: error.message });
    }
}