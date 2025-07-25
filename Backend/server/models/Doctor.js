const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = mongoose.Types;
const DoctorSchema = new Schema({
    userId:{
        type: Types.ObjectId
        // required: true
    },
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    specialty:{
        type: String,
        required: true
    },
    degree:{
        type: String,
        required: true
    }
}); 



module.exports = mongoose.model('Doctor',DoctorSchema);

// function insertDoctor(){
//     Doctor.insertMany(
//         [
//             {
//                 name: 'Krystal Shepherd',
//                 image: '../src/jpg/d1.jpg',
//                 specialty: 'Neurology',
//                 degree: 'Bachelor'
//             },
//             {
//                 name: 'Kieren Cochran',
//                 image: '../src/jpg/d10.jpg',
//                 specialty: 'Internal medicine',
//                 degree: 'Doctor of Medicine'
//             },
//             {
//                 name: 'Jean-Luc Crosby',
//                 image: '../src/jpg/d2.jpg',
//                 specialty: 'Odontology',
//                 degree: 'Bachelor'
//             },
//             {
//                 name: 'Daisy-Mae Flowers',
//                 image: '../src/jpg/d3.jpg',
//                 specialty: 'Orthopedics',
//                 degree: 'Bachelor'
//             },
//             {
//                 name: 'Efe Forster',
//                 image: '../src/jpg/d4.jpg',
//                 specialty: 'Dermatology',
//                 degree: 'Bachelor'
//             },
//             {
//                 name: 'Tyler-Jay Franks',
//                 image: '../src/jpg/d5.jpg',
//                 specialty: 'Plastic surgery',
//                 degree: 'Bachelor'
//             },
//             {
//                 name: 'Marlene Valentine',
//                 image: '../src/jpg/d6.jpg',
//                 specialty: 'Traumatology',
//                 degree: 'Bachelor'
//             },
//             {
//                 name: 'Mikey Nicholls',
//                 image: '../src/jpg/d7.jpg',
//                 specialty: 'Ophthalmology',
//                 degree: 'Bachelor'
//             },
//             {
//                 name: 'Yahya Adkins',
//                 image: '../src/jpg/d8.jpg',
//                 specialty: 'Gastroenterology',
//                 degree: 'Bachelor'
//             },
//             {
//                 name: 'Stephen Strange',
//                 image: '../src/jpg/d9.jpg',
//                 specialty: 'Neurology',
//                 degree: 'Doctor of Medicine'
//             }
//         ]
//     );
// }

// insertDoctor();