var prev = [];
var idPrev = [];

function inputEvents(id, qNum) {
    $('#' + id).attr('readonly', false);

    prev.push(id);
    prev.push(qNum);
}

function disableField(id) {
    $("#" + id).attr('readonly', true);

    var field = "";
    var testType = "";
    var type = prev[0];
    var prevID = prev[1];
    var prevContent = $("#" + type).val();


    if (id.indexOf("oq_gi") !== -1) {
        field = "1";

        if (id.indexOf("oq_gi_mcID") !== -1) {
            testType = "Multiple Choice";
        }
        if (id.indexOf("oq_gi_FbID") !== -1) {
            testType = "Filling the blanks";
        }
        if (id.indexOf("oq_gi_EnuID") !== -1) {
            testType = "Identification";
        }
        if (id.indexOf("oq_gi_EssayID") !== -1) {
            testType = "Essay";
        }
        if (id.indexOf("oq_gi_diagramID") !== -1) {
            testType = "Diagram";
        }
        if (id.indexOf("oq_gi_enumID") !== -1) {
            testType = "Enumeration";
        }
        if (id.indexOf("oq_gi_MtID") !== -1) {
            testType = "Matching Type";
        }
        if (id.indexOf("oq_gi_diagramID") !== -1) {
            testType = "Diagram";
        }
    } else if (type.indexOf("oq_q") !== -1) {
        field = "2";

        if (id.indexOf("oq_q_enumID") !== -1) {
            testType = "Enumeration";
        }

    } else if (type.indexOf("oq_ch") !== -1) {
        field = "3";
    } else if (type.indexOf("oq_ans") !== -1) {
        field = "4";
    }
    // -- END ---
    console.log(field);
    $.ajax({
        url: '/Maintenance/updateQuestionaire',
        type: 'POST',
        data: JSON.stringify({ id: prevID, content: prevContent, fieldName: field, TestType: testType }),
        dataType: "json",
        traditional: true,
        contentType: 'application/json;',
        cache: false,
        complete: function () {
            $(".op-imgLoader").hide();
            $("#op-check").show();

        }
    });

    prev.shift();
    prev.shift();
}

function categoryOnchange() {
    var newCategory = $("#categoryId").val();
    var examID = $("#txtExamID").val();

    $.ajax({
        url: '/Maintenance/updateQuestionaire',
        type: 'POST',
        data: JSON.stringify({ id: "-1", content: newCategory, fieldName: examID, TestType: "" }),
        dataType: "json",
        traditional: true,
        contentType: 'application/json;',
        cache: false,
        complete: function () {
            $('#categoryId').attr('disabled', true);
        }
    });
}
function categoryDblClk() {
    $('#categoryId').attr('disabled', false);
    $('#txtTitleID').attr('readonly', false);
    $('#txtSchedule').attr('readonly', false);
    $('#examineeID').attr('disabled', false);
    $('#passingRate').attr('readonly', false);
    $('#hrID').attr('readonly', false);
    $('#minID').attr('readonly', false);
}

function changeTitle() {
    var newTitle = $("#txtTitleID").val();
    var examID = $("#txtExamID").val();
    $.ajax({
        url: '/Maintenance/updateQuestionaire',
        type: 'POST',
        data: JSON.stringify({ id: "-2", content: newTitle, fieldName: examID, TestType: "" }),
        dataType: "json",
        traditional: true,
        contentType: 'application/json;',
        cache: false,
        complete: function () {
            $('#txtTitleID').attr('disabled', true);
        }
    });
}

function changeSchedule(e) {
    var examID = $("#txtExamID").val();
    $.ajax({
        url: '/Maintenance/updateQuestionaire',
        type: 'POST',
        data: JSON.stringify({ id: "-3", content: e.target.value, fieldName: examID, TestType: "" }),
        dataType: "json",
        traditional: true,
        contentType: 'application/json;',
        cache: false,

    });

}

function examineeOnchange() {

    var newExaminee = "";
    var examID = $("#txtExamID").val();

    // Get Examinees for submitted questionnaire
    if ($('#AllEmployees').is(":checked"))
        newExaminee += $("#AllEmployees").val() + ", ";

    if ($('#RIMPEmployees').is(":checked"))
        newExaminee += $("#RIMPEmployees").val() + ", ";

    if ($('#CGSIEmployees').is(":checked"))
        newExaminee += $("#CGSIEmployees").val() + ", ";

    if ($('#GoodJobEmployees').is(":checked"))
        newExaminee += $("#GoodJobEmployees").val() + ", ";

    if ($('#Visitor').is(":checked"))
        newExaminee += $("#Visitor").val() + ", ";

    if ($("#listSelected") !== undefined || $("#listSelected").val() !== "") {
        newExaminee += $("#listSelected").val() + ", ";
    }

    $.ajax({
        url: '/Maintenance/updateQuestionaire',
        type: 'POST',
        data: JSON.stringify({ id: "-4", content: newExaminee, fieldName: examID, TestType: "" }),
        dataType: "json",
        traditional: true,
        contentType: 'application/json;',
        cache: false,
        complete: function () {
            $('#examineeID').attr('disabled', true);
            location.reload();
        }
    });
}

$(function () {
    //Examinee
    $("#examineeID").change(function () {
        var Examinee = $(this).val();

        if (Examinee == "Selected") {
            $("#selectedEmp").show();
            $("#fixSlected").show();
        } else {

            $("#selectedEmp").hide();
            $("#fixSlectedID").hide();
            $("#fxSelectedTmp").hide();
        }
    });
});

function updNewExaminee() {
    var examID = $("#txtExamID").val();
    var newExaminee = $("#fixSlected").val();

    $.ajax({
        url: '/Maintenance/updateQuestionaire',
        type: 'POST',
        data: JSON.stringify({ id: "-4", content: newExaminee, fieldName: examID, TestType: "" }),
        dataType: "json",
        traditional: true,
        contentType: 'application/json;',
        cache: false,
        complete: function () {
            $('#examineeID').attr('disabled', true);
            $('#selectedEmp').attr('readonly', true);
        }
    });
}

function submitNewExaminee() {
    var examID = $("#txtExamID").val();
    var newExaminee = $("#selectedEmp").val();
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?]+/;

    if (event.key === 'Enter') {
        if (newExaminee.charAt(0) != "g" || newExaminee.match(format)) {

            $("#selectedEmp").addClass("is-invalid");
            $('#selectedEmp')
                .attr('data-toggle', 'tooltip')
                .attr('data-placement', 'top')
                .tooltip({
                    trigger: 'manual'
                })
                .tooltip('show');

        } else {
            $.ajax({
                url: '/Maintenance/updateQuestionaire',
                type: 'POST',
                data: JSON.stringify({ id: "-4", content: newExaminee, fieldName: examID, TestType: "" }),
                dataType: "json",
                traditional: true,
                contentType: 'application/json;',
                cache: false,
                complete: function () {
                    $('#examineeID').attr('disabled', true);
                    $('#selectedEmp').attr('readonly', true);
                }
            });
        }
    }
}

function passingDblClk() {
    var examID = $("#txtExamID").val();

    $.ajax({
        url: '/Maintenance/updateQuestionaire',
        type: 'POST',
        data: JSON.stringify({ id: "-5", content: $("#passingRate").val(), fieldName: examID, TestType: "" }),
        dataType: "json",
        traditional: true,
        contentType: 'application/json;',
        cache: false,
        complete: function () {
            $('#passingRate').attr('readonly', true);
        }
    });
}

function limitDblClk() {

    var examID = $("#txtExamID").val();
    var hr = $("#hrID").val();
    var min = $("#minID").val();

    $.ajax({
        url: '/Maintenance/updateQuestionaire',
        type: 'POST',
        data: JSON.stringify({ id: "-6", content: hr + ";" + min, fieldName: examID, TestType: "" }),
        dataType: "json",
        traditional: true,
        contentType: 'application/json;',
        cache: false,
        complete: function () {
            $('#hrID').attr('readonly', true);
            $('#minID').attr('readonly', true);
        }
    });
}

function addEssayScore(id, examinee, attempt, q_id, points,visitor) {

    var givenPnts = $("#essayScore_" + q_id).val();
    var displayPts = givenPnts + " points";

    if (parseInt(givenPnts) <= parseInt(points)) {
        if (givenPnts !== "") {
            $.ajax({
                url: '/Examinations/updateEssayScore',
                type: 'POST',
                data: JSON.stringify({ content: givenPnts, examID: id, empID: examinee, attempt: attempt, QID: q_id, isVisitor: visitor}),
                dataType: "json",
                traditional: true,
                contentType: 'application/json;',
                cache: false,
                complete: function () {
                    $("#essayScore_" + q_id).hide();
                    $("#lblGivenScore_" + q_id).text(displayPts);
                }
            });
        }
      
    } else {
        $("#exceed_" + q_id).show();
        setTimeout(function () {
            $("#exceed_" + q_id).hide();
        }, 2500);
       
    }
}

var changeDiagram = function (event, img, input, imgBase64, imageName) {

    var output = document.getElementById(img);
    output.src = URL.createObjectURL(event.target.files[0]);

    updtoBase64(input, imgBase64); // convert image to base64

    setTimeout(function () {
        var tmpDiagram = $("#" + imgBase64).val();
        tmpDiagram = tmpDiagram.split(",").pop();

        $.ajax({
            url: '/Maintenance/replaceImage',
            type: 'POST',
            data: JSON.stringify({ ImageName: imageName, StrBase64: tmpDiagram }),
            dataType: "json",
            traditional: true,
            contentType: 'application/json;',
            cache: false,
            complete: function () {
            }
        });

    }, 2000);

};
var changeDiagramCh = function (event, img, input, imgBase64, imageName) {

    var output = document.getElementById(img);
    output.src = URL.createObjectURL(event.target.files[0]);

    updtoBase64(input, imgBase64); // convert image to base64

    setTimeout(function () {
        var tmpDiagram = $("#" + imgBase64).val();
        tmpDiagram = tmpDiagram.split(",").pop();

        $.ajax({
            url: '/Maintenance/replaceImage',
            type: 'POST',
            data: JSON.stringify({ ImageName: imageName, StrBase64: tmpDiagram }),
            dataType: "json",
            traditional: true,
            contentType: 'application/json;',
            cache: false,
            complete: function () {
            }
        });

    }, 1500);

};
function updtoBase64(file, id) {

    var filesSelected = document.getElementById(file).files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];

        var fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64

            var newImage = document.createElement('img');
            newImage.src = srcData;
            $("#" + id).val(srcData);
        }
        fileReader.readAsDataURL(fileToLoad);
    }
}