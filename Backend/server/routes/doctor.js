const express = require('express');
const router = express.Router();
const path = require('path');
const Doctor = require('../models/Doctor');
const  authenticateToken  = require('../routes/main').authenticateToken;

router.use(authenticateToken);

router.get('/',async (req,res) => {
    try{
        const doctors = await Doctor.find();
        if (!doctors){
            res.status(404).json({message: 'No doctor found'});
        }else{
            res.sendFile(path.join(__dirname,'../../..//Frontend/publlic/doctor.html'));
            return res.json(doctors);
        }
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Server error'});
    }   
});

module.exports = router;