
//var arraySize = 7;
var arraySize = 10;

var request = new XMLHttpRequest(); 
var chart = null, title, rcd_title, rcd_color, rcd_data, rcd_date;
var username;
var dat_Date = [];
//let dat_HR = [];
let dat_HR = [];
let dat_BPS = [] ;
let dat_T = [];
let dat_S = [];
var low_HR = 140, up_HR = 0, low_BPS = 100, up_BPS = 0,low_T = 100, up_T = 0 ;
const csvUrl2 = "https://docs.google.com/spreadsheets/d/1royxguyMR5ZWGNXp1GarZ0ZDMKnlJtx16aN1dXZdrbk/export?format=csv";
const interval2 = 0; //(tần suất cập nhật)
//var type = '';
function get_data() {
    fetch(csvUrl2)
        .then(response => response.text())
        .then(data => {
            const rows = data.split("\n").map(row => row.split(","));
            
            // Log dữ liệu ra console
            console.clear(); // Xóa console trước đó
            console.log("Dữ liệu từ Google Sheets:");
            console.table(rows); // Hiển thị dưới dạng bảng (nếu trình duyệt hỗ trợ)

            rows.slice(1).forEach((row, index) => {
                let type = row[0];  // heartrate/spo2/temperature
                let date = row[1];  // datetime
                let value =  Number(row[2].trim());
                let status = row[3];
                
                if (type!=null  && date!=null  && value!=null && status!=null  && (index/3 | 0) < arraySize) {
                    if (type === "HeartRate") 
                    {
                        dat_HR[index/3 | 0] = value;
                        if (low_HR<Number(value)) low_HR=Number(value);
                        if (up_HR>Number(value)) up_HR=Number(value);
                    }
                    if (type === "SpO2")
                    {
                        dat_BPS[index/3 |  0] = value;
                        if (low_BPS<Number(value)) low_BPS=Number(value);
                        if (up_BPS>Number(value)) up_BPS=Number(value);
                    }
                    if (type === "Temperature")
                        {
                            dat_T[index/3 | 0] = value;
                            if (low_T<Number(value)) low_T=Number(value);
                            if (up_T>Number(value)) up_T=Number(value);
                        }
                    dat_Date[index/3] = date;
                    dat_S [index/3] = status;
                }
            });
            // updateChart(type);
        })
        .catch(error => console.error("Lỗi khi lấy dữ liệu từ Google Sheets:", error));
}

// Gọi hàm lần đầu và lặp lại mỗi 5 giây
get_data();
setInterval(get_data, 5000);

window.onload = function() {
    var tit2 = document.getElementById("dataChartTitle");
    tit2.textContent = "Default Chart";
    tit2.style.color = "#677483";

    // menu listener
    const sideMenu = document.getElementById("aside");
    const menuBtn  = document.getElementById("menu-btn");
    const closeBtn = document.getElementById("close-btn");

    menuBtn.addEventListener('click', () => {
        sideMenu.style.display = 'block';
    })

    closeBtn.addEventListener('click', () => {
        sideMenu.style.display = 'none';
    })

    console.log("arrSize: "+arraySize);

    setMenuHypertext();
    getUserInfo();
    updateUserInfo();
    // updateCardData();
    // updateChart('BP_S');
    // getAllRecord();
}

function getUserInfo() {
    username = "name1";
}

function updateUserInfo() {
    var ui_username = document.getElementById("username");
    ui_username.textContent = username;
    try {
        document.getElementById("welcome").textContent = "Hi, " + username;
    } catch (error) {}
}

function getAllRecord() {
}

function updateCardData() {
    console.log("updateCardData()");
    var card_BPS    = document.getElementById("card_BPS");
    var card_HR     = document.getElementById("card_HR" );
    var card_Steps     = document.getElementById("card_Steps" );
    var card_Status    = document.getElementById("card_Status" );
    card_BPS.textContent    = (dat_BPS[0]!=null?dat_BPS[0]:0)   + " %" ;
    card_HR.textContent     = (dat_HR[0]!=null ?dat_HR[0]:0)     + " bpm"  ;
    card_Steps.textContent     = (dat_T[0]!=null ?dat_T[0]:0)     + " C"  ;
    card_Status.textContent     = (dat_S[0]!=null ?dat_S[0]:0) ;

}


function updateChart(type) {
    if(chart!==null)chart.destroy();
    var ctx = document.getElementById("line-chart").getContext('2d');
    var tit = document.getElementById("dataChartTitle");
    window.scrollTo(0, 0);

    updateChartData(type);

    tit.style.color = rcd_color;
    tit.textContent = title;

    chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: rcd_date,
			datasets: [{ 
				data: rcd_data,
				label: rcd_title,
				borderColor: rcd_color,
				fill: false
			}]
		}, 
        options: {
            title: {display: false}
        }
	});
    updateCardData();

    if(type == 'BP_S')  addBoundLine(chart,low_BPS, up_BPS);
    if(type == 'HR')    addBoundLine(chart,low_HR, up_HR);
    if(type == 'T')    addBoundLine(chart,low_T, up_T);


}

function updateChartData(type){
    switch(type){
        case 'BP_S':
            title = "SpO2";
            rcd_title = "SpO2(%)";
            rcd_color = "#ff7782";
            rcd_data = dat_BPS;
            console.log(dat_BPS);
            break;
        case 'HR':
            title = "Heart Rate";
            rcd_title = "Heart Rate (bpm)";
            rcd_color = "#2E87A3";
            rcd_data = dat_HR;
            break;
        case 'T':
            title = "Temperature";
            rcd_title = "Temperature (Celsius degree)";
            rcd_color = "#FFB74D";
            rcd_data = dat_T;
            break;

    };
    rcd_date = dat_Date;
    console.log("updateChartData");
}


function addBoundLine(myChart, upperBound, lowerBound){
    myChart.data.datasets.push({ 
        data: Array(arraySize).fill(upperBound),
        label: "Upper Bound",
        borderColor: "#ff0000",
        pointRadius: 0,
        fill: false
    });
    myChart.data.datasets.push({ 
        data: Array(arraySize).fill(lowerBound),
        label: "Lower Bound",
        borderColor: "#0000ff",
        pointRadius: 0,
        fill: true,
    });
    myChart.update();
}