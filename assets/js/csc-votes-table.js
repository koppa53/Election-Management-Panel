$(document).ready(function () {

    let loaded = 0;
    setHeaderElectioYear();
    async function setHeaderElectioYear() {
        const response = await fetch('http://localhost:5000/election_period', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        document.getElementById('electionyear').innerHTML = data[0].period_election_year + " CSC Election Candidates With Highest Votes"
        document.getElementById('footer').innerHTML = "&copy; " + data[0].period_election_year + " Bicol University USC | CSC Election System"
    }
    $('#college').change(function () {
        $('#genRes').prop('disabled', false);
    })
    $("#CSCpositions").on('click', async (event) => {
        if (loaded == 0) {
            const response = await fetch('http://localhost:5000/all_active_CSC_position', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const positiondata = await response.json();
            positiondata.forEach(function (v) {
                var o = new Option(v.position_name, v.position_name);
                $(o).html(v.position_name);
                $("#CSCpositions").append(o);
            })
            loaded++;
        }
    })

    $('#CSCpositions').change(function () {
        var table = $('#table2').DataTable();
        table.search($('#CSCpositions').val()).draw();
    })

    $('#table2').DataTable({
        ajax: {
            url: `http://localhost:5000/all_csc_ballot_candidate_on_list`,
            dataSrc: "",
        },
        autoWidth: false,
        responsive: true,
        columns: [
            { data: "csc_candidate_ballot_id", visible: false },
            { data: "csc_candidate_position" },
            { data: "csc_candidate_first_name" },
            { data: "csc_candidate_last_name" },
            { data: "csc_ballot_college" },
            { data: "csc_candidate_party" },
            {
                data: "csc_candidate_votes"
            }
        ], columnDefs: [
            {
                targets: 6,
                className: 'bolded'
            }
        ],
        language: {
            loadingRecords: `<div class="spinner-border text-secondary" role="status"></div><span>&nbsp&nbspGathering Records...</span>`
        }
    });

});

async function getHighestVotes(college) {
    var result = new Array();
    const response = await fetch(`http://localhost:5000/college_csc_ballot_candidate_on_list/` + college, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let info = await response.json();
    info.forEach(function (a) {
        if (!this[a.csc_candidate_position]) {
            this[a.csc_candidate_position] = {
                Position: a.csc_candidate_position, First_name: a.csc_candidate_first_name,
                Last_name: a.csc_candidate_last_name, Political_party: a.csc_candidate_party, Votes: 0, ballot_pos: a.csc_ballot_pos
            };
            result.push(this[a.csc_candidate_position]);
        }
        var temp = this[a.csc_candidate_position].Votes
        this[a.csc_candidate_position].Votes = Math.max(this[a.csc_candidate_position].Votes, a.csc_candidate_votes);
        if (temp != this[a.csc_candidate_position].Votes) {
            this[a.csc_candidate_position].First_name = a.csc_candidate_first_name
            this[a.csc_candidate_position].Last_name = a.csc_candidate_last_name
            this[a.csc_candidate_position].Political_party = a.csc_candidate_party
            this[a.csc_candidate_position].ballot_pos = a.csc_ballot_pos
        }
        if (temp == a.csc_candidate_votes && this[a.csc_candidate_position].Position == a.csc_candidate_position) {
            this[a.csc_candidate_position] = {
                Position: a.csc_candidate_position, First_name: a.csc_candidate_first_name,
                Last_name: a.csc_candidate_last_name, Political_party: a.csc_candidate_party, Votes: a.csc_candidate_votes, ballot_pos: a.csc_ballot_pos
            };
            result.push(this[a.csc_candidate_position]);
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
    });
}