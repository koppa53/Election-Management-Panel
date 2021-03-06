
function logout() {
    localStorage.clear();
    window.location.href = "auth-login.html"
}

window.onload = setProfile()
const tok = localStorage.getItem("Token")

function setProfile() {
    let lvl = ""
    let fname = localStorage.getItem("First Name")
    fname = fname.charAt(0).toUpperCase() + fname.slice(1)
    let lname = localStorage.getItem("Last Name")
    lname = lname.charAt(0).toUpperCase() + lname.slice(1)
    document.getElementById('name').innerHTML = fname + " " + lname
    lvl = localStorage.getItem("Level")
    if (lvl == 1) {
        document.getElementById('accountlevel').innerHTML = "USC Electoral Board"
        var li = document.getElementById("acc");
        li.style.display = "block";
        li.innerHTML += `
        <a href="accounts.html" class='sidebar-link'>
            <i class="bi bi-person-lines-fill"></i>
            <span>Accounts</span>
        </a>
        `;
        var eli = document.getElementById("Eperiod");
        eli.style.display = "block";
        eli.innerHTML += `
        <a href="election-period.html" class='sidebar-link'>
            <i class="bi bi-archive-fill"></i>
            <span>Election Period</span>
        </a>
        `;

        var result = document.getElementById("result");
        result.style.display = "block";
        var subresult = document.getElementById("subresult");
        subresult.innerHTML += `
                <li class="submenu-item ">
                    <a href="usc-votes.html">USC</a>
                </li>
                <li class="submenu-item ">
                    <a href="csc-votes.html">CSC</a>
                </li>
            `
        var party = document.getElementById("party");
        party.style.display = "block";
        party.innerHTML += `
        <a href="register-partylist.html" class='sidebar-link'>
            <i class="fas fa-handshake"></i>
            <span>Political Party</span>
        </a>
        `;
        var usc = document.getElementById("USC");
        usc.style.display = "block";
        var subUSC = document.getElementById("subUSC");
        subUSC.innerHTML += `
        <li class="submenu-item ">
            <a href="usc-positions.html">Positions</a>
        </li>
        <li class="submenu-item ">
            <a href="usc-candidate.html">Candidates</a>
        </li>
        `;
    } else {
        document.getElementById('accountlevel').innerHTML = "CSC Electoral Board"
        var cscresult = document.getElementById("result");
        cscresult.style.display = "block";
        var cscsubresult = document.getElementById("subresult");
        cscsubresult.innerHTML += `
                <li class="submenu-item ">
                    <a href="csc-votes.html">CSC</a>
                </li>
            `
        var csc = document.getElementById("CSC");
        csc.style.display = "block";
        var subUSC = document.getElementById("subCSC");
        subCSC.innerHTML += `
        <li class="submenu-item ">
            <a href="csc-positions.html">Positions</a>
        </li>
        <li class="submenu-item ">
            <a href="csc-candidate.html">Candidates</a>
        </li>
        `;
    }
    document.getElementById('headname').innerHTML = "Hello, " + fname + "!"
}

let id = localStorage.getItem("User Name")
async function loadProfile() {
    const response = await fetch('http://localhost:5000/account_details/' + id, {
        method: "GET",
        headers: {
            "authorization": tok,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    document.getElementById("username").value = data.account_username;
    document.getElementById("firstname").value = data.account_first_name;
    document.getElementById("middlename").value = data.account_middle_name;
    document.getElementById("lastname").value = data.account_last_name;
    let element = document.getElementById("gender");
    element.value = data.account_user_gender;
    document.getElementById("gender").value = data.account_user_gender;
    document.getElementById("contactnumber").value = data.account_contact_number;
    document.getElementById("address").value = data.account_address;
}

$(document).ready(function () {
    $('#prof').on('click', function () {
        $('#profileUpdate').prop('disabled', true);
    })
    $('#pass').on('click', function () {
        $('#profileUpdate').prop('disabled', true);
    })
    $('#username').keyup(function () {
        if ($(this).val() != '') {
            $('#profileUpdate').prop('disabled', false);
        }
    });
    $('#firstname').keyup(function () {
        if ($(this).val() != '') {
            $('#profileUpdate').prop('disabled', false);
        }
    });
    $('#middlename').keyup(function () {
        if ($(this).val() != '') {
            $('#profileUpdate').prop('disabled', false);
        }
    });
    $('#lastname').keyup(function () {
        if ($(this).val() != '') {
            $('#profileUpdate').prop('disabled', false);
        }
    });
    $('#address').keyup(function () {
        if ($(this).val() != '') {
            $('#profileUpdate').prop('disabled', false);
        }
    });
    $('#contactnumber').keyup(function () {
        if ($(this).val() != '') {
            $('#profileUpdate').prop('disabled', false);
        }
    });
    $('#gender').change(function () {
        $('#profileUpdate').prop('disabled', false);
    });
    $('#currpass').keyup(function () {
        if ($(this).val() != '') {
            $('#passwordUpdate').prop('disabled', false);
        }
    });
    $('#updateProfile').on('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById("username").value
        const firstname = document.getElementById("firstname").value
        const middlename = document.getElementById("middlename").value
        const lastname = document.getElementById("lastname").value
        const gender = document.getElementById("gender").value
        const contactnumber = document.getElementById("contactnumber").value
        const address = document.getElementById("address").value
        const level = localStorage.getItem("Level")
        const response = await fetch('http://localhost:5000/update_profile/' + id, {
            method: "PUT",
            headers: {
                "authorization": tok,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                gender: gender,
                address: address,
                contactnumber: contactnumber,
                firstname: firstname,
                middlename: middlename,
                lastname: lastname,
                level: level,
            })
        });
        let res = await response.json();
        if (response.ok) {
            localStorage.setItem("First Name", firstname)
            localStorage.setItem("Last Name", lastname)
            $('#profileUpdate').prop('disabled', true);
            Toastify({
                text: "Profile Updated",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#56B6F7",
            }).showToast();
            location.reload();
            $('#uprofile').modal('hide');
        } else {
            Toastify({
                text: res.message,
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#CD201F",
            }).showToast();
        }

    })

    $('#changePass').on('submit', async (event) => {
        event.preventDefault();
        const password = document.getElementById("currpass").value
        const newpassword = document.getElementById("newpass").value
        const cnewpassword = document.getElementById("cnewpass").value
        if (newpassword == cnewpassword) {
            const response = await fetch('http://localhost:5000/change_password/' + id, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: password,
                    newpassword: newpassword
                })
            });
            let res = await response.json();
            if (response.ok) {
                Toastify({
                    text: res.message,
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#56B6F7",
                }).showToast();
                $('#passwordUpdate').prop('disabled', true);
                $('#cpass').modal('hide');
            } else {
                Toastify({
                    text: res.message,
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#CD201F",
                }).showToast();
            }
        } else {
            Toastify({
                text: "Confirm Password Do Not Match",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#CD201F",
            }).showToast();
        }
    })
});