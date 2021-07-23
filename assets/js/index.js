$(document).ready(function () {


    window.onload = fetchData
    async function fetchData() {
        var [data1, data2, data3, data4, data5, data6, data7] = await Promise.all([
            fetch(`http://localhost:5000/election_period`).then((response) => response.json()),// parse each response as json
            fetch(`http://localhost:5000/all_candidate`).then((response) => response.json()),
            fetch(`http://localhost:5000/all_political_party`).then((response) => response.json()),
            fetch(`http://localhost:5000/all_USC_position`).then((response) => response.json()),
            fetch(`http://localhost:5000/all_CSC_position`).then((response) => response.json()),
            fetch('http://localhost:5000/all_active_USC_position').then((response) => response.json()),
            fetch('http://localhost:5000/all_active_CSC_position').then((response) => response.json())
        ]);
        if (data1.length != 0) {
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let d = new Date(data1[0].period_date)
            var MyDateString = ""
            MyDateString = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
            let g = MyDateString.split('-')
            document.getElementById("electiondate").innerHTML = `<i class="fas fa-calendar-day"></i>  ` + months[parseInt(g[1] - 1)] + " "
                + g[2] + ", " + g[0] + ":  " + tConvert(data1[0].period_start_time) + " - " + tConvert(data1[0].period_end_time)
        } else {
            document.getElementById("electiondate").innerHTML = `<i class="fas fa-calendar-day"></i>  ` + "No Election Date"
        }
        if (data1.length != 0) {
            const response = await fetch(`http://localhost:5000/election_year_votes/` + data1[0].period_election_year, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let info = await response.json()
            document.getElementById("alreadyvoted").innerHTML = `<i class="fas fa-user-check"></i>  ` + info + " "
        } else {
            document.getElementById("alreadyvoted").innerHTML = `<i class="fas fa-user-check"></i>  ` + "---"
        }
        document.getElementById("totalcandidates").innerHTML = `<i class="fas fa-address-card"></i> ` + data2.length
        document.getElementById("totalpoliticalparty").innerHTML = ` <i class="fas fa-handshake"></i> ` + data3.length
        document.getElementById("USCpos").innerHTML = `<i class="fas fa-map-pin"></i> ` + data4.length
        document.getElementById("CSCpos").innerHTML = `<i class="fas fa-map-pin"></i> ` + data5.length
        data6.forEach(function (v) {
            var o = new Option(v.position_name, v.position_name);
            $(o).html(v.position_name);
            $("#positions").append(o);
        })
        data7.forEach(function (v) {
            var o = new Option(v.position_name, v.position_name);
            $(o).html(v.position_name);
            $("#cscpositions").append(o);
        })
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
})