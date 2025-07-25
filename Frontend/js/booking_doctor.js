let meetingId = '';
function showMeetings(){
    let doctorId = localStorage.getItem('userId');
    fetch(`/booking_doctor?doctorId=${encodeURIComponent(doctorId)}`,{
        method: 'GET',
        credentials: 'include'
    }
    ).then(response => response.json())
    .then(data => {
        if (data){
            let tbody = document.getElementById('rows');
            let tbody_1 = document.getElementById('rows_1');
            // const today = new Date().toISOString().split('T')[0];
            const today = new Date();
            const todayPart = today.toLocaleDateString('en-CA'); // cũng ở dạng YYYY-MM-DD
            let id_1 = 1;
            for (let i = 0 ;i < data.length;i++){
                const date = new Date(data[i].meetingTime);
                const datePart = date.toLocaleDateString('en-CA');
                const timePart = date.toLocaleTimeString('vi-VN');

                let tr = document.createElement('tr');
                let tr_1 = document.createElement('tr');

                tr.innerHTML = `
                    <td><p>${i+1}</p></td>
                    <td><p>${datePart} | ${timePart}</p></td>
                    <td><p>${data[i].patient_info[0].userName}</p></td>
                    <td><a class = "meetingLink" href="${data[i].linkMeet}">Link</a></td>
                    <td><p>${data[i].dateStatus}</p></td>                
                `;
                tr.addEventListener('click', ((id) => () => {
                    meetingId = id;
                    alert('Apointment picked');
                })(data[i]._id));
                tbody.appendChild(tr);
                if (datePart === todayPart){ //Giai quyet dieu kien date = today
                    tr_1.innerHTML = `
                    <td><p>${id_1++}</p></td>
                    <td><p>${datePart} | ${timePart}</p></td>
                    <td><p>${data[i].patient_info[0].userName}</p></td>
                    <td><a class = "meetingLink" href="${data[i].linkMeet}">Link</a></td>
                    <td><p>${data[i].dateStatus}</p></td>                
                    `;
                    tbody_1.appendChild(tr_1);
                }
            }
        }else{
            console.log('No data');
        }
    }).catch(error => console.log('Error occurred: ',error));
}
function sendlink(){
    document.getElementById('send-link-button').addEventListener('click',()=>{
        let meetingLink = document.getElementById('meetingLink').value;
        console.log('Meeting link: ',meetingLink);
        fetch('/booking_doctor/sendlink',{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({meetingId,meetingLink})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success){
                console.log('Send link successfully');
            }else{
                console.log(data.message);
            }
        }).catch(error => console.log('Send link error',error));
    })
}
function confirmMeeting(){
    document.getElementById('confirm-button').addEventListener('click',() => {
        fetch('/booking_doctor/confirm_meeting',{
            method: 'PUT',
            headers: { 'Content-Type' : 'application/json'},
            credentials: 'include',
            body: JSON.stringify({meetingId:meetingId,action : 'confirm meeting done'})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success){
                alert('Appointment updated');
            }else {
                console.log(data.message);
            }
        })
        .catch(error => console.log('Appointment update error',error));
    })
    document.getElementById('confirm-button-available-meeting').addEventListener('click',()=>{
        fetch('/booking_doctor/confirm_meeting',{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({meetingId:meetingId,action: 'confirm meeting'})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success){
                alert('Apoointment updated');
            }else{
                console.log(data.message);
            }
        })
        .catch(error => console.log('Error in confirming meeting',error));
    })
}
showMeetings();
sendlink();
confirmMeeting();