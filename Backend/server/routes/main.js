const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path  = require('path');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(bodyParser.json());
router.use(cookieParser());

const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');


//Create serect key
const crypto = require('crypto');
let secretKey = '';


const authenticateToken = (req,res,next) => {
    const token = req.cookies.token;
    if (!token){
        return res.status(401).json({success:false,message:'No token.Access denied'});
    }
    jwt.verify(token,secretKey, (err,decoded)=> {
        if (err){
            return res.status(403).json({success:false,message:'Token not valid'});
        }
        req.user = decoded;
        next();
    });
};

router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'../../..//Frontend/public/index.html'));
});

router.post('/login', async (req,res) => {
    try {
        const { uname, upass } = req.body;
        let redirectPath = '/public/index.html'; 
        // Kiểm tra nếu input rỗng
        if (!uname || !upass) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin!' ,redirectTo: redirectPath});
        }

        // Tìm user trong database
        const user = await User.findOne({ name: uname });

        if (!user || user.pass !== upass) {
            return res.status(401).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!',redirectTo: redirectPath});
        }
        secretKey = crypto.randomBytes(32).toString('hex');

        const token = jwt.sign({uname},secretKey,{expiresIn:'1h'});

        res.cookie('token', token, {
            httpOnly: true,  // Ngăn JavaScript truy cập
            secure: true,    // Chỉ gửi qua HTTPS (tắt khi chạy local)
            sameSite: 'Strict', // Chống CSRF
            maxAge: 3600000  // 1 giờ
        });

        // Lưu thông tin user vào session
        // req.session.user_name = user.name;
        // req.session.name = user.name;
        // req.session.id = user._id;
        if (user.userType === 'Patient') {
            redirectPath = '/public/booking.html';
        } else if (user.userType === 'Doctor') {
            redirectPath = '/public/booking_doctor.html';
        }
        
        return res.json({ success: true, redirectTo: redirectPath,userId: user._id });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }  
})

// User.insertMany([
//     {
//         // name: "NAME1",
//         // pass: "name1",
//         // userName: "Bob Ross",
//         // email: "bobross@gmail.com.vn",
//         // phone: "0909713014",
//         // address: "11 Wall Street, New York",
//         // userType: "Patient",
//         // image: "../src/user/user1.jpg" 

//         // name: "NAME4",
//         // pass: "name4",
//         // userName: "Krystal Shepherd",
//         // email: "krystalshepherd@gmail.com.vn",
//         // phone: "0934567890",
//         // address: "789 Oak St, Boston",
//         // userType: "Doctor",
//         // image: "../src/user/user4.jpg"         

//     }
// ]);


    // Doctor.insertMany(
    //     [
    //         {
    //             userId: new mongoose.Types.ObjectId('67c2991b1a4f97cb40a7b2b2'),
    //             name: 'Krystal Shepherd',
    //             image: '../src/jpg/d1.jpg',
    //             specialty: 'Neurology',
    //             degree: 'Bachelor'
    //         },
    //         {
    //             name: 'Kieren Cochran',
    //             image: '../src/jpg/d10.jpg',
    //             specialty: 'Internal medicine',
    //             degree: 'Doctor of Medicine'
    //         },
    //         {
    //             name: 'Jean-Luc Crosby',
    //             image: '../src/jpg/d2.jpg',
    //             specialty: 'Odontology',
    //             degree: 'Bachelor'
    //         },
    //         {
    //             name: 'Daisy-Mae Flowers',
    //             image: '../src/jpg/d3.jpg',
    //             specialty: 'Orthopedics',
    //             degree: 'Bachelor'
    //         },
    //         {
    //             name: 'Efe Forster',
    //             image: '../src/jpg/d4.jpg',
    //             specialty: 'Dermatology',
    //             degree: 'Bachelor'
    //         },
    //         {
    //             name: 'Tyler-Jay Franks',
    //             image: '../src/jpg/d5.jpg',
    //             specialty: 'Plastic surgery',
    //             degree: 'Bachelor'
    //         },
    //         {
    //             name: 'Marlene Valentine',
    //             image: '../src/jpg/d6.jpg',
    //             specialty: 'Traumatology',
    //             degree: 'Bachelor'
    //         },
    //         {
    //             name: 'Mikey Nicholls',
    //             image: '../src/jpg/d7.jpg',
    //             specialty: 'Ophthalmology',
    //             degree: 'Bachelor'
    //         },
    //         {
    //             name: 'Yahya Adkins',
    //             image: '../src/jpg/d8.jpg',
    //             specialty: 'Gastroenterology',
    //             degree: 'Bachelor'
    //         },
    //         {
    //             name: 'Stephen Strange',
    //             image: '../src/jpg/d9.jpg',
    //             specialty: 'Neurology',
    //             degree: 'Doctor of Medicine'
    //         }
    //     ]
    // );

    module.exports.router = router;
    module.exports.authenticateToken = authenticateToken;

