
async function login() {
    try {
        const usrnm = document.getElementById('username').value
        const pass = document.getElementById('password').value
        const response = await fetch('http://localhost:5000/user_login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usrnm,
                password: pass
            })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("First Name", data[0])
            localStorage.setItem("Last Name", data[1])
            localStorage.setItem("User Name", data[2])
            localStorage.setItem("Level", data[3])
            localStorage.setItem("hasLoggedIn", true)
            window.location.href = "index.html";
        } else {
            Toastify({
                text: data.message,
                duration: 3000,
                gravity: "top",
                position: "left",
                backgroundColor: "#CD201F",
            }).showToast();
        }
    } catch (error) {
        console.log(error)
    }
}