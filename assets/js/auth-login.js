
async function login() {
    try {
        document.getElementById("loginbutton").disabled = true;
        document.getElementById("loginbutton").value = "Logging in..."
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
            localStorage.setItem("First Name", data.name[0])
            localStorage.setItem("Last Name", data.name[1])
            localStorage.setItem("User Name", data.name[2])
            localStorage.setItem("Level", data.name[3])
            localStorage.setItem("College", data.name[4])
            localStorage.setItem("Token", data.token)
            window.location.href = "index.html";
        } else {
            document.getElementById("loginbutton").disabled = false;
            document.getElementById("loginbutton").value = "Login"
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