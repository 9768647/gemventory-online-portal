var username; // global username
var cardselected = ""; //id of selected credit card
var userSva;
var balance; //Variable to store the balance
var balanceNum;
var eventId; //Event Selected for details
var currentEvent;
var eventContribType;
var messageObject; //object of the selected message
var userInfoFull;
var userScanned; //USED TO QR CODE
var userSigned; //user signed
var globalCompanyId; //companyId
var globalCompanyCode; //company code
var globalHealthCareSystem; //user signed
var globalHealthCareId; //user signed
var globalUserSigned; //user signed

var reportrangeMain;
var reportrangePD;

var globalUserInfo;
var globalUserRole;
var globalResultSetTableIP;
var globalResultSetTableIP_PD;
var globalResultSetTableN;
var globalResultSetTableClient;
var globalResultSetTablePR_PD;
var globalResultSetTableNH;
var globalResultSetTableSend;
var globalResultSetTableApt;
var globalResultSetTableAptComing;
var globalResultSetTableReceived;
var globalResultSettablePH;
var globalResultSetTableDashboard;
var globalResultSetTableEmployees;
var globalAccountDetail;
var globalDataPaymentConfiguration;
var globalResultSetTableCompany;
var globalResultSetTableWithdraw;
var globalResultSetTableBalance;
var globalResultSetCryptoSettings;
var globalResultSettableHealthcare;

var globalDateFormat = "MM/DD/YYYY";
var globalTimeFormat = "hh:mm A";

var dataTableClient = [];

var arrayTableClient = [[]];
var arrayTableEmployees = [[]];
var selTableClient = [];

var selTableBalance = [];
var arrayTableBalance = [[]];

var globalConfirmButtonColor = "#001AE3"

var globalFindClient;
var globalMessageNoDataTable = "No data exists for selection criteria.";
var globalResultStore = undefined;
var globalNameTimeZoneBrowser;
var globalNameTimeZoneUser;
var globalDiffTimeZone;

var globalLoadAdmin = true;
var availableBalanceCoins = [0, 0.389, 1.73, 12394.33, 324.26];
var currentValue = [];

// loadPage("main.html");


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

function validInputChangePassword() {

    if (validTextChangePassword($("#cpOldPassword"), 8))
        if (validTextChangePassword($("#cpNewPassword"), 8))
            if (validTextChangePassword($("#cpConfirmNewPassword"), 8))
                if (validLengthChangePassword($("#cpOldPassword"), 8))
                    if (validLengthChangePassword($("#cpNewPassword"), 8))
                        if (validLengthChangePassword($("#cpConfirmNewPassword"), 8))
                            if ($("#cpNewPassword").val() === $("#cpConfirmNewPassword").val()) {
                                $("#buttonSendChangePassword").attr("disabled", false);
                                $("#buttonSendChangePassword").removeClass("disabled");
                            } else {
                                if (!$("#buttonSendChangePassword").hasClass("disabled")) {
                                    $("#buttonSendChangePassword").attr("disabled", true);
                                    $("#buttonSendChangePassword").addClass("disabled");
                                }
                            }
}

function getUsername() {
    // getBuddyByEmail(getCookie("username"), "login");

    document.getElementById('loading').style.visibility = 'hidden';
    getPortalRole().then(function (resultRole) {
        document.getElementById('loading').style.visibility = 'hidden';
        if (resultRole === undefined)
            window.location.href = "login.html";
        globalUserRole = resultRole;
        console.log(globalUserRole);


        $('#menuHome').on("click", function () {
            $('li.active.nav-item').removeClass('active');
            $(this).addClass('active');

            loadPage("main.html");
        });


        $('#menuLogout').on("click", function () {
            $('li.active.nav-item').removeClass('active');
            $(this).addClass('active');

            logout();

            document.getElementById("navMainMenu").style.display = "none";

            loadPage("index.html");
        });

        if (globalUserRole === "TENANT_ADMIN") {
            $('#menuHealthcare').removeAttr("hidden");

            $('li.active.nav-item').removeClass('active');
            $("#menuHealthcare").addClass('active');
            $("#menuHealthcare").trigger("click");
        }

        if (globalUserRole === "HEALTHCARE_ADMIN") {
            $('#menuCompany').removeAttr("hidden");
            $("#menuCompany").addClass('active');
            $("#menuCompany").trigger("click");

        }
        if (globalUserRole === "MERCHANT") {
            $('#menuHome').removeAttr("hidden");
            $('#menuPaymentDashboard').removeAttr("hidden");
            $('#menuClient').removeAttr("hidden");
            $('#menuOffers').removeAttr("hidden");
            $('#menuNotification').removeAttr("hidden");
            $('#menuAppointment').removeAttr("hidden");
            $('#menuQR').removeAttr("hidden");
            $('#menuAdmin').removeAttr("hidden");
            loadPage("main.html");
            getUserInfo();
        }
        if (globalUserRole === "CLERK") {
            $('#menuHome').removeAttr("hidden");
            $('#menuPaymentDashboard').removeAttr("hidden");
            $('#menuClient').removeAttr("hidden");
            $('#menuOffers').removeAttr("hidden");
            $('#menuNotification').removeAttr("hidden");
            $('#menuAppointment').removeAttr("hidden");
            $('#menuQR').removeAttr("hidden");
            loadPage("main.html");
            getUserInfo();
        }


        // if (globalUserRole !== "TENANT_ADMIN" && globalUserRole !== "HEALTHCARE_ADMIN") {
        //     getBuddyByEmail(getCookie("username"), "login").then(function (result) {
        //
        //         getUserInfo().then(function (result) {
        //             globalUserInfo = result;
        //
        //         });
        //     });
        // }

    });


}

function loadPage(url) {

    $('#mainContainer').load(url);
}


function validPassword() {
    var myInput = document.getElementById("cpNewPassword");
    var letter = document.getElementById("cpLetter");
    var capital = document.getElementById("cpCapital");
    var number = document.getElementById("cpNumber");
    var length = document.getElementById("cpLength");


// When the user clicks on the password field, show the message box
    myInput.onfocus = function () {
        document.getElementById("message").style.display = "block";
    }

// When the user clicks outside of the password field, hide the message box
    myInput.onblur = function () {
        document.getElementById("message").style.display = "block";
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

function getTimeZoneOffset(date, timeZone) {

    // Abuse the Intl API to get a local ISO 8601 string for a given time zone.
    let iso = date.toLocaleString('en-CA', {timeZone, hour12: false}).replace(', ', 'T');

    // Include the milliseconds from the original timestamp
    iso += '.' + date.getMilliseconds().toString().padStart(3, '0');

    // Lie to the Date object constructor that it's a UTC time.
    const lie = new Date(iso + 'Z');

    // Return the difference in timestamps, as minutes
    // Positive values are West of GMT, opposite of ISO 8601
    // this matches the output of `Date.getTimeZoneOffset`
    return -(lie - date) / 60 / 1000;
}

var timeout;
document.onmousemove = function () {

    clearTimeout(timeout);
    sessionCounter();
}

function sessionCounter() {

    timeout = setTimeout(function () {
        if (getCookie("username")) {
            Swal.fire({
                title: 'Session Close!',
                html: 'No activity has been detected, your session will close in ' + conf.displayTimer + ' seconds',
                timer: conf.displayTimer * 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    const b = Swal.getHtmlContainer().querySelector('b')

                },
            }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {

                    $('#menuLogout').trigger("click");
                    console.log('I was closed by the timer')
                }
            })
        }
    }, conf.sessionTimer * 1000);// milliseconds to close session
}

$(document).ready(function () {
    bootstrapValidate('#cpOldPassword', 'required:Please fill out this field!|min:8:Enter at least 8 Characters');
    bootstrapValidate('#cpConfirmNewPassword', 'matches:#cpNewPassword:Password and confirm should match');

    // globalNameTimeZoneBrowser = "Asia/Taipei";
    globalNameTimeZoneBrowser = Intl.DateTimeFormat().resolvedOptions().timeZone;
    globalNameTimeZoneUser = Intl.DateTimeFormat().resolvedOptions().timeZone;
    globalDiffTimeZone = 0;

    getUsername();
    validPassword();
    $("#changePassword").on("click", function () {
        $("#cpOldPassword").val("");
        $("#cpNewPassword").val("");
        $("#cpConfirmNewPassword").val("");
        $("#modalChangePassword").modal("show");
    });

    $("#cpOldPassword").on("keyup", function () {
        validInputChangePassword();
    });

    $("#cpNewPassword").on("keyup", function () {
        validInputChangePassword();
    });

    $("#cpConfirmNewPassword").on("keyup", function () {
        validInputChangePassword();
    });

    $("#buttonSendChangePassword").on("click", function () {
        document.getElementById('loading').style.visibility = 'visible';
        var params = {
            currentPassword: $("#cpOldPassword").val(),
            newPassword: $("#cpNewPassword").val()
        }
        requestChangePassword(params).then(function (result) {

        });
        $("#modalChangePassword").modal("hide");
    });

    $("body").on('click', '.toggle-password', function () {
        $(this).toggleClass("fa-eye fa-eye-slash");

        var inputOld = $("#cpOldPassword");

        if (inputOld.attr("type") === "password") {
            inputOld.attr("type", "text");
        } else {
            inputOld.attr("type", "password");
        }
    });

    $("body").on('click', '.toggle-password2', function () {
        $(this).toggleClass("fa-eye fa-eye-slash");

        var inputNew = $("#cpNewPassword");

        if (inputNew.attr("type") === "password") {
            inputNew.attr("type", "text");
        } else {
            inputNew.attr("type", "password");
        }
    });

    $("body").on('click', '.toggle-password3', function () {
        $(this).toggleClass("fa-eye fa-eye-slash");

        var inputConfirm = $("#cpConfirmNewPassword");

        if (inputConfirm.attr("type") === "password") {
            inputConfirm.attr("type", "text");
        } else {
            inputConfirm.attr("type", "password");
        }
    });
});


/*function getToken(account, expiry, cvvT) {
let tokenize = {};

tokenize.account = account;
tokenize.expiry = expiry;
tokenize.cvv = cvvT;

$.ajax({
crossDomain: true,
url: conf.urlCardConnect + "?api-key=" + conf.apikey,
type: "POST",
data: JSON.stringify(tokenize),
headers: {
"content-type": "application/json"
},
success: function (result) {
cardToken = result.token;
loadPage("review.html");
},
error: function (xhr, status, error) {
// document.getElementById('loading').style.visibility = 'hidden';
Swal.fire({
title: 'Error processing the credit card!',
text: "We have some issues validating your card, please validate that all the information are correct and try again.",
icon: 'error',
confirmButtonText: 'Close'
}) //alert(JSON.stringify(xhr.responseJSON));
}
})
}*/


