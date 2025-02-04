﻿
var content = [];
var title = "";
var _category = "";
var maxCategory = 0;
var examinee = "";

function ExportToTable() {
    $("#questionType").hide();
    $("#excelBtn").show();
    $.ajax({ url: '/Maintenance/setExamID', type: 'POST' });

    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
    /*Checks whether the file is a valid excel file*/
    if (regex.test($("#excelfile").val().toLowerCase())) {
        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
        if ($("#excelfile").val().toLowerCase().indexOf(".xlsx") > 0) {
            xlsxflag = true;
        }
        /*Checks whether the browser supports HTML5*/
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                /*Converts the excel data in to object*/
                if (xlsxflag) {
                    var workbook = XLSX.read(data, { type: 'binary' });
                }
                else {
                    var workbook = XLS.read(data, { type: 'binary' });
                }
                /*Gets all the sheetnames of excel in to a variable*/
                var sheet_name_list = workbook.SheetNames;

                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
                    /*Convert the cell value to Json*/
                    if (xlsxflag) {
                        var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                    }
                    else {
                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                    }
                    if (exceljson.length > 0 && cnt == 0) {
                        setTimeout(function () {
                            BindTable(exceljson, '#exceltable');
                        }, 4000);
                        cnt++;
                    }
                });
                $("#importLoader").show();
                $("#importText").show();

                setTimeout(function () {
                    $("#importLoader").hide();
                    $("#importText").hide();
                    $('#exceltable').show();
                }, 4000);

            }
            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                reader.readAsArrayBuffer($("#excelfile")[0].files[0]);
            }
            else {
                reader.readAsBinaryString($("#excelfile")[0].files[0]);
            }
        }
        else {
            alert("Sorry! Your browser does not support HTML5!");
        }
    }
    else {
        alert("Please upload a valid Excel file!");
    }
}

function BindTable(jsondata, tableid) {/*Function used to convert the JSON array to Html Table*/
    var columns = BindTableHeader(jsondata, tableid); /*Gets all the column headings of Excel*/
    for (var i = 0; i < jsondata.length; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = jsondata[i][columns[colIndex]];
            if (cellValue == null)
                cellValue = "";
            row$.append($('<td/>').html(cellValue));

            content.push(cellValue);
        }
        $(tableid).append(row$);
    }
}
function BindTableHeader(jsondata, tableid) {/*Function used to get all column names from JSON and bind the html table header*/
    var columnSet = [];
    var headerTr$ = $('<tr/>');
    for (var i = 0; i < jsondata.length; i++) {
        var rowHash = jsondata[i];
        for (var key in rowHash) {
            if (rowHash.hasOwnProperty(key)) {
                if ($.inArray(key, columnSet) == -1) {/*Adding each unique column names to a variable array*/
                    columnSet.push(key);
                    headerTr$.append($('<th/>').html(key));
                    content.push(key);
                }
            }
        }
    }
    $(tableid).append(headerTr$);
    return columnSet;
}


/*
Summary: 
Loop - get all excel content
Conditions - push exam item and instruction to array accordingly
*/
function extractExcel() {

    var multipleChoice = [];
    var identification = [];
    var essay = [];
    var fllingDblanks = [];
    var matchingtype = [];
    var enumeration = [];

    var item = 0;
    var prevExam = "";


    for (var i = 0; i < content.length; i++) {

        if (i == 0) {
            title = content[i].split(":").pop();
        } else {

            if (item == 0) { // Get exam type | General instruction

                if (content[i].toLowerCase().indexOf("multiple choice") !== -1 || prevExam.toLowerCase().indexOf("multiple choice") !== -1) {
                    multipleChoice.push(content[i]);
                    prevExam = "multiple Choice";
                } else if (content[i].toLowerCase().indexOf("filling the blanks") !== -1 || prevExam.toLowerCase().indexOf("filling the blanks") !== -1) {
                    fllingDblanks.push(content[i]);
                    prevExam = "filling the blanks";
                } else if (content[i].toLowerCase().indexOf("identification") !== -1 || prevExam.toLowerCase().indexOf("identification") !== -1) {
                    identification.push(content[i]);
                    prevExam = "identification";
                } else if (content[i].toLowerCase().indexOf("essay") !== -1 || prevExam.toLowerCase().indexOf("essay") !== -1) {
                    essay.push(content[i]);
                    prevExam = "essay";
                } else if (content[i].toLowerCase().indexOf("matching type") !== -1 || prevExam.toLowerCase().indexOf("matching type") !== -1) {
                    matchingtype.push(content[i]);
                    prevExam = "matching type";
                }
                item++;
            } else {

                // If new exam type is multiple choice / get instruction
                if (content[i].toLowerCase().indexOf("multiple choice") !== -1) {
                    item = 0;
                    prevExam = content[i];
                    multipleChoice.push(prevExam);
                } else { // get all items of multiple choice
                    if (prevExam.toLowerCase().indexOf("multiple choice") !== -1 &&
                        !(content[i].toLowerCase().indexOf("filling the blanks") !== -1 ||
                            content[i].toLowerCase().indexOf("identification") !== -1 ||
                            content[i].toLowerCase().indexOf("essay") !== -1 ||
                            content[i].toLowerCase().indexOf("matching type") !== -1 ||
                            content[i].toLowerCase().indexOf("enumeration") !== -1
                        )) {
                        multipleChoice.push(content[i]);
                        item++;
                    }
                }

                //If new exam type is Filling the blanks / get instruction
                if (content[i].toLowerCase().indexOf("filling the blanks") !== -1) {
                    item = 0;
                    prevExam = content[i];
                    fllingDblanks.push(prevExam);
                } else {  // get all items of filling the blanks
                    if (prevExam.toLowerCase().indexOf("filling the blanks") !== -1 &&
                        !(content[i].toLowerCase().indexOf("multiple choice") !== -1 ||
                            content[i].toLowerCase().indexOf("identification") !== -1 ||
                            content[i].toLowerCase().indexOf("essay") !== -1 ||
                            content[i].toLowerCase().indexOf("matching type") !== -1 ||
                            content[i].toLowerCase().indexOf("enumeration") !== -1
                        )) {

                        fllingDblanks.push(content[i]);
                        item++;
                    }
                }

                // If new exam is Identification / get instruction
                if (content[i].toLowerCase().indexOf("identification") !== -1) {
                    item = 0;
                    prevExam = content[i];
                    identification.push(prevExam);
                } else {  // get all items of identication
                    if (prevExam.toLowerCase().indexOf("identification") !== -1 &&
                        !(content[i].toLowerCase().indexOf("multiple choice") !== -1 ||
                            content[i].toLowerCase().indexOf("filling the blanks") !== -1 ||
                            content[i].toLowerCase().indexOf("essay") !== -1 ||
                            content[i].toLowerCase().indexOf("matching type") !== -1 ||
                            content[i].toLowerCase().indexOf("enumeration") !== -1
                        )) {

                        identification.push(content[i]);
                        item++;
                    }
                }

                //If new item is essay / get instruction
                if (content[i].toLowerCase().indexOf("essay") !== -1) {
                    item = 0;
                    prevExam = content[i];
                    essay.push(prevExam);
                } else {  // get all items of essay
                    if (prevExam.toLowerCase().indexOf("essay") !== -1 &&
                        !(content[i].toLowerCase().indexOf("multiple choice") !== -1 ||
                            content[i].toLowerCase().indexOf("filling the blanks") !== -1 ||
                            content[i].toLowerCase().indexOf("identification") !== -1 ||
                            content[i].toLowerCase().indexOf("matching type") !== -1 ||
                            content[i].toLowerCase().indexOf("enumeration") !== -1
                        )) {

                        essay.push(content[i]);
                        item++;
                    }
                }


                // If new exam is enumeration / get instruction
                if (content[i].toLowerCase().indexOf("matching type") !== -1) {
                    item = 0;
                    prevExam = content[i];
                    matchingtype.push(prevExam);
                } else {  // get all items of identication
                    if (prevExam.toLowerCase().indexOf("matching type") !== -1 &&
                        !(content[i].toLowerCase().indexOf("multiple choice") !== -1 ||
                            content[i].toLowerCase().indexOf("filling the blanks") !== -1 ||
                            content[i].toLowerCase().indexOf("essay") !== -1 ||
                            content[i].toLowerCase().indexOf("enumeration") !== -1 ||
                            content[i].toLowerCase().indexOf("identification") !== -1
                        )) {

                        matchingtype.push(content[i]);
                        item++;
                    }
                }

                // If new exam is enumeration / get instruction
                if (content[i].toLowerCase().indexOf("enumeration") !== -1) {
                    item = 0;
                    prevExam = content[i];
                    enumeration.push(prevExam);
                } else {  // get all items of identication
                    if (prevExam.toLowerCase().indexOf("enumeration") !== -1 &&
                        !(content[i].toLowerCase().indexOf("multiple choice") !== -1 ||
                            content[i].toLowerCase().indexOf("filling the blanks") !== -1 ||
                            content[i].toLowerCase().indexOf("essay") !== -1 ||
                            content[i].toLowerCase().indexOf("matching type") !== -1 ||
                            content[i].toLowerCase().indexOf("identification") !== -1
                        )) {

                        enumeration.push(content[i]);
                        item++;
                    }
                }

            }
        }
    }

    /*
     To convert array to json, insert questions, choices and answer to json accordingly.
     */
    if (multipleChoice.length !== 0) {
        var tmpMc = {};
        var mc = [];
        var choices = "";
        var genIns = "";
        var answer = "";
        var question = "";
        var nextIsQues = 0;

        for (var a = 0; a < multipleChoice.length; a++) {


            if (multipleChoice[a].toLowerCase().indexOf("multiple choice") !== -1) {
                var tmp = multipleChoice[a].substring(0, multipleChoice[a].indexOf("."));
                genIns = tmp + " " + multipleChoice[a].split(":").pop();
                nextIsQues = 1;

            } else if (multipleChoice[a].toLowerCase().indexOf("answer") !== -1) {
                answer = multipleChoice[a].split(":").pop();
                nextIsQues = 1;
            } else {
                if (nextIsQues == 0) {
                    choices = choices + " " + multipleChoice[a];
                } else {
                    question = multipleChoice[a].slice(2);
                    nextIsQues = 0;
                }

            }

            if (genIns !== "" && answer !== "" && question !== "" && choices.length != 0) {
                tmpMc = {
                    'Instruction': genIns,
                    'Question': question,
                    'Choices': choices,
                    'Answer': answer,
                };
                mc.push(JSON.stringify(tmpMc));

                answer = "";
                question = "";
                choices = [];
            }

        }
        SubmitExcel(mc, 'Multiple Choice');
    }

    if (fllingDblanks.length !== 0) {

        var tmpfB = {};
        var fb = [];
        var genIns = "";
        var answer = "";
        var question = "";
        var nextIsQues = 0;

        for (var a = 0; a < fllingDblanks.length; a++) {

            if (fllingDblanks[a].toLowerCase().indexOf("filling the blanks") !== -1) {
                var tmp = fllingDblanks[a].substring(0, fllingDblanks[a].indexOf("."));
                genIns = tmp + " " + fllingDblanks[a].split(":").pop();

            } else if (fllingDblanks[a].toLowerCase().indexOf("answer") !== -1) {
                answer = fllingDblanks[a].split(":").pop();
            } else {
                if (fllingDblanks[a].slice(2) !== "") {
                    question = fllingDblanks[a].slice(2);
                }
              
            }

            if (genIns !== "" && answer !== "" && question !== "") {
                tmpfB = {
                    'Instruction': genIns,
                    'Question': question,
                    'Answer': answer,
                };
                fb.push(JSON.stringify(tmpfB));
                answer = "";
            }
        }

        SubmitExcel(fb, 'Filling the blanks');
    }

    if (identification.length !== 0) {

        var tmpIdntfcn = {};
        var idntfictn = [];
        var genIns = "";
        var answer = "";
        var question = "";
        var nextIsQues = 0;

        for (var a = 0; a < identification.length; a++) {

            if (identification[a].toLowerCase().indexOf("identification") !== -1) {
                var tmp = identification[a].substring(0, identification[a].indexOf("."));
                genIns = tmp + " " + identification[a].split(":").pop();

            } else if (identification[a].toLowerCase().indexOf("answer") !== -1) {
                answer = identification[a].split(":").pop();
            } else {
                if (identification[a].slice(2) !== "") {
                    question = identification[a].slice(2);
                }
            }

            if (genIns !== "" && answer !== "" && question !== "") {
                tmpIdntfcn = {
                    'Instruction': genIns,
                    'Question': question,
                    'Answer': answer,
                };
                idntfictn.push(JSON.stringify(tmpIdntfcn));
                answer = "";
            }
        }

        SubmitExcel(idntfictn, 'Identification');
    }

    if (essay.length !== 0) {
        var tmpEssay = {};
        var arrEssay = [];
        var genIns = "";
        var answer = "";
        var question = "";

        for (var a = 0; a < essay.length; a++) {
            if (essay[a].toLowerCase().indexOf("essay") !== -1) {
                var tmp = essay[a].substring(0, essay[a].indexOf("."));
                genIns = tmp + " " + essay[a].split(":").pop();

            } else if (essay[a].toLowerCase().indexOf("answer") !== -1) {
                answer = essay[a].split(":").pop();
            } else {
                if (essay[a].slice(2) !== "") {
                    question = essay[a].slice(2);
                }
            }
           if (genIns !== "" && answer !== "" && question !== "") {
                tmpEssay = {
                    'Instruction': genIns,
                    'Question': question,
                    'Answer': answer,
                };
                arrEssay.push(JSON.stringify(tmpEssay));
                answer = "";
            }
         
        }

        SubmitExcel(arrEssay, 'Essay');
    }

    if (matchingtype.length !== 0) {

        var tmpMt = {};
        var mt = [];
        var genIns = "";
        var answer = "";
        var question = "";
        var choices = "";
        var nextIsQues = 0;

        for (var a = 0; a < matchingtype.length; a++) {

            if (matchingtype[a].toLowerCase().indexOf("matching type") !== -1) {
                var tmp = matchingtype[a].substring(0, matchingtype[a].indexOf("."));
                genIns = tmp + " " + matchingtype[a].split(":").pop();
                nextIsQues = 1;
            } else if (matchingtype[a].toLowerCase().indexOf("answer") !== -1) {
                answer = matchingtype[a].split(":").pop();
                nextIsQues = 1;
            } else {
                //  question = matchingtype[a].slice(2);
                if (nextIsQues == 0) {
                    choices = " " + matchingtype[a];
                } else {
                    question = matchingtype[a].slice(2);
                    nextIsQues = 0;
                }
            }

            if (genIns !== "" && answer !== "" && question !== "") {
                tmpMt = {
                    'Instruction': genIns,
                    'Question': question,
                    'Choices': choices,
                    'Answer': answer,
                };
                mt.push(JSON.stringify(tmpMt));
                answer = "";
            }
        }
        SubmitExcel(mt, 'Matching Type');
    }

    if (enumeration.length !== 0) {

        var tmpEnum = {};
        var Enum = [];
        var genIns = "";
        var answer = "";
        var question = "";
        var nextIsQues = 0;
        var order = "";

        for (var a = 0; a < enumeration.length; a++) {

            if (enumeration[a].toLowerCase().indexOf("enumeration") !== -1) {
                var tmp = enumeration[a].substring(0, enumeration[a].indexOf("."));
                genIns = tmp + " " + enumeration[a].split(":").pop();
            } else if (enumeration[a].toLowerCase().indexOf("answer") !== -1) {
                answer = enumeration[a].split(":").pop();

            } else if (enumeration[a].toLowerCase().indexOf("order") !== -1) {
                order = enumeration[a].split(":").pop();

            } else {
                if (enumeration[a].slice(2) !== "") {
                    question = enumeration[a].slice(2);
                }
            }

            if (genIns !== "" && answer !== "" && question !== "") {
                tmpEnum = {
                    'Instruction': genIns,
                    'Question': question,
                    'Answer': answer,
                    'InAnyOrder': order,
                };
                Enum.push(JSON.stringify(tmpEnum));
                answer = "";
            }
        }
        SubmitExcel(Enum, 'Enumeration');

    }
}

// Call controller function to save submitted items using ajax.
function SubmitExcel(exam, examType) {
    var hr = $("#hrID").val();
    var min = $("#minID").val();
    var schedule = $("#schedule").val();
    var rate = $("#passingRate").val();

    // --- E N D -----

  

    $.ajax({
        url: '/Maintenance/SaveExcel',
        type: 'POST',
        data: JSON.stringify({ Content: exam, ExamType: examType, Hr: hr, Min: min, Rate: rate, Title: title, Category: _category, Examinee: examinee, Schedule: schedule }),
        dataType: "json",
        traditional: true,
        contentType: 'application/json;',
        cache: false,
        success: function () {
        }
    });

    $("#teOverlay").fadeIn();

    setTimeout(function () {
        $("#teOverlay").fadeOut();

    }, 6000);

    setTimeout(function () {
        location.href = "#open-modal";
    }, 7000);
}

//--- Validations Functions --


function checkImport() {
    var isAllValid = 1;

    //call validations and setters for category and examinee
    setCategory();
    setExaminee();

    if ($("#hrID").val() == "" || $("#minID").val() == "") {
        $("#limitError").show();
        document.getElementById("hrID").style.borderColor = "red";
        document.getElementById("minID").style.borderColor = "red";
        isAllValid = 0;
    }

    if ($("#passingRate").val() == "") {
        $("#limitError").show();
        document.getElementById("passingRate").style.borderColor = "red";
        isAllValid = 0;
    }

    if (examinee == "") {
        isAllValid = 0;
        $("#blankCategory").show();
    }

    if (_category == "") {
        isAllValid = 0;
        $("#blankCategory").show();
    }

    // --- E N D ----------

    if (isAllValid == 1) {
        extractExcel();
    }

    examinee = "";
}

function setCategory() {
    $.ajax({
        url: '/Maintenance/getMaxCategory',
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
            _category = $('#category' + c).val();
        }
    }

}

function setExaminee() {
    // Get Examinees for submitted questionnaire
    if ($('#AllEmployee').is(":checked"))
        examinee += $("#AllEmployee").val() + ", ";

    if ($('#RIMP').is(":checked"))
        examinee += $("#RIMP").val() + ", ";

    if ($('#CGSI').is(":checked"))
        examinee += $("#CGSI").val() + ", ";

    if ($('#GoodJob').is(":checked"))
        examinee += $("#GoodJob").val() + ", ";

    if ($('#Visitor').is(":checked"))
        examinee += $("#Visitor").val() + ", ";

    if ($('#selected').val() !== "")
        examinee += $("#selected").val() + ", ";
}
//----- E N D ----------------
