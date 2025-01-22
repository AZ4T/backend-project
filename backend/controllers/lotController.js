const Lot = require('../models/Lot');

exports.createLot = async (req, res) => {
    try {
        const { category, title, description, price, billOption, information } = req.body;

        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        const photoPath = req.file.path; 
        
        const newLot = new Lot({
            category,
            title,
            description,
            price,
            photo: photoPath,
            billOption,
            information
        });

        await newLot.save();

        const lotResponse = newLot.toObject();

        res.status(201).json({
            success: true,
            message: 'Lot added successfully',
            lot: lotResponse
        });
        
    }
    catch (error) {
        console.error('Lot creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during lot creation',
            error: error.message
        })
    }
};