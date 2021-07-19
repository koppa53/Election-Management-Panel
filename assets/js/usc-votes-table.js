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

    $('#USCpositions').change(function () {
        var table = $('#table2').DataTable();
        table.search($('#USCpositions').val()).draw();
    })

    getHighestVotes()
    async function getHighestVotes() {
        var result = new Array();
        const response = await fetch(`http://localhost:5000/all_usc_ballot_candidate_on_list`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let info = await response.json();
        info.forEach(function (a) {
            if (!this[a.usc_candidate_position]) {
                this[a.usc_candidate_position] = {
                    Position: a.usc_candidate_position, First_name: a.usc_candidate_first_name,
                    Last_name: a.usc_candidate_last_name, Political_party: a.usc_candidate_party, Votes: 0, ballot_pos: a.usc_ballot_pos
                };
                result.push(this[a.usc_candidate_position]);
            }
            var temp = this[a.usc_candidate_position].Votes
            this[a.usc_candidate_position].Votes = Math.max(this[a.usc_candidate_position].Votes, a.usc_candidate_votes);
            if (temp != this[a.usc_candidate_position].Votes) {
                this[a.usc_candidate_position].First_name = a.usc_candidate_first_name
                this[a.usc_candidate_position].Last_name = a.usc_candidate_last_name
                this[a.usc_candidate_position].Political_party = a.usc_candidate_party
                this[a.usc_candidate_position].ballot_pos = a.usc_ballot_pos
            }
            if (temp == a.usc_candidate_votes && this[a.usc_candidate_position].Position == a.usc_candidate_position) {
                this[a.usc_candidate_position] = {
                    Position: a.usc_candidate_position, First_name: a.usc_candidate_first_name,
                    Last_name: a.usc_candidate_last_name, Political_party: a.usc_candidate_party, Votes: a.usc_candidate_votes, ballot_pos: a.usc_ballot_pos
                };
                result.push(this[a.usc_candidate_position]);
            }
        }, Object.create(null));
        $('#table1').DataTable({
            destroy: true,
            autoWidth: false,
            responsive: true,
            data: result,
            columns: [
                { data: "Position" },
                { data: "First_name" },
                { data: "Last_name" },
                { data: "Political_party" },
                { data: "Votes" },
                { data: "ballot_pos", visible: false }
            ],
            order: [[5, "asc"]],
            columnDefs: [
                {
                    targets: 4,
                    className: 'bolded'
                }
            ],
            language: {
                loadingRecords: `<div class="spinner-border text-secondary" role="status"></div><span>&nbsp&nbspGathering Records...</span>`
            }
        });
    }

    var table2 = $('#table2').DataTable({
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
            {
                data: "usc_candidate_votes"
            }
        ], columnDefs: [
            {
                targets: 5,
                className: 'bolded'
            }
        ],
        language: {
            loadingRecords: `<div class="spinner-border text-secondary" role="status"></div><span>&nbsp&nbspGathering Records...</span>`
        },
        initComplete: function () {
            if (!table2.data().any()) {
                document.getElementById("genRes").disabled = true;
            } else {
                document.getElementById("genRes").disabled = false;
            }
        }
    });
});