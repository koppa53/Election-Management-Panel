$(document).ready(function () {
    const tok = localStorage.getItem("Token")
    const lvl = localStorage.getItem("Level")
    $('#table1').DataTable({
        ajax: {
            url: `http://localhost:5000/usc_management_panel_accounts`,
            dataSrc: "",
            beforeSend: function (request) {
                request.setRequestHeader("authorization", tok);
            }
        },
        autoWidth: false,
        responsive: true,
        columns: [
            { data: "account_id", visible: false },
            { data: "account_first_name" },
            { data: "account_last_name" },
            { data: "account_username" },
            { data: "account_contact_number" },
            {
                data: null,
                defaultContent: ` <a data-target = "#editacc" data-toggle="modal" class="btn btn-success btn-sm" id="editaccount"><i class="fas fa-edit"></i></a>
                                <a data-target = "#deleteaccount" data-toggle="modal" class="btn btn-danger btn-sm" id="delaccount"><i class="fas fa-trash"></i></a>
                                <a data-target = "#resetpass" data-toggle="modal" class="btn btn-dark btn-sm" id="rpass">Reset</a>`,
                className: "text-center",
            }
        ],
    });

    /*$('#table2').DataTable({
        ajax: {
            url: `http://localhost:5000/all_voting_assistance_accounts`,
            dataSrc: "",
            beforeSend: function (request) {
                request.setRequestHeader("authorization", tok);
            }
        },
        autoWidth: false,
        responsive: true,
        columns: [
            { data: "account_id", visible: false },
            { data: "account_first_name" },
            { data: "account_last_name" },
            { data: "account_username" },
            { data: "account_college" },
            { data: "account_contact_number" },
            {
                data: null,
                defaultContent: ` <a data-target = "#v_editacc" data-toggle="modal" class="btn btn-success btn-sm" id="v_editaccount"><i class="fas fa-edit"></i></a>
                                <a data-target = "#v_deleteaccount" data-toggle="modal" class="btn btn-danger btn-sm" id="v_delaccount"><i class="fas fa-trash"></i></a>
                                <a data-target = "#v_resetpass" data-toggle="modal" class="btn btn-dark btn-sm" id="v_rpass">Reset</a>`,
                className: "text-center",
            }
        ],
    });*/

    $('#table3').DataTable({
        ajax: {
            url: `http://localhost:5000/csc_management_panel_accounts`,
            dataSrc: "",
            beforeSend: function (request) {
                request.setRequestHeader("authorization", tok);
            }
        },
        autoWidth: false,
        responsive: true,
        columns: [
            { data: "account_id", visible: false },
            { data: "account_first_name" },
            { data: "account_last_name" },
            { data: "account_username" },
            { data: "account_contact_number" },
            { data: "account_college" },
            {
                data: null,
                defaultContent: ` <a data-target = "#v_editacc" data-toggle="modal" class="btn btn-success btn-sm" id="v_editaccount"><i class="fas fa-edit"></i></a>
                                <a data-target = "#v_deleteaccount" data-toggle="modal" class="btn btn-danger btn-sm" id="v_delaccount"><i class="fas fa-trash"></i></a>
                                <a data-target = "#v_resetpass" data-toggle="modal" class="btn btn-dark btn-sm" id="v_rpass">Reset</a>`,
                className: "text-center",
            }
        ],
    });

    $('#a_level').change(function () {
        if ($(this).val() != "1") {
            $('#a_college').prop('disabled', false);
        } else {
            $('#a_college').prop('disabled', true);
        }
    });


    $('#addAccount').on('submit', async (event) => {
        event.preventDefault();
        const defaultpass = "BicolUni"
        const defaultpass2 = "BicolUni"
        const username = $('#a_username').val();
        const firstname = $('#a_firstname').val();
        const middlename = $('#a_middlename').val();
        const lastname = $('#a_lastname').val();
        const gender = $('#a_gender').val();
        const address = $('#a_address').val();
        const contactnumber = $('#a_contactnumber').val();
        let level = $('#a_level').val();
        const college = $('#a_college').val();

        try {
            if (level == 1) {
                const res = await fetch('http://localhost:5000/register_account', {
                    method: "POST",
                    headers: {
                        "authorization": tok,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: defaultpass,
                        password2: defaultpass2,
                        firstname: firstname,
                        middlename: middlename,
                        lastname: lastname,
                        gender: gender,
                        address: address,
                        contactnumber: contactnumber,
                        level: level,
                        college: "ALL"
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    $('#a_username').val("");
                    $('#a_firstname').val("");
                    $('#a_middlename').val("");
                    $('#a_lastname').val("");
                    $('#a_gender').val("Male");
                    $('#a_address').val("");
                    $('#a_contactnumber').val("");
                    $('#a_level').val("1");
                    $('#a_college').prop('disabled', true);
                    Toastify({
                        text: data.message,
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        backgroundColor: "#4fbe87",
                    }).showToast();
                    $('#addacc').modal('hide');
                } else {
                    if (data.errors != undefined) {
                        data.errors.forEach(function (v) {
                            Toastify({
                                text: v.message,
                                duration: 3000,
                                gravity: "top",
                                position: "center",
                                backgroundColor: "#CD201F",
                            }).showToast();
                        })
                    }
                }
            } else {
                const response = await fetch('http://localhost:5000/register_account', {
                    method: "POST",
                    headers: {
                        "authorization": tok,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: defaultpass,
                        password2: defaultpass2,
                        firstname: firstname,
                        middlename: middlename,
                        lastname: lastname,
                        gender: gender,
                        address: address,
                        contactnumber: contactnumber,
                        level: level,
                        college: college,
                    })
                });
                const data = await response.json();
                $('#table1').DataTable().ajax.reload();
                $('#table2').DataTable().ajax.reload();
                if (response.ok) {
                    $('#a_username').val("");
                    $('#a_firstname').val("");
                    $('#a_middlename').val("");
                    $('#a_lastname').val("");
                    $('#a_gender').val("Male");
                    $('#a_address').val("");
                    $('#a_contactnumber').val("");
                    $('#a_level').val("1");
                    $('#a_college').prop('disabled', true);
                    Toastify({
                        text: data.message,
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        backgroundColor: "#4fbe87",
                    }).showToast();
                    $('#addacc').modal('hide');
                } else {
                    if (data.errors != undefined) {
                        data.errors.forEach(function (v) {
                            Toastify({
                                text: v.message,
                                duration: 3000,
                                gravity: "top",
                                position: "center",
                                backgroundColor: "#CD201F",
                            }).showToast();
                        })
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    });

    //EDIT SECTION
    let u_dataID = ""
    $('#table1 tbody').on('click', '#editaccount', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        u_dataID = $('#table1').DataTable().row(current_row).data();
        $('#u_username').val(u_dataID.account_username);
        $('#u_firstname').val(u_dataID.account_first_name);
        $('#u_middlename').val(u_dataID.account_middle_name);
        $('#u_lastname').val(u_dataID.account_last_name);
        $('#u_gender').val(u_dataID.account_user_gender);
        $('#u_address').val(u_dataID.account_address);
        $('#u_contactnumber').val(u_dataID.account_contact_number)
        $('#editacc').modal('show');
    });

    $('#editAccount').on('submit', async (event) => {
        event.preventDefault();
        const username = $('#u_username').val();
        const firstname = $('#u_firstname').val();
        const middlename = $('#u_middlename').val();
        const lastname = $('#u_lastname').val();
        const gender = $('#u_gender').val();
        const address = $('#u_address').val();
        const contactnumber = $('#u_contactnumber').val();
        try {
            const response = await fetch('http://localhost:5000/update_profile/' + u_dataID.account_id, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    gender: gender,
                    address: address,
                    contactnumber: contactnumber,
                    firstname: firstname,
                    middlename: middlename,
                    lastname: lastname,
                    level: lvl

                })
            });
            const res = await response.json();
            $('#table1').DataTable().ajax.reload();
            if (response.ok) {
                $('#editacc').modal('hide');
                var id = localStorage.getItem("User Name")
                if (parseInt(id) === u_dataID.account_id) {
                    localStorage.setItem("First Name", firstname)
                    localStorage.setItem("Last Name", lastname)
                    localStorage.setItem("Level", lvl)
                    Toastify({
                        text: res.message,
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        backgroundColor: "#56B6F7",
                    }).showToast();
                    location.reload();
                } else {
                    Toastify({
                        text: res.message,
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        backgroundColor: "#56B6F7",
                    }).showToast();
                }
            } else {
                Toastify({
                    text: res.message,
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#CD201F",
                }).showToast();
            }
        } catch (error) {
            console.log(error);
        }
    });

    //ASSISTANCE ACCOUNT EDIT
    let v_dataID = ""
    $('#table3 tbody').on('click', '#v_editaccount', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        v_dataID = $('#table3').DataTable().row(current_row).data();
        $('#v_username').val(v_dataID.account_username);
        $('#v_firstname').val(v_dataID.account_first_name);
        $('#v_middlename').val(v_dataID.account_middle_name);
        $('#v_lastname').val(v_dataID.account_last_name);
        $('#v_gender').val(v_dataID.account_user_gender);
        $('#v_address').val(v_dataID.account_address);
        $('#v_contactnumber').val(v_dataID.account_contact_number)
        $('#v_level').val(v_dataID.account_college)
        $('#v_editacc').modal('show');
    });

    $('#v_editAccount').on('submit', async (event) => {
        event.preventDefault();
        const v_username = $('#v_username').val();
        const v_firstname = $('#v_firstname').val();
        const v_middlename = $('#v_middlename').val();
        const v_lastname = $('#v_lastname').val();
        const v_gender = $('#v_gender').val();
        const v_address = $('#v_address').val();
        const v_contactnumber = $('#v_contactnumber').val();
        const v_college = $('#v_college').val();
        try {
            const response = await fetch('http://localhost:5000/update_profile/' + v_dataID.account_id, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: v_username,
                    gender: v_gender,
                    address: v_address,
                    contactnumber: v_contactnumber,
                    firstname: v_firstname,
                    middlename: v_middlename,
                    lastname: v_lastname,
                    college: v_college,
                    level: "2"
                })
            });
            const res = await response.json();
            $('#table3').DataTable().ajax.reload();
            if (response.ok) {
                $('#v_editacc').modal('hide');
                Toastify({
                    text: res.message,
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#56B6F7",
                }).showToast();
            } else {
                Toastify({
                    text: res.message,
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#CD201F",
                }).showToast();
            }
        } catch (error) {
            console.log(error);
        }
    });

    //DELETE SECTION
    let d_dataID
    $('#table1 tbody').on('click', '#delaccount', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        d_dataID = $('#table1').DataTable().row(current_row).data();
        $('#deleteaccount').modal('show');
    });

    $('#deleteAccount').on('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/delete_management_account/' + d_dataID.account_id, {
                method: "DELETE",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                }
            });
            $('#table1').DataTable().ajax.reload(null, false);
            $('#deleteaccount').modal('hide');
            Toastify({
                text: "Account Deleted",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#CD201F",
            }).showToast();
        } catch (error) {
            console.log(error);
        }
    });

    //DELETE ASSIST ACCOUNTS
    let vd_dataID
    $('#table2 tbody').on('click', '#v_delaccount', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        vd_dataID = $('#table2').DataTable().row(current_row).data();
        $('#v_deleteaccount').modal('show');
    });

    $('#v_deleteAccount').on('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/delete_vote_assist_account/' + vd_dataID.account_id, {
                method: "DELETE",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                }
            });
            $('#table2').DataTable().ajax.reload(null, false);
            $('#v_deleteaccount').modal('hide');
            Toastify({
                text: "Account Deleted",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#CD201F",
            }).showToast();
        } catch (error) {
            console.log(error);
        }
    });

    //RESET SECTION 
    let r_dataID = ""
    $('#table1 tbody').on('click', '#rpass', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        r_dataID = $('#table1').DataTable().row(current_row).data();
        $('#resetpass').modal('show');
    });

    $('#resetPassword').on('submit', async (event) => {
        event.preventDefault();
        try {
            const resetPass = "BicolUni"
            const response = await fetch('http://localhost:5000/reset_managementacc_password/' + r_dataID.account_id, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newpassword: resetPass
                })
            });
            $('#resetpass').modal('hide');
            const res = await response.json();
            Toastify({
                text: res.message,
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#212529",
            }).showToast();
            $('#table1').DataTable().ajax.reload(null, false);
        } catch (error) {
            console.log(error);
        }
    });

    //RESET VOTE ASSIST ACCOUNT SECTION
    let vr_dataID = ""
    $('#table2 tbody').on('click', '#v_rpass', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        vr_dataID = $('#table2').DataTable().row(current_row).data();
        $('#v_resetpass').modal('show');
    });

    $('#v_resetPassword').on('submit', async (event) => {
        event.preventDefault();
        try {
            const resetPass = "BicolUni"
            const response = await fetch('http://localhost:5000/reset_voteassist_password/' + vr_dataID.account_id, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newpassword: resetPass
                })
            });
            $('#v_resetpass').modal('hide');
            const res = await response.json();
            Toastify({
                text: res.message,
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#212529",
            }).showToast();
            $('#table2').DataTable().ajax.reload(null, false);
        } catch (error) {
            console.log(error);
        }
    });
});