/**
 * Created by orlando on 6/13/18.
 */


'use strict';

var mainUrl = "http://api-dev.liftcommerce.com/"; //DEV
// var mainUrl = "https://api.cloudpayments-staging.com/";//Stage


// var mainUrl = "http://localhost:8086/";

var conf = {
    //UAT
    urlGetToken: mainUrl + "auth/oauth/token",
    urlLogoutToken: mainUrl + "fundz-ms/user/logout",
    urlGetUserInfo: mainUrl + "fundz-ms/user/getMyUserInfo",
    urlCreateSVA: mainUrl + "payment/api/v1/services/createAccount",
    urlAddCC: mainUrl + "payment/api/v1/services/addMoneyContainer",
    urlExcTrx: mainUrl + "payment/api/v1/services/executeTrx",
    urlGetMoneyC: mainUrl + "payment/api/v1/services/getMoneyContainers",
    removeMoneyC: mainUrl + "payment/api/v1/services/removeMoneyContainer",
    urlGetBalance: mainUrl + "payment/api/v1/services/getAccountBalance",
    urlRegistration: mainUrl + "registration/user/selfregister",

    apikey: "5dbb36169aa4ad00019f74972a304fa29e124044b9702478b24cd3d1", //DEV
    tenantName: "FUNDZ", //DEV
    // apikey: "613a606b20808900019edcd6e0d540ed0f9243e89a7393fd0b46ae92",//Stage
    // tenantName: "ASURA",//Stage

    tenantNameCrypto: "CRYPTO",

    sessionTimer: 3600,  //seconds to close session
    displayTimer: 60,//seconds to show message close session


    urlRegistrationFull: mainUrl + "fundz-ms/userFull",
    urlValidationRegistrationFull: mainUrl + "fundz-ms/user/validatePin",
    urlGetEventsPagination: mainUrl + "fundz-ms/events/list/pagination",
    urlGetContributingPagination: mainUrl + "fundz-ms/events/contributed/pagination",
    urlCreateEvent: mainUrl + "fundz-ms/event",
    urlGetEvents: mainUrl + "fundz-ms/events/all",
    urlGetOpenEvents: mainUrl + "fundz-ms/events/open",
    urlGetReachedEvents: mainUrl + "fundz-ms/events/reached",
    urlGetClosedEvents: mainUrl + "fundz-ms/events/closed",
    urlGetFailedEvents: mainUrl + "fundz-ms/events/failed",
    urlGetDeletedEvents: mainUrl + "fundz-ms/events/deleted",
    urlGetContributedEvents: mainUrl + "fundz-ms/events/contributed",
    urlGetContributorEvents: mainUrl + "fundz-ms/event/contributor/",
    urlWithdraw: mainUrl + "fundz-ms/event/withdraw/",
    urlGetContributorHistory: mainUrl + "fundz-ms/event/payment/history/",
    urlGetTerms: mainUrl + "fundz-ms/termsOfService",
    urlGetPolicy: mainUrl + "fundz-ms/privacyPolicy",

    urlGetAllMessages: mainUrl + "fundz-ms/notification",
    // urlGetAllMessagesPagination: mainUrl + "fundz-ms/notification/pagination",
    urlGetAllMessagesPagination: mainUrl + "fundz-ms/asura/notification/pagination",
    urlCreateAppointment: mainUrl + "fundz-ms/asura/appointment/createAppointment",
    urlAppointmentUpdateStatus: mainUrl + "fundz-ms/asura/appointment/updateStatus",
    urlGetAllAppointments: mainUrl + "fundz-ms/asura/appointment/getAllAppointments",
    urlGetUserInsuranceList: mainUrl + "fundz-ms/asura/portal/getUserInsuranceList",
    urlPreregisterMerchantAsura: mainUrl + "fundz-ms/asura/merchant/preRegisterMerchant",
    urlRegisterMerchantAsura: mainUrl + "fundz-ms/asura/merchant/registerMerchant",
    urlGetRegisterMerchantAsura: mainUrl + "fundz-ms/asura/merchant/getRegisterMerchantAsura",
    urlRejectPreregisterMerchantAsura: mainUrl + "fundz-ms/asura/merchant/removePreregisterMerchant",
    urlRegisterHealthcareAsura: mainUrl + "fundz-ms/asura/healthCare/registerHealthCare",
    urlGetHealthCareProviders: mainUrl + "fundz-ms/asura/merchant/getHealthCareProviders",
    urlIsCompanyCodeAvailable: mainUrl + "fundz-ms/asura/merchant/isCompanyCodeAvailable",
    urlIsEmailInUse: mainUrl + "fundz-ms/user/isUsernameAlreadyTake",
    urlGetAsuraPaymentSummary: mainUrl + "fundz-ms/asura/paymentSummary",
    urlGetAccountDetail: mainUrl + "fundz-ms/asura/merchant/getAccountDetail",
    urlGetPortalRole: mainUrl + "fundz-ms/asura/getPortalRole",
    urlGetCountries: mainUrl + "fundz-ms/user/getCountries",
    urlGetTimezonesByCountries: mainUrl + "fundz-ms/user/getTimezonesByCountry",
    urlGetCompanyDetails: mainUrl + "fundz-ms/asura/merchant/getCompanyDetail",

    urlRequestMoneyReport: mainUrl + "fundz-ms/asura/merchant/getRequestMoneyReport",

    //Crypto
    urlGetCryptoSettings: mainUrl + "crypto-ms/getCryptoSettings",
    urlCreateCryptoSettings: mainUrl + "crypto-ms/createCryptoSettings",
    urlGetCryptoCoinList: mainUrl + "crypto-ms/getCoinsList",
    urlGetCryptoPrice: mainUrl + "crypto-ms/getCryptoPrice",

    // Campaign
    urlUpdateCampaign: mainUrl + "fundz-ms/loyalty/updateRatioCampaign",
    urlGetCampaignDetails: mainUrl + "fundz-ms/loyalty/getCampaignDetails",

    ///pagination
    urlDeleteMessage: mainUrl + "fundz-ms/notification/",

    urlContributorEvents: mainUrl + "fundz-ms/event",

    urlHistory: mainUrl + "fundz-ms/history",

    urlGetBuddyByEmail: mainUrl + "fundz-ms/user/getUser",
    urlGetBuddies: mainUrl + "fundz-ms/user/getBuddies",
    urlGetBlackList: mainUrl + "fundz-ms/user/getBlackList",
    urlSendMoney: mainUrl + "fundz-ms/user/sendMoney",
    urlRequestMoney: mainUrl + "fundz-ms/request/requestMoney",
    urlCreateEmployee: mainUrl + "fundz-ms/merchant/createEmployee",
    urlUpdateEmployee: mainUrl + "fundz-ms/asura/merchant/updateEmployee",
    urlGetEmployees: mainUrl + "fundz-ms/merchant/getEmployees",
    urlIsUsernameAvailable: mainUrl + "fundz-ms/user/isUsernameAlreadyTake",

    urlRequestMoneyActivity: mainUrl + "fundz-ms/merchant/getRequestMoneyActivityNew",
    urlRequestMoneyMTC: mainUrl + "fundz-ms/merchant/requestMoneyMTC",
    urlRequestStores: mainUrl + "fundz-ms/merchant/getStores",
    urlGetHistory: mainUrl + "fundz-ms/merchant/getHistory",
    urlGetHistorySP: mainUrl + "fundz-ms/historySP",

    urlGetAsuraUserList: mainUrl + "fundz-ms/asura/user/getUserList",
    urlSendNotificationToAll: mainUrl + "fundz-ms/asura/notification/sendNotificationToAll",


    urlRequestMoneyDetail: mainUrl + "fundz-ms/request/",
    urlRequestMoneyUpdateStatus: mainUrl + "fundz-ms/request/updateStatus",

    urlUpdateUserImage: mainUrl + "fundz-ms/merchant/storePicture",
    urlUpdateClientImage: mainUrl + "fundz-ms/user/setMyPicture",
    urlUpdateUserPhone: mainUrl + "fundz-ms/user/setPhone",
    urlUpdateUserEmail: mainUrl + "fundz-ms/user/setEmail",
    urlValidateUserPhone: mainUrl + "fundz-ms/user/validatePhone",
    urlValidateUserEmail: mainUrl + "fundz-ms/user/validateEmail",
    urlUpdateUserAddress: mainUrl + "fundz-ms/user/addAddress",
    urlRemoveFromBlackList: mainUrl + "fundz-ms/user/removeFromBlackList",
    urlAddToBlackList: mainUrl + "fundz-ms/user/addToBlackList",
    urlRemoveBuddie: mainUrl + "fundz-ms/user/removeBuddie",
    urlAddBuddie: mainUrl + "fundz-ms/user/addBuddie",


    urlResetPassword: mainUrl + "auth/api/reset/password",
    urlChangePassword: mainUrl + "auth/api/myinfo/changePassword",


    urlRegisterUserFundz: mainUrl + "fundz-ms/user",

}



