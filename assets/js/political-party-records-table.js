$(document).ready(function () {
    $('#table1').DataTable({
        ajax: {
            url: `http://localhost:5000/all_political_party`,
            dataSrc: "",
            beforeSend: function (request) {
                request.setRequestHeader("authorization", tok);
            }
        },
        autoWidth: false,
        responsive: true,
        columns: [
            { data: "party_id", visible: false },
            { data: "party_name" },
            { data: "party_year_organized" },
            {
                data: "party_color_theme",
                render: function (data) {
                    return '<button class="btn btn-lg  btn-block p-3" style="background-color:' + data + '"></button>'
                },
                className: "text-center",
            },
            {
                data: null,
                defaultContent: ` <a data-target = "#showmembers" data-toggle="modal" class="btn btn-info btn-sm" id="viewmembers"><i class="fas fa-users"></i> Members</a>`,
                className: "text-center",
            }
        ],
        order: [1, "asc"]
    });

    //VIEW SECTION
    async function getData(id) {
        const response = await fetch(`http://localhost:5000/political_party_members/` + id, {
            method: "GET",
            headers: {
                "authorization": tok,
                'Content-Type': 'application/json'
            }
        });
        let info = await response.json();
        return info;
    }

    let u_dataID = ""
    $('#table1 tbody').on('click', '#viewmembers', async function () {
        $('#table2').DataTable().clear();
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        u_dataID = $('#table1').DataTable().row(current_row).data();
        const data = await getData(u_dataID.party_name);
        $('#table2').DataTable().rows.add(data)
        $('#table2').DataTable().draw()
        $('#showmembers').modal('show');
    });

    $('#table2').DataTable({
        autoWidth: false,
        responsive: true,
        columns: [
            { data: "candidate_id", visible: false },
            { data: "candidate_position" },
            { data: "candidate_first_name" },
            { data: "candidate_last_name" },
            { data: "candidate_council" },
            { data: "candidate_election_year" },
        ]
    });

});