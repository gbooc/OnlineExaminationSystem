// Diagram exam variables
var deItem = 1;
var addtionalDe = 0;
var deCount = 1;
var prevGi = "";
var prevDiagram = "";
var romanizeDiagram = "";
var prvRomanizeDiagram = "";
var deDiagramCount = 1;
var deTestNum = 0;

// Essay
var essayItem = 1;
var additionalEssay = 0;
var essayCount = 1;
var essayTestNum = 0;

//Filling the blanks
var essayCount = 1;
var addtionalFb = 0;
var fbCount = 1;
var fbItem = 1;
var fbTestNum = 0;

//Identification
var enuItem = 1;
var addtionalEnu = 0;
var enuCount = 1;
var idenTestNum = 0;

//Matching type
var mtCount = 1;
var additionalMt = 0;
var mtItem = 1;
var mtDisplayItems = 1;
var prvMTgi = "";
var mtRomanize = "";
var mtTestNum = 0;

//Multiple Choice
var mcItem = 1;
var typesCount = 0;
var addtionalMc = 0;
var mcCount = 1;
var mcTestNum = 0;

//Enumeration
var enumCount = 1;
var enumItem = 1;
var addtionalEnum = 0;
var enumAns = 1;
var enumAnswers = 2;
var recentQuestion = "";
var recentGi = "";
var inAnyOrder = "";
var romanizeNum = "";
var prvRomanize = "";
var enumNoItems = 1;
var enumTestNum = 0;
//-----------------
var title = "";
var category = "";
var maxCategory = "";
var Btns = "";
var UsrTxt = "";
var item = 2;

//----------------------------


// --- All functions are from new questionnaire page ----
function submitQuestionaire() {

    var title = $('#q_titleID').val();
    var schedule = $('#schedule').val();

    var accessIds = "";

    var tmp_multpleChce = {};
    var multpleChce = [];

    var tmp_diagramExam = {};
    var diagramExam = [];

    var tmp_fillDBlnks = {};
    var fillDBlnks = [];

    var tmp_identification = {};
    var identification = [];

    var tmp_essay = {};
    var essay = [];

    var tmp_enum = {};
    var enumeration = [];

    var tmp_mt = {};
    var matchingtype = [];

    var examLimit = "";
    var tmpHr = "";
    var tmpMin = "";

    var rate = $("#passingRate").val();


    if ($("#hrID").val() == "") { tmpHr = "0"; } else { tmpHr = $("#hrID").val(); }
    if ($("#minID").val() == "") { tmpMin = "0"; } else { tmpMin = $("#minID").val(); }


    // --- C a t e g o r y ------
    $.ajax({
        url: '/Maintenance/getMaxCategory',   // ** Get maximum category id
        async: false,
        type: 'POST',
        dataType: "json",
        traditional: true,
        contentType: 'application/json;',
        cache: false,
        success: function (MaxCategory) {
            maxCategory = MaxCategory;
        }
    });

    for (var c = 1; c <= maxCategory; c++) {

        if ($('#category' + c).is(":checked")) {
            category = $('#category' + c).val();
        }
    }
    // ---- E N D -------------
    // Get Examinees for submitted questionnaire
    if ($('#AllEmployee').is(":checked")) accessIds += $("#AllEmployee").val() + ", ";
    if ($('#RIMP').is(":checked")) accessIds += $("#RIMP").val() + ", ";
    if ($('#CGSI').is(":checked")) accessIds += $("#CGSI").val() + ", ";
    if ($('#GoodJob').is(":checked")) accessIds += $("#GoodJob").val() + ", ";
    if ($('#Visitor').is(":checked")) accessIds += $("#Visitor").val() + ", ";
    if ($('#selected').val() !== "") accessIds += $("#selected").val() + ", ";
    // - - - E N D -------

    examLimit = tmpHr.replace(/\D/g, '') + ";" + tmpMin.replace(/\D/g, '');
    $.ajax({ url: '/Maintenance/setExamID', type: 'POST' });

    if (category !== "" && accessIds !== "") {

        // ---- Get Values From Multiple Choice ----
        for (var i = 0; i <= (mcItem + addtionalMc); i++) {
            for (var a = 0; a <= mcItem; a++) {
                var tmp = 'p' + i + '_mcItem' + a;
                var gi = 'giMc' + i;

                if ($("#" + gi).val() !== "" && $("#" + tmp).val() !== "") {
                    if ($("#" + gi).val() !== undefined && $("#" + tmp).val() !== undefined) {

                        var tmpAnswer = $("#" + tmp + '_b').val();
                        tmpAnswer = tmpAnswer.split(":").pop();


                        tmp_multpleChce = {
                            'Instruction': romanize(i) + ". " + $("#" + gi).val(),
                            'Question': $("#" + tmp).val(),
                            'Choices': $("#" + tmp + '_a').val(),
                            'Answer': tmpAnswer.trim(),
                            'Schedule': schedule,
                            'AccessIDs': accessIds,
                            'Limit': examLimit,
                            'PassingRate': rate.replace(/\D/g, '')

                        };
                        multpleChce.push(JSON.stringify(tmp_multpleChce));
                    }
                } else {
                    if (i > 0) {
                        displayError(gi, tmp);
                    }
                    return;
                }
            }
        }
        //----- E N D -------

        // ---- Get Values From Diagram Exam ----
        for (var i = 1; i <= (deItem); i++) {
            for (var a = 0; a <= deItem; a++) {

                var tmp = 'p' + i + '_DEItem' + a;
                var gi = 'giDE' + i;

                if ($("#" + gi).val() !== undefined) {
                    prevGi = $("#" + gi).val();
                }

                if ($("#diagramRomanize" + i).text() !== "") {
                    romanizeDiagram = $("#diagramRomanize" + i).text().substring(0, $("#diagramRomanize" + i).text().indexOf('-'));
                }

                if ($("#" + tmp).val() !== undefined) {
                    if (prevGi !== "") {
                        if ($("#" + tmp).val() !== "") {

                            var tmpDiagram = "";
                            var tmpChoicesImg = "";
                            var tmpAnswer = "";

                            if ($("#" + tmp + '_b').val() !== "" && $("#" + tmp + '_b').val() !== undefined) {
                                tmpAnswer = $("#" + tmp + '_b').val();
                                tmpAnswer = tmpAnswer.split(":").pop();
                            }

                            if ($("#base64Tmp" + a).val() !== "" && $("#base64Tmp" + a).val() !== undefined) {
                                tmpDiagram = $("#base64Tmp" + a).val();
                                tmpDiagram = tmpDiagram.split(",").pop();
                                prevDiagram = tmpDiagram;

                            }

                            if ($("#chBase64Tmp" + a).val() !== "" && $("#chBase64Tmp" + a).val() != undefined) {
                                var tmpChoicesImg = $("#chBase64Tmp" + a).val();
                                tmpChoicesImg = tmpChoicesImg.split(",").pop();
                            }

                            tmp_diagramExam = {
                                'Instruction': romanizeDiagram + ". " + prevGi,
                                'Question': $("#" + tmp).val(),
                                'Diagram': prevDiagram.trim(),
                                'ChoicesTxt': ($("#" + tmp + '_a').val() !== "" && $("#" + tmp + '_a').val() !== undefined) ? $("#" + tmp + '_a').val() : "NULL",
                                'ChoicesImg': tmpChoicesImg == "" ? "NULL" : tmpChoicesImg.trim(),
                                'Answer': tmpAnswer.trim(),
                                'Schedule': schedule,
                                'AccessIDs': accessIds,
                                'Limit': examLimit,
                                'PassingRate': rate.replace(/\D/g, '')

                            };
                            diagramExam.push(JSON.stringify(tmp_diagramExam));
                        } else {
                            if (i > 0) {
                                displayError(gi, tmp);
                            }
                            return;
                        }
                    } else {
                        if (i > 0) {
                            displayError(gi, tmp);
                        }
                        return;
                    }
                }
            }
        }
        //----- E N D -------


        // ---- Get values from Filling the blanks ------

        for (var i = 0; i <= (fbItem + addtionalFb); i++) {

            for (var a = 0; a <= fbItem; a++) {
                var tmp = 'p' + i + '_fbItem' + a;
                var gi = 'giFb' + i;

                if ($("#" + gi).val() !== "" && $("#" + tmp).val() !== "") {
                    if ($("#" + gi).val() !== undefined && $("#" + tmp).val() !== undefined) {

                        var tmpAnswer = $("#" + tmp + '_ans').val();
                        tmpAnswer = tmpAnswer.split(":").pop();


                        tmp_fillDBlnks = {
                            "Instruction": romanize(i) + ". " + $("#" + gi).val(),
                            "Question": $("#" + tmp).val(),
                            'Answer': tmpAnswer.trim(),
                            'Schedule': schedule,
                            'AccessIDs': accessIds,
                            'Limit': examLimit,
                            'PassingRate': rate.replace(/\D/g, '')
                        };
                        fillDBlnks.push(JSON.stringify(tmp_fillDBlnks));
                    }
                } else {
                    if (i > 0) {
                        displayError(gi, tmp);
                    }
                    return;
                }
            }
        }

        //------ E N D ----

        //----Get values from Identification ------

        for (var i = 0; i <= (enuItem + addtionalEnu); i++) {

            for (var a = 0; a <= enuItem; a++) {
                var tmp = 'p' + i + '_enuItem' + a;
                var gi = 'giEnu' + i;

                if ($("#" + gi).val() !== "" && $("#" + tmp).val() !== "") {
                    if ($("#" + gi).val() !== undefined && $("#" + tmp).val() !== undefined) {

                        var tmpAnswer = $("#" + tmp + '_ans').val();
                        tmpAnswer = tmpAnswer.split(":").pop();

                        tmp_identification = {
                            "Instruction": romanize(i) + ". " + $("#" + gi).val(),
                            "Question": $("#" + tmp).val(),
                            "Answer": tmpAnswer.trim(),
                            'Schedule': schedule,
                            'AccessIDs': accessIds,
                            'Limit': examLimit,
                            'PassingRate': rate.replace(/\D/g, '')
                        };
                        identification.push(JSON.stringify(tmp_identification));
                    }
                } else {
                    if (i > 0) {
                        displayError(gi, tmp);
                    }
                    return;
                }
            }
        }

        // --- E N D ----

        // ---- Get Values From Essay ----
        for (var i = 0; i <= (essayItem + additionalEssay); i++) {
            for (var a = 0; a <= essayItem; a++) {
                var tmp = 'p' + i + '_essayItem' + a;
                var gi = 'giEssay' + i;

                if ($("#" + gi).val() !== "" && $("#" + tmp).val() !== "") {
                    if ($("#" + gi).val() !== undefined && $("#" + tmp).val() !== undefined) {

                        var tmpAnswer = $("#" + tmp + '_ans').val();
                        tmpAnswer = tmpAnswer.split(":").pop();

                        tmp_essay = {
                            'Instruction': romanize(i) + ". " + $("#" + gi).val(),
                            'Question': $("#" + tmp).val(),
                            'Answer': tmpAnswer.trim(),
                            'Schedule': schedule,
                            'AccessIDs': accessIds,
                            'Limit': examLimit,
                            'PassingRate': rate.replace(/\D/g, ''),
                            'Points': $("#essayScore" +i).val()
                        };
                        essay.push(JSON.stringify(tmp_essay));
                    }
                } else {
                    if (i > 0) {
                        displayError(gi, tmp);
                    }
                    return;
                }
            }
        }
        console.log(essay);
        //----- END -------


        // ---- Get values from Filling the blanks ------
        for (var i = 0; i <= (enumItem + addtionalEnum); i++) {

            for (var a = 0; a <= enumItem; a++) {
                var tmp = 'p' + i + '_EnumItem' + a;
                var gi = 'giEnum' + i;
                var order = "ansOrder" + i;


                if ($("#" + gi).val() !== undefined)
                    recentGi = $("#" + gi).val();

                if ($("#" + tmp).val() !== undefined) {
                    if ($("input[name='" + order + "']:checked").length > 0) {
                        inAnyOrder = $("input[name='" + order + "']:checked").val();
                    }

                    if ($("#" + tmp).val() == "") {
                        displayError(gi, tmp);
                        recentQuestion = "";
                        return;
                    } else {
                        recentQuestion = $("#" + tmp).val();
                    }
                }

                if (recentGi !== undefined && recentQuestion !== undefined && $("#" + tmp + "_b").val() !== undefined) {
                    if ($("#enumRomanize" + i).text() !== prvRomanize && $("#enumRomanize" + i).text() !== "") {
                        prvRomanize = $("#enumRomanize" + i).text();
                        romanizeNum = prvRomanize.substring(0, prvRomanize.indexOf('-'));
                    }

                    if (recentQuestion !== "" && recentGi !== "" && $("#" + tmp + '_b').val() !== "" && inAnyOrder !== "") {

                        tmp_enum = {
                            "Instruction": romanizeNum + ". " + recentGi,
                            "Question": recentQuestion,
                            'Answer': $("#" + tmp + '_b').val(),
                            'Schedule': schedule,
                            'AccessIDs': accessIds,
                            'Limit': examLimit,
                            'PassingRate': rate.replace(/\D/g, ''),
                            'InAnyOrder': inAnyOrder
                        };
                        enumeration.push(JSON.stringify(tmp_enum));
                    } else {
                        displayError(gi, tmp);
                        recentQuestion = "";
                        return;
                    }
                }
            }
        }
        //------ E N D ----

        // ---- Get Values From Matching Type ----
        for (var i = 1; i <= (mtItem + additionalMt); i++) {

            for (var a = 1; a <= mtItem; a++) {
                var tmp = 'p_' + i + 'mtTxt' + a + '_ques';
                var ans = 'p_' + i + 'mtTxt' + a + '_ans';
                var ch = 'p_' + i + 'mtTxt' + a + '_ch';
                var gi = 'giMT' + i;

                if ($("#matchingRomanize" + i).text() !== prvMTgi) {
                    prvMTgi = $("#matchingRomanize" + i).text();
                    mtRomanize = prvMTgi.substring(0, prvMTgi.indexOf('-'));
                }
              
                if ($("#" + gi).val() !== undefined && $("#" + tmp).val() !== undefined && $("#" + ans).val() !== undefined && $("#" + ch).val() !== undefined) {
                    if ($("#" + gi).val() !== "" && $("#" + tmp).val() !== "" && $("#" + ans).val() !== "" && $("#" + ch).val() !== "") {
                        tmp_mt = {
                            'Instruction': mtRomanize + ". " + $("#" + gi).val(),
                            'Question': $("#" + tmp).val(),
                            'Choices': getLetter(a) + ". " + $("#" + ch).val(),
                            'Answer': $("#" + ans).val(),
                            'Schedule': schedule,
                            'AccessIDs': accessIds,
                            'Limit': examLimit,
                            'PassingRate': rate.replace(/\D/g, '')

                        };
                        matchingtype.push(JSON.stringify(tmp_mt));
                    } else {
                        if (i > 0) {
                            displayError(gi, tmp);
                        }
                        return;
                    }
                }
            }
        }

        //----- END -------

        $.ajax({
            url: '/Maintenance/saveMC',
            type: 'POST',
            data: JSON.stringify({ Title: title, Category: category, multipleChoice: multpleChce }),
            dataType: "json",
            traditional: true,
            contentType: 'application/json;',
            cache: false,
            success: function () {

            }
        });

        $.ajax({
            url: '/Maintenance/saveIdentification',
            type: 'POST',
            data: JSON.stringify({ Title: title, Category: category, identification: identification }),
            dataType: "json",
            traditional: true,
            contentType: 'application/json;',
            cache: false,
            success: function () {

            }
        });

        $.ajax({
            url: '/Maintenance/saveFb',
            type: 'POST',
            data: JSON.stringify({ Title: title, Category: category, fillTheBlanks: fillDBlnks }),
            dataType: "json",
            traditional: true,
            contentType: 'application/json;',
            cache: false,
            success: function () {

            }
        });

        $.ajax({
            url: '/Maintenance/saveEssay',
            type: 'POST',
            data: JSON.stringify({ Title: title, Category: category, Essay: essay }),
            dataType: "json",
            traditional: true,
            contentType: 'application/json;',
            cache: false,
            success: function () {

            }
        });


        $.ajax({
            url: '/Maintenance/saveDiagramExam',
            type: 'POST',
            data: JSON.stringify({ Title: title, Category: category, DiagramExam: diagramExam }),
            dataType: "json",
            traditional: true,
            contentType: 'application/json;',
            cache: false,
            success: function () {
            }
        });

        $.ajax({
            url: '/Maintenance/saveEnumeration',
            type: 'POST',
            data: JSON.stringify({ Title: title, Category: category, Enumeration: enumeration }),
            dataType: "json",
            traditional: true,
            contentType: 'application/json;',
            cache: false,
            success: function () {
            }
        });

        $.ajax({
            url: '/Maintenance/saveMatchingType',
            type: 'POST',
            data: JSON.stringify({ Title: title, Category: category, MatchingType: matchingtype }),
            dataType: "json",
            traditional: true,
            contentType: 'application/json;',
            cache: false,
            success: function () {
            }
        });

        $("#teOverlay").fadeIn();

        setTimeout(function () {
            $("#waitLoader").fadeOut("fast");
            $("#successLoader").fadeIn("slow");
        }, 6000);

        setTimeout(function () {
            $("#teOverlay").fadeOut();
            window.location.href += "maintenance_q";
            location.reload();
        }, 10000);

        // --- END ----
    } else {
        alert("Please select category and examinee.");
    }

    window.onbeforeunload = null;
    window.onunload = null;
}

function romanize(num) {
    var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }, roman = '', i;
    for (i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }
    return roman;
}

//---- Multiple choice functions----

function multipleChoice(param) {

    var set = '<br />\
        <div id="mcHead' + param + '">\
            <label id="mcRomanize' + romanize(param) + '">' + romanize(param) + '</label>. <font style="font-weight:bold;">(Multiple Choice)</font>\
            <a href = "#" onclick = "removeAllExamNum('+ "'Mc'" + ',' + param + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a>\
            <textarea class="form-control" style="width:100%;overflow:hidden;height:60px;" placeholder="Enter general instruction here.." id="giMc'+ param + '"></textarea> \
            <div class="invalid-feedback" id="giMc'+ param + 'error"> \
              <label id = "validMsg" > This field is required </label> \
            </div>\
        </div>';

    $("#question").append(set);

    $(".enuCounter").hide();
    $(".fbCounter").hide();
    $(".essayCounter").hide();

    mcCount = 1;

    // -- Reset to 1 --
    enumNoItems = 1;
    deDiagramCount = 1;
    mtDisplayItems = 1;
    // -- END --
    mcTestNum = param;
    addtionalMc = param;
    addmc(param);

}

function addmc(param) {


    var remove = "'mc" + mcItem + "'";
    var html = '<div class="mc' + mcTestNum + '">\
    <div style="font-family:Courier New;font-size:13px;">\
        <div class="mcCounter" style="display:inline-block;">\
            <div class="counter'+ mcCount + '">\
                <a href="#" onclick="removeMC('+ remove + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a> \
                <a href="#" onclick="addmc(' + param + ');return false;"> <i class="fa fa-plus-circle"></i></a>\
            </div>\
        </div> \
        <font style="font-size:18px;">' + mcCount++ + '.</font>\
        <textarea class="form-control" placeholder="Enter your question here.." style="width:90%;display:inline-block;overflow:hidden;margin-top:5px;height:50px;margin-bottom:10px;" id="p' + param + '_mcItem' + mcItem++ + '"></textarea>\
        <div class="invalid-feedback" id="p' + param + '_mcItem' + (mcItem - 1) + 'error">\
            <label id="validMsg"> This field is required </label> \
        </div> \
    </div> \
    <textarea class="form-control" style="overflow:hidden;padding-left:55px;height:50px;width:90%;margin-left:40px;" id="p'+ param + '_mcItem' + (mcItem - 1) + '_a">a.  b.  c.  d. </textarea> \
    <textarea class="form-control" style="overflow:hidden;color:red;margin-top:5px;height:50px;width:90%;margin-left:40px;" id="p'+ param + '_mcItem' + (mcItem - 1) + '_b">answer: </textarea> \
</div>';

    $(".counter" + (mcCount - 2)).remove();
    $("#question").append(html);

}
function removeMC(param) {
    $('#' + param).remove();
}
//------------END---------------------
//---------Identification --------------
function Identification(param) {
    var set = '<br /> \
                <div id="identificationHead' + param + '">\
                    ' + romanize(param) + '. <font style="font-weight:bold;">(Identification)</font>\
                    <a href = "#" onclick = "removeAllExamNum('+ "'Identification'" + ',' + param + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a>\
                    . <textarea  class="form-control" style="overflow:hidden;margin-top:5px;resize: both;height:60px;" placeholder="Insert general instruction" id="giEnu'+ param + '"></textarea> \
                    <div class="invalid-feedback" id = "giEnu'+ param + 'error"> \
                      <label id = "validMsg" > This field is required </label> \
                    </div>\
                </div>';

    $("#question").append(set);

    $(".mcCounter").hide();
    $(".fbCounter").hide();
    $(".essayCounter").hide();
    enuCount = 1;

    // -- Reset to 1 --
    enumNoItems = 1;
    deDiagramCount = 1;
    mtDisplayItems = 1;
    // -- END --

    idenTestNum = param;
    addtionalEnu = param;
    addIdentification(param);
}

function addIdentification(param) {

    var remove = "'enu" + enuItem + "'";
    var html = '<div class="enu' + idenTestNum + '">\
                  <div style="font-family:Courier New;font-size:12px;"> \
                     <div class="enuCounter" style="display:inline-block;"> \
                       <div class="counter'+ enuCount + '"> \
                        <a href = "#" onclick = "removeIdentification('+ remove + ');return false;" > <i class="fa fa-minus-circle" style="color:red;"></i></a> \
                        <a href = "#" onclick = "addIdentification(' + param + ');return false;" > <i class="fa fa-plus-circle"></i></a> \
                        </div></div> \
                 ___\<font style="font-size:18px;"> ' + enuCount++ + '.</font> \
                  <textarea class="form-control" placeholder="Enter question here..."  style = "resize: both;width:86%;display:inline-block;overflow:hidden;margin-top:5px;height:50px;" id = "p' + param + '_enuItem' + enuItem++ + '"></textarea> \
                     <div class="invalid-feedback" id="p' + param + '_enuItem' + (enuItem - 1) + 'error"> \
                            <label id = "validMsg" > This field is required </label> \
                    </div> \
                </div> \
              <textarea class="form-control"  style="resize: both;overflow:hidden;margin-top:5px;color:red;height:50px;width:86%;margin-left:65px;" id = "p'+ param + '_enuItem' + (enuItem - 1) + '_ans">answer: </textarea> \
            </div>';

    $('.counter' + (enuCount - 2)).remove();
    $("#question").append(html);

}

function removeIdentification(param) {
    $('#' + param).remove();
}

//------ END --------------------
//------ Fill in the blanks -------
function fillInTheBlanks(param) {
    var set = '<br />\
            <div id="fbHead' + param + '">\
                ' + romanize(param) + '. <font style = "font-weight:bold;" > Filling the blanks</font> \
                <a href = "#" onclick = "removeAllExamNum('+ "'Fb'" + ',' + param + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a>\
                <textarea class="form-control" style="resize: both;overflow:hidden;margin-top:5px;height:60px;" placeholder="Insert general instruction" id="giFb'+ param + '"></textarea> \
                <div class="invalid-feedback" id="giFb'+ param + 'error"> \
                   <label id = "validMsg" > This field is required </label> \
                </div> \
             </div>';

    $("#question").append(set);

    $(".enuCounter").hide();
    $(".mcCounter").hide();
    $(".essayCounter").hide();

    fbCount = 1;

    // -- Reset to 1 --
    enumNoItems = 1;
    deDiagramCount = 1;
    mtDisplayItems = 1;
    // -- END --

    fbTestNum = param;
    addtionalFb = param;
    addFb(param);

}

function addFb(param) {
    var remove = "'fb" + fbItem + "'";
    var html = '<div class="fb' + fbTestNum + '"> \
                 <div style="font-family:Courier New;font-size:12px;"> \
                    <div class="fbCounter" style="display:inline-block;"> \
                      <div class="counter'+ fbCount + '">\
                         <a href = "#" onclick = "removeFb(' + remove + ');return false;" > <i class="fa fa-minus-circle" style="color:red;"></i></a> \
                         <a href = "#" onclick = "addFb(' + param + ');return false;" > <i class="fa fa-plus-circle"></i></a> \
                     </div></div> \
                    <font style = "font-size:18px;" >'+ fbCount++ + '.</font> \
                <textarea  placeholder="Enter your question here.." class="form-control" style = "width:90%;display:inline-block;overflow:hidden;margin-top:5px;height:50px;" id = "p' + param + '_fbItem' + fbItem++ + '"></textarea></div> \
                <div><textarea class="form-control"  style="resize: both;overflow:hidden;margin-top:5px;color:red;height:50px;height:50px;width:90%;margin-left:40px;" id = "p'+ param + '_fbItem' + (fbItem - 1) + '_ans">answer: </textarea></div>\
              </div>';

    $('.counter' + (fbCount - 2)).remove();
    $("#question").append(html);

}
function removeFb(param) {
    $('#' + param).remove();
}
//-------- E N D -----------------
//---------E S S A Y --------------
function Essay(param) {
    var set = '<br />\
               <div id = "essayHead' + param + '" > \
                    '+ romanize(param) + '. <font style="font-weight:bold;">(Essay) - </font>\
                    <a href = "#" onclick = "removeAllExamNum('+ "'Essay'" + ',' + param + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a>\
                    <input type = "text" style="display:inline-block; width:150px;" placeholder="Enter points." class="form-control" id = "essayScore' + param + '">\
                    <textarea  class="form-control" style="overflow:hidden;margin-top:5px;resize: both;height:60px;" placeholder="Insert general instruction" id="giEssay'+ param + '"></textarea> \
                     <div class="invalid-feedback" id = "giEssay'+ param + 'error"> \
                       <label id = "validMsg" > This field is required </label> \
                    </div> \
               </div>';


    $("#question").append(set);

    $(".enuCounter").hide();
    $(".mcCounter").hide();
    $(".fbCounter").hide();

    essayCount = 1;
    // -- Reset to 1 --
    enumNoItems = 1;
    deDiagramCount = 1;
    mtDisplayItems = 1;
    // -- END --

    essayTestNum = param;
    additionalEssay = param;
    addEssay(param);
}

function addEssay(param) {

    var remove = "'essay" + essayItem + "'";
    var html = '<div class="essay' + essayTestNum + '">\
                  <div style="font-family:Courier New;font-size:12px;"> \
                     <div class="essayCounter" style="display:inline-block;"> \
                       <div class="counter'+ essayCount + '"> \
                        <a href = "#" onclick = "removeEssay('+ remove + ');return false;" > <i class="fa fa-minus-circle" style="color:red;"></i></a> \
                        <a href = "#" onclick = "addEssay(' + param + ');return false;" > <i class="fa fa-plus-circle"></i></a> \
                        </div></div> \
                 \<font style="font-size:18px;"> ' + essayCount++ + '.</font> \
                  <textarea class="form-control" placeholder="Enter question here..."  style = "resize: both;width:90%;display:inline-block;overflow:hidden;margin-top:5px;height:50px;" id = "p' + param + '_essayItem' + essayItem++ + '"></textarea> \
                 <div><textarea class="form-control"  style="resize: both;overflow:hidden;margin-top:5px;color:red;height:50px;width:90%;margin-left:40px;" id = "p'+ param + '_essayItem' + (essayItem - 1) + '_ans">answer: </textarea></div>\
                 <div class="invalid-feedback" id = "p' + param + '_essayItem' + (essayItem - 1) + 'error" > \
                            <label id = "validMsg" > This field is required </label> \
                    </div> \
                </div> \
              </div>';


    $('.counter' + (essayCount - 2)).remove();
    $("#question").append(html);

}

function removeEssay(param) {
    $('#' + param).remove();
}

//---- Diagram Exam functions----

function diagramExam(param) {

    var set = '<br />\
         <div id = "diagramHead' + param + '" > \
            <label style="display:inline-block;" id="diagramRomanize' + deCount + '">' + romanize(param) + '- Diagram Exam</label>. \
            <a href = "#" onclick = "removeAllExamNum('+ "'Diagram'" + ',' + param + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a>\
            <textarea class="form-control" style="width:95%;overflow:hidden;height:60px;" placeholder="Enter general instruction here.." id="giDE'+ deCount + '"></textarea> \
            <div class="invalid-feedback" id="giDE'+ param + 'error"> \
              <label id = "validMsg" > This field is required </label> \
            </div>\
        </div>';

    $("#question").append(set);

    $(".enuCounter").hide();
    $(".fbCounter").hide();
    $(".essayCounter").hide();
    $(".mcCounter").hide();

    // -- Reset to 1 --
    enumNoItems = 1;
    mtDisplayItems = 1;
    // -- END --
    deTestNum = param;
    addtionalDe = param;
    addDiagramExam(param);

}

function addDiagramExam(param) {
    var remove = "'de" + deCount + "'";
    var html = '\
        <div class = "de' + deTestNum + '" >\
    <div style="font-family:Courier New;font-size:13px;">\
        <div class="deCounter" style="display:inline-block;">\
            <div class="Diacounter'+ deCount + '">\
                <a href="#" onclick="removeDiagramExam('+ remove + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a> \
                <a href="#" onclick="addDiagramExam(' + (deCount) + ');return false;"> <i class="fa fa-plus-circle"></i></a>\
            </div>\
        </div> \
        <font style="font-size:18px;">Diagram -' + deDiagramCount + ' </font>.\
        <div style="margin-bottom:10px; width:80%;max-height:650px; margin-left:85px;">\
            <input type="file"  style="border:none; background: transparent; outline: 0;float:right;margin-bottom:10px;"  accept="image/*" onchange="loadDiagram(event,'+ (deItem) + ')" id="diagramImg' + (deItem) + '" />\
            <img style="display: block;margin: auto;height: auto;max-height:100 %;width: auto;max-width:100%;" id="displayDiagram'+ (deItem) + '" width="600" height="650" class="img-thumbnail"/>\
            <textarea id="base64Tmp'+ (deItem) + '" style="display:none;"></textarea> \
        </div> \
    </div> \
    <div id="subQuestion'+ deCount + '">\
        <div class="deCounter" style="display:inline-block;">\
            <div class="counter'+ deCount + '">\
                <a href="#" onclick="removeSubDiagram('+ (deCount) + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a> \
                <a href="#" onclick="addSubDiagram(' + (deCount) + ');return false;"> <i class="fa fa-plus-circle"></i></a>\
            </div>\
        </div> \
        <font style="font-size:12px;">1.</font>\
        <textarea class="form-control" placeholder="Enter your question here.." style="width:90%;display:inline-block;overflow:hidden;margin-top:5px;height:50px;" id="p' + (deCount) + '_DEItem' + deItem + '"></textarea>\
         <i class="fa fa-folder" id="folderClose'+ (deItem) + '" style="display:inline-block;cursor:pointer;float:right;" onclick="openChoices(' + (deCount) + ',' + (deItem) + ');return false;"></i>\
        <div id = "choices'+ (deItem) + '" style="display:none;">\
           <font>Choose type of choices.</font>\
            <a href="#" class="mb-2 btn btn-sm" onclick="textOption('+ (deCount) + ',' + (deItem) + ');return false;"> <i class="fa fa-pencil" style="font-size:17px;"></i> Text</a>\
            <a href="#" class="mb-2 btn btn-sm" onclick="imageOption('+ (deCount) + ',' + (deItem) + ');return false;"> <i class="fa fa-image" style="font-size:17px;" onclick="imageOption()"></i> Image</a>\
        </div>\
            <div> &nbsp;  &nbsp; \
        <div style="display:none;margin-bottom:10px; width:80%;max-height:650px; margin-left:85px;" id="imgOption'+ (deItem) + '"> \
            <input type="file"  style="border:none; background: transparent; outline: 0;float:right;margin-bottom:10px;"  accept="image/*" onchange="loadChoices(event,'+ (deItem) + ')" id="choicesImg' + (deItem) + '" />\
            <img style="display: block;margin: auto;height: auto;max-height:100 %;width: auto;max-width:100%;" id="displayChoices'+ (deItem) + '" width="600" height="650" class="img-thumbnail"/>\
            <textarea id="chBase64Tmp'+ (deItem) + '" style="display:none;"></textarea> \
        </div>\
        </div> \
         <textarea class="form-control" style="width:90%;display:none;overflow:hidden;padding-left:55px;height:50px;margin-left:58px;" id="p'+ (deCount) + '_DEItem' + (deItem) + '_a" placeholder="a. b. c. d."></textarea> \
         <textarea class="form-control" style="width:90%;overflow:hidden;color:red;margin-top:5px;height:50px;margin-left:58px;" id="p'+ (deCount) + '_DEItem' + (deItem) + '_b">answer: </textarea>\
    </div>\
</div>';

    item = 2;
    deCount++;
    deDiagramCount++;
    deItem++;
    //param++;
    //addtionalDe++;
    $(".Diacounter" + (deCount - 2)).remove();
    $("#question").append(html);


}


function addSubDiagram(subquestion) {
    var html = ' \
        <div class="deCounter" style = "display:inline-block;" >\
          <div class="counter'+ (item) + '">\
                <a href="#" onclick="removeSubDiagram('+ (subquestion) + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a> \
                <a href="#" onclick="addSubDiagram(' + (subquestion) + ');return false;"> <i class="fa fa-plus-circle"></i></a>\
            </div>\
        </div > \
        <font style="font-size:12px;">' + (item++) + ' </font>.\
        <textarea class="form-control" placeholder="Enter your question here.." style="width:90%;display:inline-block;overflow:hidden;margin-top:5px;height:50px;" id="p' + (subquestion) + '_DEItem' + (deItem) + '"></textarea>\
        <i class="fa fa-folder" id="folderClose'+ (deItem) + '" style="display:inline-block;cursor:pointer;float:right;" onclick="openChoices(' + (subquestion) + ',' + (deItem) + ');return false;"></i>\
        <div id = "choices'+ (deItem) + '" style = "display:none;margin-top:10px;" >\
             <font>Choose type of choices.</font>\
            <a href="#" class="mb-2 btn btn-sm" onclick="textOption('+ (subquestion) + ',' + (deItem) + ');return false;"> <i class="fa fa-pencil" style="font-size:17px;"></i> Text</a>\
            <a href="#" class="mb-2 btn btn-sm" onclick="imageOption('+ (subquestion) + ',' + (deItem) + ');return false;"> <i class="fa fa-image" style="font-size:17px;" onclick="imageOption()"></i> Image</a>\
        </div>\
        <textarea class="form-control" style="width:90%;display:none;overflow:hidden;padding-left:55px;height:50px;margin-left:58px;margin-top:10px;" id="p'+ (subquestion) + '_DEItem' + (deItem) + '_a" placeholder="a. b. c. d."></textarea> \
         <div style="display:none;margin-bottom:10px; width:80%;max-height:650px; margin-left:85px;" id="imgOption'+ (deItem) + '"> \
            <input type="file"  style="border:none; background: transparent; outline: 0;float:right;margin-bottom:10px;"  accept="image/*" onchange="loadChoices(event,'+ (deItem) + ')" id="choicesImg' + (deItem) + '" />\
            <img style="display: block;margin: auto;height: auto;max-height:100 %;width: auto;max-width:100%;" id="displayChoices'+ (deItem) + '" width="600" height="650" class="img-thumbnail" />\
            <textarea id="chBase64Tmp'+ (deItem) + '" style="display:none;"></textarea> \
        </div>\
        <textarea class="form-control" style = "width:90%;overflow:hidden;color:red;margin-top:5px;height:50px;margin-left:58px;" id = "p'+ (subquestion) + '_DEItem' + (deItem) + '_b" > answer: </textarea >\
        ';
    deItem++;
    $(".counter" + (item - 2)).remove();
    $("#subQuestion" + subquestion).append(html);

}


var loadDiagram = function (event, id) {

    $("#dgEmptyImg" + id).hide();

    var divId = "displayDiagram" + id;
    var output = document.getElementById(divId);
    output.src = URL.createObjectURL(event.target.files[0]);

    var diagram = "diagramImg" + id;
    toBase64(diagram, id, "ques"); // convert image to base64
};

var loadChoices = function (event, id) {
    $("#chEmptyImg" + id).hide();

    var divId = "displayChoices" + id;
    var output = document.getElementById(divId);
    output.src = URL.createObjectURL(event.target.files[0]);

    var chImg = "choicesImg" + id;
    toBase64(chImg, id, "ch");
};

function imageOption(param, item) {
    $("#imgOption" + item).show();
    $("#choices" + item).hide();
    $("#p" + param + "_DEItem" + item + "_a").val("");
}

function textOption(param, item) {
    $("#p" + param + "_DEItem" + item + "_a").show();
    $("#choices" + item).hide();

}

function removeSubDiagram() {

}
function openChoices(param, item) {

    $("#choices" + item).show();
    $("#p" + param + "_DEItem" + item + "_a").hide();
    $("#p" + param + "_DEItem" + item + "_a").val("");

    $("#imgOption" + item).hide();
    $("#chBase64Tmp" + item).val("");

}
function toBase64(file, id, diagram) {

    var filesSelected = document.getElementById(file).files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];

        var fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64

            var newImage = document.createElement('img');
            newImage.src = srcData;

            if (diagram == "ques") {
                $("#base64Tmp" + id).val(srcData);
            } else {
                $("#chBase64Tmp" + id).val(srcData);
            }
        }
        fileReader.readAsDataURL(fileToLoad);
    }
}

function removeDiagramExam(param) {
    $('#' + param).remove();
}
//------------END---------------------

//----- E N U M E R A T I O N --------
function Enumeration(param) {

    var set = '<br /> \
           <div id = "enumHead' + param + '" > \
             <label style = "display:inline-block;" id = "enumRomanize' + enumCount + '" > ' + romanize(param) + ' - Enumeration</label>.\
             <a href = "#" onclick = "removeAllExamNum('+ "'Enum'" + ',' + param + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a>\
             <textarea class="form-control" style="width:95%;overflow:hidden;height:60px;" placeholder="Enter general instruction here.." id="giEnum'+ enumCount + '"></textarea> \
             <div class="invalid-feedback" id="giEnum'+ param + 'error"> \
               <label id = "validMsg" > This field is required </label> \
             </div>\
          </div>';

    $("#question").append(set);

    $(".enuCounter").hide();
    $(".fbCounter").hide();
    $(".essayCounter").hide();
    $(".mcCounter").hide();
    $(".deCounter").hide();

    // -- Reset to 1 --
    deDiagramCount = 1;
    mtDisplayItems = 1;
    enumNoItems = 1;
    // -- END --
    enumTestNum = param;
    addtionalEnum = param;
    addEnumeration(param);

}
function addEnumeration(param) {
    var remove = "'enum" + enumCount + "'";
    var html = '\
        <div class = "enum' + enumTestNum + '" >\
          <div id="enumQuestion'+ enumCount + '">\
            <div class="enumQCounter" style="display:inline-block;">\
              <div class="enumSQCounter'+ enumCount + '">\
                <a href="#" onclick="removeEnumeration('+ (enumCount) + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a> \
                <a href="#" onclick="addEnumeration(' + (enumCount) + ');return false;"> <i class="fa fa-plus-circle"></i></a>\
              </div>\
            </div> \
           <font style="font-size:12px;">'+ enumNoItems + '.</font>\
           <textarea class="form-control" placeholder="Enter question here.." style="width:90%;display:inline-block;overflow:hidden;margin-top:5px;height:50px;" id="p' + (enumCount) + '_EnumItem' + enumItem++ + '"></textarea>\
        <div id="enuAns'+ enumAns + '">\
           <div class="enuAnsCounter'+ enumAnswers + '" style = "display:inline-block;margin-left:50px;" >\
              <div class="AnsSBCounter'+ enumCount + '">\
                <a href="#" onclick="removeSubDiagram('+ (enumCount) + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a> \
                <a href="#" onclick="addEnumAnswer(' + (enumAns) + ');return false;"> <i class="fa fa-plus-circle"></i></a>\
              </div>\
           </div> \
            <font style="font-size:12px;" class="enuAnsCounter'+ enumAnswers + '">' + 1 + '.</font>\
           <textarea class="form-control" placeholder="Enter answer here.." style="width:70%;display:inline-block;overflow:hidden;margin-top:5px;height:50px;" id="p' + (enumCount) + '_EnumItem' + (enumItem - 1) + '_b"></textarea>\
         </div>\
        <div style="display:inline-block;">\
             <font>In any order?</font>\
            <input type="radio" name="ansOrder'+ (enumAns) + '" id="ansOrderId' + (enumAns) + '" value="Yes" /> Yes\
            <input type="radio" name="ansOrder'+ (enumAns) + '" id="ansOrderId' + (enumAns) + '" value="No" /> No\
        </div >\
   </div>';

    enumAnswers = 2;
    addtionalEnum++;
    enumAns++;
    enumCount++;
    enumNoItems++;
    $(".enumSQCounter" + (enumCount - 1)).remove();
    $("#question").append(html);


}

function addEnumAnswer(param) {
    var html = '\<br/>\
    <div class="enuAnsCounter'+ enumAnswers + '" style = "display:inline-block;margin-left:50px;" >\
        <div class="AnsSBCounter'+ enumAnswers + '">\
          <a href="#" onclick="removeEnumAns('+ (enumItem) + ',' + enumCount + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a> \
          <a href="#" onclick="addEnumAnswer(' + (param) + ');return false;"> <i class="fa fa-plus-circle"></i></a>\
        </div>\
    </div> \
    <font style="font-size:12px;"class="enuAnsCounter'+ enumAnswers + '">' + enumAnswers + '.</font>\
    <textarea class="form-control" placeholder="Enter answer here.." style="width:70%;display:inline-block;overflow:hidden;margin-top:5px;height:50px;" id="p' + (enumCount - 1) + '_EnumItem' + enumItem++ + '_b"></textarea>\
    ';
    enumAnswers++;
    $(".AnsSBCounter" + (enumAnswers - 2)).remove();
    $("#enuAns" + param).append(html);

}

function removeEnumeration(id) {
    $("#enumQuestion" + id).remove();
}
function removeEnumAns(id, param) {
    $(".enuAnsCounter" + id).remove();
    $("#p" + param + "_EnumItem" + id + "_b").remove();
}
// ------ E N D ----------------------

// ------- M A T C H I N G T Y P E ---------
function matchingType(param) {

    var set = '<br />\
         <div id = "mtHead' + param + '" > \
            <label style = "display:inline-block;" id = "matchingRomanize' + mtCount + '" > ' + romanize(param) + ' - Matching Type.</label> \
            <a href = "#" onclick = "removeAllExamNum('+ "'Mt'" + ',' + param + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a>\
            <textarea class="form-control" style="width:95%;overflow:hidden;height:60px;" placeholder="Enter general instruction here.." id="giMT'+ mtCount + '"></textarea> \
            <div class="invalid-feedback" id="giMt'+ param + 'error"> \
                <label id = "validMsg" > This field is required </label> \
            </div>\
        </div>';

    $("#question").append(set);

    $(".enuCounter").hide();
    $(".fbCounter").hide();
    $(".essayCounter").hide();
    $(".mcCounter").hide();
    $(".deCounter").hide();

    mtCount++;
   
    // -- Reset to 1 --
    enumNoItems = 1;
    deDiagramCount = 1;
    // -- END --
    mtTestNum = param;
    additionalMt = param;
    addMatchingType(param);

}

function addMatchingType(param) {

    var html = '<div class="mt' + mtTestNum + '">\
    <div style="font-family:Courier New;font-size:13px;margin-top:5px;">\
        <div id="p_'+ (mtCount - 1) + 'mtSets' + mtItem + '" style="display:inline-block;width:100%;">\
            <div id="p_'+ (mtCount - 1) + 'mtQuestions' + mtItem + '" style="width:40%;display:inline-block;">\
                <font id="p_'+ (mtCount - 1) + 'mtItem' + mtItem + '">' + mtDisplayItems + '.</font>\
                <textarea class="form-control" style="width:90%;display:inline-block;" placeholder="Enter question here..." id="p_'+ (mtCount - 1) + 'mtTxt' + mtItem + '_ques"></textarea>\
            </div>\
            <div id="p_'+ (mtCount - 1) + 'mtChoices' + mtItem + '" style="width:40%;display:inline-block;">\
             '+ getLetter(mtItem) + '.<textarea class="form-control" style="width:90%;display:inline-block;" placeholder="Enter choice here.." id="p_' + (mtCount - 1) + 'mtTxt' + mtItem + '_ch"></textarea>\
            </div>\
            <input type="text" class = "form-control" style="display:inline-block;width:100px;" placeholder="Answer" id="p_'+ (mtCount - 1) + 'mtTxt' + mtItem + '_ans">\
            <div class="p_'+ (mtCount - 1) + 'mtAddQues' + mtItem + '" style="margin-left:20px;">\
             <a href="#" onclick="removeMtQues('+ (mtItem) + ',' + mtItem + ');return false;"> <i class="fa fa-minus-circle" style="color:red;"></i></a> \
             <a href="#" onclick="addMatchingType(' + (mtItem) + ');return false;"> <i class="fa fa-plus-circle"></i></a>\
           </div>\
        </div>\
   </div>';

    mtItem++;
    mtDisplayItems++;
    $("#question").append(html);

    if (mtItem > 1)
        $(".p_" + (mtCount - 1) + "mtAddQues" + (mtItem - 2)).remove();

}
function getLetter(letter) {
    var choice = "";
    switch (letter) {
        case 1: choice = "A"; break;
        case 2: choice = "B"; break;
        case 3: choice = "C"; break;
        case 4: choice = "D"; break;
        case 5: choice = "E"; break;
        case 6: choice = "F"; break;
        case 7: choice = "G"; break;
        case 8: choice = "H"; break;
        case 9: choice = "I"; break;
        case 10: choice = "J"; break;
        case 11: choice = "K"; break;
        case 12: choice = "L"; break;
        case 13: choice = "M"; break;
        case 14: choice = "N"; break;
        case 15: choice = "O"; break;
        case 16: choice = "P"; break;
        case 17: choice = "Q"; break;
        case 18: choice = "R"; break;
        case 19: choice = "S"; break;
        case 20: choice = "T"; break;
        case 21: choice = "U"; break;
        case 22: choice = "V"; break;
        case 23: choice = "W"; break;
        case 24: choice = "X"; break;
        case 25: choice = "Y"; break;
        case 26: choice = "Z"; break;
    }
    return choice;
}
// ------- E N D ---------------------------

// ----- Removal of all exam types ---------


function removeAllExamNum(type, param) {


    if (type == "Mc") {

        $("#mcHead" + param).remove();
        $(".mc" + param).remove();
    } else if (type == "Identification") {

        $("#identificationHead" + param).remove();
        $(".enu" + param).remove();

    } else if (type == "Fb") {

        $("#fbHead" + param).remove();
        $(".fb" + param).remove();
    } else if (type == "Essay") {

        $("#essayHead" + param).remove();
        $(".essay" + param).remove();
     
    } else if (type == "Mt") {

        $("#mtHead" + param).remove();
        $(".mt" + param).remove();
    } else if (type == "Enum") {

        $("#enumHead" + param).remove();
        $(".enum" + param).remove();
    } else if (type == "Diagram") {
        $("#diagramHead" + param).remove();
        $(".de" + param).remove();
    }
   
}
//----- E N D -------------

//------  C a t e g o r y --------------------

function addNewCategory() {
    var category = $("#txtCategory").val();

    if (category != "") {

        $.ajax({
            url: '/Maintenance/addNewCategory',
            type: 'POST',
            data: JSON.stringify({ CategoryName: category }),
            dataType: "json",
            traditional: true,
            contentType: 'application/json;',
            cache: false,
            success: function (categories) {
                if (categories !== 0) {
                    var id = "category" + categories;
                    var html = '<div class="custom-control custom-checkbox mb-1"> \
                           <input type = "checkbox" class="custom-control-input" id = '+ id + ' value="' + categories + '" name="test[1][]" onclick="selectOnlyThis(this)"> \
                           <label class="custom-control-label" for="'+ id + '">' + category + '</label> \
                       </div>';
                    $('#txtCategory').val("");
                    $("#categoryID").append(html);
                } else {
                    $("#errorCategory").show()

                    setTimeout(function () {
                        $("#errorCategory").fadeOut("slow");
                    }, 5500);
                }

            },
            beforeSend: function () {
            },
            complete: function () {
            }
        });
    } else {
        $("#categoryInvalid").show();
        setTimeout(function () {
            $("#categoryInvalid").fadeOut("slow");
        }, 5500);

        $(".form-control").addClass("is-invalid");
    }
    //  $("#categoryID").append(html);
}
//------ END ---------


function checkInputs() {

    if ($("#q_titleID").val() == "") {

        $("#invalidID").show();
        setTimeout(function () {
            $("#invalidID").fadeOut("slow");
        }, 5500);

    } else if ($("#hrID").val() == "" || $("#minID").val() == "" || $("#passingRate").val() == "") {
        $("#limitError").show();
        setTimeout(function () {
            $("#limitError").fadeOut("slow");
        }, 5500);
    } else {
        $('.bs-example-modal-new').modal('show');
    }
}

function displayError(gi, tmp) {


    $("#nqError").fadeIn("slow");
    setTimeout(function () {
        $("#nqError").fadeOut();
    }, 5500);


    if ($("#" + gi).val() == "") {
        $("#" + gi + "error").show();
    }

    if ($("#" + tmp).val() == "") {
        $("#" + tmp + "error").show();
    }


    setTimeout(function () {
        $("#" + gi + "error").fadeOut("slow");
        $("#" + tmp + "error").fadeOut("slow");
    }, 5500);
}
// --- End ----

//-- This function is from maintenance page / Removing the questionnaire---
function removeQuestionaire(id, rowId) {
    $("#idRemove").val(id);
    $("#rowRemove").val(rowId);
    $('.bs-example-modal-new').modal('show');
}

function proceedRemoval() {
    var idRemove = $("#rowRemove").val();
    document.getElementById("ques_table").deleteRow(idRemove);
    var removeID = $("#idRemove").val();
    $.ajax({
        url: '/Maintenance/deleteQuestionaire',
        type: 'POST',
        data: JSON.stringify({ id: removeID }),
        dataType: "json",
        traditional: true,
        contentType: 'application/json;',
        cache: false,
        success: function () {

        }
    });
}
function selectOnlyThis(element) {

    if (element.checked) {
        element.classList.add("marked");
    } else {
        element.classList.remove("marked");
    }

    if (document.getElementsByClassName("marked").length > 1) {
        alert("Please select only one category.");
        element.checked = false;
        element.classList.remove("marked");
    }
}

function refereshPage() {
    window.location.href += "#maintenance";
    location.reload();
}


function giveAccess() {

    $('.bs-example-modal-new1').modal('show');

}

function SubmitAccess() {

    var examID = $("#titlesID").val();
    var users = $("#empIDs").val();



    $.ajax({
        url: '/Maintenance/GiveUserAccess',
        type: 'POST',
        data: JSON.stringify({ usrIds: users, examID: examID }),
        dataType: "json",
        traditional: true,
        contentType: 'application/json;',
        cache: false,
        success: function () {
        }
    });
    alert("Added successfully.");
}


//------ END -------