

'use strict';
//var mainUrl = "http://api-dev.liftcommerce.com/";
var mainUrl = "https://api.cloudpayments.com/";
var conf = {
    //DEV
    //apikey: "5dbb36169aa4ad00019f74972a304fa29e124044b9702478b24cd3d1",
    //tenantName: "FUNDZ",
    //urlCardConnect: "https://boltgw.cardconnect.com:6443/cardsecure/api/v1/ccn/tokenize",
    //urlPay: mainUrl +  "fundz-ms/customer/order/paywithcc"

    //PRD
    apikey: "5cc31beb901a2e00017617f8af9a9076ba7541969a5dfb79b17248d1",
    tenantName: "FUNDZ",
    urlCardConnect: "https://boltgw.cardconnect.com/cardsecure/api/v1/ccn/tokenize",
    urlPay: mainUrl +  "fundz-ms/customer/order/paywithcc"
}