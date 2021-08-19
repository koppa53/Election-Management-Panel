$(document).ready(function () {
    const lvl = localStorage.getItem("Level")
    const college = localStorage.getItem("College")
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
    if (lvl == 1) {
        var htitle = document.getElementById("exporttitle")
        htitle.innerHTML += "USC & CSC Election Results"
        var j = document.getElementById("votes")
        j.innerHTML += `
        <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#authpass"
            id="checkpass">
            <i class="far fa-eye"></i> View Votes
        </button>
        <hr/>
        <h4>Student Voter Logs</h4>
        <div class="form-group">
            <p>Sort by Election Year:</p>
            <div class="row">
                <div class="col-md-2">
                    <select class="form-select" id="electionyear1">
                        <option value="">All</option>
                    </select>
                </div>
            </div>
        </div>
        <table class="table table-striped" id="table1">
            <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Date & Time Voted</th>
                    <th>College</th>
                    <th>Election Year</th>
                </tr>
            </thead>
        </table>
        <br />
        `
        var x = document.getElementById("exportbuttons")
        x.innerHTML += `<button
        class="btn btn-primary"
        id = "usc"
        onclick = "generateRecordUSC()"
        disabled>
            <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                style="display: none"
                id="loading"
            ></span>
            <i class="fas fa-download" id="dlicon"></i>
        Export USC
        </button>
            <button
                class="btn btn-primary"
                id="csc"
                onclick="generateRecordCSC()"
                disabled>
                <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                    style="display: none"
                    id="cscloading"
                ></span>
                <i class="fas fa-download" id="cscdlicon"></i>
                Export CSC
            </button>`
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
                },
                { data: "vote_college" },
                { data: "vote_election_year" }
            ]
        });

        /*$('#table2').DataTable({
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

            ]
        });*/
    } else {
        var title = document.getElementById("exporttitle")
        title.innerHTML += "CSC Election Results"
        var j2 = document.getElementById("votes")
        j2.innerHTML +=
            `<h4>Student Voter Logs ( ` + college + ` )</h4>
            <div class="form-group">
                <p>Sort by Election Year:</p>
                <div class="row">
                    <div class="col-md-2">
                        <select class="form-select" id="electionyear1">
                            <option value="">All</option>
                        </select>
                    </div>
                </div>
            </div>
            <table class="table table-striped" id="table1">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Date & Time Voted</th>
                        <th>Election Year</th>
                    </tr>
                </thead>
            </table>
            <br />`
        var x = document.getElementById("exportbuttons")
        x.innerHTML += `
            <button
                class="btn btn-primary"
                id="csc"
                onclick="generateRecordCSC()"
                disabled
            >
                <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                    style="display: none"
                    id="cscloading"
                ></span>
                <i class="fas fa-download" id="cscdlicon"></i>
                Export CSC
            </button>
        `
        $('#table1').DataTable({
            ajax: {
                url: `http://localhost:5000/college_student_voters_logs/` + college,
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
                    data: "created_at"
                },
                { data: "vote_election_year" }
            ],
            columnDefs: [{ type: 'date', 'targets': [1] }],
            order: [[1, 'desc']]
        });
    }
    $('#electionyear1').change(function () {
        var table = $('#table1').DataTable();
        table.search($('#electionyear1').val()).draw();
    })

    $('#electionyear2').change(function () {
        var table = $('#table2').DataTable();
        table.search($('#electionyear2').val()).draw();
    })

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