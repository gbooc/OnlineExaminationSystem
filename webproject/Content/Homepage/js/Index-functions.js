$(document).ready(function () {
    $('li a').click(function (e) {
        //   e.preventDefault();

        $(".nav-link").removeClass("active");
        var link = $(this).hasClass('nav-link') ? $(this) : $(this).closest('ul').prev();
        var href = $(this).attr('href');

        link.addClass('active');

        switch (href) {
            case "#dashboard": window.location.href = '/Dashboard/Dashboard#dashboard'; break;

            // --- Maintenance Sub-menu ----
            case "#maintenance_q": window.location.href = '/Maintenance/Maintenance#maintenance_q'; break;
            case "#maintenance_r": window.location.href = '/Maintenance/Register#maintenance_r'; break;
            // --- E N D ---

            // --- Results Sub-Menu ---
            case "#employeeResults": window.location.href = '/Results/Results#employeeResults'; break;
            case "#vstrResults": window.location.href = '/Results/VisitorResults#vstrResults'; break;
            case "#summaryResults": window.location.href = '/Results/Summary#summaryResults'; break;
            // --- E N D ----

            // -- Examinations --
            case "#questionaires": window.location.href = '/Examinations/Examinations#questionaires'; break;
        }
    });

    $(".nav-link").removeClass("active");
    var href = window.location.hash;

    switch (href) {
        case "#dashboard": $("#idDashboard").addClass("active"); break;
        case "#maintenance_q":
            $('#nav_maintenance').collapse('show');
            $("#idMaintenance_q").addClass("active");
            break;
        case "#maintenance_r":
            $('#nav_maintenance').collapse('show');
            $("#idCode").addClass("active");
            break;
        case "#employeeResults":
            $('#nav_results').collapse('show');
            $("#idEmployeeResults").addClass("active");
            break;
        case "#vstrResults": 
            $('#nav_results').collapse('show');
            $("#idVsitor").addClass("active");
            break;
        case "#summaryResults":
            $('#nav_results').collapse('show');
            $("#idSummary").addClass("active");
            break;
        case "#questionaires": $("#idQuestionaires").addClass("active"); break;
    }
});

$(document).ready(function () {
    $("#searchForm").submit(function (e) {

        var searchValue = $("#search").val();
        window.location.href = "/Home/Search?search=" + searchValue;

        return false;
    });
});
