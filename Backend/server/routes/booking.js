const express = require('express');
const router = express.Router();
const meetingDate = require('../models/MeetingDate');
const mongoose = require('mongoose');
const  authenticateToken  = require('../routes/main').authenticateToken;

router.use(authenticateToken);
router.get('/',async (req,res) => {
    try{
        const {patientId} = req.query;
        const patientId1 = new mongoose.Types.ObjectId(patientId);
        const meetingDates = await meetingDate.aggregate([
            {
                $match: { patientId: patientId1}
            },
            {
                $lookup:{
                    from: 'doctors',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor_info'
                }
            }
        ]);

        console.log(meetingDates); 

        if (!meetingDates || meetingDates.length === 0){
            return res.status(404).json({message:'No meeting date'});
        }
        else{
            return res.json(meetingDates);
        }
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }

});

router.post('/',  (req,res) => {
    console.log('Request body: ',req.body);
    try{     
        const { patientId,doctorId,date} = req.body;
        const appointmentDate = new Date(date);
        if (patientId && doctorId && !isNaN(appointmentDate.getTime())){
            meetingDate.insertOne({
                patientId: new mongoose.Types.ObjectId(patientId) ,
                doctorId: new mongoose.Types.ObjectId(doctorId),
                meetingTime: appointmentDate,
                dateStatus: 'In progress',
                linkMeet: ''
            })
            .then( () => res.json({success: true,message:'Appointment created'}))
            .catch(error => console.log('Insert error: ',error));
        }else{
            res.status(400).json({success:false,message:'Missing information'})
        }
    }catch (error){
        console.log('Error during making appointment',error);
        res.status(500).send('Internal Server Error');
    }

});

module.exports = router;