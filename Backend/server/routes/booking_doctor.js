const express = require('express');
const router = express.Router();
const meetingDate = require('../models/MeetingDate');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const mongoose = require('mongoose');
const  authenticateToken = require('../routes/main').authenticateToken;
router.use(authenticateToken);

router.get('/',async (req,res) => {
    try{
        console.log('Req query: ',req.query);
        // const userId = req.query.doctorId;
        const {doctorId} = req.query;

        console.log("userID : ",doctorId);
        const doctorId1 = new mongoose.Types.ObjectId(doctorId);
        const doctor = await Doctor.aggregate([
            {
                $match: { userId: doctorId1 }  // Lọc bác sĩ theo userId
            },
            {

                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user_info'

                }
            }
        ]);
        if (!(!doctor|| doctor.length === 0)){
            const doctorId1 = doctor[0]._id;
            console.log('doctorId1: ',doctorId1);
            const meetingDates = await meetingDate.aggregate([
                {
                    $match: {doctorId : doctorId1}
                },
                {
                    $lookup: {
                        from : 'users',
                        localField: 'patientId',
                        foreignField: '_id',
                        as: 'patient_info'
                    }
                }
        
            ]);
            if (!meetingDates|| meetingDates.length === 0){
                res.status(404).send('No meeting dates');
            }else{
                res.json(meetingDates);
            }
        }else{
            res.status(404).send('No meeting dates');
        }
    }catch(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }

});

router.put('/sendlink',async (req,res)=> {
    console.log('SENDING LINK');
    try{
        const {meetingId,meetingLink} = req.body;
        const meetingId_1 = new mongoose.Types.ObjectId(meetingId);
        const updatedMeeting = await meetingDate.updateOne(
            {
                _id : meetingId_1
            },
            {
                $set: {linkMeet : meetingLink}
            }
        );
        if (updatedMeeting.matchedCount === 0){
            return res.status(404).json({success : false,message : 'No meeting date'});
        }
        if (updatedMeeting.modifiedCount === 0){
            return res.status(200).json({success: false , message: 'No change applied'});
        } 
        return res.status(200).json({success: true});
    }catch(error){
        console.log("Error in updating appointment ",error);
        res.status(500).json({success: false,message: 'Internal server error'});
    }
});
router.put('/confirm_meeting',async (req,res)=> {
    try{
        const {meetingId,action} = req.body;
        const meetingId_1 = new mongoose.Types.ObjectId(meetingId);
        console.log('MeetingId_1 : ',meetingId_1);
        let dateStatus = '';
        if (action === 'confirm meeting done'){
            dateStatus = 'Done';
        }
        if (action === 'confirm meeting'){
            dateStatus = 'Accepted';
        }
        const updatedDate = await meetingDate.updateOne(
            {
                _id : meetingId_1
            },
            {
                $set : { dateStatus: dateStatus}
            }
        );
        console.log(updatedDate);
        if (!updatedDate){
            if (updatedDate.matchedCount === 0) {
                return res.status(404).json({success : false,message: 'No meeting date'});
            }
            if (updatedDate.modifiedCount === 0){
                return res.status(404).json({success : false,message: 'No meeting date'});            
            }
        }else{
            return res.status(200).json({success : true});
        }
    }catch(error){
        console.log('Error in updating appointment');
        res.status(500).json({success: false, message: 'Internal Server Error'});
    }

})
module.exports = router;