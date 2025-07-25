const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Types = mongoose.Types;
const MeetingDateSchema = new Schema({
    patientId:{
        type: Types.ObjectId,
        required: true
    },
    doctorId:{
        type: Types.ObjectId,
        required: true
    },
    meetingTime:{
        type: Date,
        required: true,
    },
    dateStatus:{
        type: String,
        required : true
    },
    linkMeet: {
        type : String
    }
});


module.exports = mongoose.model('MeetingDate', MeetingDateSchema);