$(document).ready(function () {
    const tok = localStorage.getItem("Token")
    const lvl = localStorage.getItem("Level")
    const college = localStorage.getItem("College")
    let loaded = 0;
    $("#CSCpositions").on('click', async (event) => {
        if (loaded == 0) {
            const response = await fetch('http://localhost:5000/all_active_CSC_position', {
                method: "GET",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json'
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

    if (lvl == 1) {
        var colTitle = document.getElementById("collegetitle");
        colTitle.innerHTML += `CSC Electoral Report ( All Colleges )`
        var colSelect = document.getElementById("collegeSelect");
        colSelect.innerHTML += `<fieldset class="form-group">
            <select class="form-select" id="colleges" onchange="getHighestVotes(document.getElementById('colleges').value)">
                <option value="" selected disabled>Select College</option>
                <option value="College of Science">College of Science</option>
                <option value="College of Arts and Letters">College of Arts and Letters</option>
                <option value="College of Education">College of Education</option>
                <option value="College of Nursing">College of Nursing</option>
                <option value="College of Education">College of Education</option>
                <option value="College of Engineering">College of Engineering</option>
                <option value="College of Social Science and Philosophy">College of Social Science and Philosophy</option>
                <option value="College of Business, Economics and Management">College of Business, Economics and Management</option>
                <option value="College of Agriculture and Forestry">College of Agriculture and Forestry</option>
                <option value="IPESR">IPESR</option>
            </select>
        </fieldset>`;
        var colSelectExport = document.getElementById("collegeSelectExport");
        colSelectExport.innerHTML += `<br>
            <div class="col-md-4">
                <fieldset class="form-group">
                    <select class="form-select" id="college">
                        <option value="" selected disabled>Select College</option>
                        <option value="College of Science">College of Science</option>
                        <option value="College of Arts and Letters">College of Arts and Letters</option>
                        <option value="College of Education">College of Education</option>
                        <option value="College of Nursing">College of Nursing</option>
                        <option value="College of Education">College of Education</option>
                        <option value="College of Engineering">College of Engineering</option>
                        <option value="College of Social Science and Philosophy">College of Social Science and Philosophy</option>
                        <option value="College of Business, Economics and Management">College of Business, Economics and Management</option>
                        <option value="College of Agriculture and Forestry">College of Agriculture and Forestry</option>
                        <option value="IPESR">IPESR</option>
                    </select>
                </fieldset>
            </div>
            <button type="button" onclick="generateResult()" class="btn btn-primary"
                id="genRes" disabled>
                <span class="spinner-border spinner-border-sm" role="status"
                    aria-hidden="true" style="display:none" id="loading"></span>
                <i class="fas fa-download" id="cscdlicon"></i> Export CSC Election Results</button>`;
        var table2 = $('#table2').DataTable({
            ajax: {
                url: `http://localhost:5000/all_csc_ballot_candidate_on_list`,
                dataSrc: "",
                /*beforeSend: function (request) {
                    request.setRequestHeader("authorization", tok);
                }*/
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
            },
            initComplete: function () {
                if (!table2.data().any()) {
                    document.getElementById("college").disabled = true;
                } else {
                    document.getElementById("college").disabled = false;
                }
            }
        });
    } else {
        var colTitle2 = document.getElementById("collegetitle");
        colTitle2.innerHTML += `CSC Electoral Report ( ` + college + ` )`
        var colSelectExport2 = document.getElementById("collegeSelectExport");
        colSelectExport2.innerHTML += `<br>
            <button type="button" onclick="generateResult();" class="btn btn-primary"
                id="genRes">
                <span class="spinner-border spinner-border-sm" role="status"
                    aria-hidden="true" style="display:none" id="loading"></span>
                <i class="fas fa-download" id="cscdlicon"></i> Export CSC Election Results</button>`;
        var table2 = $('#table2').DataTable({
            ajax: {
                url: `http://localhost:5000/college_csc_ballot_candidate_on_list/` + college,
                dataSrc: "",
                /*beforeSend: function (request) {
                    request.setRequestHeader("authorization", tok);
                }*/
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

        getHighestVotes(college)
    }

    $('#college').change(function () {
        $('#genRes').prop('disabled', false);
    })
});

async function getHighestVotes(college) {
    var result = new Array();
    const response = await fetch(`http://localhost:5000/college_csc_ballot_candidate_on_list/` + college, {
        method: "GET",
        headers: {
            "authorization": tok,
            'Content-Type': 'application/json'
        }
    });
    let info = await response.json();
    info.forEach(function (a) {
        if (a.csc_candidate_votes != 0) {
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