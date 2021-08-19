$(document).ready(function () {
    const college = localStorage.getItem("College")
    $('.table').DataTable({
        ajax: {
            url: `http://localhost:5000/all_college_candidate_CSC/` + college,
            dataSrc: "",
            beforeSend: function (request) {
                request.setRequestHeader("authorization", tok);
            }
        },
        autoWidth: false,
        responsive: true,
        columns: [
            { data: "candidate_id", visible: false },
            { data: "candidate_position" },
            {
                data: "candidate_photo",
                render: function (data) {
                    if (data != null) {
                        var binary = '';
                        var bytes = new Uint8Array(data.data);
                        var len = bytes.byteLength;
                        for (var i = 0; i < len; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        return '<img src="data:image/png;base64,' + binary + '"style="width: 60px; height:60px">' +
                            '  <a data-target = "#editcandidatephoto" data-toggle="modal" class="btn btn-dark btn-sm" id="editcandidatephoto"><i class="fas fa-edit"></i></a>'
                    }
                },
                className: "text-center"
            },
            { data: "candidate_first_name" },
            { data: "candidate_last_name" },
            { data: "candidate_college" },
            { data: "candidate_party" },
            {
                data: null,
                defaultContent: `<a href="#" data-target = "#updatecandidate" data-toggle="modal" class="btn btn-success btn-sm" id="editcandidate"><i class="fas fa-edit"></i></a>
                                <a data-target = "#deletecandidate" data-toggle="modal" class="btn btn-danger btn-sm" id="deletecandidate"><i class="fas fa-trash"></i></a>`,
                className: "text-center",
            }
        ],
        language: {
            loadingRecords: `<div class="spinner-border text-secondary" role="status"></div><span>&nbsp&nbspGathering Data...</span>`
        },
        order: [0, "desc"]
    });

    //ADD MODAL
    let count = 0;
    $('#showcandidatemodal').on('click', async (event) => {
        //Some code
        event.preventDefault();
        try {
            if (count == 0) {
                const r = await fetch('http://localhost:5000/all_political_party', {
                    method: "GET",
                    headers: {
                        "authorization": tok,
                        'Content-Type': 'application/json',
                    }
                });
                const response = await fetch('http://localhost:5000/all_active_CSC_position', {
                    method: "GET",
                    headers: {
                        "authorization": tok,
                        'Content-Type': 'application/json',
                    }
                });
                const positiondata = await response.json();
                const partydata = await r.json();
                var d = new Date();
                var n = d.getFullYear();
                $("#candidate_college").val(college);
                $("#candidate_election_year").val(n);
                positiondata.forEach(function (v) {
                    var o = new Option(v.position_name, v.position_name);
                    $(o).html(v.position_name);
                    $("#candidate_position").append(o);
                })
                partydata.forEach(function (v) {
                    var o = new Option(v.party_name, v.party_name);
                    $(o).html(v.party_name);
                    $("#candidate_party").append(o);
                })
                count++;
            } else {
                var d = new Date();
                var n = d.getFullYear();
                $("#candidate_election_year").val(n);
            }
            $('#addcandidate').modal('show');
        } catch (error) {
            console.log(error)
        }
    });

    let base64String = "";
    $("#candidate_photo").change(function () {
        var file = document.querySelector('input[type=file]')['files'][0];
        var reader = new FileReader();
        reader.onload = function () {
            base64String = reader.result.replace("data:", "")
                .replace(/^.+,/, "");
            imageBase64Stringsep = base64String;
        }
        reader.readAsDataURL(file);
    });
    let u_base64String = "";
    $("#u_candidate_photo").change(function () {
        var u_file = document.getElementById("u_candidate_photo")['files'][0]
        var u_reader = new FileReader();
        u_reader.onload = function () {
            u_base64String = u_reader.result.replace("data:", "")
                .replace(/^.+,/, "");
            u_imageBase64Stringsep = u_base64String;
        }
        u_reader.readAsDataURL(u_file);
    });

    $('#addCandidate').on('submit', async (event) => {
        event.preventDefault();
        $('#subCandidateCSC').prop('disabled', true);
        $('#aloading').show();
        const candidate_college = $('#candidate_college').val();
        const candidate_first_name = $('#candidate_first_name').val();
        const candidate_middle_name = $('#candidate_middle_name').val();
        const candidate_last_name = $('#candidate_last_name').val();
        const candidate_photo = base64String;
        const candidate_age = $('#candidate_age').val();
        const candidate_student_id = $('#candidate_student_id').val();
        const candidate_curriculum_year = $('#candidate_curriculum_year').val();
        const candidate_address = $('#candidate_address').val();
        const candidate_course = $('#candidate_course').val();
        const candidate_contact_number = $('#candidate_contact_number').val();
        const candidate_position = $('#candidate_position').val();
        const candidate_party = $('#candidate_party').val();
        const candidate_election_year = $('#candidate_election_year').val();
        const candidate_council = "CSC"
        try {
            const response = await fetch('http://localhost:5000/new_candidate', {
                method: "POST",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    candidate_college: candidate_college,
                    candidate_first_name: candidate_first_name,
                    candidate_middle_name: candidate_middle_name,
                    candidate_last_name: candidate_last_name,
                    candidate_photo: candidate_photo,
                    candidate_age: candidate_age,
                    candidate_student_id: candidate_student_id,
                    candidate_curriculum_year: candidate_curriculum_year,
                    candidate_address: candidate_address,
                    candidate_course: candidate_course,
                    candidate_contact_number: candidate_contact_number,
                    candidate_position: candidate_position,
                    candidate_party: candidate_party,
                    candidate_election_year: candidate_election_year,
                    candidate_council: candidate_council
                })
            });
            const data = await response.json();
            if (response.ok) {
                base64String = "";
                const res = await fetch('http://localhost:5000/CSC_position_name/' + candidate_position, {
                    method: "GET",
                    headers: {
                        "authorization": tok,
                        'Content-Type': 'application/json',
                    }
                });
                const d = await res.json();
                $('.table').DataTable().ajax.reload(null, false);
                const r = await fetch('http://localhost:5000/new_csc_ballot_candidate', {
                    method: "POST",
                    headers: {
                        "authorization": tok,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        csc_candidate_id: data.candidate_id,
                        csc_candidate_first_name: candidate_first_name,
                        csc_candidate_middle_name: candidate_middle_name,
                        csc_candidate_last_name: candidate_last_name,
                        csc_ballot_college: candidate_college,
                        csc_candidate_position: candidate_position,
                        csc_candidate_party: candidate_party,
                        csc_ballot_election_year: candidate_election_year,
                        csc_candidate_photo: candidate_photo,
                        csc_ballot_pos: d.position_order,
                        is_on_ballot_list: true
                    })
                });
                $("input:text").val("");
                $('input:file').val('');
                $('#candidate_age').val('');
                $('#candidate_party').prop('selectedIndex', 0);
                $('#candidate_position').prop('selectedIndex', 0);
                $('#addcandidate').modal('hide');
                Toastify({
                    text: "Candidate Added",
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#4fbe87",
                }).showToast();
            } else {
                Toastify({
                    text: data.message,
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#CD201F",
                }).showToast();
            }
            $('#subCandidateCSC').prop('disabled', false);
            $('#aloading').hide();
        } catch (error) {
            console.log(error);
        }
    });

    //EDIT SECTION
    var u_dataID = ""
    $('.table tbody').on('click', '#editcandidate', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        u_dataID = $('.table').DataTable().row(current_row).data();
        $('#updatecandidate').modal('show');
    });

    $('.table tbody').on('click', '#editcandidatephoto', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        u_dataID = $('.table').DataTable().row(current_row).data();
        $('#editcandidatephoto').modal('show');
    });

    let u_count = 0;
    $('.table tbody').on('click', '#editcandidate', async (event) => {
        event.preventDefault();
        try {
            if (u_count == 0) {
                const r = await fetch('http://localhost:5000/all_political_party', {
                    method: "GET",
                    headers: {
                        "authorization": tok,
                        'Content-Type': 'application/json',
                    }
                });
                const response = await fetch('http://localhost:5000/all_active_CSC_position', {
                    method: "GET",
                    headers: {
                        "authorization": tok,
                        'Content-Type': 'application/json',
                    }
                });
                const u_positiondata = await response.json();
                const u_partydata = await r.json();
                var d = new Date();
                var n = d.getFullYear();
                $("#u_candidate_election_year").val(n);
                u_positiondata.forEach(function (v) {
                    var o = new Option(v.position_name, v.position_name);
                    $(o).html(v.position_name);
                    $("#u_candidate_position").append(o);
                })
                u_partydata.forEach(function (v) {
                    var o = new Option(v.party_name, v.party_name);
                    $(o).html(v.party_name);
                    $("#u_candidate_party").append(o);
                })
                $('#u_candidate_college').val(u_dataID.candidate_college);
                $('#u_candidate_first_name').val(u_dataID.candidate_first_name);
                $('#u_candidate_middle_name').val(u_dataID.candidate_middle_name);
                $('#u_candidate_last_name').val(u_dataID.candidate_last_name);
                $('#u_candidate_age').val(u_dataID.candidate_age);
                $('#u_candidate_student_id').val(u_dataID.candidate_student_id);
                $('#u_candidate_curriculum_year').val(u_dataID.candidate_curriculum_year);
                $('#u_candidate_address').val(u_dataID.candidate_address);
                $('#u_candidate_course').val(u_dataID.candidate_course);
                $('#u_candidate_contact_number').val(u_dataID.candidate_contact_number);
                $('#u_candidate_position').val(u_dataID.candidate_position);
                $('#u_candidate_party').val(u_dataID.candidate_party);
                $('#updatecandidate').modal('show');
                u_count++
            } else {
                var d = new Date();
                var n = d.getFullYear();
                $("#u_candidate_election_year").val(n);
                $('#u_candidate_college').val(u_dataID.candidate_college);
                $('#u_candidate_first_name').val(u_dataID.candidate_first_name);
                $('#u_candidate_middle_name').val(u_dataID.candidate_middle_name);
                $('#u_candidate_last_name').val(u_dataID.candidate_last_name);
                $('#u_candidate_age').val(u_dataID.candidate_age);
                $('#u_candidate_student_id').val(u_dataID.candidate_student_id);
                $('#u_candidate_curriculum_year').val(u_dataID.candidate_curriculum_year);
                $('#u_candidate_address').val(u_dataID.candidate_address);
                $('#u_candidate_course').val(u_dataID.candidate_course);
                $('#u_candidate_contact_number').val(u_dataID.candidate_contact_number);
                $('#u_candidate_position').val(u_dataID.candidate_position);
                $('#u_candidate_party').val(u_dataID.candidate_party);
                $('#updatecandidate').modal('show');
            }
        } catch (error) {
            console.log(error)
        }

    });

    $('#editCandidatephoto').on('submit', async (event) => {
        event.preventDefault();
        const u_candidate_photo = u_base64String;
        try {
            const response = await fetch('http://localhost:5000/update_candidate_photo/' + u_dataID.candidate_id, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    candidate_photo: u_candidate_photo,
                })
            });
            const data = await response.json();
            if (response.ok) {
                const r = await fetch('http://localhost:5000/update_csc_ballot_candidate_photo/' + u_dataID.candidate_id, {
                    method: "PUT",
                    headers: {
                        "authorization": tok,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        csc_candidate_photo: u_candidate_photo,
                    })
                });
                u_base64String = ""
                $('.table').DataTable().ajax.reload(null, false);
                $('#editcandidatephoto').modal('hide');
                Toastify({
                    text: "Candidate Photo Updated",
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#212529",
                }).showToast();
            } else {
                Toastify({
                    text: data.message,
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

    $('#editCandidate').on('submit', async (event) => {
        event.preventDefault();
        const u_candidate_college = $('#u_candidate_college').val();
        const u_candidate_first_name = $('#u_candidate_first_name').val();
        const u_candidate_middle_name = $('#u_candidate_middle_name').val();
        const u_candidate_last_name = $('#u_candidate_last_name').val();
        const u_candidate_age = $('#u_candidate_age').val();
        const u_candidate_student_id = $('#u_candidate_student_id').val();
        const u_candidate_curriculum_year = $('#u_candidate_curriculum_year').val();
        const u_candidate_address = $('#u_candidate_address').val();
        const u_candidate_course = $('#u_candidate_course').val();
        const u_candidate_contact_number = $('#u_candidate_contact_number').val();
        const u_candidate_position = $('#u_candidate_position').val();
        const u_candidate_party = $('#u_candidate_party').val();
        const u_candidate_election_year = $('#u_candidate_election_year').val();
        try {
            const response = await fetch('http://localhost:5000/update_candidate/' + u_dataID.candidate_id, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    candidate_college: u_candidate_college,
                    candidate_first_name: u_candidate_first_name,
                    candidate_middle_name: u_candidate_middle_name,
                    candidate_last_name: u_candidate_last_name,
                    candidate_age: u_candidate_age,
                    candidate_student_id: u_candidate_student_id,
                    candidate_curriculum_year: u_candidate_curriculum_year,
                    candidate_address: u_candidate_address,
                    candidate_course: u_candidate_course,
                    candidate_contact_number: u_candidate_contact_number,
                    candidate_position: u_candidate_position,
                    candidate_party: u_candidate_party,
                    candidate_election_year: u_candidate_election_year,
                })
            });
            const data = await response.json();
            if (response.ok) {
                const res = await fetch('http://localhost:5000/CSC_position_name/' + u_candidate_position, {
                    method: "GET",
                    headers: {
                        "authorization": tok,
                        'Content-Type': 'application/json',
                    }
                });
                const d = await res.json();
                const r = await fetch('http://localhost:5000/update_csc_ballot_candidate/' + u_dataID.candidate_id, {
                    method: "PUT",
                    headers: {
                        "authorization": tok,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        csc_candidate_first_name: u_candidate_first_name,
                        csc_candidate_middle_name: u_candidate_middle_name,
                        csc_candidate_last_name: u_candidate_last_name,
                        csc_candidate_position: u_candidate_position,
                        csc_ballot_college: u_candidate_college,
                        csc_candidate_party: u_candidate_party,
                        csc_ballot_election_year: u_candidate_election_year,
                        csc_ballot_pos: d.position_order
                    })
                });
                $('.table').DataTable().ajax.reload(null, false);
                $('#updatecandidate').modal('hide');
                Toastify({
                    text: "Candidate Updated",
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#56B6F7",
                }).showToast();
            } else {
                Toastify({
                    text: data.message,
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
    var d_dataID = ""
    $('.table tbody').on('click', '#deletecandidate', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        d_dataID = $('.table').DataTable().row(current_row).data();
        $('#deletecandidate').modal('show');
    });

    $('#deleteCandidate').on('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/delete_candidate/' + d_dataID.candidate_id, {
                method: "DELETE",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                }
            });
            const r = await fetch('http://localhost:5000/delete_csc_ballot_candidate/' + d_dataID.candidate_id, {
                method: "DELETE",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                }
            });
            $('.table').DataTable().ajax.reload(null, false);
            const data = await response.json();
            $('#deletecandidate').modal('hide');
            Toastify({
                text: "Candidate Deleted",
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