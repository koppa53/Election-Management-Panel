$(document).ready(function () {

    fetchData()
    async function fetchData() {
        const response = await fetch(`http://localhost:5000/all_election_year`, {
            method: "GET",
            headers: {
                "authorization": tok,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        data.forEach(function (v) {
            var o = new Option(v.candidate_election_year, v.candidate_election_year);
            var x = new Option(v.candidate_election_year, v.candidate_election_year);
            var y = new Option(v.candidate_election_year, v.candidate_election_year);
            var z = new Option(v.candidate_election_year, v.candidate_election_year);
            $("#electionyear").append(y);
            $("#electionyear1").append(o);
            $("#electionyear2").append(x);
            $("#electionyear3").append(z);
        })
    }

    $('#electionyear1').change(function () {
        var table = $('#table1').DataTable();
        table.search($('#electionyear1').val()).draw();
    })

    $('#electionyear2').change(function () {
        var table = $('#table2').DataTable();
        table.search($('#electionyear2').val()).draw();
    })

    $('#table1').DataTable({
        ajax: {
            url: `http://localhost:5000/all_student_voters_logs`,
            dataSrc: "",
            beforeSend: function (request) {
                request.setRequestHeader("authorization", tok);
            }
        },
        destroy: true,
        autoWidth: false,
        responsive: true,
        columns: [
            { data: "vote_student_id" },
            {
                data: "created_at",
                render: function (data) {
                    var date = new Date(data)
                    var str = date.toString()
                    var split = str.split("GMT")
                    return split[0];
                }
            },
            { data: "vote_college" },
            { data: "vote_election_year" }
        ],
        order: [1, "asc"]
    });

    $('#table2').DataTable({
        ajax: {
            url: `http://localhost:5000/all_assisted_student_voters_logs`,
            dataSrc: "",
            beforeSend: function (request) {
                request.setRequestHeader("authorization", tok);
            }
        },
        destroy: true,
        autoWidth: false,
        responsive: true,
        columns: [
            { data: "vote_student_id" },
            {
                data: "created_at",
                render: function (data) {
                    var date = new Date(data)
                    var str = date.toString()
                    var split = str.split("GMT")
                    return split[0];
                }
            },
            { data: "vote_college" },
            { data: "vote_election_year" },
            { data: "vote_assistant_last_name", visible: false },
            { data: "vote_assistant_first_name", visible: false },
            {
                mData: function (data) {
                    return data.vote_assistant_last_name + " " + data.vote_assistant_first_name[0].toUpperCase() + ".";
                }
            }

        ],
        order: [1, "asc"]
    });

    $('#verifypassword').on('submit', async (event) => {
        event.preventDefault();
        const username = localStorage.getItem("User Name")
        const password = $('#vpass').val();

        try {
            const response = await fetch('http://localhost:5000/verify_user_pass', {
                method: "POST",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            const d = await response.json();
            if (response.ok) {
                $('#showVotes').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#vpass').val("");
                $('#authpass').modal('hide');
                Toastify({
                    text: d.message,
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#4fbe87",
                }).showToast();
                $('#showVotes').modal('show');
            } else {
                $('#vpass').val("");
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

    $('#electionyear').change(function () {
        const electionyear = $('#electionyear').val()
        $('#tableVotes').DataTable({
            ajax: {
                url: `http://localhost:5000/election_year_student_votes/` + electionyear,
                dataSrc: "",
                beforeSend: function (request) {
                    request.setRequestHeader("authorization", tok);
                }
            },
            destroy: true,
            autoWidth: false,
            responsive: true,
            columns: [
                { data: "vote_student_id" },
                { data: "vote_candidate_first_name", visible: false },
                { data: "vote_candidate_last_name", visible: false },
                {
                    mData: function (data) {
                        if (data.vote_candidate_first_name != "ABSTAINED") return data.vote_candidate_last_name + " " + data.vote_candidate_first_name[0].toUpperCase() + ".";
                        return data.vote_candidate_last_name
                    }
                },
                { data: "vote_candidate_position" },
                { data: "vote_council" },
                { data: "vote_college" },
                {
                    data: null,
                    defaultContent: `<input type="checkbox" class="form-check-input" id="checkbox2">
                                    <label for="checkbox2">Mark</label>`
                }

            ],
            order: [0, "asc"]
        });
        $('#tableVotes2').DataTable({
            ajax: {
                url: `http://localhost:5000/election_year_assisted_student_votes/` + electionyear,
                dataSrc: "",
                beforeSend: function (request) {
                    request.setRequestHeader("authorization", tok);
                }
            },
            destroy: true,
            autoWidth: false,
            responsive: true,
            columns: [
                { data: "vote_student_id" },
                { data: "vote_candidate_first_name", visible: false },
                { data: "vote_candidate_last_name", visible: false },
                {
                    mData: function (data) {
                        if (data.vote_candidate_first_name != "ABSTAINED") return data.vote_candidate_last_name + " " + data.vote_candidate_first_name[0].toUpperCase() + ".";
                        return data.vote_candidate_last_name
                    }
                },
                { data: "vote_candidate_position" },
                { data: "vote_council" },
                { data: "vote_college" },
                {
                    data: null,
                    defaultContent: `<input type="checkbox" class="form-check-input" id="checkbox2">
                                    <label for="checkbox2">Mark</label>`
                }

            ],
            order: [0, "asc"]
        });
    })
});