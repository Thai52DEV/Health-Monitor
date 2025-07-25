

// VARIABLES
const rangeInput = document.querySelector('input[type="range"]');
const imageList = document.querySelector(".image-list");
const searchInput = document.querySelector('input[type="search"]');
const btns = document.querySelectorAll(".view-options button");
const photosCounter = document.querySelector(".toolbar .counter span");
const imageListItems = document.querySelectorAll(".image-list li");
const captions = document.querySelectorAll(".image-list figcaption p:first-child");
const myArray = [];
let counter = 1;
const active = "active";
const listView = "list-view";
const gridView = "grid-view";
const dNone = "d-none";

// SET VIEW
for (const btn of btns) {
  btn.addEventListener("click", function() {
    const parent = this.parentElement;
    document.querySelector(".view-options .active").classList.remove(active);
    parent.classList.add(active);
    this.disabled = true;
    document.querySelector('.view-options [class^="show-"]:not(.active) button').disabled = false;

    if (parent.classList.contains("show-list")) {
      parent.previousElementSibling.previousElementSibling.classList.add(dNone);
      imageList.classList.remove(gridView);
      imageList.classList.add(listView);
    } else {
      parent.previousElementSibling.classList.remove(dNone);
      imageList.classList.remove(listView);
      imageList.classList.add(gridView);
    }
  });
}

// SET THUMBNAIL VIEW - CHANGE CSS VARIABLE
rangeInput.addEventListener("input", function() {
  document.documentElement.style.setProperty("--minRangeValue",`${this.value}px`);
});

// SEARCH FUNCTIONALITY
for (const caption of captions) {
  myArray.push({
    id: counter++,
    text: caption.textContent
  });
}

searchInput.addEventListener("keyup", keyupHandler);

function keyupHandler() {
  for (const item of imageListItems) {
    item.classList.add(dNone);
  }
  const text = this.value;
  const filteredArray = myArray.filter(el => el.text.includes(text));
  if (filteredArray.length > 0) {
    for (const el of filteredArray) {
      document.querySelector(`.image-list li:nth-child(${el.id})`).classList.remove(dNone);
    }
  }
  photosCounter.textContent = filteredArray.length;
}
function saveDoctorInfo(id,name,specialty,image,degree){
  console.log("Id "+ id);
  console.log("Name "+ name);
  console.log("specialty "+ specialty);   
  console.log("image "+ image);   
  console.log("degree "+ degree); 
  localStorage.setItem('doctorId',id); 
  localStorage.setItem('doctorName',name);
  localStorage.setItem('doctorSpecialty',specialty);
  localStorage.setItem('doctorImage',image);
  localStorage.setItem('doctorDegree',degree);

} 
function getDoctors(){
  fetch('/doctor',{
     method: "GET",
     credentials: 'include'
    }
  ).then(response => response.json())
  .then(data => {
    console.log('Data',data);
    if (data){
      for (let i = 0; i < data.length ; i++){
        let li = document.createElement('li');
        li.innerHTML = 
                `<li>
                     <figure>
                          <a >
                              <img src="${data[i].image}" alt="No picture">
                          </a>
                          <figcaption>
                              <a >
                                    <p class="doctor-name">${data[i].name}</p>
                              </a>
                              <p>Medical specialty: ${data[i].specialty}</p>
                              <p>Degree: ${data[i].degree}</p>
                          </figcaption>
                      </figure>
                </li>        
        `;
        li.addEventListener('click',function(event) {
          event.preventDefault();
          saveDoctorInfo(data[i]._id,data[i].name,data[i].specialty,data[i].image,data[i].degree);
          window.location.href = '../public/booking.html';
        })
        imageList.appendChild(li);

      }
    }else{  
      console.log('No data');
    }
  }).catch(error => console.error("Error occurred",error));
  
}


getDoctors();


