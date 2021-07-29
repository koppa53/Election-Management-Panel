$(document).ready(function () {
    const tok = localStorage.getItem("Token")
    $('.table').DataTable({
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
                defaultContent: ` <a href="#" data-target = "#updateparty" data-toggle="modal" class="btn btn-success btn-sm" id="editparty"><i class="fas fa-edit"></i></a>
                                <a href="#" data-target = "#deletepos" data-toggle="modal" class="btn btn-danger btn-sm" id="deleteparty"><i class="fas fa-trash"></i></a>`,
                className: "text-center",
            },
        ],
        order: [1, "asc"]
    });

    //ADD MODAL

    $('#addPoliticalParty').on('submit', async (event) => {
        event.preventDefault();
        const party_name = $('#party_name').val();
        const year_organized = $('#year_organized').val();
        const party_color = $("#party_color").val();
        try {
            const response = await fetch('http://localhost:5000/new_political_party', {
                method: "POST",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    party_name: party_name,
                    party_year_organized: year_organized,
                    party_color_theme: party_color,
                })
            });
            const d = await response.json()
            if (response.ok) {
                $('.table').DataTable().ajax.reload();
                $('input:text').val("");
                $('#party_color').val("#000000");
                $('#addparty').modal('hide');
                Toastify({
                    text: "Position Added",
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#4fbe87",
                }).showToast();
            } else {
                Toastify({
                    text: d.message,
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

    //EDIT SECTION
    let u_dataID = ""
    $('.table tbody').on('click', '#editparty', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        u_dataID = $('.table').DataTable().row(current_row).data();
        $('#u_party_name').val(u_dataID.party_name);
        $('#u_year_organized').val(u_dataID.party_year_organized);
        $('#u_party_color').val(u_dataID.party_color_theme);
        $('#updateparty').modal('show');
    });

    $('#updateParty').on('submit', async (event) => {
        event.preventDefault();
        const party_name = $('#u_party_name').val();
        const year_organized = $('#u_year_organized').val();
        const party_color = $('#u_party_color').val();
        try {
            const response = await fetch('http://localhost:5000/update_political_party/' + u_dataID.party_id, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    party_name: party_name,
                    party_year_organized: year_organized,
                    party_color_theme: party_color,
                })
            });
            $('.table').DataTable().ajax.reload();
            const data = await response.json();
            $('#updateparty').modal('hide');
            Toastify({
                text: "Political Party Updated",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#56B6F7",
            }).showToast();
        } catch (error) {
            console.log(error);
        }
    });

    //DELETE SECTION
    var d_dataID = ""
    $('.table tbody').on('click', '#deleteparty', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        d_dataID = $('.table').DataTable().row(current_row).data();
        $('#deleteparty').modal('show');
    });

    $('#deleteParty').on('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/delete_political_party/' + d_dataID.party_id, {
                method: "DELETE",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                }
            });
            $('.table').DataTable().ajax.reload();
            const data = await response.json();
            $('#deleteparty').modal('hide');
            Toastify({
                text: "Political Party Deleted",
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