$(document).ready(function () {
    let loaded = 0;
    const lvl = localStorage.getItem("Level")
    const college = localStorage.getItem("College")
    $("#USCpositions").on('click', async (event) => {
        if (loaded == 0) {
            const response = await fetch('http://localhost:5000/all_USC_position', {
                method: "GET",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                }
            });
            const positiondata = await response.json();
            positiondata.forEach(function (v) {
                var o = new Option(v.position_name, v.position_name);
                $(o).html(v.position_name);
                $("#USCpositions").append(o);
            })
            loaded++;
        }
    })

    let loadedcsc = 0;
    $("#CSCpositions").on('click', async (event) => {
        if (loadedcsc == 0) {
            const response = await fetch('http://localhost:5000/all_active_CSC_position', {
                method: "GET",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                }
            });
            const positiondata = await response.json();
            positiondata.forEach(function (v) {
                var o = new Option(v.position_name, v.position_name);
                $(o).html(v.position_name);
                $("#CSCpositions").append(o);
            })
            loadedcsc++;
        }
    })

    $('#colleges').change(function () {
        var table = $('#table2').DataTable();
        table.search($('#colleges').val()).draw();
    })

    $('#USCpositions').change(function () {
        var table = $('#table1').DataTable();
        table.search($('#USCpositions').val()).draw();
    })
    if (lvl == 1) {
        $('form[name="deleteCSCLIST"]').attr("id", "rmmAllCSCFromList");
        var j = document.getElementById("ballotcollege")
        j.style.display = "block";
        j.innerHTML += `<fieldset class="form - group">
            <select class="form-select" id = "colleges">
                <option value="">All Colleges</option>
                <option value="College of Science">College of Science</option>
                <option value="College of Arts and Letters">College of Arts and Letters</option>
                <option value="College of Education">College of Education</option>
                <option value="College of Nursing">College of Nursing</option>
                <option value="College of Industrial Technology">College of Industrial Technology</option>
                <option value="College of Engineering">College of Engineering</option>
                <option value="College of Social Science and Philosophy">College of Social Science and Philosophy</option>
                <option value="College of Business, Economics and Management">College of Business, Economics and Management</option>
                <option value="College of Agriculture and Forestry">College of Agriculture and Forestry</option>
                <option value="IPESR">IPESR</option>
            </select>
        </fieldset>`
        var i = document.getElementById("uscbodyheader");
        i.innerHTML += `<div class="col-md-4">
            <fieldset class="form-group">
                <select class="form-select" id="USCpositions">
                    <option value=""selected>All Position</option>
                </select>
            </fieldset>
        </div>
        <div class="col-md-4 mb-2">
            <button class="btn btn-primary"data-bs-toggle="modal" data-bs-target="#addlist" id="loadaddlist"><i class="fas fa-plus"></i> Add Candidate</button>
            <label>Restore removed candidates here.</label>
        </div>
        <div>
        <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#showUSCballot" id="showballotUSC"><i class="far fa-eye"></i> Preview Ballot</button>
        </div>
        `
        var li = document.getElementById("uscbodycontent");
        li.innerHTML += `<table class="table table-striped" id="table1">
            <thead>
                <tr>
                    <th>Candidate ID</th>
                    <th>Position</th>                                                        
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Political Party</th> 
                    <th>Position Level</th>  
                    <th>Tools</th> 
                </tr>
            </thead>
        </table>
        <br>
        <div class="col">
            <button class="btn btn-dark"data-bs-toggle="modal" data-bs-target="#rmAllUSClist" id="loadaddlist"><i class="fas fa-users-slash"></i> Remove All</button>
        </div>
        `;
        $('#table1').DataTable({
            ajax: {
                url: `http://localhost:5000/all_usc_ballot_candidate_on_list`,
                dataSrc: "",
                beforeSend: function (request) {
                    request.setRequestHeader("authorization", tok);
                }
            },
            autoWidth: false,
            responsive: true,
            columns: [
                { data: "usc_candidate_ballot_id", visible: false },
                { data: "usc_candidate_position" },
                { data: "usc_candidate_first_name" },
                { data: "usc_candidate_last_name" },
                { data: "usc_candidate_party" },
                { data: "usc_ballot_pos", visible: false },
                {
                    data: null,
                    defaultContent: `<a data-target = "#removefromlist" data-toggle="modal" class="btn btn-danger btn-sm" id="rmfromlist"><i class="fas fa-user-minus"></i></a>`,
                    className: "text-center",
                }
            ],
            order: [[5, "asc"]]
        });
        $('#table2').DataTable({
            ajax: {
                url: `http://localhost:5000/all_csc_ballot_candidate_on_list`,
                dataSrc: "",
                beforeSend: function (request) {
                    request.setRequestHeader("authorization", tok);
                }
            },
            autoWidth: false,
            responsive: true,
            columns: [
                { data: "csc_candidate_ballot_id", visible: false },
                { data: "csc_candidate_position" },
                { data: "csc_candidate_first_name" },
                { data: "csc_candidate_last_name" },
                { data: "csc_ballot_college" },
                { data: "csc_candidate_party" },
                { data: "csc_ballot_pos", visible: false },
                {
                    data: null,
                    defaultContent: `<a data-target = "#removefromlistcsc" data-toggle="modal" class="btn btn-danger btn-sm" id="rmfromlistcsc"><i class="fas fa-user-minus"></i></a>`,
                    className: "text-center",
                }
            ],
        });
    } else {
        $('form[name="deleteCSCLIST"]').attr("id", "rmmCollegeCSCFromList");
        var k = document.getElementById("uscbodycontent");
        k.innerHTML += `
        <div>
        <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#showUSCballot" id="showballotUSC"><i class="far fa-eye"></i> Preview Ballot</button>
        </div>`
        $('#table2').DataTable({
            ajax: {
                url: `http://localhost:5000/college_csc_ballot_candidate_on_list/` + college,
                dataSrc: "",
                beforeSend: function (request) {
                    request.setRequestHeader("authorization", tok);
                }
            },
            autoWidth: false,
            responsive: true,
            columns: [
                { data: "csc_candidate_ballot_id", visible: false },
                { data: "csc_candidate_position" },
                { data: "csc_candidate_first_name" },
                { data: "csc_candidate_last_name" },
                { data: "csc_ballot_college" },
                { data: "csc_candidate_party" },
                { data: "csc_ballot_pos", visible: false },
                {
                    data: null,
                    defaultContent: `<a data-target = "#removefromlistcsc" data-toggle="modal" class="btn btn-danger btn-sm" id="rmfromlistcsc"><i class="fas fa-user-minus"></i></a>`,
                    className: "text-center",
                }
            ],
        });
    }

    //USC ADD FROM LIST SECTION
    $('#table0').DataTable({
        ajax: {
            url: `http://localhost:5000/all_usc_ballot_candidate_not_on_list`,
            dataSrc: "",
            beforeSend: function (request) {
                request.setRequestHeader("authorization", tok);
            }
        },
        autoWidth: false,
        responsive: true,
        columns: [
            { data: "usc_candidate_ballot_id", visible: false },
            { data: "usc_candidate_position" },
            { data: "usc_candidate_first_name" },
            { data: "usc_candidate_last_name" },
            { data: "usc_candidate_party" },
            { data: "usc_ballot_pos", visible: false },
            {
                data: null,
                defaultContent: `<a data-target = "#addfromlist" data-toggle="modal" class="btn btn-success btn-sm" id="adfromlist"><i class="fas fa-user-plus"></i></a>`,
                className: "text-center",
            }
        ],
        order: [[5, "asc"]]
    });

    let a_dataID = ""
    $('#table0 tbody').on('click', '#adfromlist', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        a_dataID = $('#table0').DataTable().row(current_row).data();
        $('#addfromlist').modal('show');
    });

    $('#loadaddlist').on('click', function () {
        $('#table0').DataTable().ajax.reload();
    });

    $('#addFromList').on('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/add_usc_ballot_from_list_candidate/' + a_dataID.usc_candidate_ballot_id, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json'
                }
            });
            $('#table0').DataTable().ajax.reload();
            $('#table1').DataTable().ajax.reload();
            const data = await response.json();
            $('#addfromlist').modal('hide');
            Toastify({
                text: "USC Candidate Added to E-Ballot",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#4fbe87",
            }).showToast();
        } catch (error) {
            console.log(error);
        }
    })

    //USC REMOVE FROM LIST SECTION
    let d_dataID = ""
    $('#table1 tbody').on('click', '#rmfromlist', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        d_dataID = $('#table1').DataTable().row(current_row).data();
        $('#removefromlist').modal('show');
    });

    $('#removeFromList').on('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/delete_usc_ballot_from_list_candidate/' + d_dataID.usc_candidate_ballot_id, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json'
                }
            });
            $('#table1').DataTable().ajax.reload();
            const data = await response.json();
            $('#removefromlist').modal('hide');
            Toastify({
                text: "USC Candidate removed from E-Ballot",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#CD201F",
            }).showToast();
        } catch (error) {
            console.log(error);
        }
    });

    $('#rmmAllUSCFromList').on('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/delete_ALL_usc_ballot_from_list_candidate', {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json'
                }
            });
            $('#table1').DataTable().ajax.reload();
            const data = await response.json();
            $('#rmAllUSClist').modal('hide');
            Toastify({
                text: "ALL USC Candidate removed from E-Ballot",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#CD201F",
            }).showToast();
        } catch (error) {
            console.log(error);
        }
    });

    //CSC SECTION

    //CSC ADD FROM LIST SECTION
    if (lvl == 1) {
        $('#table3').DataTable({
            ajax: {
                url: `http://localhost:5000/all_csc_ballot_candidate_not_on_list`,
                dataSrc: "",
                beforeSend: function (request) {
                    request.setRequestHeader("authorization", tok);
                }
            },
            autoWidth: false,
            responsive: true,
            columns: [
                { data: "csc_candidate_ballot_id", visible: false },
                { data: "csc_candidate_position" },
                { data: "csc_candidate_first_name" },
                { data: "csc_candidate_last_name" },
                { data: "csc_candidate_party" },
                { data: "csc_ballot_pos", visible: false },
                {
                    data: null,
                    defaultContent: `<a data-target = "#addfromlistcsc" data-toggle="modal" class="btn btn-success btn-sm" id="adfromlistcsc"><i class="fas fa-user-plus"></i></a>`,
                    className: "text-center",
                }
            ]
        });
    } else {
        $('#table3').DataTable({
            ajax: {
                url: `http://localhost:5000/college_csc_ballot_candidate_not_on_list/` + college,
                dataSrc: "",
                beforeSend: function (request) {
                    request.setRequestHeader("authorization", tok);
                }
            },
            autoWidth: false,
            responsive: true,
            columns: [
                { data: "csc_candidate_ballot_id", visible: false },
                { data: "csc_candidate_position" },
                { data: "csc_candidate_first_name" },
                { data: "csc_candidate_last_name" },
                { data: "csc_candidate_party" },
                { data: "csc_ballot_pos", visible: false },
                {
                    data: null,
                    defaultContent: `<a data-target = "#addfromlistcsc" data-toggle="modal" class="btn btn-success btn-sm" id="adfromlistcsc"><i class="fas fa-user-plus"></i></a>`,
                    className: "text-center",
                }
            ]
        });
    }

    let a_dataID_csc = ""
    $('#table3 tbody').on('click', '#adfromlistcsc', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        a_dataID_csc = $('#table3').DataTable().row(current_row).data();
        $('#addfromlistcsc').modal('show');

    });

    $('#loadaddlistcsc').on('click', function () {
        $('#table3').DataTable().ajax.reload();
    });

    $('#addFromListcsc').on('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/add_csc_ballot_from_list_candidate/' + a_dataID_csc.csc_candidate_ballot_id, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json'
                }
            });
            $('#table2').DataTable().ajax.reload();
            $('#table3').DataTable().ajax.reload();
            const data = await response.json();
            $('#addfromlistcsc').modal('hide');
            Toastify({
                text: "CSC Candidate Added to E-Ballot",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#4fbe87",
            }).showToast();
        } catch (error) {
            console.log(error);
        }
    })

    //CSC REMOVE FROM LIST SECTION

    let d_dataID_csc = ""
    $('#table2 tbody').on('click', '#rmfromlistcsc', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        d_dataID_csc = $('#table2').DataTable().row(current_row).data();
        $('#removefromlistcsc').modal('show');
    });

    $('#removeFromListcsc').on('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/delete_csc_ballot_from_list_candidate/' + d_dataID_csc.csc_candidate_ballot_id, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json'
                }
            });
            $('#table2').DataTable().ajax.reload();
            const data = await response.json();
            $('#removefromlistcsc').modal('hide');
            Toastify({
                text: "CSC Candidate removed from E-Ballot",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#CD201F",
            }).showToast();
        } catch (error) {
            console.log(error);
        }
    });

    $('#rmmAllCSCFromList').on('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/delete_ALL_csc_ballot_from_list_candidate', {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json'
                }
            });
            $('#table2').DataTable().ajax.reload();
            const data = await response.json();
            $('#rmAllCSClist').modal('hide');
            Toastify({
                text: "ALL CSC Candidate removed from E-Ballot",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#CD201F",
            }).showToast();
        } catch (error) {
            console.log(error);
        }
    });

    $('#rmmCollegeCSCFromList').on('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/delete_ALL_college_csc_ballot_from_list_candidate/' + college, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json'
                }
            });
            $('#table2').DataTable().ajax.reload();
            const data = await response.json();
            $('#rmAllCSClist').modal('hide');
            Toastify({
                text: "ALL CSC Candidate removed from E-Ballot",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#CD201F",
            }).showToast();
        } catch (error) {
            console.log(error);
        }
    });
});