$(document).ready(function () {

    $('#table1').DataTable({
        ajax: {
            url: `http://localhost:5000/all_candidate_CSC`,
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
            { data: "candidate_first_name" },
            { data: "candidate_last_name" },
            { data: "candidate_party" },
            { data: "candidate_election_year" },
            { data: "candidate_votes" },
            {
                data: null,
                defaultContent: ` <a data-target = "#showdetails" data-toggle="modal" class="btn btn-info btn-sm" id="viewdetails"><i class="fas fa-info-circle"></i> About</a>`,
                className: "text-center",
            }
        ],
        language: {
            loadingRecords: `<div class="spinner-border text-secondary" role="status"></div><span>&nbsp&nbspGathering Records...</span>`
        }
    });

    //VIEW SECTION
    async function getData(id) {
        const response = await fetch(`http://localhost:5000/candidate/` + id, {
            method: "GET",
            headers: {
                "authorization": tok,
                'Content-Type': 'application/json',
            }
        });
        let info = await response.json();
        return info;
    }

    let u_dataID = ""
    $('#table1 tbody').on('click', '#viewdetails', async function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        u_dataID = $('#table1').DataTable().row(current_row).data();
        const data = await getData(u_dataID.candidate_id);
        var binary = '';
        var bytes = new Uint8Array(data.candidate_photo.data);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        $('#candidate_photo').attr("src", 'data:image/png;base64,' + binary);
        $('#first_name').val(data.candidate_first_name)
        $('#middle_name').val(data.candidate_middle_name)
        $('#last_name').val(data.candidate_last_name)
        $('#age').val(data.candidate_age)
        $('#college').val(data.candidate_college)
        $('#student_id').val(data.candidate_student_id)
        $('#curriculum_year').val(data.candidate_curriculum_year)
        $('#course').val(data.candidate_course)
        $('#Address').val(data.candidate_address)
        $('#contact_number').val(data.candidate_contact_number)
        $('#showdetails').modal('show');
    });


});