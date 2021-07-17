$(document).ready(function () {

    let loaded = 0;
    $("#USCpositions").on('click', async (event) => {
        if (loaded == 0) {
            const response = await fetch('http://localhost:5000/all_active_USC_position', {
                method: "GET",
                headers: {
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

    $('#table1').DataTable({
        ajax: {
            url: `http://localhost:5000/all_usc_ballot_candidate_on_list`,
            dataSrc: "",
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
                defaultContent: `<a href="#" data-target = "#removefromlist" data-toggle="modal" class="btn btn-danger btn-sm" id="rmfromlist">Remove From List  </a>`,
                className: "text-center",
            }
        ],
        order: [[5, "asc"]]
    });

    //USC ADD FROM LIST SECTION
    $('#table0').DataTable({
        ajax: {
            url: `http://localhost:5000/all_usc_ballot_candidate_not_on_list`,
            dataSrc: "",
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
                defaultContent: `<a href="#" data-target = "#addfromlist" data-toggle="modal" class="btn btn-success btn-sm" id="adfromlist">Add From List  </a>`,
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
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    is_on_ballot_list: true
                })
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
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    is_on_ballot_list: false
                })
            });
            $('#table1').DataTable().ajax.reload();
            const data = await response.json();
            $('#removefromlist').modal('hide');
            Toastify({
                text: "USC Candidate removed from E-Ballot",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#F3616D",
            }).showToast();
        } catch (error) {
            console.log(error);
        }
    });

    //CSC SECTION

    $('#table2').DataTable({
        ajax: {
            url: `http://localhost:5000/all_csc_ballot_candidate_on_list`,
            dataSrc: "",
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
                defaultContent: `<a href="#" data-target = "#removefromlistcsc" data-toggle="modal" class="btn btn-danger btn-sm" id="rmfromlistcsc">Remove From List  </a>`,
                className: "text-center",
            }
        ],
        order: [[6, "asc"]]
    });

    //CSC ADD FROM LIST SECTION

    $('#table3').DataTable({
        ajax: {
            url: `http://localhost:5000/all_csc_ballot_candidate_not_on_list`,
            dataSrc: "",
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
                defaultContent: `<a href="#" data-target = "#addfromlistcsc" data-toggle="modal" class="btn btn-success btn-sm" id="adfromlistcsc">Add From List  </a>`,
                className: "text-center",
            }
        ],
        order: [[5, "asc"]]
    });

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
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    is_on_ballot_list: true
                })
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
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    is_on_ballot_list: false
                })
            });
            $('#table2').DataTable().ajax.reload();
            const data = await response.json();
            $('#removefromlistcsc').modal('hide');
            Toastify({
                text: "CSC Candidate removed from E-Ballot",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#F3616D",
            }).showToast();
        } catch (error) {
            console.log(error);
        }
    });
});