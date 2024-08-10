var isChange = 0;
var count = 0;
var titles = [];

$(document).ready(function () {

    //Employee
    $("#drpdwnCategories").change(function () {
        var categories = $(this).val();

        $.ajax({
            Type: 'POST',
            url: '/Maintenance/DisplayQuestionnaires',
            dataType: "json",
            cache: false,
            data: { categoryID: categories },
            complete: function (questionnaires) {
                count = questionnaires.responseJSON.length;
                var html = "";
                $("#titlesTxt").fadeIn();
                for (var c = 0; c < count; c++) {
                    html = "<tr>\
                                <td style='width:10%;'>\
                                   <input type='checkbox' class='w3-check' id='cbTitle"+ c + "'></td>\
                                <td> \
                                  <input type ='hidden' id='titleTxt"+ c + "' value='" + questionnaires.responseJSON[c].exam_id + "'>"
                                   + questionnaires.responseJSON[c].title + "</td>\
                            </tr>";
                    $("#tblTitles").append(html);
                }
            }
        });
    })

    $("#v_drpdwnCategories").change(function () {
        var categories = $(this).val();
         $.ajax({
            Type: 'POST',
            url: '/Maintenance/DisplayQuestionnaires',
            dataType: "json",
            data: { categoryID: categories },
            cache: false,
            complete: function (questionnaires) {
                count = questionnaires.responseJSON.length;
                var html = "";
                $("#v_titlesTxt").fadeIn();
                for (var c = 0; c < count; c++) {
                    html = "<tr>\
                                <td style='width:10%;'>\
                                   <input type='checkbox' class='w3-check' id='v_cbTitle"+ c + "'></td>\
                                <td> \
                                  <input type ='hidden' id='v_titleTxt"+ c + "' value='" + questionnaires.responseJSON[c].exam_id + "'>"
                        + questionnaires.responseJSON[c].title + "</td>\
                            </tr>";
                    $("#v_tblTitles").append(html);
                }
            }
        });
    })
});

//$(function () {
//    $("#schedule").datepicker();
//});


function GenerateCode(type) {
    var randomCode = Math.floor(Math.random() * 1000000) + 1;

    if (type == "1") {

        if (empIsNotValid() == true) {

            $("#e_empCode").val(randomCode);
            $("#empGenBtn").hide();
            $("#empBtn").show();
        }
    } else {
        if (vsitorIsNotValid() == true) {
            $("#v_vsitrCode").val(randomCode);
            $("#vsitorGenBtn").hide();
            $("#visitorBtn").show();
        }
    }
}

function empIsNotValid() {

  
    if ($("#e_empIDtxt").val() == "") {
        $("#empIDError").show();
        return false;
    } else {
        $("#empIDError").hide();
    }

    if ($("#e_Auto_Title").val() == "") {
        $("#e_TitleError").show();
        return false;
    } else {
        $("#e_TitleError").hide();
    }

    return true;
}

function vsitorIsNotValid() {

    if ($("#v_fnameTxt").val() == "") {
        $("#v_fnameError").show();
        return false;
    } else {
        $("#v_fnameError").hide();
    }

    if ($("#v_mnameTxt").val() == "") {
        $("#v_mnameError").show();
        return false;
    } else {
        $("#v_mnameError").hide();
    }

    if ($("#v_lnameTxt").val() == "") {
        $("#v_lnameError").show();
        return false;
    } else {
        $("#v_lnameError").hide();
    }

    if ($("#v_Auto_Title").val() == "") {
        $("#v_TitleError").show();
        return false;
    } else {
        $("#v_TitleError").hide();
    }
    return true;
}

function registrationSubmit(type) {

    //-- Values --
    var empID = $("#e_empIDtxt").val();
    var fname = $("#e_fullname").val();
    var lname = $("#e_fullname").val();
    var dept = $("#e_deptTxt").val();
    var cntrol_no = $("#e_empCode").val();
    var categories = $("#drpdwnCategories").val();

    var v_fname = $("#v_fnameTxt").val();
    var v_mname = $("#v_mnameTxt").val();
    var v_lname = $("#v_lnameTxt").val();
    var v_cntrol_no = $("#v_vsitrCode").val();
    var v_categories = $("#v_drpdwnCategories").val();
    // -- E N D --


    if (type == 1) {

        if (empIsNotValid() == true) {
            for (var c = 0; c < count; c++) {
                var examid = $("#titleTxt" + c).val();
                
                if ($('#cbTitle' + c).is(":checked")) {
                    $.ajax({
                        url: '/Maintenance/e_Registration',
                        type: 'POST',
                        data: JSON.stringify(
                            {
                                examid: examid,
                                empID: empID.trim(),
                                fname: fname.substring(fname.lastIndexOf(',') + 1),
                                mname: "",
                                lname: lname.substring(0, lname.lastIndexOf(",") + 0),
                                dept: dept,
                                cntrol_no: cntrol_no,
                                isVisitor: '0',
                                category: categories
                            }),
                        dataType: "json",
                        traditional: true,
                        contentType: 'application/json;',
                        cache: false,
                        beforeSend: function () {
                            $("#loaderDiv").fadeIn();
                        },
                        complete: function (title) {
                            setTimeout(function () {
                                $("#loaderDiv").fadeOut();
                            }, 2500);

                            setTimeout(function () {
                                location.reload();
                            }, 3000);
                        }
                    });
                }
            }
        }
    } else {

        if (vsitorIsNotValid() == true) {
            for (var c = 0; c < count; c++) {

                var examid = $("#v_titleTxt" + c).val();

                if ($('#v_cbTitle' + c).is(":checked")) {

                    $.ajax({
                        url: '/Maintenance/e_Registration',
                        type: 'POST',
                        data: JSON.stringify(
                            {
                                examid: examid,
                                empID: v_cntrol_no,
                                fname: v_fname,
                                mname: v_mname,
                                lname: v_lname,
                                dept: '0',
                                cntrol_no: v_cntrol_no,
                                isVisitor: '1',
                                category: v_categories
                            }),
                        dataType: "json",
                        traditional: true,
                        contentType: 'application/json;',
                        cache: false,
                        beforeSend: function () {
                            $("#loaderDiv").fadeIn();
                        },
                        complete: function (title) {
                            setTimeout(function () {
                                $("#loaderDiv").fadeOut();
                            }, 2500);

                            setTimeout(function () {
                                location.reload();
                            }, 3000);
                        }
                    });
                }
            }
        }
    }
}