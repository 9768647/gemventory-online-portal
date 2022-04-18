/**
 * Created by orlando on 5/30/18.
 */

"use strict";

var minPasswordLength = 8;
var loginX = false;


function registerFull(registerJson) {
    document.getElementById('loading').style.visibility = 'visible';
    $.ajax({
        crossDomain: true,
        url: conf.urlRegistrationFull + "?api-key=" + conf.apikey,
        type: "POST",
        data: JSON.stringify(registerJson),
        headers: {
            "content-type": "application/json",
            "tenantName": conf.tenantName,
            "api-key": conf.apikey
        },
        success: function (result) {
            document.getElementById('loading').style.visibility = 'hidden';
            Swal.fire({
                title: 'Success!',
                text: "User registered.",
                icon: 'success',
                confirmButtonText: 'Close'
            }).then((result) => {
                if (result.value) {

                    $('#validateAccountModal').modal('show');

                }
            })
        },
        error: function (xhr, status, error) {
            document.getElementById('loading').style.visibility = 'hidden';
            Swal.fire({
                title: 'Error!',
                text: JSON.stringify(xhr.responseJSON.additionalStatusMessage),
                icon: 'error',
                confirmButtonText: 'Close'
            })
        }
    })
}

function validateFullAccount() {
    document.getElementById('loading').style.visibility = 'visible';
    var validateFullAcc = {};

    if (validateType === "EMAIL")
        validateFullAcc.username = document.getElementById('emailForValidate').value;
    else {
        if (!validNumberValidate) {
            document.getElementById('loading').style.visibility = 'hidden';
            Swal.fire({
                title: 'Invalid phone number',
                text: "Please verify the format number",
                icon: 'error',
                confirmButtonText: 'Close'
            })
            return;
        } else {
            validateFullAcc.username = validateNumber;
        }
    }

    validateFullAcc.pin = document.getElementById('validatePin').value;

    $.ajax({
        crossDomain: true,
        url: conf.urlValidationRegistrationFull + "?api-key=" + conf.apikey,
        type: "POST",
        data: JSON.stringify(validateFullAcc),
        headers: {
            "content-type": "application/json",
            "tenantName": conf.tenantName,
            "api-key": conf.apikey
        },
        success: function (result) {
            document.getElementById('loading').style.visibility = 'hidden';
            Swal.fire({
                title: 'Success!',
                text: "User Validated please login",
                icon: 'success',
                confirmButtonText: 'Close'
            }).then((result) => {
                if (result.value) {

                    window.location.href = "login.html";

                }
            })
        },
        error: function (xhr, status, error) {
            document.getElementById('loading').style.visibility = 'hidden';
            Swal.fire({
                title: 'Error!',
                text: JSON.stringify(xhr.responseJSON.additionalStatusMessage),
                icon: 'error',
                confirmButtonText: 'Close'
            })
        }
    })

}

function createAccount() {
    document.getElementById("messages").style.display = "none";
    var firstName = document.getElementById('fistName');
    var lastName = document.getElementById('lastName');
    var email = document.getElementById('email');

    if (firstName.value === '') {
        $("#messagesText").text("Please fill the first name.");
        document.getElementById("messages").style.display = "block";
        $('#fistName').focus();
        return;
    } else if (lastName.value === '') {
        $("#messagesText").text("Please fill the last name.");
        document.getElementById("messages").style.display = "block";
        $('#lastName').focus();
        return;
    } else if (email.value === '') {
        $("#messagesText").text("Please fill the email");
        document.getElementById("messages").style.display = "block";
        $('#email').focus();
        return;
    } else if (validateEmail(email.value) === false) {
        $("#messagesText").text("Please fill with a valid email.");
        document.getElementById("messages").style.display = "block";
        return;
    } else if ($("#password_confirmation").val().length < minPasswordLength) {
        $("#messagesText").text("Password is too short. Minimum 8 characters.");
        document.getElementById("messages").style.display = "block";
        return;
    } else if ($("#password_confirmation").val() != $("#registerPassword").val()) {
        $("#messagesText").text("Password and Confirm must be same.");
        document.getElementById("messages").style.display = "block";
        return;
    } else if (document.getElementById("letter").classList.contains("invalid") || document.getElementById("capital").classList.contains("invalid")
        || document.getElementById("number").classList.contains("invalid") || document.getElementById("length").classList.contains("invalid")) {
        $("#messagesText").text("Password does not match the format. Letter + capital + number and 8 characters length.");
        document.getElementById("messages").style.display = "block";
        return;
    } else {
        document.getElementById("messages").style.display = "none";
        var registerJson = {};
        registerJson.firstName = document.getElementById('fistName').value;
        registerJson.lastName = document.getElementById('lastName').value;
        registerJson.password = document.getElementById('registerPassword').value;
        registerJson.userContact = document.getElementById('email').value;
        registerJson.username = document.getElementById('email').value;
        registerJson.contactType = "EMAIL";
        registerJson.pin = "1234";
        registerJson.preferredLanguage = "en";
        registerJson.role = ["CONSUMER"];
        registerJson.timeZoneFormatted = "America/Caracas";
        register(registerJson);
    }
}

function login() {
    //Validate Username/phone
    if (credentialType === "EMAIL") {
        if ($('#inputLoginUsername').val() === '') {
            $('#inputLoginUsername').focus();
            return;
        }
    } else {
        if ($('#phone').val() === '') {
            $('#phone').focus();
            return;
        } else {
            if (!validNumber) {
                Swal.fire({
                    title: 'Invalid phone number',
                    text: "Please verify the format number",
                    icon: 'error',
                    confirmButtonText: 'Close'
                })
                return;
            }
        }
    }
    //validate password
    if ($('#inputLoginPassword').val() === '') {
        $('#inputLoginPassword').focus();
        return;
    } else {
        if (credentialType === "EMAIL") {
            loginAuth(document.getElementById('inputLoginUsername').value, document.getElementById('inputLoginPassword').value, "login");
        } else
            loginAuth(replaceAllCharacters(loginNUmber, " ", "%20"), document.getElementById('inputLoginPassword').value, "login");
    }
}

function replaceAllCharacters(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}


function showRegisterForm() {
    $('.registerBox').fadeIn('fast');
    $('.login-footer').fadeOut('fast', function () {
        $('.register-footer').fadeIn('fast');
    });
    $('.error').removeClass('alert alert-danger').html('');
}

function openRegisterModal() {
    showRegisterForm();
    setTimeout(function () {
        $('#registerModal').modal('show');
    }, 230);

}

function openValidateModal() {
    showModal("validateAccountModal");
}

function loginAjax() {
    /*   Remove this comments when moving to server
     $.post( "/login", function( data ) {
     if(data == 1){
     window.location.replace("/home");
     } else {
     shakeModal();
     }
     });
     */

    /*   Simulate error message from the server   */
    shakeModal();
}

function shakeModal() {
    $('#registerModal .modal-dialog').addClass('shake');
    $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
    $('input[type="password"]').val('');
    setTimeout(function () {
        $('#registerModal .modal-dialog').removeClass('shake');
    }, 1000);
}


function getPolicy() {
    $.ajax({
        crossDomain: true,
        url: conf.urlGetPolicy + "?api-key=" + conf.apikey,
        type: "GET",

        headers: {
            "content-type": "application/json",
            "tenantName": conf.tenantName,
            "api-key": conf.apikey
        },
        success: function (result) {
            $('#policyText').text(result.body);
            $('#policyModal').modal('show');
        },
        error: function (xhr, status, error) {
            document.getElementById('loading').style.visibility = 'hidden';
            Swal.fire({
                title: 'Error!',
                text: JSON.stringify(xhr.responseJSON.additionalStatusMessage),
                icon: 'error',
                confirmButtonText: 'Close'
            })
        }
    })
}

function emailIsValid(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function validResetPassword() {
    if (emailIsValid($("#usernameReset")[0].value)) {
        $("#buttonSendForgotPassword").attr("disabled", false);
        $("#buttonSendForgotPassword").removeClass("disabled");
    } else {
        if (!$("#buttonSendForgotPassword").hasClass("disabled")) {
            $("#buttonSendForgotPassword").attr("disabled", true);
            $("#buttonSendForgotPassword").addClass("disabled");
        }
    }

}


function validPassword() {
    var myInput = document.getElementById("newPassword");
    var letter = document.getElementById("cpLetter");
    var capital = document.getElementById("cpCapital");
    var number = document.getElementById("cpNumber");
    var length = document.getElementById("cpLength");


// When the user clicks on the password field, show the message box
    myInput.onfocus = function () {
        document.getElementById("message3").style.display = "block";
    }

// When the user clicks outside of the password field, hide the message box
    myInput.onblur = function () {
        document.getElementById("message3").style.display = "block";
    }

// When the user starts to type something inside the password field
    myInput.onkeyup = function () {
        // Validate lowercase letters
        var lowerCaseLetters = /[a-z]/g;
        if (myInput.value.match(lowerCaseLetters)) {
            letter.classList.remove("invalid");
            letter.classList.add("valid");
        } else {
            letter.classList.remove("valid");
            letter.classList.add("invalid");
        }

        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if (myInput.value.match(upperCaseLetters)) {
            capital.classList.remove("invalid");
            capital.classList.add("valid");
        } else {
            capital.classList.remove("valid");
            capital.classList.add("invalid");
        }

        // Validate numbers
        var numbers = /[0-9]/g;
        if (myInput.value.match(numbers)) {
            number.classList.remove("invalid");
            number.classList.add("valid");
        } else {
            number.classList.remove("valid");
            number.classList.add("invalid");
        }

        // Validate length
        if (myInput.value.length >= 8) {
            length.classList.remove("invalid");
            length.classList.add("valid");
        } else {
            length.classList.remove("valid");
            length.classList.add("invalid");
        }
    }
}

function validTextChangePassword(value, size) {
    if (value.val().length < size) {
        // val.focus();
        return false;
    }
    return true;
}

function validLengthChangePassword(value, size) {

    if (value.val().length < size) {
        value.focus();
        return false;
    }
    return true;
}

function validInputChangePasswordLogin() {

    if (validTextChangePassword($("#newPassword"), 8))
        if (validTextChangePassword($("#confirmNewPassword"), 8))
            if (validLengthChangePassword($("#newPassword"), 8))
                if (validLengthChangePassword($("#confirmNewPassword"), 8))
                    if ($("#newPassword").val() === $("#confirmNewPassword").val()) {
                        $("#buttonSendChangePasswordLogin").attr("disabled", false);
                        $("#buttonSendChangePasswordLogin").removeClass("disabled");
                    } else {
                        if (!$("#buttonSendChangePasswordLogin").hasClass("disabled")) {
                            $("#buttonSendChangePasswordLogin").attr("disabled", true);
                            $("#buttonSendChangePasswordLogin").addClass("disabled");
                        }
                    }
}

$(document).ready(function () {
    if ($('#usernameReset').length > 0)
        bootstrapValidate('#usernameReset', 'email:Invalid mail format|required:Please fill out this field!');
    if ($('#confirmNewPassword').length > 0)
        bootstrapValidate('#confirmNewPassword', 'matches:#newPassword:Password and confirm should match');
    validPassword();

    $("#usernameReset").on("keyup", function () {
        (validResetPassword());
    });

    $("#divLabelForgotPassword").on("click", function () {
        $("#usernameReset").val("");
    });

    $("#newPassword").on("keyup", function () {
        validInputChangePasswordLogin();
    });

    $("#confirmNewPassword").on("keyup", function () {
        validInputChangePasswordLogin();
    });

    $('#changePassword').on('shown.bs.modal', function (e) {
        $("#newPassword").val("");
        $("#confirmNewPassword").val("");
        if (!$("#buttonSendChangePasswordLogin").hasClass("disabled")) {
            $("#buttonSendChangePasswordLogin").attr("disabled", true);
            $("#buttonSendChangePasswordLogin").addClass("disabled");
        }
    });

    $("body").on('click', '.toggle-password', function () {
        $(this).toggleClass("fa-eye fa-eye-slash");

        var input = $("#inputLoginPassword");

        if (input.attr("type") === "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });
})

