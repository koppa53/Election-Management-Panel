$(document).ready(function () {


    $("#showballotUSC").click(async function () {
        try {
            $("#USCBALLOT").empty();
            const [data1, data2] = await Promise.all([
                fetch('http://localhost:5000/all_active_USC_position').then((response) => response.json()),
                fetch('http://localhost:5000/all_usc_ballot_candidate_on_list').then((response) => response.json())
            ]);
            var currentposition = ""
            var dupcurrentposition = ""
            var ballotcounter = 0
            var count = 1
            var rowCount = 0;
            data2.forEach(function (v) {
                dupcurrentposition = v.usc_candidate_position
                var MAX_VOTE = 0
                let obj = data1.find(o => o.position_name === dupcurrentposition);
                MAX_VOTE = obj.position_max_vote
                if (currentposition != v.usc_candidate_position) {
                    var binary = '';
                    var bytes = new Uint8Array(v.usc_candidate_photo.data);
                    var len = bytes.byteLength;
                    if (rowCount != 0) {
                        if (MAX_VOTE == 1) {
                            $("#" + rowCount).append(
                                `
                            <div class="col">
                                <br>
                                <br>
                                <input type="radio" id="`+ currentposition + "_usc" + `" name ="` + currentposition + `" class="radio-button" value="ABSTAINED_ABSTAINED_` + currentposition + "_-1_USC_" + v.usc_ballot_election_year + `" style="height:20px; width:20px;">
                                <label for="`+ currentposition + `" style="font-size: 20px;"><b>ABSTAIN</b></label>
                            </div>
                            <br>
                            </form>
                            </div>
                            <hr class="divider">
                        `
                            )
                        } else {
                            $("#" + rowCount).append(
                                `
                            <div class="col">
                                <br>
                                <br>
                                <input type="radio" id="`+ currentposition + "_usc" + `" class="radio-button" value="ABSTAINED_ABSTAINED_` + currentposition + "_-1_USC_" + v.usc_ballot_election_year + `" style="height:20px; width:20px;">
                                <label for="`+ currentposition + `" style="font-size: 20px;"><b>ABSTAIN</b></label>
                            </div>
                            <br>
                            </form>
                            </div>
                            <hr class="divider">
                        `
                            )
                        }
                    }
                    rowCount++
                    currentposition = v.usc_candidate_position
                    for (var i = 0; i < len; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    if (MAX_VOTE == 1) {
                        $("#USCBALLOT").append(`
                        <br>
                        <form>
                        <div class="box-header with-border">
                            <h4 class="box-title"><b>USC `+ currentposition + `</b></h4>
                            <p> Please select only <b>`+ MAX_VOTE + ` candidate</b>:
                            <button type="reset" class="btn btn-sm btn-outline-danger">Reset</button>
                            </p> 
                        </div>
                        <br>
                        <div class="row" id="`+ rowCount + `">
                            <div class="col">
                            <label for="`+ v.usc_candidate_position + "_" + count + `">
                            <div class="avatar">
                                <img class="shadow border border-3 border-secondary rounded-circle" src="data:image/png;base64,` + binary + `" alt="" srcset="" onclick="null" style=" height: 100px; width: 100px;">
                                <span class="avatar-status" style=" height: 2rem; width: 2rem; color:white; padding-top:3px; background-color:`+ v.party_color_theme + `;">#` + count + `</span>
                            </div>
                            <br><input type="radio" class="radio-button" name ="`+ currentposition + `" id= "` + v.usc_candidate_position + "_" + count + `" value="` + v.usc_candidate_first_name + "_" + v.usc_candidate_last_name + "_" + v.usc_candidate_position + "_" + v.usc_candidate_id + "_USC_" + v.usc_ballot_election_year + `" style="height:20px; width:20px;">
                            <span class="cname clist"><b>` + v.usc_candidate_last_name.toUpperCase() + "</b>, " + v.usc_candidate_first_name + ` </span><br>
                            <span class="cpolparty clist">`+ "- " + v.usc_candidate_party + `</span>
                            </label>
                            </div>
                            `
                        );
                    } else {
                        $("#USCBALLOT").append(`
                        <br>
                        <form>
                        <div class="box-header with-border">
                            <h4 class="box-title"><b>USC `+ currentposition + `</b></h4>
                            <p> Please select up to <b>`+ MAX_VOTE + ` candidates</b>:
                            <button type="reset" class="btn btn-sm btn-outline-danger">Reset</button>
                            </p> 
                        </div>
                        <br>
                        <div class="row" id="`+ rowCount + `">
                            <div class="col">
                            <label for="`+ v.usc_candidate_position + "_" + count + `">
                            <div class="avatar">
                                <img class="shadow border border-3 border-secondary rounded-circle" src="data:image/png;base64,` + binary + `" alt="" srcset="" onclick="null" style=" height: 100px; width: 100px;">
                                <span class="avatar-status" style=" height: 2rem; width: 2rem; color:white; padding-top:3px; background-color:`+ v.party_color_theme + `;">#` + count + `</span>
                            </div>
                            <br><input type="radio" class="radio-button" id= "` + v.usc_candidate_position + "_" + count + `" value="` + v.usc_candidate_first_name + "_" + v.usc_candidate_last_name + "_" + v.usc_candidate_position + "_" + v.usc_candidate_id + "_USC_" + v.usc_ballot_election_year + `" style="height:20px; width:20px;">
                            <span class="cname clist"><b>` + v.usc_candidate_last_name.toUpperCase() + "</b>, " + v.usc_candidate_first_name + ` </span><br>
                            <span class="cpolparty clist">`+ "- " + v.usc_candidate_party + `</span>
                            </label>
                            </div>
                            `
                        );
                    }
                    count++;
                } else {
                    var binary = '';
                    var bytes = new Uint8Array(v.usc_candidate_photo.data);
                    var len = bytes.byteLength;
                    for (var i = 0; i < len; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    console.log(MAX_VOTE)
                    if (MAX_VOTE == 1) {
                        $("#" + rowCount).append(`
                        <div class="col">
                        <label for="`+ v.usc_candidate_position + "_" + count + `">
                        <div class="avatar">
                            <img class="shadow border border-3 border-secondary rounded-circle" src="data:image/png;base64,` + binary + `" alt="" srcset="" style=" height: 100px; width: 100px" >
                            <span class="avatar-status" style=" height: 2rem; width: 2rem; color:white; padding-top:3px; background-color:`+ v.party_color_theme + `;">#` + count + `</span>
                        </div>
                        <br><input type="radio" class="radio-button" name ="`+ currentposition + `"  id= "` + v.usc_candidate_position + "_" + count + `" value="` + v.usc_candidate_first_name + "_" + v.usc_candidate_last_name + "_" + v.usc_candidate_position + "_" + v.usc_candidate_id + "_USC_" + v.usc_ballot_election_year + `" style="height:20px; width:20px;">
                        <span class="cname clist"><b>` + v.usc_candidate_last_name.toUpperCase() + "</b>, " + v.usc_candidate_first_name + ` </span><br>
                        <span class="cpolparty clist">`+ "- " + v.usc_candidate_party + `</span>
                        </label>
                        </div>
                        `
                        );
                    } else {
                        $("#" + rowCount).append(`
                        <div class="col">
                        <label for="`+ v.usc_candidate_position + "_" + count + `">
                        <div class="avatar">
                            <img class="shadow border border-3 border-secondary rounded-circle" src="data:image/png;base64,` + binary + `" alt="" srcset="" style=" height: 100px; width: 100px" >
                            <span class="avatar-status" style=" height: 2rem; width: 2rem; color:white; padding-top:3px; background-color:`+ v.party_color_theme + `;">#` + count + `</span>
                        </div>
                        <br><input type="radio" class="radio-button" id= "` + v.usc_candidate_position + "_" + count + `" value="` + v.usc_candidate_first_name + "_" + v.usc_candidate_last_name + "_" + v.usc_candidate_position + "_" + v.usc_candidate_id + "_USC_" + v.usc_ballot_election_year + `" style="height:20px; width:20px;">
                        <span class="cname clist"><b>` + v.usc_candidate_last_name.toUpperCase() + "</b>, " + v.usc_candidate_first_name + ` </span><br>
                        <span class="cpolparty clist">`+ "- " + v.usc_candidate_party + `</span>
                        </label>
                        </div>
                        `
                        );
                    }
                    count++;
                }
                if (data2.length - 1 == ballotcounter) {
                    if (MAX_VOTE == 1) {
                        $("#" + rowCount).append(
                            `
                        <div class="col">
                            <br>
                            <br>
                            <input type="radio" name ="`+ currentposition + `" id="` + currentposition + "_usc" + `" class="radio-button" value="ABSTAINED_ABSTAINED_` + currentposition + "_-2_USC_" + v.usc_ballot_election_year + `" style="height:20px; width:20px;">
                            <label for="`+ currentposition + `" style="font-size: 20px;"><b>ABSTAIN</b></label>
                        </div>
                        </div>
                        <hr class="divider">
                        `
                        )
                    } else {
                        $("#" + rowCount).append(
                            `
                        <div class="col">
                            <br>
                            <br>
                            <input type="radio" id="` + currentposition + "_usc" + `" class="radio-button" value="ABSTAINED_ABSTAINED_` + currentposition + "_-2_USC_" + v.usc_ballot_election_year + `" style="height:20px; width:20px;">
                            <label for="`+ currentposition + `" style="font-size: 20px;"><b>ABSTAIN</b></label>
                        </div>
                        </div>
                        <hr class="divider">
                        `
                        )
                    }
                }
                ballotcounter++;
            })

        } catch (err) {
            console.log(err);
        }
    });

    $("#showballotCSC").click(function () {
        $("#CSCBALLOT").empty();
        $("#ballotcolleges").val("");
    })

    $("#ballotcolleges").change(async function () {
        var college = $("#ballotcolleges").val();
        try {
            $("#CSCBALLOT").empty();
            const [data3, data4] = await Promise.all([
                fetch('http://localhost:5000/all_active_CSC_position').then((response) => response.json()),
                fetch('http://localhost:5000/college_csc_ballot_candidate_on_list/' + college).then((response) => response.json())
            ]);
            var csccurrentposition = ""
            var dupcsccurrentposition = ""
            var csccount = 1
            var cscrowCount = 100;
            var cscballotcounter = 0
            data4.forEach(function (v) {
                dupcsccurrentposition = v.csc_candidate_position
                var CSCMAX_VOTE = 0
                let cscobj = data3.find(o => o.position_name === dupcsccurrentposition);
                CSCMAX_VOTE = cscobj.position_max_vote
                if (csccurrentposition != v.csc_candidate_position) {
                    if (cscrowCount != 100) {
                        if (CSCMAX_VOTE == 1) {
                            $("#" + cscrowCount).append(
                                `
                            <div class="col">
                                <br>
                                <br>
                                <input type="radio" id="`+ csccurrentposition + "_csc" + `" name="` + csccurrentposition + `" class="radio-button" value="ABSTAINED_ABSTAINED_` + csccurrentposition + "_-2_CSC_" + v.csc_ballot_election_year + `" style="height:20px; width:20px;">
                                <label for="`+ csccurrentposition + `" style="font-size: 20px;"><b>ABSTAIN</b></label>
                            </div>
                            <br>
                            </div>
                            </form>
                            <hr class="divider">
                            `
                            )
                        } else {
                            $("#" + cscrowCount).append(
                                `
                            <div class="col">
                                <br>
                                <br>
                                <input type="radio" id="`+ csccurrentposition + "_csc" + `" class="radio-button" value="ABSTAINED_ABSTAINED_` + csccurrentposition + "_-2_CSC_" + v.csc_ballot_election_year + `" style="height:20px; width:20px;">
                                <label for="`+ csccurrentposition + `" style="font-size: 20px;"><b>ABSTAIN</b></label>
                            </div>
                            <br>
                            </div>
                            </form>
                            <hr class="divider">
                            `
                            )
                        }
                    }
                    cscrowCount++
                    csccurrentposition = v.csc_candidate_position
                    var cscbinary = '';
                    var cscbytes = new Uint8Array(v.csc_candidate_photo.data);
                    var csclen = cscbytes.byteLength;
                    for (var i = 0; i < csclen; i++) {
                        cscbinary += String.fromCharCode(cscbytes[i]);
                    }
                    if (CSCMAX_VOTE == 1) {
                        $("#CSCBALLOT").append(`
                        <br>
                        <form>
                        <div class="box-header with-border">
                            <h4 class="box-title"><b>CSC `+ csccurrentposition + `</b></h4>
                            <p> Please select only <b>`+ CSCMAX_VOTE + ` candidate</b>:
                            <button type="reset" class="btn btn-sm btn-outline-danger">Reset</button>
                            </p> 
                        </div>
                        <br>
                        <div class="row" id="`+ cscrowCount + `">
                            <div class="col">
                            <label for="`+ v.csc_candidate_position + "_" + csccount + "_" + "csc" + `">
                            <div class="avatar">
                                <img class="shadow border border-3 border-secondary rounded-circle" src="data:image/png;base64,` + cscbinary + `" alt="" srcset="" onclick="null" style=" height: 100px; width: 100px" >
                                <span class="avatar-status" style=" height: 2rem; width: 2rem; color:white; padding-top:3px; background-color:`+ v.party_color_theme + `">#` + csccount + `</span>
                            </div>
                            <br><input type="radio" class="radio-button" name="`+ csccurrentposition + `" id= "` + v.csc_candidate_position + "_" + csccount + "_" + "csc" + `" value="` + v.csc_candidate_first_name + "_" + v.csc_candidate_last_name + "_" + v.csc_candidate_position + "_" + v.csc_candidate_id + "_CSC_" + v.csc_ballot_election_year + `" style="height:20px; width:20px;">
                            <span class="cname clist"><b>` + v.csc_candidate_last_name.toUpperCase() + "</b>, " + v.csc_candidate_first_name + ` </span><br>
                            <span class="cpolparty clist">`+ "- " + v.csc_candidate_party + `</span>
                            </label>
                            </div>
                        `
                        );
                    } else {
                        $("#CSCBALLOT").append(`
                        <br>
                        <form>
                        <div class="box-header with-border">
                            <h4 class="box-title"><b>CSC `+ csccurrentposition + `</b></h4>
                            <p> Please select up to <b>`+ CSCMAX_VOTE + ` candidate/s</b>:
                            <button type="reset" class="btn btn-sm btn-outline-danger">Reset</button>
                            </p> 
                        </div>
                        <br>
                        <div class="row" id="`+ cscrowCount + `">
                            <div class="col">
                            <label for="`+ v.csc_candidate_position + "_" + csccount + "_" + "csc" + `">
                            <div class="avatar">
                                <img class="shadow border border-3 border-secondary rounded-circle" src="data:image/png;base64,` + cscbinary + `" alt="" srcset="" onclick="null" style=" height: 100px; width: 100px" >
                                <span class="avatar-status" style=" height: 2rem; width: 2rem; color:white; padding-top:3px; background-color:`+ v.party_color_theme + `">#` + csccount + `</span>
                            </div>
                            <br><input type="radio" class="radio-button" id= "`+ v.csc_candidate_position + "_" + csccount + "_" + "csc" + `" value="` + v.csc_candidate_first_name + "_" + v.csc_candidate_last_name + "_" + v.csc_candidate_position + "_" + v.csc_candidate_id + "_CSC_" + v.csc_ballot_election_year + `" style="height:20px; width:20px;">
                            <span class="cname clist"><b>` + v.csc_candidate_last_name.toUpperCase() + "</b>, " + v.csc_candidate_first_name + ` </span><br>
                            <span class="cpolparty clist">`+ "- " + v.csc_candidate_party + `</span>
                            </label>
                            </div>
                        `
                        );
                    }
                    csccount++;
                } else {
                    var cscbinary = '';
                    var cscbytes = new Uint8Array(v.csc_candidate_photo.data);
                    var csclen = cscbytes.byteLength;
                    for (var i = 0; i < csclen; i++) {
                        cscbinary += String.fromCharCode(cscbytes[i]);
                    }
                    if (CSCMAX_VOTE == 1) {
                        $("#" + cscrowCount).append(`
                        <div class="col">
                        <label for="`+ v.csc_candidate_position + "_" + csccount + "_" + "csc" + `">
                        <div class="avatar">
                            <img class="shadow border border-3 border-secondary rounded-circle" src="data:image/png;base64,` + cscbinary + `" alt="" srcset="" style=" height: 100px; width: 100px" >
                            <span class="avatar-status" style=" height: 2rem; width: 2rem; color:white; padding-top:3px; background-color:`+ v.party_color_theme + `">#` + csccount + `</span>
                        </div>
                        <br><input type="radio" class="radio-button" name="`+ csccurrentposition + `" id= "` + v.csc_candidate_position + "_" + csccount + "_" + "csc" + `" value="` + v.csc_candidate_first_name + "_" + v.csc_candidate_last_name + "_" + v.csc_candidate_position + "_" + v.csc_candidate_id + "_CSC_" + v.csc_ballot_election_year + `" style="height:20px; width:20px;">
                        <span class="cname clist"><b>` + v.csc_candidate_last_name.toUpperCase() + "</b>, " + v.csc_candidate_first_name + ` </span><br>
                        <span class="cpolparty clist">`+ "- " + v.csc_candidate_party + `</span>
                        </label>
                        </div>
                        `
                        );
                    } else {
                        $("#" + cscrowCount).append(`
                        <div class="col">
                        <label for="`+ v.csc_candidate_position + "_" + csccount + "_" + "csc" + `">
                        <div class="avatar">
                            <img class="shadow border border-3 border-secondary rounded-circle" src="data:image/png;base64,` + cscbinary + `" alt="" srcset="" style=" height: 100px; width: 100px" >
                            <span class="avatar-status" style=" height: 2rem; width: 2rem; color:white; padding-top:3px; background-color:`+ v.party_color_theme + `">#` + csccount + `</span>
                        </div>
                        <br><input type="radio" class="radio-button" id= "`+ v.csc_candidate_position + "_" + csccount + "_" + "csc" + `" value="` + v.csc_candidate_first_name + "_" + v.csc_candidate_last_name + "_" + v.csc_candidate_position + "_" + v.csc_candidate_id + "_CSC_" + v.csc_ballot_election_year + `" style="height:20px; width:20px;">
                        <span class="cname clist"><b>` + v.csc_candidate_last_name.toUpperCase() + "</b>, " + v.csc_candidate_first_name + ` </span><br>
                        <span class="cpolparty clist">`+ "- " + v.csc_candidate_party + `</span>
                        </label>
                        </div>
                        `
                        );
                    }
                    csccount++;
                }
                if (data4.length - 1 == cscballotcounter) {
                    if (CSCMAX_VOTE == 1) {
                        $("#" + cscrowCount).append(
                            `
                        <div class="col">
                            <br>
                            <br>
                            <input type="radio" id="`+ csccurrentposition + "_csc" + `" name="` + csccurrentposition + `" class="radio-button" value="ABSTAINED_ABSTAINED_` + csccurrentposition + "_-2_CSC_" + v.csc_ballot_election_year + `" style="height:20px; width:20px;">
                            <label for="`+ csccurrentposition + `" style="font-size: 20px;"><b>ABSTAIN</b></label>
                        </div>
                        </div>
                        <hr class="divider">
                        `
                        )
                    } else {
                        $("#" + cscrowCount).append(
                            `
                        <div class="col">
                            <br>
                            <br>
                            <input type="radio" id="`+ csccurrentposition + "_csc" + `" class="radio-button" value="ABSTAINED_ABSTAINED_` + csccurrentposition + "_-2_CSC_" + v.csc_ballot_election_year + `" style="height:20px; width:20px;">
                            <label for="`+ csccurrentposition + `" style="font-size: 20px;"><b>ABSTAIN</b></label>
                        </div>
                        </div>
                        <hr class="divider">
                        `
                        )
                    }
                }
                cscballotcounter++;
            })


        } catch (err) {
            console.log(err);
        }
    })

})