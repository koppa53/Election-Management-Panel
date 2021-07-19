
async function generateResult() {
    document.getElementById("genRes").disabled = true;
    document.getElementById("loading").style.display = "inline-block";
    const response = await fetch(`http://localhost:5000/all_usc_ballot_candidate_on_list`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let info = await response.json();
    var year = 0
    var count = 0;
    var currentPos = "";
    var countCandidates = 1
    var pos = new Array()
    let limit = 0
    info.forEach(function (g) {
        pos.push(g.usc_candidate_position)
        if (limit == 0) {
            year = g.usc_ballot_election_year
            limit++
        }
    })
    var filteredpos = pos.filter((value, index) => pos.indexOf(value) === index)
    var content = Array.from(Array(info.length + filteredpos.length + 1), () => new Array(17))
    var voters = new Array()
    for (infos of info) {
        infos.voteCAF = 0
        infos.voteCAL = 0
        infos.voteCBEM = 0
        infos.voteCE = 0
        infos.voteCENG = 0
        infos.voteCIT = 0
        infos.voteCN = 0
        infos.voteCS = 0
        infos.voteCSSP = 0
        infos.voteGC = 0
        infos.voteIPESR = 0
        infos.votePC = 0
        infos.voteTC = 0
        const se = await fetch(`http://localhost:5000/student_votes_college_usc/` + infos.usc_candidate_id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let votes = await se.json()
        const set = await fetch(`http://localhost:5000/assisted_student_votes_college_usc/` + infos.usc_candidate_id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let assistedvotes = await set.json()
        votes.forEach(function (v) {
            if (v.vote_college == "College of Science") infos.voteCS = infos.voteCS + 1
            if (v.vote_college == "College of Nursing") infos.voteCN = infos.voteCN + 1
            if (v.vote_college == "College of Education") infos.voteCE = infos.voteCS + 1
            if (v.vote_college == "College of Arts and Letters") infos.voteCAL = infos.voteCAL + 1
            if (v.vote_college == "College of Engineering") infos.voteCENG = infos.voteCENG + 1
            if (v.vote_college == "College of Social Science and Philosophy") infos.voteCSSP = infos.voteCSSP + 1
            if (v.vote_college == "College of Business, Economics and Management") infos.voteCBEM = infos.voteCBEM + 1
            if (v.vote_college == "College of Agriculture and Forestry") infos.voteCAF = infos.voteCAF + 1
            if (v.vote_college == "College of Industrial Technology") infos.voteCIT = infos.voteCIT + 1
            if (v.vote_college == "IPESR") infos.voteIPESR = infos.voteIPESR + 1
            if (v.vote_college == "GC") infos.voteGC = infos.voteGC + 1
            if (v.vote_college == "TC") infos.voteTC = infos.voteTC + 1
            if (v.vote_college == "PC") infos.votePC = infos.votePC + 1
            voters.push(v.vote_student_id)
        })
        assistedvotes.forEach(function (v) {
            if (v.vote_college == "College of Science") infos.voteCS = infos.voteCS + 1
            if (v.vote_college == "College of Nursing") infos.voteCN = infos.voteCN + 1
            if (v.vote_college == "College of Education") infos.voteCE = infos.voteCS + 1
            if (v.vote_college == "College of Arts and Letters") infos.voteCAL = infos.voteCAL + 1
            if (v.vote_college == "College of Engineering") infos.voteCENG = infos.voteCENG + 1
            if (v.vote_college == "College of Social Science and Philosophy") infos.voteCSSP = infos.voteCSSP + 1
            if (v.vote_college == "College of Business, Economics and Management") infos.voteCBEM = infos.voteCBEM + 1
            if (v.vote_college == "College of Agriculture and Forestry") infos.voteCAF = infos.voteCAF + 1
            if (v.vote_college == "College of Industrial Technology") infos.voteCIT = infos.voteCIT + 1
            if (v.vote_college == "IPESR") infos.voteIPESR = infos.voteIPESR + 1
            if (v.vote_college == "GC") infos.voteGC = infos.voteGC + 1
            if (v.vote_college == "TC") infos.voteTC = infos.voteTC + 1
            if (v.vote_college == "PC") infos.votePC = infos.votePC + 1
            voters.push(v.vote_student_id)
        })
    }
    var totalNumofVoters = voters.filter((value, index) => voters.indexOf(value) === index)

    info.forEach(function (v) {
        let total = 0;
        if (currentPos != v.usc_candidate_position) {
            currentPos = v.usc_candidate_position
            currentPoslvl = v.usc_ballot_pos
            content[count][0] = v.usc_candidate_position.toUpperCase()
            countCandidates = 1
            count++;
            content[count][0] = countCandidates + ". " + v.usc_candidate_last_name.toUpperCase() + ", " + v.usc_candidate_first_name + " "
            content[count][1] = v.voteCAF
            content[count][2] = v.voteCAL
            content[count][3] = v.voteCBEM
            content[count][4] = v.voteCE
            content[count][5] = v.voteCENG
            content[count][6] = v.voteCIT
            content[count][7] = v.voteCN
            content[count][8] = v.voteCS
            content[count][9] = v.voteCSSP
            content[count][10] = v.voteGC
            content[count][11] = v.voteIPESR
            content[count][12] = v.votePC
            content[count][13] = v.voteTC
            total = total + content[count][1] + content[count][2] + content[count][3] + content[count][4] + content[count][5] +
                content[count][6] + content[count][7] + content[count][8] + content[count][9] + content[count][10] + content[count][11]
                + content[count][12] + content[count][13]
            content[count][14] = total
            if (total != 0) content[count][15] = toWordsconver(total)
            else {
                content[count][15] = "Zero"
            }
            content[count][16] = v.usc_candidate_party
            countCandidates++;
            count++;
        } else {
            content[count][0] = countCandidates + ". " + v.usc_candidate_last_name.toUpperCase() + ", " + v.usc_candidate_first_name + " "
            content[count][16] = v.usc_candidate_party
            content[count][1] = v.voteCAF
            content[count][2] = v.voteCAL
            content[count][3] = v.voteCBEM
            content[count][4] = v.voteCE
            content[count][5] = v.voteCENG
            content[count][6] = v.voteCIT
            content[count][7] = v.voteCN
            content[count][8] = v.voteCS
            content[count][9] = v.voteCSSP
            content[count][10] = v.voteGC
            content[count][11] = v.voteIPESR
            content[count][12] = v.votePC
            content[count][13] = v.voteTC
            total = total + content[count][1] + content[count][2] + content[count][3] + content[count][4] + content[count][5] +
                content[count][6] + content[count][7] + content[count][8] + content[count][9] + content[count][10] + content[count][11]
                + content[count][12] + content[count][13]
            content[count][14] = total
            if (total != 0) content[count][15] = toWordsconver(total)
            else {
                content[count][15] = "Zero"
            }
            countCandidates++;
            count++;
        }
    })
    //templates
    window.jsPDF = window.jspdf.jsPDF
    var pdf = new jsPDF('l', 'mm', 'legal');
    var img = new Image;
    var depLogo = new Image;
    img.crossOrigin = "";
    img.src = "/assets/images/logo/bu.png";
    depLogo.src = "/assets/images/logo/osas.png"
    img.onload = function () {
        pdf.addImage(this, 80, 10, 20, 20);
        pdf.addImage(depLogo, 258, 7, 30, 30);
        pdf.setFont('Helvetica', 'bold')
        pdf.setFontSize(9)
        var textWidth = pdf.getStringUnitWidth("BICOL UNIVERSITY") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset, 15, "BICOL UNIVERSITY");
        pdf.setFontSize(25)
        var textWidth = pdf.getStringUnitWidth("OFFICE OF STUDENT SERVICES") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset, 25, "OFFICE OF STUDENT SERVICES");
        pdf.setFontSize(9)
        var textWidth = pdf.getStringUnitWidth("Legazpi City, Albay") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset, 30, "Legazpi City, Albay");
        pdf.setFontSize(18)
        var textWidth = pdf.getStringUnitWidth("SUMMARY OF ELECTION RETURNS " + year) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset, 42, "SUMMARY OF ELECTION RETURNS " + year);
        pdf.setFontSize(14)
        var textWidth = pdf.getStringUnitWidth("UNIVERSITY STUDENT COUNCIL") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset, 47, "UNIVERSITY STUDENT COUNCIL");
        pdf.setFontSize(11)
        pdf.setFont('Helvetica', 'bold')
        pdf.autoTable({
            startY: 55,
            tableWidth: 335,
            head: [[{ content: 'CANDIDATES', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }, { content: 'COLLEGES/UNITS', colSpan: 13, styles: { halign: 'center' } }, { content: 'TOTAL', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            { content: 'TOTAL IN WORDS', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }, { content: 'PARTY', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }],
            ['CAF', 'CAL', 'CBEM', 'CE', 'CENG', 'CIT', 'CN', 'CS', 'CSSP', 'GC', 'IPESR', 'PC', 'TC'],],
            headStyles: { textColor: 21, halign: 'center', fillColor: [107, 207, 245], cellPadding: { top: 1, right: 1, bottom: 0, left: 0 }, fontSize: 11 },
            bodyStyles: { fontSize: 11, cellPadding: { top: 1, right: 1, bottom: 1, left: 1 } },
            columnStyles: { 14: { halign: 'center' }, 15: { halign: 'center' } },
            margin: { top: 10, left: 10 },
            body: content,
        })
        let finaly = pdf.lastAutoTable.finalY
        pdf.addPage();
        pdf.setFont('Helvetica', 'normal')
        pdf.text("WE HEREBY CERTIFY THAT THE ABOVE RESULTS ARE TRUE AND CORRECT:", 10, 20)
        pdf.setFont('Helvetica', 'bold')
        var textWidth = pdf.getStringUnitWidth("UNIVERSITY STUDENT ELECTORAL BOARD") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset, 30, "UNIVERSITY STUDENT ELECTORAL BOARD");
        var textWidth = pdf.getStringUnitWidth("_________________________________") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset, 55, "_________________________________");
        var textWidth = pdf.getStringUnitWidth("Faculty-Member") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset, 60, "Faculty-Member");
        var textWidth = pdf.getStringUnitWidth("Chairperson") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 6;
        pdf.text(textOffset, 60, "Chairperson");
        var textWidth = pdf.getStringUnitWidth("_________________________________") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 8;
        pdf.text(textOffset, 55, "_________________________________");
        var textWidth = pdf.getStringUnitWidth("Faculty-Member") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset + 110, 60, "Faculty-Member");
        var textWidth = pdf.getStringUnitWidth("_________________________________") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset + 110, 55, "_________________________________");
        var textWidth = pdf.getStringUnitWidth("_________________________________") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset, 85, "_________________________________");
        var textWidth = pdf.getStringUnitWidth("Student-Member") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset, 90, "Student-Member");
        var textWidth = pdf.getStringUnitWidth("Student-Member") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 6;
        pdf.text(textOffset, 90, "Student-Member");
        var textWidth = pdf.getStringUnitWidth("_________________________________") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 8;
        pdf.text(textOffset, 85, "_________________________________");
        var textWidth = pdf.getStringUnitWidth("Student-Member") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset + 110, 90, "Student-Member");
        var textWidth = pdf.getStringUnitWidth("_________________________________") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset + 110, 85, "_________________________________");
        pdf.autoTable({
            startY: 110,
            tableWidth: 90,
            head: [['', 'Summary']],
            headStyles: { textColor: 21, halign: 'center', fillColor: [107, 207, 245], fontSize: 11 },
            bodyStyles: { fontSize: 11, cellPadding: { top: 1, right: 1, bottom: 1, left: 0 } },
            columnStyles: { 1: { fontStyle: 'bold', halign: 'center' } },
            margin: { left: 10 },
            body: [
                ['A. Total No. of Registered Student Voters: '],
                ['B. Total No. of Who Actually Voted: ', totalNumofVoters.length],
                ['C. Total No. of Students Who did not Vote: ',],
                [`Voter's Turnout(%) : ( B / A x 100 ): `,]
            ],
            rowPageBreak: 'avoid'
        })
        let finalY = pdf.lastAutoTable.finalY
        const d = new Date();
        pdf.setFont('Helvetica', 'normal')
        pdf.text("Effectivity Date: " + d.toDateString(), 290, finalY)
        const pages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.width;  //Optional
        const pageHeight = pdf.internal.pageSize.height;  //Optional
        pdf.setFontSize(10);  //Optional

        for (let j = 1; j < pages + 1; j++) {
            let horizontalPos = pageWidth / 2;  //Can be fixed number
            let verticalPos = pageHeight - 10;  //Can be fixed number
            pdf.setPage(j);
            pdf.text(`Page ${j} of ${pages}`, horizontalPos, verticalPos, { align: 'center' });
        }
        document.getElementById("loading").style.display = "none";
        document.getElementById("genRes").disabled = false;
        pdf.output('dataurlnewwindow');
    };
}
