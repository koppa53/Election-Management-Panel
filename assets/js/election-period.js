$(document).ready(function () {

    var table = $('.table').DataTable({
        searching: false,
        paging: false,
        info: false,
        ajax: {
            url: `http://localhost:5000/election_period`,
            dataSrc: "",
        },
        autoWidth: false,
        responsive: true,
        columns: [
            { data: "period_id", visible: false },
            {
                data: "period_date",
                render: function (data) {
                    var d = new Date(data);
                    return d;
                }
            },
            {
                data: "period_start_time", render: function (data) {
                    // Check correct time format and split into components
                    data = data.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [data];

                    if (data.length > 1) { // If time format correct
                        data = data.slice(1);  // Remove full string match value
                        data[5] = +data[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
                        data[0] = +data[0] % 12 || 12; // Adjust hours
                    }
                    return data.join(''); // return adjusted time or original string
                }
            },
            {
                data: "period_end_time", render: function (data) {
                    // Check correct time format and split into components
                    data = data.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [data];

                    if (data.length > 1) { // If time format correct
                        data = data.slice(1);  // Remove full string match value
                        data[5] = +data[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
                        data[0] = +data[0] % 12 || 12; // Adjust hours
                    }
                    return data.join(''); // return adjusted time or original string
                }
            },
            { data: "period_election_year" },
            {
                data: null,
                defaultContent: ` <a href="#" data-target = "#updateelectiontime" data-toggle="modal" class="btn btn-success btn-sm" id="editelectiontime">Edit</a>
                                <a href="#" data-target = "#deleteelectiontime" data-toggle="modal" class="btn btn-danger btn-sm" id="deleteelectiontime">Delete</a>`,
                className: "text-center",
            }
        ],
        initComplete: function () {
            if (table.rows().count() !== 0) {
                $("#addelecttime").attr("disabled", true);
            }
        }
    });


    async function getUSCPositions() {
        const response = await fetch(`http://localhost:5000/all_USC_position`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let info = await response.json();
        return info;
    }

    async function getCSCPositions() {
        const response = await fetch(`http://localhost:5000/all_CSC_position`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let info = await response.json();
        return info;
    }

    //ADD MODAL
    let count = 0;
    $('#addelecttime').on('click', async function () {
        if (count == 0) {
            const data1 = await getUSCPositions()
            const data2 = await getCSCPositions()
            data1.forEach(function (v) {
                $("#uscpos").append('<li class="list-group-item"><input class="form-check-input me-1" type="checkbox" value="' + v.position_name + '_' + v.position_id + '"aria-label="...">' + v.position_name + '</li>');
            })
            data2.forEach(function (v) {
                $("#cscpos").append('<li class="list-group-item"><input class="form-check-input me-1" type="checkbox" value="' + v.position_name + '_' + v.position_id + '"aria-label="...">' + v.position_name + '</li>');
            })
            count++
        }
    })

    $('#election_date').change(function () {
        let year = $('#election_date').val()
        year = year.split('-')
        $("#election_year").val(year[0]);
    });

    $('#addElectionTime').on('submit', async (event) => {
        event.preventDefault();
        const election_year = $('#election_year').val();
        var election_date = $('#election_date').val();
        const election_start_time = $('#election_start_time').val();
        const election_end_time = $('#election_end_time').val();

        try {
            const response = await fetch('http://localhost:5000/new_election_period', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    period_date: election_date,
                    period_start_time: election_start_time,
                    period_end_time: election_end_time,
                    period_election_year: election_year
                })
            });
            const d = await response.json();
            if (response.ok) {
                $('#uscpos input:checked').each(async function () {
                    var split = $(this).val().split('_')
                    const response = await fetch('http://localhost:5000/update_position_status/' + split[1], {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            position_active: true
                        })
                    });
                    const data = await response.json();
                });
                $('#cscpos input:checked').each(async function () {
                    var split = $(this).val().split('_')
                    const response = await fetch('http://localhost:5000/update_position_status/' + split[1], {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            position_active: true
                        })
                    });
                    const data = await response.json();
                });
                $('.table').DataTable().ajax.reload();
                $("#addelecttime").attr("disabled", true);
                $('#election_date').val("");
                $('#election_start_time').val("");
                $('#election_end_time').val("");
                $('#addelectiontime').modal('hide');
                Toastify({
                    text: d.message,
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
    let u_count = 0
    $('.table tbody').on('click', '#editelectiontime', async function () {
        var current_row = $(this).parents('tr');//Get the current row
        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }
        if (u_count == 0) {
            const data1 = await getUSCPositions()
            const data2 = await getCSCPositions()
            data1.forEach(function (v) {
                if (v.position_active == true) {
                    $("#uscposupdate").append('<li class="list-group-item"><input class="form-check-input me-1" type="checkbox" value="' + v.position_name + '_' + v.position_id + '"aria-label="..." checked>' + v.position_name + '</li>');
                }
                else {
                    $("#uscposupdate").append('<li class="list-group-item"><input class="form-check-input me-1" type="checkbox" value="' + v.position_name + '_' + v.position_id + '"aria-label="..." >' + v.position_name + '</li>');
                }
            })
            data2.forEach(function (v) {
                if (v.position_active == true)
                    $("#cscposupdate").append('<li class="list-group-item"><input class="form-check-input me-1" type="checkbox" value="' + v.position_name + '_' + v.position_id + '"aria-label="..." checked>' + v.position_name + '</li>');
                else {
                    $("#cscposupdate").append('<li class="list-group-item"><input class="form-check-input me-1" type="checkbox" value="' + v.position_name + '_' + v.position_id + '"aria-label="..." >' + v.position_name + '</li>');
                }
            })
            u_count++
        }
        var data = $('.table').DataTable().row(current_row).data();
        var d = new Date(data.period_date)
        var MyDateString = ""
        MyDateString = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
        $('#u_election_year').val(data.period_election_year);
        $('#u_election_date').val(MyDateString);
        $('#u_election_start_time').val(data.period_start_time);
        $('#u_election_end_time').val(data.period_end_time);
        $('#updateelectiontime').modal('show');
    });

    $('#updateElectionTime').on('submit', async (event) => {
        event.preventDefault();
        const election_year = $('#u_election_year').val();
        var d = $('#u_election_date').val();
        const election_start_time = $('#u_election_start_time').val();
        const election_end_time = $('#u_election_end_time').val();
        try {
            $('#uscposupdate input:checked').each(async function () {
                var split = $(this).val().split('_')
                const response = await fetch('http://localhost:5000/update_position_status/' + split[1], {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        position_active: true
                    })
                });
                const data = await response.json();
            });
            $('#uscposupdate input:not(:checked)').each(async function () {
                var split = $(this).val().split('_')
                const response = await fetch('http://localhost:5000/update_position_status/' + split[1], {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        position_active: false
                    })
                });
                const data = await response.json();
            });
            $('#cscposupdate input:checked').each(async function () {
                var split = $(this).val().split('_')
                const response = await fetch('http://localhost:5000/update_position_status/' + split[1], {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        position_active: true
                    })
                });
                const data = await response.json();
            });
            $('#cscposupdate input:not(:checked)').each(async function () {
                var split = $(this).val().split('_')
                const response = await fetch('http://localhost:5000/update_position_status/' + split[1], {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        position_active: false
                    })
                });
                const data = await response.json();
            });
            var dataID = $('.table').DataTable().row().data();
            const response = await fetch('http://localhost:5000/update_election_period/' + dataID.period_id, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    period_date: d,
                    period_start_time: election_start_time,
                    period_end_time: election_end_time,
                    period_election_year: election_year
                })
            });
            $('.table').DataTable().ajax.reload();
            const data = await response.json();
            console.log(data)
            $('#updateelectiontime').modal('hide');
            Toastify({
                text: "Election Period Updated",
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
    $('.table tbody').on('click', '#deleteelectiontime', function () {
        $('#deleteelectiontime').modal('show');
    });

    $('#deleteElectiontime').on('submit', async (event) => {
        event.preventDefault();
        try {
            var dataID = $('.table').DataTable().row().data();
            const response = await fetch('http://localhost:5000/delete_election_period/' + dataID.period_id, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const r = await fetch('http://localhost:5000/reset_candidate_position_status', {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            $('.table').DataTable().ajax.reload();
            const data = await response.json();
            $("#addelecttime").attr("disabled", false);
            $('#deleteelectiontime').modal('hide');
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