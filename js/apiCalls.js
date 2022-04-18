/**
 * Created by orlando on 10/23/19.
 */

"use strict";
var svaCode;

function sucessFlow(method) {
    if (method === "register") {
        loginAuth(document.getElementById('email').value, document.getElementById('registerPassword').value, "register");
    } else if (method === "createSVA") {
        createSva(document.getElementById('email').value);
    } else if (method === "getMoney") {//
        getMyMoneyContainerLogin("register");
    } else if (method === "registerFundz") {
        registerOnFundz(document.getElementById('email').value);
    }
}

//Step 1
function register(registerJson) {
    document.getElementById('loading').style.visibility = 'visible';
    $.ajax({
        crossDomain: true,
        url: conf.urlRegistration + "?api-key=" + conf.apikey,
        type: "POST",
        data: JSON.stringify(registerJson),
        headers: {
            "content-type": "application/json",
            "tenantName": conf.tenantName,
            "api-key": conf.apikey
        },
        success: function (result) {
            document.getElementById('loading').style.visibility = 'hidden';
            //If something fail Show the message
            if (JSON.stringify(result.contextResponse.statusCode) === '"FAILURE"') {
                document.getElementById('loading').style.visibility = 'hidden';
                Swal.fire({
                    title: 'Error!',
                    text: result.contextResponse.errors[0].errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Close'
                })
            } else {
                svaCode = 840;
                sucessFlow("register")
            }
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


//Step 1


//Step 2
function loginAuth(username, password, method) {

    document.getElementById('loading').style.visibility = 'visible';
    var login = {};
    login.grant_type = "password";
    login.username = username; //.replace('+',"%2B");
    login.password = password;
    $.ajax({
        crossDomain: true,
        url: conf.urlGetToken + "?api-key=" + conf.apikey,
        type: "POST",
        data: login,
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "tenantName": conf.tenantName,
            "api-key": conf.apikey
        },
        success: function (result) {

            if (result.need_change_password) {
                setCookie("refreshToken" + username, JSON.stringify(result.refresh_token).replace(/"/g, ""), 60000);
                setCookie("accessToken" + username, JSON.stringify(result.access_token).replace(/"/g, ""), 40);
                setCookie("username", username, 60000);

                document.getElementById('loading').style.visibility = 'hidden';
                $('#changePassword').modal('show');
                $("#userSigned").val(result.name);


            } else {

                document.getElementById('loading').style.visibility = 'hidden';
                setCookie("refreshToken" + username, JSON.stringify(result.refresh_token).replace(/"/g, ""), 60000);
                setCookie("accessToken" + username, JSON.stringify(result.access_token).replace(/"/g, ""), 40);
                setCookie("username", username, 60000);
                if (method === "login") {
                    window.location.href = "home.html?username=" + username;
                }
            }
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


//step 3
function createSva(userEmail) {
    var newSva = {};
    var attributes = [];
    var key1 = {};
    key1.key = "ACCOUNT_NAME";
    key1.value = "SHAREFUNDS";
    attributes.push(key1);
    newSva.attributes = attributes;
    newSva.containerType = "SVA";
    newSva.currency = "840";
    newSva.default = true;
    var at = getCookie("accessToken" + userEmail);

    $.ajax({
        url: conf.urlCreateSVA + "?api-key=" + conf.apikey,
        type: "POST",
        data: JSON.stringify(newSva),
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + at,
            "tenantName": conf.tenantName,
            "api-key": conf.apikey
        },
        success: function (result) {
            document.getElementById('loading').style.visibility = 'hidden';
            sucessFlow('getMoney');
        },
        error: function (xhr, status, error) {
            window.location.href = "html/main2.html";
        }
    })
}

//step 4
function getMyMoneyContainerLogin(from) {
    var at = getCookie("accessToken" + document.getElementById('email').value);
    var body = {};
    $.ajax({
        url: conf.urlGetMoneyC + "?api-key=" + conf.apikey,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify(body),
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + at,
            "tenantName": conf.tenantName,
            "api-key": conf.apikey
        },
        success: function (result) {
            if (result.contextResponse.statusCode === "SECURITY") {
            } else {
                for (var i = 0; i < result.moneyContainers.length; i++) {
                    if (result.moneyContainers[i].type === "SVA") {
                        if (result.moneyContainers[i].default === true) {
                            //localStorage['sva'+username] = result.moneyContainers[i].containerId;
                            sva = result.moneyContainers[i].containerId;
                        }
                    }
                }
                if (from === "register")
                    sucessFlow("registerFundz");
            }
        },
        error: function (xhr, status, error) {
        }
    })
}

//step 5
function registerOnFundz(userEmail) {
    var at = getCookie("accessToken" + userEmail);
    var newUser = {};
    newUser.name = document.getElementById('fistName').value + " " + document.getElementById('lastName').value;
    newUser.svaId = sva;
    newUser.svaCurrencyCode = svaCode;
    $.ajax({
        url: conf.urlRegisterUserFundz + "?api-key=" + conf.apikey,
        type: "POST",
        data: JSON.stringify(newUser),
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + at,
            "tenantName": conf.tenantName,
            "api-key": conf.apikey
        },
        success: function (result) {
            Swal.fire({
                title: 'Success!',
                text: "User registered.",
                icon: 'success',
                confirmButtonText: 'Close'
            }).then((result) => {
                if (result.value) {
                    window.location.href = "html/main2.html";
                }
            })
        },
        error: function (xhr, status, error) {
            //alert(JSON.stringify(xhr));
            window.location.href = "html/main2.html";
        }
    })

}

// async function logout() {
//     
//     var result = await $.ajax({
//         // crossDomain: true,
//         url: conf.urlLogoutToken + "?api-key=" + conf.apikey,
//         type: "POST",
//         headers: {
//             "Authorization": "Bearer " + getCookie("accessToken" + username),
//             "content-type": "application/x-www-form-urlencoded",
//             "tenantName": conf.tenantName,
//             "api-key": conf.apikey
//         },
//         success: function (result) {
//             document.getElementById('loading').style.visibility = 'hidden';
//         },
//         error: function (xhr, status, error) {
//             document.getElementById('loading').style.visibility = 'hidden';
//
//         }
//     });
//     document.getElementById('loading').style.visibility = 'hidden';
//     return result;
// }

function logout() {
    setCookie("refreshToken" + username, "", 0);
    setCookie("accessToken" + username, "", 0);
    setCookie("username", "", 0);
}

function refreshAccessToken(functionName) {
    var rtoken = {};
    rtoken.grant_type = "refresh_token";
    rtoken.refresh_token = getCookie("refreshToken" + username);
    $.ajax({
        crossDomain: true,
        url: conf.urlGetToken + "?api-key=" + conf.apikey,
        //contentType: "application/json",
        type: "POST",
        data: rtoken,
        headers: {
            "Authorization": "Basic SkFOVVM6c2VjcmV0",
            "content-type": "application/x-www-form-urlencoded",
            "tenantName": conf.tenantName,
            "api-key": conf.apikey
        },
        success: function (result) {
            setCookie("accessToken" + username, JSON.stringify(result.access_token).replace(/"/g, ""), 40);
            // if (functionName === "createEvent")
            //     createNewEvent();
            // else if (functionName === "getBalance")
            //     getBalance();
            // else if (functionName === "getEventDetail")
            //     getEventDetail();
            // else if (functionName === "getPendingInvitationByEvent")
            //     getPendingInvitationByEvent();
            // else if (functionName === "payEvent")
            //     makepay();
            // else if (functionName === "sendMoney")
            //     sendMoney();
            // else if (functionName === "getAllMessages")
            //     getAllMessages();
            // else if (functionName === "getHistory")
            //     getHistory();
            // else if (functionName === "getuserInfo") {
            //     getUserInfo();
            // } else if (functionName === "getEventsPagination") {
            //     getEventsPagination();
            // }
        },
        error: function (xhr, status, error) {
            var error = JSON.stringify(xhr.responseJSON);

        }
    })
}


// function getMoneyContainers(div) {
//     document.getElementById('loading').style.visibility = 'visible';
//     //refreshAccessToken(username);
//     var at = getCookie("accessToken" + username);
//     var xz = {};
//     if (div === "bankAccountsDiv")
//         xz.containerType = "BANK_ACCOUNT";
//     else
//         xz.containerType = "CC";
//     $.ajax({
//         url: conf.urlGetMoneyC + "?api-key=" + conf.apikey,
//         contentType: "application/json",
//         type: "POST",
//         data: JSON.stringify(xz),
//         headers: {
//             "content-type": "application/json",
//             "Authorization": "Bearer " + at,
//             "tenantName": conf.tenantName,
//             "api-key": conf.apikey
//         },
//         success: function (result) {
//             document.getElementById('loading').style.visibility = 'hidden';
//             if (result.contextResponse.statusCode === "SECURITY") {
//                 refreshAccessToken(username);
//             } else {
//                 if (null != result.moneyContainers) {
//                     for (var i = 0; i < result.moneyContainers.length; i++) {
//
//                         if (result.moneyContainers[i].type === "CC") {
//                             var card = '<br><div class="row col-xl-8 col-sm-12 col-md-10" style="background-color: #FFFFFF;color: #000000; border-radius: 8px; margin: auto; margin-top: 20px;">';
//                             if (result.moneyContainers[i].subType === "VISA") {
//                                 card += '<div class="col-2 col-sm-3"><br><br>' + visaLogo + '</div>';
//                             } else if (result.moneyContainers[i].subType === "MASTERCARD") {
//                                 card += '<div class="col-2 col-sm-3"><br><br>' + masterLogo + '</div>';
//                             } else if (result.moneyContainers[i].subType === "AMEX") {
//                                 card += '<div class="col-2 col-sm-3"><br><br>' + amexLogo + '</div>';
//                             }
//                             selectCard("");
//                             var name = "";
//                             var cardNumber = "";
//                             var month = "";
//                             var year = "";
//                             var id = result.moneyContainers[i].containerId;
//
//                             for (var j = 0; j < result.moneyContainers[i].attributesSecureRetrievable.length; j++) {
//                                 if (result.moneyContainers[i].attributesSecureRetrievable[j].key === "CARD_HOLDER_FULL_NAME") {
//                                     name = result.moneyContainers[i].attributesSecureRetrievable[j].value;
//                                 }
//
//                                 if (result.moneyContainers[i].attributesSecureRetrievable[j].key === "EXPIRE_MONTH") {
//                                     month = result.moneyContainers[i].attributesSecureRetrievable[j].value;
//                                 }
//                                 if (result.moneyContainers[i].attributesSecureRetrievable[j].key === "EXPIRE_YEAR") {
//                                     year = result.moneyContainers[i].attributesSecureRetrievable[j].value;
//                                 }
//                             }
//
//                             cardNumber = result.moneyContainers[i].last4AccountDigits;
//
//                             card += '<div class="col-8 col-sm-7"><br><h6><b>' + name + '</b></h6><h6> **' + cardNumber + '</h6>' +
//                                 '<h6>' + month + '/' + year + '</h6><br></div>';
//                             if (div === "creditCardsDiv") {
//
//                                 card += '<div id=' + id + ' class="col-1"><br><br><i class="far fa-trash-alt" onclick="removeMoneyContainers(this.id)" id="' + id + '"></i></div></div>';
//                             } else {
//                                 if (result.moneyContainers[i].default) {
//                                     card += '<div class="form-check col-1" style="margin-top: 30px;"><label class="form-check-label" for="' + id + '">' +
//                                         '<input onclick="selectCard(this.id)" id="' + id + '" type="radio" checked="checked" class="form-check-input" ' +
//                                         'name="optradio"></label></div>';
//                                     selectCard(id);
//                                 } else {
//                                     card += '<div class="form-check col-1" style="margin-top: 30px;"><label class="form-check-label" for="' + id + '">' +
//                                         '<input onclick="selectCard(this.id)" id="' + id + '" type="radio" class="form-check-input" ' +
//                                         'name="optradio"></label></div>';
//                                 }
//                             }
//                             $('#' + div + '').append(card);
//
//                         } else if (result.moneyContainers[i].type === "BANK_ACCOUNT") {
//                             var status = result.moneyContainers[i].status;
//                             if (status === "CONFIRMATION_PENDING") {
//                                 var card = '<br><div class="row col-xl-10 col-sm-10 col-md-10" id="' + result.moneyContainers[i].containerId + '" ' +
//                                     'style="cursor:pointer; background-color: #FFFFFF;color: #000000; border-radius: 8px; margin: auto; margin-top: 20px;" onclick="validateAccount(this.id)">';
//                             } else if (status === "BANK_CONFIRMATION_FAILED") {
//
//                                 var card = '<br><div class="row col-xl-10 col-sm-10 col-md-10" id="' + result.moneyContainers[i].containerId + '" ' +
//                                     'style="cursor:pointer;background-color: #FFFFFF;color: #000000; border-radius: 8px; margin: auto;margin-top: 20px;" onclick="removeBankAccount(this.id)">';
//                             } else {
//                                 var card = '<br><div class="row col-xl-10 col-sm-10 col-md-10" id="' + result.moneyContainers[i].containerId + '" ' +
//                                     'style="cursor:pointer; background-color: #FFFFFF;color: #000000; border-radius: 8px; margin: auto; margin-top: 20px;" onclick="removeBankAccount(this.id)">';
//                             }
//                             card += '<div class="col-2"><br><br><i class="fas fa-university"></i></div>';
//                             selectCard("");
//                             var name = "";
//                             var accountName = "";
//                             var last4 = result.moneyContainers[i].last4AccountDigits;
//                             var subtype = result.moneyContainers[i].subType;
//                             var description = result.moneyContainers[i].description;
//
//                             var id = result.moneyContainers[i].containerId;
//
//                             for (var j = 0; j < result.moneyContainers[i].attributesSecureRetrievable.length; j++) {
//                                 if (result.moneyContainers[i].attributesSecureRetrievable[j].key === "CUSTOMER_FULL_NAME") {
//                                     name = result.moneyContainers[i].attributesSecureRetrievable[j].value;
//                                 }
//                             }
//
//                             for (var j = 0; j < result.moneyContainers[i].attributes.length; j++) {
//                                 if (result.moneyContainers[i].attributes[j].key === "ACCOUNT_NAME") {
//                                     accountName = result.moneyContainers[i].attributes[j].value;
//                                 }
//                             }
//
//                             card += '<div class="col-8">';
//                             card += '<div class="col-12"><h6><b>' + name + '</b></h6></div>';
//                             card += '<div class="col-12"><h6>' + subtype + ' Account:* ' + last4 + '</h6></div>';
//                             card += '<div class="col-12"><h6>' + accountName + ' (' + description + ')</h6></div>';
//                             if (status === "CONFIRMATION_PENDING") {
//                                 card += '<div class="col-12"><h6>Pending Verification</h6></div>';
//                             } else if (status === "BANK_CONFIRMATION_FAILED") {
//                                 card += '<div class="col-12"><h6>Confirmation failed</h6></div>';
//                             } else {
//                                 card += '<div class="col-12"><h6>Verified</h6></div>';
//                             }
//                             card += '</div>';
//                             if (result.moneyContainers[i].default) {
//                                 card += '<div class="form-check col-1" style="margin-top: 30px;"><label class="form-check-label" for="' + id + '">' +
//                                     '<input onclick="selectCard(this.id)" id="' + id + '" type="radio" checked="checked" class="form-check-input" ' +
//                                     'name="optradio"></label></div>';
//                                 selectCard(id);
//                             } else {
//                                 card += '<div class="form-check col-1" style="margin-top: 30px;"><label class="form-check-label" for="' + id + '">' +
//                                     '<input onclick="selectCard(this.id)" id="' + id + '" type="radio" class="form-check-input" ' +
//                                     'name="optradio"></label></div>';
//                             }
//
//
//                             $('#' + div + '').append(card);
//                         }
//                     }
//                 }
//             }
//         },
//         error: function (xhr, status, error) {
//             document.getElementById('loading').style.visibility = 'hidden';
//             Swal.fire({
//                 title: 'Error!',
//                 text: JSON.stringify(xhr),
//                 icon: 'error',
//                 confirmButtonText: 'Close'
//             })
//
//         }
//     })
// }
async function getMoneyContainers(params) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlGetMoneyC + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {

            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        });
        document.getElementById('loading').style.visibility = 'hidden';
        return result;
    }
    document.getElementById('loading').style.visibility = 'hidden';
}

async function addMoneyContainer(params) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);
        // var params = {};
        // params.entityId = globalCompanyId;
        // params.containerType =  "BANK_ACCOUNT";

        var result = await $.ajax({
            url: conf.urlAddCC + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        });
        return result;
    }
}

async function verifyMoneyContainer(params) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);
        // var params = {};
        // params.entityId = globalCompanyId;
        // params.containerType =  "BANK_ACCOUNT";

        var result = await $.ajax({
            url: conf.urlExcTrx + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        });
        return result;
    }
}

async function withdrawToBankMoneyContainer(params) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlExcTrx + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        });
        return result;
    }
}

async function removeMoneyContainer(params) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);
        // var params = {};
        // params.entityId = globalCompanyId;
        // params.containerType =  "BANK_ACCOUNT";

        var result = await $.ajax({
            url: conf.removeMoneyC,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        });
        return result;
    }
}

async function getAccountBalance(params) {

    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlGetBalance + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
                // "push_id": pushId
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
            }
        });
        return result;
    }
}


function getMyMoneyContainer(from) {
    var at = getCookie("accessToken" + username);
    var body = {};
    $.ajax({
        url: conf.urlGetMoneyC + "?api-key=" + conf.apikey,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify(body),
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + at,
            "tenantName": conf.tenantName,
            "api-key": conf.apikey
        },
        success: function (result) {
            if (result.contextResponse.statusCode === "SECURITY") {
            } else {
                for (var i = 0; i < result.moneyContainers.length; i++) {
                    if (result.moneyContainers[i].type === "SVA") {
                        if (result.moneyContainers[i].default === true) {
                            localStorage['sva' + username] = result.moneyContainers[i].containerId;
                            userSva = result.moneyContainers[i].containerId;
                        }
                    }
                }
                if (from === "register")
                    sucessFlow("registerFundz");
            }
        },
        error: function (xhr, status, error) {
        }
    })
}

function selectCard(id) {
    cardselected = id;
}


// function removeMoneyContainers(container) {
//     Swal.fire({
//         title: 'Are you sure?',
//         text: "You won't be able to revert this!",
//         type: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, delete it!'
//     }).then((result) => {
//         if (result.value) {
//             document.getElementById('loading').style.visibility = 'visible';
//             var at = getCookie("accessToken" + username);
//             var xz = {};
//             xz.containerId = parseInt(container);
//             $.ajax({
//                 url: conf.removeMoneyC + "?api-key=" + conf.apikey,
//                 type: "POST",
//                 data: JSON.stringify(xz),
//                 headers: {
//                     "content-type": "application/json",
//                     "Authorization": "Bearer " + at,
//                     "tenantName": conf.tenantName,
//                     "api-key": conf.apikey
//                 },
//                 success: function (result) {
//                     document.getElementById('loading').style.visibility = 'hidden';
//                     loadPage('creditCards.html')
//                 },
//                 error: function (xhr, status, error) {
//                     document.getElementById('loading').style.visibility = 'hidden';
//                     Swal.fire({
//                         title: 'Error!',
//                         text: JSON.stringify(xhr),
//                         icon: 'error',
//                         confirmButtonText: 'Close'
//                     })
//                 }
//             })
//         }
//     })
// }

function getBalance(call) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);
        var xz = {};
        var myVar = localStorage['sva' + username] || 'defaultValue';
        xz.moneyContainerId = parseInt(myVar);
        $.ajax({
            url: conf.urlGetBalance + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(xz),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "push_id": pushId
            },
            success: function (result) {
                if (typeof result.balance === "undefined") {
                    $("#myBalance").text("$0.00");
                    balance = "$0.00";
                    balanceNum = 0;
                } else {
                    var a = parseFloat(result.balance);
                    a = a / 100;
                    //balance = a;
                    $("#myBalance").text("$" + a.toFixed(2));
                    balance = "$" + a;
                    balanceNum = a;
                }
                /*if(call==="callEvents")
                    getEventsPagination();*/

                if (call === "loadbalance")
                    loadPage("addBalance.html");
            },
            error: function (xhr, status, error) {
            }
        })
    }
}

async function getBuddyByEmail(email, method) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);
        var result = await $.ajax({
            url: conf.urlGetBuddyByEmail + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "username": email
            },
            success: function (result) {
                //alert(JSON.stringify(result))
                if (method === "findbuddy") {
                    if (false !== result.registered) {

                        // $("#nameRP").show();
                        $("#nameRP").val(result.name);
                        $("#nameRP").trigger("change");

                    } else {
                        // $("#nameRP").hide();
                        $("#nameRP").val("");
                        if (!$("#buttonSendRP").hasClass("disabled"))
                            $("#buttonSendRP").addClass("disabled");
                    }
                }
                if (method === "login") {
                    if (false !== result.registered) {
                        $("#userSigned").html(result.name);
                        globalUserSigned = result.name;
                    }
                }
            },
            error: function (xhr, status, error) {
                //alert(JSON.stringify(xhr))
            }
        });
        return result;
    }
}


if (!username)
    var username = getCookie("username");

function getUserInfo() {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {

        var at = getCookie("accessToken" + username);
        document.getElementById('loading').style.visibility = 'visible';

        $.ajax({
            crossDomain: true,
            url: conf.urlGetUserInfo + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                //"content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
                // "push_id" : pushId
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
                globalUserSigned = result.user.name;
                globalUserInfo = result;

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
}

async function getUserInfoAsync() {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {

        var at = getCookie("accessToken" + username);
        document.getElementById('loading').style.visibility = 'visible';

        var result = await $.ajax({
            crossDomain: true,
            url: conf.urlGetUserInfo + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                //"content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
                // "push_id" : pushId
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
                globalUserInfo = result;

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
        return result
    }
}

async function getPortalRole() {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getuserInfo");
    } else {

        var at = getCookie("accessToken" + username);
        document.getElementById('loading').style.visibility = 'visible';

        var result = await $.ajax({
            crossDomain: true,
            url: conf.urlGetPortalRole + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                globalUserRole = result;
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
            }
        })
        return result;
    }
}

function getUser() {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getuserInfo");
    } else {

        var at = getCookie("accessToken" + username);
        document.getElementById('loading').style.visibility = 'visible';

        $.ajax({
            crossDomain: true,
            url: conf.urlGetBuddyByEmail + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                //"content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
                // "push_id" : pushId
            },
            success: function (result) {
                userInfoFull = result;
                if (result.user.imgUrl != null) {
                    $("#userImage").attr("src", result.user.imgUrl);
                    $("#userImage2").attr("src", result.user.imgUrl);
                }
                $("#name").text(result.user.firstName + " " + result.user.lastName);
                $("#name2").text(result.user.firstName + " " + result.user.lastName);
                document.getElementById('loading').style.visibility = 'hidden';
                $("#fundzCount").text(result.user.summary.reachedEvents);
                $("#contribCount").text(result.user.summary.pendingInvitation);
                $("#messagesCount").text(result.user.summary.pendingMessages);
                $("#p2pCount").text(result.user.summary.pendingIncomingMoneyRequests);
                $("#profileCount").text(result.user.summary.pendingIncomingMoneyRequests);
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
}

async function requestMoneyActivity(reqStatus, menu, params, beginDate, endDate) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);
        var result = await $.ajax({
            url: conf.urlRequestMoneyActivity + "?api-key=" + conf.apikey,
            type: "GET",
            // data: params,
            headers: {
                "requestStatus": reqStatus,
                "beginDate": beginDate,
                "endDate": endDate,
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "companyId": globalCompanyId,
                "type": "REQUEST_MONEY",
                "pageSize": 40
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        })
        return result;
    }
}

async function requestHistory(reqStatus, menu, params) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlGetHistory + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                // "requestStatus": reqStatus,
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "pageSize": 40
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        })
        return result;
    }
}

async function getHistorySP(uuid, trxType) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlGetHistorySP + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                // "requestStatus": reqStatus,
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "uuid": uuid,
                "trxType": trxType,
                "pageSize": 40
            },
            success: function (result) {

            },
            error: function (xhr, status, error) {
                console.log("entrando a error" + error);
            }
        })
        return result;
    }
}

function sendNotificationToAll(params) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("sendMoney");
    } else {
        var at = getCookie("accessToken" + username);


        $.ajax({
            url: conf.urlSendNotificationToAll + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                userScanned = "";
                // document.getElementById('modalRequestPayment').style.visibility = 'hidden';
                $('#modalSendNotificationsToAll').modal('hide');
                Swal.fire({
                    title: 'Success!',
                    text: "Notification sent to all.",
                    icon: 'success',
                    confirmButtonText: 'Close',
                    confirmButtonColor: globalConfirmButtonColor
                }).then((result) => {
                    if (result.value) {
                        getBalance();
                        // loadPage("home.html")
                    }
                })
            },
            error: function (xhr, status, error) {
                //alert(JSON.stringify(xhr))
            }
        })
    }
}

function requestMoneyMTC(params) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("sendMoney");
    } else {
        var at = getCookie("accessToken" + username);


        $.ajax({
            url: conf.urlRequestMoneyMTC + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                userScanned = "";
                // document.getElementById('modalRequestPayment').style.visibility = 'hidden';
                $('#modalRequestPayment').modal('hide');
                Swal.fire({
                    title: 'Success!',
                    text: "Request Money success.",
                    icon: 'success',
                    confirmButtonText: 'Close',
                    confirmButtonColor: globalConfirmButtonColor
                }).then((result) => {
                    if (result.value) {
                        getBalance();
                        // loadPage("home.html")
                    }
                })
            },
            error: function (xhr, status, error) {
                //alert(JSON.stringify(xhr))
            }
        })
    }
}

async function requestStores() {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("sendMoney");
    } else {
        var at = getCookie("accessToken" + username);
        var xz = {};
        // xz.username = buddyId;
        xz.username = username;

        const result = await $.ajax({
            url: conf.urlRequestStores + "?api-key=" + conf.apikey,
            type: "GET",
            // data: JSON.stringify(xz),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {

                if (result.stores.length === 0) {


                } else {

                    for (let i = 0; i < result.stores.length; i++) {
                        globalHealthCareSystem = result.stores[i].name;
                        globalCompanyId = result.stores[i].companyId;
                        globalCompanyCode = result.stores[i].companyCode;
                        if (result.stores[i].timezone) {
                            globalNameTimeZoneUser = result.stores[i].timezone;
                            // globalNameTimeZoneBrowser = result.stores[i].timezone;
                        }
                        globalHealthCareId = result.stores[i].healthcareId;
                        $("#imgAccountOwner").attr("src", result.stores[i].logoUrl);
                    }
                    $("#healthCareSystem").html(globalHealthCareSystem);
                }
            },
            error: function (xhr, status, error) {
                //alert(JSON.stringify(xhr))
            }
        })
        return result;
    }
}

async function getAsuraUserList(name) {
    var globalDateFormat = "MM/DD/YYYY";
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlGetAsuraUserList + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "healthCareId": globalHealthCareId,
                "name": name,
                "pageSize": 40
            },
            success: function (result) {

            },

            error: function (xhr, status, error) {
                console.log("error getAsuraUserList " + error);
                document.getElementById('loading').style.visibility = 'hidden';
            }
        })
        return result;
    }
}

async function createAppointment(params) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlCreateAppointment + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                // "requestStatus": reqStatus,
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                Swal.fire({
                    title: 'Success!',
                    text: "Appointment created success.",
                    icon: 'success',
                    confirmButtonText: 'Close'
                })
            },
            error: function (xhr, status, error) {
                console.log("entrando a error" + error);
            }
        })
        return result;
        document.getElementById('loading').style.visibility = 'hidden';
    }
}

async function appointmentUpdateStatus(params) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlAppointmentUpdateStatus + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                // "requestStatus": reqStatus,
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                Swal.fire({
                    title: 'Success!',
                    text: "Appointment updated success.",
                    icon: 'success',
                    confirmButtonText: 'Close'
                })
            },
            error: function (xhr, status, error) {
                console.log("entrando a error" + error);
            }
        })
        return result;
        document.getElementById('loading').style.visibility = 'hidden';
    }
}

async function getAllAppointments(companyCode, startDate, endDate, appointmentStatus, email) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);
        var result = await $.ajax({
            url: conf.urlGetAllAppointments + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                // "requestStatus": reqStatus,
                // "lastDate": lastDate,
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "companycode": companyCode,
                "startDate": startDate,
                "endDate": endDate,
                "appointmentStatus": appointmentStatus,
                "username": email,
                "pageSize": 40
            },
            success: function (result) {
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        })

        return result;
    }
}

async function getUserInsuranceList(email) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);
        var result = await $.ajax({
            url: conf.urlGetUserInsuranceList + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "username": email,
                "pageSize": 40
            },
            success: function (result) {
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        })

        return result;
    }
}

async function preregisterMerchantAsura(params) {
    var result = await $.ajax({
        url: conf.urlPreregisterMerchantAsura + "?api-key=" + conf.apikey,
        type: "POST",
        data: JSON.stringify(params),
        headers: {
            "content-type": "application/json",
            "tenantName": conf.tenantName,
            "appName": "asura",
            "api-key": conf.apikey
        },
        success: function (result) {

        },
        error: function (xhr, status, error) {
            console.log("entrando a error" + error);
        }
    });
    // document.getElementById('loading').style.visibility = 'hidden';
    return result;

    // }
}

async function registerMerchantAsura(id) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);


        var result = await $.ajax({
            url: conf.urlRegisterMerchantAsura + "/" + id + "?api-key=" + conf.apikey,
            type: "POST",
            headers: {
                "Authorization": "Bearer " + at,
                "content-type": "application/json",
                "tenantName": conf.tenantName,
                "appName": "asura",
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        });
        return result;
    }
}

async function rejectPreregisterMerchantAsura(idCompany) {

    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlRejectPreregisterMerchantAsura + "/" + idCompany + "?api-key=" + conf.apikey,
            type: "DELETE",
            headers: {
                "Authorization": "Bearer " + at,
                "content-type": "application/json",
                "tenantName": conf.tenantName,
                "appName": "asura",
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        });
        return result;
    }
}

async function getHealthCareProvider() {
    var result = await $.ajax({
        url: conf.urlGetHealthCareProviders + "?api-key=" + conf.apikey,
        type: "GET",
        headers: {
            "content-type": "application/json",
            // "Authorization": "Bearer " + at,
            "tenantName": conf.tenantName,
            "api-key": conf.apikey
            // "username": email,
            // "pageSize": 40
        },
        success: function (result) {
            // document.getElementById('loading').style.visibility = 'hidden';
        },
        error: function (xhr, status, error) {
            // document.getElementById('loading').style.visibility = 'hidden';
            console.log("entrando a error" + error);
        }
    })

    return result;
}

async function registerHealthcareAsura(params) {

    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlRegisterHealthcareAsura + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                "Authorization": "Bearer " + at,
                "content-type": "application/json",
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        });
        return result;
    }
}

async function getCountries() {
    document.getElementById('loading').style.visibility = 'visible';

    var result = await $.ajax({
        crossDomain: true,
        url: conf.urlGetCountries + "?api-key=" + conf.apikey,
        type: "GET",
        headers: {
            "content-type": "application/json",
            // "Authorization": "Bearer " + at,
            "tenantName": conf.tenantName,
            "api-key": conf.apikey
        },
        success: function (result) {
            document.getElementById('loading').style.visibility = 'hidden';
        },
        error: function (xhr, status, error) {
            document.getElementById('loading').style.visibility = 'hidden';
        }
    })
    return result;
    // }
}

async function getTimezonesByCountries(countryCode) {
    document.getElementById('loading').style.visibility = 'visible';

    var result = await $.ajax({
        crossDomain: true,
        url: conf.urlGetTimezonesByCountries + "?api-key=" + conf.apikey,
        type: "GET",
        headers: {
            "content-type": "application/json",
            // "Authorization": "Bearer " + at,
            "tenantName": conf.tenantName,
            "api-key": conf.apikey,
            "countryCode": countryCode
        },
        success: function (result) {
            document.getElementById('loading').style.visibility = 'hidden';
        },
        error: function (xhr, status, error) {
            document.getElementById('loading').style.visibility = 'hidden';
        }
    })
    return result;
    // }
}

async function isCompanyCodeAvailable(companyCode) {

    var result = await $.ajax({
        url: conf.urlIsCompanyCodeAvailable + "?api-key=" + conf.apikey,
        type: "GET",
        headers: {
            "content-type": "application/json",
            "tenantName": conf.tenantName,
            "api-key": conf.apikey,
            "companyCode": companyCode
        },
        success: function (result) {
            document.getElementById('loading').style.visibility = 'hidden';
        },
        error: function (xhr, status, error) {
            document.getElementById('loading').style.visibility = 'hidden';
            console.log("Error isCompanyCodeAvailable" + error);
        }
    })

    return result;
}

async function isEmailInUse(email) {

    var result = await $.ajax({
        url: conf.urlIsEmailInUse + "?api-key=" + conf.apikey,
        type: "GET",
        headers: {
            "content-type": "application/json",
            "tenantName": conf.tenantName,
            "api-key": conf.apikey,
            "username": email
        },
        success: function (result) {
            document.getElementById('loading').style.visibility = 'hidden';
        },
        error: function (xhr, status, error) {
            document.getElementById('loading').style.visibility = 'hidden';
            console.log("Error isEmailInUse" + error);
        }
    })

    return result;
}

async function createEmployee(params) {

    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlCreateEmployee + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                // "requestStatus": reqStatus,
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "TIMEZONE": globalNameTimeZoneBrowser,
                "companyId": globalCompanyId
            },
            success: function (result) {
                Swal.fire({
                    title: 'Success!',
                    text: "Employee created success.",
                    icon: 'success',
                    confirmButtonText: 'Close'
                })
            },
            error: function (xhr, status, error) {
                console.log("entrando a error" + error);
            }
        })
        return result;
        document.getElementById('loading').style.visibility = 'hidden';
    }
}

async function updateEmployee(params, uuid) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            // url: conf.urlUpdateEmployee + "?api-key=" + conf.apikey,
            url: conf.urlUpdateEmployee + "/" + uuid + "?api-key=" + conf.apikey,
            type: "PUT",
            data: JSON.stringify(params),
            headers: {
                // "requestStatus": reqStatus,
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "TIMEZONE": globalNameTimeZoneBrowser,
                "companyId": globalCompanyId,
                "uuid": uuid
            },
            success: function (result) {
                Swal.fire({
                    title: 'Success!',
                    text: "Employee Updated success.",
                    icon: 'success',
                    confirmButtonText: 'Close'
                })
            },
            error: function (xhr, status, error) {
                console.log("entrando a error" + error);
            }
        })
        return result;
        document.getElementById('loading').style.visibility = 'hidden';
    }
}

async function getEmployees(name, setStatusEmployee) {

    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlGetEmployees + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "companyId": globalCompanyId,
                "name": name,
                "setStatus": setStatusEmployee,
                "pageSize": 40
            },
            success: function (result) {

            },

            error: function (xhr, status, error) {
                console.log("error getAsuraUserList " + error);
                document.getElementById('loading').style.visibility = 'hidden';
            }
        })
        return result;
    }
}

async function isUsernameAvailable(email) {

    var result = await $.ajax({
        url: conf.urlIsUsernameAvailable + "?api-key=" + conf.apikey,
        type: "GET",
        headers: {
            "content-type": "application/json",
            "tenantName": conf.tenantName,
            "api-key": conf.apikey,
            "username": email
        },
        success: function (result) {

        },

        error: function (xhr, status, error) {
            console.log("error  " + error);
        }
    })
    return result;
}

async function getAsuraPaymentSummary(status, dateFrom, dateTo) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlGetAsuraPaymentSummary + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "companyCode": globalCompanyCode,
                "status": status,
                "dateFrom": dateFrom,
                "dateTo": dateTo,
                "pageSize": 40
            },
            success: function (result) {

            },

            error: function (xhr, status, error) {
                console.log("error getAsuraPaymentSummary " + error);
                document.getElementById('loading').style.visibility = 'hidden';
            }
        })
        return result;
    }
}

async function getAccountDetail() {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlGetAccountDetail + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "companyId": globalCompanyId,
                "pageSize": 40
            },
            success: function (result) {

            },

            error: function (xhr, status, error) {
                console.log("error getAsuraPaymentSummary " + error);
                document.getElementById('loading').style.visibility = 'hidden';
            }
        })
        return result;
    }
}

async function getRegisterMerchantAsura() {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlGetRegisterMerchantAsura + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                // "requestStatus": reqStatus,
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "companyCode": globalCompanyCode
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        })
        return result;
    }
}

async function requestMoneyReport(reqStatus, menu, params, beginDate, endDate) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);
        var result = await $.ajax({
            url: conf.urlRequestMoneyReport + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "setRequestStatus": reqStatus,
                "beginDate": beginDate,
                "endDate": endDate,
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "companyId": globalCompanyId,
                "type": "REQUEST_MONEY",
                "pageSize": 40
            },
            success: function (result) {
            },
            error: function (xhr, status, error) {
                console.log("entrando a error" + error);
            }
        })
        return result;
    }
}

function getAllMessages() {
    //eventId
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getAllMessages");
    } else {
        var at = getCookie("accessToken" + username);
        $.ajax({
            url: conf.urlGetAllMessages + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                // notificationList = result;
                showAll();
            },
            error: function (xhr, status, error) {
                //alert(JSON.stringify(xhr))
            }
        })
    }
}

async function getAllMessagesPagination(reqStatus, startDate, endDate, email, pageSize) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);
        var result = await $.ajax({
            url: conf.urlGetAllMessagesPagination + "?api-key=" + conf.apikey,
            type: "POST",
            headers: {
                "notificationStatus": reqStatus,
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey,
                "startDate": startDate,
                "endDate": endDate,
                "username": email,
                "companyCode": globalCompanyCode,
                "pageSize": pageSize
            },
            success: function (result) {


            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        })
        return result;
    }
}

function getHistory() {
    //eventId
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getHistory");
    } else {
        var at = getCookie("accessToken" + username);
        $.ajax({
            url: conf.urlHistory + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                // historyList = result;
                showHistory();
            },
            error: function (xhr, status, error) {
            }
        })
    }
}

async function requestChangePassword(params) {

    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlChangePassword + "?api-key=" + conf.apikey,
            type: "PUT",
            data: JSON.stringify(params),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                Swal.fire({
                    title: 'Success!',
                    text: "Password Updated success.",
                    icon: 'success',
                    confirmButtonText: 'Close'
                });
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                var mesagge = "";
                if (JSON.stringify(xhr.responseJSON))
                    if (JSON.stringify(xhr.responseJSON.contextResponse))
                        if (JSON.stringify(xhr.responseJSON.contextResponse.additionalStatusMessage))
                            mesagge = JSON.stringify(xhr.responseJSON.contextResponse.additionalStatusMessage);
                Swal.fire({
                    title: 'Error!',
                    text: JSON.stringify(xhr.responseJSON.contextResponse.additionalStatusMessage),
                    icon: 'error',
                    confirmButtonText: 'Close'
                });
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error" + error);
            }
        })
        return result;
    }
}

async function saveUserImage(formData) {
    var at = getCookie("accessToken" + username);
    document.getElementById('loading').style.visibility = 'visible';

    var result = await $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        crossDomain: true,
        url: conf.urlUpdateUserImage + "?api-key=" + conf.apikey,
        data: formData,
        headers: {
            "Authorization": "Bearer " + at,
            "tenantName": conf.tenantName,
            "api-key": conf.apikey,
            "companyCode": globalCompanyCode
        },
        success: function (result) {

            document.getElementById('loading').style.visibility = 'hidden';
        },
        error: function (xhr, status, error) {
            document.getElementById('loading').style.visibility = 'hidden';
        }
    })
    return result;
}

async function saveClientImage(formData) {
    var at = getCookie("accessToken" + username);
    document.getElementById('loading').style.visibility = 'visible';

    var result = await $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        crossDomain: true,
        url: conf.urlUpdateClientImage + "?api-key=" + conf.apikey,
        data: formData,
        headers: {
            "Authorization": "Bearer " + at,
            "tenantName": conf.tenantName,
            "api-key": conf.apikey,
            "companyCode": globalCompanyCode
        },
        success: function (result) {

            document.getElementById('loading').style.visibility = 'hidden';
        },
        error: function (xhr, status, error) {
            document.getElementById('loading').style.visibility = 'hidden';
        }
    })
    return result;
}


function lockUser(id) {
    Swal.fire({
        title: 'Confirm Block contact',
        text: "Would you like to block the user " + id.substring(3) + "?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            lockUserCall(id.substring(3));
        }
    })
}

function lockUserCall(id) {
    document.getElementById('loading').style.visibility = 'visible';
    var at = getCookie("accessToken" + username);
    $.ajax({
        type: "POST",
        crossDomain: true,
        url: conf.urlAddToBlackList + "?api-key=" + conf.apikey,
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + at,
            "tenantName": conf.tenantName,
            "api-key": conf.apikey,
            "username": id
        },
        success: function (result) {
            document.getElementById('loading').style.visibility = 'hidden';
            getContacts();
            Swal.fire({
                title: 'User blocked!',
                text: "User blocked successfully",
                icon: 'success',
                confirmButtonText: 'Close'
            })
        },
        error: function (xhr, status, error) {
            document.getElementById('loading').style.visibility = 'hidden';
            Swal.fire({
                title: 'Error!',
                text: JSON.stringify(xhr),
                icon: 'error',
                confirmButtonText: 'Close'
            })
        }
    })
}

async function getCompanyDetails() {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);
        var result = await $.ajax({
            url: conf.urlGetCompanyDetails + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("entrando a error getCompanyDetails" + error);
            }
        })
        return result;
    }
}

function unlockUser(id) {
    Swal.fire({
        title: 'Confirm unblock contact',
        text: "Would you like to unblock the user " + id + "?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            unlockUserCall(id);
        }
    })
}

function unlockUserCall(id) {
    document.getElementById('loading').style.visibility = 'visible';
    var at = getCookie("accessToken" + username);
    $.ajax({
        type: "DELETE",
        crossDomain: true,
        url: conf.urlRemoveFromBlackList + "?api-key=" + conf.apikey,
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + at,
            "tenantName": conf.tenantName,
            "api-key": conf.apikey,
            "username": id
        },
        success: function (result) {
            document.getElementById('loading').style.visibility = 'hidden';
            getBlocked();
            Swal.fire({
                title: 'User Unblocked!',
                text: "User unblocked successfully",
                icon: 'success',
                confirmButtonText: 'Close'
            })
        },
        error: function (xhr, status, error) {
            document.getElementById('loading').style.visibility = 'hidden';
            Swal.fire({
                title: 'Error!',
                text: JSON.stringify(xhr),
                icon: 'error',
                confirmButtonText: 'Close'
            })
        }
    })
}

async function getCryptoSettings() {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getHistory");
    } else {
        var at = getCookie("accessToken" + username);
        var result = await $.ajax({
            url: conf.urlGetCryptoSettings + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantNameCrypto,
                "companyCode": globalCompanyCode,
                "entityId": globalCompanyId,
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
            }
        })
        return result;
    }
}

async function updateCryptoSettings(params) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getHistory");
    } else {
        var at = getCookie("accessToken" + username);
        var result = await $.ajax({
            url: conf.urlCreateCryptoSettings + "?api-key=" + conf.apikey,
            type: "POST",
            data: JSON.stringify(params),
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantNameCrypto,
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';

            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
            }
        })
        return result;
    }
}

async function getCryptoCoinList() {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getHistory");
    } else {
        var at = getCookie("accessToken" + username);
        var result = await $.ajax({
            url: conf.urlGetCryptoCoinList + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantNameCrypto,
                "companyCode": globalCompanyCode,
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
            }
        })
        return result;
    }
}

async function updateCampaign(newRewardRatio) {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getBalance");
    } else {
        var at = getCookie("accessToken" + username);

        var result = await $.ajax({
            url: conf.urlUpdateCampaign + "/" + newRewardRatio + "?api-key=" + conf.apikey,
            type: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
                console.log("Getting  error updateCampaign" + error);
            }
        })
        return result;
        document.getElementById('loading').style.visibility = 'hidden';
    }
}

async function getCampaignDetails() {
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getHistory");
    } else {
        var at = getCookie("accessToken" + username);
        var result = await $.ajax({
            url: conf.urlGetCampaignDetails + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
            }
        })
        return result;
    }
}

async function getCryptoPrice() {
    console.log("getCryptoPrice");
    if (!checkCookie("accessToken" + username)) {
        refreshAccessToken("getHistory");
    } else {
        var at = getCookie("accessToken" + username);
        var result = await $.ajax({
            url: conf.urlGetCryptoPrice + "?api-key=" + conf.apikey,
            type: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + at,
                "tenantName": conf.tenantName,
                "api-key": conf.apikey
            },
            success: function (result) {
                document.getElementById('loading').style.visibility = 'hidden';
            },
            error: function (xhr, status, error) {
                document.getElementById('loading').style.visibility = 'hidden';
            }
        })
        return result;
    }
}