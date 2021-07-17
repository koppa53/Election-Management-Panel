$(document).ready(function () {

    let loaded = 0;
    totalUSCPositions();
    totalCSCPositions();
    totalCandidates();
    totalPolitcalParty();

    let year = electionPeriod()
    async function electionPeriod() {
        try {
            const response = await fetch(`http://localhost:5000/election_period`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let info = await response.json();
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let date = info[0].period_date.split('T')
            let d = date[0].split('-')
            document.getElementById("electiondate").innerHTML = `<i class="fas fa-calendar-day"></i>  ` + months[parseInt(d[1] - 1)] + " "
                + d[2] + ", " + d[0] + ":  " + tConvert(info[0].period_start_time) + " - " + tConvert(info[0].period_end_time)
            return info
        } catch (e) {
            console.log(e)
        }
    }

    function tConvert(time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    year.then(async function (result) {
        for (let data of result) {
            const response = await fetch(`http://localhost:5000/election_year_votes/` + data.period_election_year, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let info = await response.json()
            var ID = new Array()
            info.forEach(function (v) {
                ID.push(v.vote_student_id)
            })
            var filteredID = ID.filter((value, index) => ID.indexOf(value) === index)
            document.getElementById("alreadyvoted").innerHTML = `<i class="fas fa-user-check"></i>  ` + filteredID.length + " "
            break;
        }
    })
    async function totalCandidates() {
        try {
            const response = await fetch(`http://localhost:5000/all_candidate`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let info = await response.json();
            document.getElementById("totalcandidates").innerHTML = `<i class="fas fa-address-card"></i> ` + info.length
        } catch (e) {
            console.log(e)
        }
    }
    async function totalPolitcalParty() {
        try {
            const response = await fetch(`http://localhost:5000/all_political_party`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let info = await response.json();
            let count = 0;
            info.forEach(function (e) {
                count++;
            });
            document.getElementById("totalpoliticalparty").innerHTML = ` <i class="fas fa-handshake"></i> ` + count
        } catch (e) {
            console.log(e)
        }
    }
    async function totalUSCPositions() {
        try {
            const response = await fetch(`http://localhost:5000/all_USC_position`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let info = await response.json();
            let count = 0;
            info.forEach(function (e) {
                count++;
            });
            document.getElementById("USCpos").innerHTML = `<i class="fas fa-map-pin"></i> ` + count
        } catch (e) {
            console.log(e)
        }
    }
    async function totalCSCPositions() {
        try {
            const response = await fetch(`http://localhost:5000/all_CSC_position`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let info = await response.json();
            let count = 0;
            info.forEach(function (e) {
                count++;
            });
            document.getElementById("CSCpos").innerHTML = `<i class="fas fa-map-pin"></i> ` + count
        } catch (e) {
            console.log(e)
        }
    }

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

});