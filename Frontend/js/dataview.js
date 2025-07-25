var data, num_row = 30;
var row_sheet;
getAllRecord();

const csvUrl = "https://docs.google.com/spreadsheets/d/1royxguyMR5ZWGNXp1GarZ0ZDMKnlJtx16aN1dXZdrbk/export?format=csv";
const interval = 0; //(tần suất cập nhật)

function fetchGoogleSheetData() {
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split("\n").map(row => row.split(","));
            
            // Log dữ liệu ra console
            console.clear(); // Xóa console trước đó
            console.log("Dữ liệu từ Google Sheets:");
            console.table(rows); // Hiển thị dưới dạng bảng (nếu trình duyệt hỗ trợ)
            console.log(row_sheet);
            rows.slice(1).forEach((row, index) => {
                let type = row[0];  // heartrate/spo2/temp
                let date = row[1];  // datetime
                let value = row[2]; // value
                let status = row[3];
                if (type && date && value && status) {
                    appendDataOnList(index+1, type, date, value, status);
                }
            });
            
        })
        .catch(error => console.error("Lỗi khi lấy dữ liệu từ Google Sheets:", error));
}

// Gọi hàm lần đầu và lặp lại mỗi 5 giây
fetchGoogleSheetData();
setInterval(fetchGoogleSheetData, interval);

let rows = []; // Mảng để lưu các dòng

function createEmptyRows() {
    let rowsHtml = ''; // Khởi tạo chuỗi HTML rỗng
    for (let i = 0; i < num_row; i++) {
        // Tạo chuỗi HTML cho mỗi dòng
        rowsHtml += `
            <tr id="row-${i}">
                <td>${i + 1}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        `;
    }

    // Gắn chuỗi HTML vào bảng
    document.getElementById("rows").innerHTML = rowsHtml;

    // Lưu các dòng vào mảng rows
    rows = Array.from(document.querySelectorAll("#rows tr"));
}

function appendDataOnList(num, type, date, value, status) {
    // Lấy dòng tương ứng với num
    const row = rows[num - 1]; // Mảng rows bắt đầu từ index 0 nên trừ 1

    // Lấy các ô td trong dòng đó
    const cells = row.getElementsByTagName("td");

    // Cập nhật giá trị trong các ô
    cells[1].innerHTML = type;
    cells[2].innerHTML = date;
    cells[3].innerHTML = value;
    cells[4].innerHTML = status;
}

createEmptyRows();

