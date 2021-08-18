$(document).ready(function () {
    const tok = localStorage.getItem("Token")
    loadChart("All");
    async function loadChart(pos) {
        $('#bar').contents().remove();
        var d = new Array({ name: "Total", data: [] });
        var party_color = new Array()
        var cat = new Array();
        var url = ""
        if (pos == "All") url = 'http://localhost:5000/all_usc_ballot_candidate_on_list'
        else {
            url = 'http://localhost:5000/usc_ballot_candidate_on_list_posbased/' + pos
        }
        var [data3] = await Promise.all([
            fetch(url, {
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()),
        ]);
        data3.forEach(function (v) {
            d[0].data.push(v.usc_candidate_votes)
            cat.push(v.usc_candidate_last_name.toUpperCase())
            party_color.push(v.party_color_theme)
        })
        renderchart()
        function renderchart() {
            var barOptions = {
                series: d,
                chart: {
                    height: 350,
                    type: 'bar'
                },
                plotOptions: {
                    bar: {
                        columnWidth: '45%',
                        distributed: true,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                xaxis: {
                    categories: cat,
                    labels: {
                        style: {
                            fontSize: '12px'
                        }
                    }
                }, tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + " votes";
                        },
                    },
                },
                colors: party_color
            };
            var bar = new ApexCharts(document.querySelector("#bar"), barOptions);
            bar.render();
        }
    }
    $('#positions').change(function () {
        var pos = $('#positions').val();
        loadChart(pos)
    })

    $('#college').change(function () {
        var college = $('#college').val();
        college += "_college"
        cscChart(college)
    })
    $('#cscpositions').change(function () {
        var pos = $('#cscpositions').val();
        cscChart(pos)
    })

    let currentcollege = ""
    async function cscChart(id) {
        $('#cscbar').contents().remove();
        $('#cscpositions').prop('disabled', false);
        var cscd = new Array({ name: "Total", data: [] });
        var csccat = new Array();
        var cscparty_color = new Array()
        var url = ""
        var incStr = id.includes("college");
        if (incStr) {
            var split = id.split("_")
            url = 'http://localhost:5000/college_csc_ballot_candidate_on_list/' + split[0]
            $("#cscpositions").val("");
            currentcollege = split[0]
        } else {
            if (id == "All") {
                url = 'http://localhost:5000/college_csc_ballot_candidate_on_list/' + currentcollege
            } else {
                url = 'http://localhost:5000/collegePos_csc_ballot_candidate_on_list/' + currentcollege + "/" + id
            }
        }
        var [data3] = await Promise.all([
            fetch(url, {
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()),
        ]);
        data3.forEach(function (v) {
            cscd[0].data.push(v.csc_candidate_votes)
            csccat.push(v.csc_candidate_last_name.toUpperCase())
            cscparty_color.push(v.party_color_theme)
        })
        renderchart()
        function renderchart() {
            var barOptions = {
                series: cscd,
                chart: {
                    height: 350,
                    type: 'bar'
                },
                plotOptions: {
                    bar: {
                        columnWidth: '45%',
                        distributed: true,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                xaxis: {
                    categories: csccat,
                    labels: {
                        style: {
                            fontSize: '12px'
                        }
                    }
                }, tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + " votes";
                        },
                    },
                },
                colors: cscparty_color
            };
            var cscbar = new ApexCharts(document.querySelector("#cscbar"), barOptions);
            cscbar.render();
        }
    }
})