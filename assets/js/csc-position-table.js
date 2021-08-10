$(document).ready(function () {
    $('.table').DataTable({
        ajax: {
            url: `http://localhost:5000/all_CSC_position`,
            dataSrc: "",
            beforeSend: function (request) {
                request.setRequestHeader("authorization", tok);
            }
        },
        autoWidth: false,
        responsive: true,
        columns: [
            { data: "position_id", visible: false },
            { data: "position_name" },
            { data: "position_max_vote" },
            { data: "position_council", visible: false },
            { data: "position_order", visible: false },
            {
                data: null,
                defaultContent: ` <a href="#" data-target = "#updatepos" data-toggle="modal" class="btn btn-success btn-sm" id="editposition"><i class="fas fa-edit"></i></a>
                                <a href="#" data-target = "#deletepos" data-toggle="modal" class="btn btn-danger btn-sm" id="deleteposition"><i class="fas fa-trash"></i></a>`,
                className: "text-center",
            }
        ],
        order: [[4, "asc"]]
    });

    //ADD MODAL
    $('#addPosition').on('submit', async (event) => {
        event.preventDefault();
        const position_name = $('#new_pos').val();
        const max_vote = $('#max_vote').val();
        const pos_lvl = $('#pos_lvl').val();
        const council = "CSC"
        try {
            const response = await fetch('http://localhost:5000/new_position', {
                method: "POST",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    position_name: position_name,
                    position_max_vote: max_vote,
                    position_council: council,
                    position_order: pos_lvl
                })
            });
            const data = await response.json();
            if (response.ok) {
                $('.table').DataTable().ajax.reload();
                $("input:text").val("");
                $("#max_vote").val("1")
                $('#addpos').modal('hide');
                Toastify({
                    text: "Position Added",
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
        } catch (error) {
            console.log(error);
        }
    });

    //EDIT SECTION
    let u_dataID = ""
    $('.table tbody').on('click', '#editposition', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        u_dataID = $('.table').DataTable().row(current_row).data();
        $('#update_pos').val(u_dataID.position_name);
        $('#update_max_vote').val(u_dataID.position_max_vote);
        $('#u_pos_lvl').val(u_dataID.position_order);
        $('#updatepos').modal('show');
    });

    $('#updatePosition').on('submit', async (event) => {
        event.preventDefault();
        const position_name = $('#update_pos').val();
        const max_vote = $('#update_max_vote').val();
        const u_pos_lvl = $('#u_pos_lvl').val();
        const council = "USC"
        try {
            const response = await fetch('http://localhost:5000/update_position/' + u_dataID.position_id, {
                method: "PUT",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    position_name: position_name,
                    position_max_vote: max_vote,
                    position_council: council,
                    position_order: u_pos_lvl
                })
            });
            $('.table').DataTable().ajax.reload();
            const data = await response.json();
            if (response.ok) {
                $('#updatepos').modal('hide');
                Toastify({
                    text: "Position Updated",
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
    let d_dataID = ""
    $('.table tbody').on('click', '#deleteposition', function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        d_dataID = $('.table').DataTable().row(current_row).data();
        $('#deletepos').modal('show');
    });

    $('#deletePosition').on('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/delete_position/' + d_dataID.position_id, {
                method: "DELETE",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                }
            });
            $('.table').DataTable().ajax.reload();
            const data = await response.json();
            $('#deletepos').modal('hide');
            Toastify({
                text: "Position Deleted",
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