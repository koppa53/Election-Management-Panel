
async function generateResult(college) {
    document.getElementById("genRes").disabled = true;
    document.getElementById("loading").style.display = "inline-block";
    const response = await fetch(`http://localhost:5000/college_csc_ballot_candidate_on_list/` + college, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let year = "";
    let info = await response.json();
    var count = 0;
    var currentPos = "";
    var countCandidates = 1
    var pos = new Array()
    var limit = 0
    info.forEach(function (g) {
        pos.push(g.csc_candidate_position)
        if (limit == 0) {
            year = g.csc_ballot_election_year
            limit++
        }
    })
    var filteredpos = pos.filter((value, index) => pos.indexOf(value) === index)
    var content = Array.from(Array(info.length + filteredpos.length + 1), () => new Array(4))
    var voters = new Array()
    for (infos of info) {
        const se = await fetch(`http://localhost:5000/student_votes_college_csc/` + infos.csc_candidate_id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let votes = await se.json()
        const set = await fetch(`http://localhost:5000/assisted_student_votes_college_csc/` + infos.csc_candidate_id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let assistedvotes = await set.json()
        votes.forEach(function (v) {
            voters.push(v.vote_student_id)
        })
        assistedvotes.forEach(function (v) {
            voters.push(v.vote_student_id)
        })
    }

    var totalNumofVoters = voters.filter((value, index) => voters.indexOf(value) === index)

    info.forEach(function (v) {
        if (currentPos != v.csc_candidate_position) {
            currentPos = v.csc_candidate_position
            currentPoslvl = v.csc_ballot_pos
            content[count][0] = v.csc_candidate_position.toUpperCase()
            countCandidates = 1
            count++;
            content[count][0] = countCandidates + ". " + v.csc_candidate_last_name.toUpperCase() + ", " + v.csc_candidate_first_name + " "
            content[count][1] = v.csc_candidate_votes
            if (v.csc_candidate_votes != 0) content[count][2] = toWordsconver(v.csc_candidate_votes)
            else {
                content[count][2] = "Zero"
            }
            content[count][3] = v.csc_candidate_party
            countCandidates++;
            count++;
        } else {
            content[count][0] = countCandidates + ". " + v.csc_candidate_last_name.toUpperCase() + ", " + v.csc_candidate_first_name + " "
            content[count][1] = v.csc_candidate_votes
            if (v.csc_candidate_votes != 0) content[count][2] = toWordsconver(v.csc_candidate_votes)
            else {
                content[count][2] = "Zero"
            }
            content[count][3] = v.csc_candidate_party
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
        var textWidth = pdf.getStringUnitWidth(college.toUpperCase() + " STUDENT COUNCIL") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset, 47, college.toUpperCase() + " STUDENT COUNCIL");
        pdf.setFontSize(11)
        pdf.setFont('Helvetica', 'bold')
        pdf.autoTable({
            startY: 55,
            tableWidth: 335,
            head: [[{ content: 'CANDIDATES', styles: { halign: 'center', valign: 'middle' } }, { content: 'TOTAL', styles: { halign: 'center', valign: 'middle' } },
            { content: 'TOTAL IN WORDS', styles: { halign: 'center', valign: 'middle' } }, { content: 'PARTY', styles: { halign: 'center', valign: 'middle' } }],
            ],
            headStyles: { textColor: 21, halign: 'center', fillColor: [107, 207, 245], cellPadding: { top: 2, right: 2, bottom: 2, left: 2 }, fontSize: 11 },
            bodyStyles: { fontSize: 11, cellPadding: { top: 1, right: 1, bottom: 1, left: 1 }, halign: 'center' },
            margin: { top: 10, left: 10 },
            body: content,
        })
        let finaly = pdf.lastAutoTable.finalY
        pdf.addPage();
        pdf.setFont('Helvetica', 'normal')
        pdf.text("WE HEREBY CERTIFY THAT THE ABOVE RESULTS ARE TRUE AND CORRECT:", 10, 20)
        pdf.setFont('Helvetica', 'bold')
        var textWidth = pdf.getStringUnitWidth("COLLEGE STUDENT ELECTORAL BOARD") * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
        pdf.text(textOffset, 30, "COLLEGE STUDENT ELECTORAL BOARD");
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
        document.getElementById("genRes").disabled = false;
        document.getElementById("loading").style.display = "none";
        pdf.output('dataurlnewwindow');
    };
}
