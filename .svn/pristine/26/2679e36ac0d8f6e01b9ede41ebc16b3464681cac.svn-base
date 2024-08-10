$(document).ready(function () {
    (function ($) {
        "use strict";
      

        /*==================================================================
        [ Focus input ]*/
        $('.input100').each(function () {
            $(this).on('blur', function () {
                if ($(this).val().trim() != "") {
                    $(this).addClass('has-val');
                }
                else {
                    $(this).removeClass('has-val');
                }
            })
        })


        /*==================================================================
        [ Validate ]*/
        var input = $('.validate-input .input100');

        $('.validate-form').on('submit', function () {
            var check = true;

            for (var i = 0; i < input.length; i++) {
                if (validate(input[i]) == false) {
                    showValidate(input[i]);
                    check = false;
                }
            }

            return check;
        });


        $('.validate-form .input100').each(function () {
            $(this).focus(function () {
                hideValidate(this);
            });
        });

        function validate(input) {
            if ($(input).attr('type') == 'emp_id' || $(input).attr('name') == 'emp_id') {
                var val = $(input).val();
                
                if (val == "") {
                   return false;
                } else if (val[0] !== "g" || isNaN(val[1])) {
                    return false;
                }
            }
            else {
                if ($(input).val().trim() == '') {
                    return false;
                }
            }
           
        }

        function showValidate(input) {
            var thisAlert = $(input).parent();

            $(thisAlert).addClass('alert-validate');
            console.log("dsad");
        }

        function hideValidate(input) {
            var thisAlert = $(input).parent();

            $(thisAlert).removeClass('alert-validate');
        }

        /*==================================================================
        [ Show pass ]*/
        var showPass = 0;
        $('.btn-show-pass').on('click', function () {
            if (showPass == 0) {
                $(this).next('input').attr('type', 'text');
                $(this).find('i').removeClass('fa fa-lock');
                $(this).find('i').addClass('fa fa-unlock-alt');
                showPass = 1;
            }
            else {
                $(this).next('input').attr('type', 'password');
                $(this).find('i').removeClass('fa fa-unlock-alt');
                $(this).find('i').addClass('fa fa-lock');
                showPass = 0;
                console.log("unlock");
            }
        });

        //$('#btnLogin_ID').click(function () {
        //    var EmployeeID = $("#ID_empID").val();
        //    var Password = $("#ID_password").val();

        //    $.ajax({
        //        type: 'POST',
        //        dataType: 'json',
        //        url: '/Home/UserLogin',
        //        data: { emp_id: EmployeeID, password: Password },
        //        success: function (response) {
        //            event.preventDefault();
        //            if (response.success) {
        //                window.location.href = '/Homepage/Dashboard/';
        //            } else {
        //                $("#msgID").fadeIn(1000);
        //                //validate(input);
        //            }
                  
        //        }
        //    });  

        //});


    })(jQuery);
});