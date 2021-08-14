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
            $("#electionyear1").append(o);
            $("#electionyear2").append(x);
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
            url: `http://localhost:5000/all_student_votes`,
            dataSrc: "",
            beforeSend: function (request) {
                request.setRequestHeader("authorization", tok);
            }
        },
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
            url: `http://localhost:5000/all_assisted_student_votes`,
            dataSrc: "",
            beforeSend: function (request) {
                request.setRequestHeader("authorization", tok);
            }
        },
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

});