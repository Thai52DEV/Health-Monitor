let doctorId = localStorage.getItem('doctorId');
function chosenDoctor(){

    let name = localStorage.getItem('doctorName');
    let specialty = localStorage.getItem('doctorSpecialty');
    let image = localStorage.getItem('doctorImage');
    let degree = localStorage.getItem('doctorDegree');
 
    if (name && specialty && image && degree ){
        console.log('There is doctor');
        let imageList = document.querySelector('.image-list');
        imageList.innerHTML = 
    `   <li>
             <figure>
                  <img src="${image}" alt="No picture">
                  <figcaption>
                      <p class="doctor-name">${name}</p>
                      <p>Medical specialty: ${specialty}</p>
                      <p>Degree: ${degree}</p>
                  </figcaption>
              </figure>
        </li>    
        `;
    }else{
        document.getElementById('doctor-choose').innerHTML = 'You have not chose a doctor,please choose a doctor at Doctor';
        console.log('No doctor');
    }

}
function showMeetings(){
    let patientId = localStorage.getItem('userId');
    fetch(`/booking?patientId=${encodeURIComponent(patientId)}`,{
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
                    <td><p>${data[i].doctor_info[0].name}</p></td>
                    <td><p>${data[i].doctor_info[0].specialty}</p></td>
                    <td><a class = "meetingLink" href="${data[i].linkMeet}">Link</a></td>
                    <td><p>${data[i].dateStatus}</p></td>                
                `;
                tbody.appendChild(tr);
                if (datePart === todayPart){
                    tr_1.innerHTML = `
                    <td><p>${id_1++}</p></td>
                    <td><p>${datePart} | ${timePart}</p></td>
                    <td><p>${data[i].doctor_info[0].name}</p></td>
                    <td><p>${data[i].doctor_info[0].specialty}</p></td>
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
function createAppointment(){
    document.getElementById('submitButton').addEventListener('click',function(){
        let date = new Date(document.getElementById('appointmentDate').value);
        let datePart = date.toLocaleDateString('en-CA');
        let timePart = date.toLocaleTimeString('vi-VN', {hour:'2-digit',minute:'2-digit'});  
        let patientId = localStorage.getItem('userId');
        if (patientId && doctorId && !isNaN(date.getTime())){
            fetch('/booking',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({patientId,doctorId,date })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success){
                    alert('Apointment booked');
                }else{
                    console.log(data.message);
                }
            })
            .catch(error => console.log('Booking error: ',error));            
        }else{
                alert('Missing doctorId or meeting date');
        }
    });
}


chosenDoctor();
showMeetings();
createAppointment();