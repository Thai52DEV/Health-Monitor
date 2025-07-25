function handleLogin(event) {
    event.preventDefault(); // Ngăn reload trang mặc định

    const uname = document.getElementById("username").value;
    const upass = document.getElementById("password").value;
    const remember = document.getElementById("rememberMeCheckbox").checked;

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uname, upass})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirectTo; // Chuyển trang sau khi đăng nhập thành công
            localStorage.setItem('userId',data.userId);

        } else {
            console.log(data.message); // Hiển thị lỗi nếu có
        }
    })
    .catch(error => console.error("Login error:", error));
}
