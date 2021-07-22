

let pos = new Array()
let cl = new Array()
allactivePositions()
allpoliticalParty()
let votes = allusccandidates()
async function allpoliticalParty() {
  const response = await fetch('http://localhost:5000/all_political_party', {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const de = await response.json();
  de.forEach(function (v) {
    cl.push(v.party_color_theme.toString())
  })
}
async function allactivePositions() {
  const response = await fetch('http://localhost:5000/all_active_USC_position', {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const data = await response.json();
  data.forEach(function (v) {
    pos.push(v.position_name)
  })
}
async function allusccandidates() {
  const response = await fetch('http://localhost:5000/all_usc_ballot_candidate_on_list', {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const data = await response.json();
  data.sort((a, b) => {
    let fa = a.usc_candidate_party.toLowerCase(),
      fb = b.usc_candidate_party.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });

  return data;
}

votes.then(function (result) {
  var currentparty = ""
  var count = 0
  var d = new Array({ name: "", data: "" });

  result.forEach(function (v) {
    if (currentparty != v.usc_candidate_party) {
      currentparty = v.usc_candidate_party;
      d.push({ name: v.usc_candidate_party, data: [v.usc_candidate_votes] })
      count++
    } else {
      d[count].data.push(v.usc_candidate_votes)
    }
  })
  d.shift()
  renderchart(pos, cl)
  function renderchart(pos, cl) {
    var barOptions = {
      series: d,
      chart: {
        type: "bar",
        height: 400,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: cl,
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: pos,
      },
      yaxis: {
        title: {
          text: "BU Student Voters",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " votes";
          },
        },
      },
    };

    var bar = new ApexCharts(document.querySelector("#bar"), barOptions);

    bar.render();
  }
})

$(document).ready(function () {
  $('#college').change(function () {
    var college = $('#college').val();
    let pos = new Array()
    let votes = allcsccandidates()
    async function allcsccandidates() {
      const response = await fetch('http://localhost:5000/college_csc_ballot_candidate_on_list/' + college, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      data.sort((a, b) => {
        let fa = a.csc_candidate_party.toLowerCase(),
          fb = b.csc_candidate_party.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });

      return data;
    }

    votes.then(function (result) {
      allactivePositions()
      var currentparty = ""
      var count = 0
      var d = new Array({ name: "", data: "" });

      result.forEach(function (v) {
        if (currentparty != v.csc_candidate_party) {
          currentparty = v.csc_candidate_party;
          d.push({ name: v.csc_candidate_party, data: [v.csc_candidate_votes] })
          count++
        } else {
          d[count].data.push(v.csc_candidate_votes)
        }
      })
      d.shift()
      async function allactivePositions() {
        const response = await fetch('http://localhost:5000/all_active_CSC_position', {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        data.forEach(function (v) {
          pos.push(v.position_name)
        })
      }
      renderchart(pos)
      function renderchart(pos) {
        var barOption = {
          series: d,
          chart: {
            type: "bar",
            height: 400,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              endingShape: "rounded",
            },
          },
          dataLabels: {
            enabled: false,
          },
          colors: cl,
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
          },
          xaxis: {
            categories: pos,
          },
          yaxis: {
            title: {
              text: "BU Student Voters",
            },
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + " votes";
              },
            },
          },
        };

        var bars = new ApexCharts(document.querySelector("#cscbar"), barOption);

        bars.render();
      }
    })
  })


})


