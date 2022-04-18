/**
 * Created by orlando on 6/4/18.
 */

// function hideModal(id) {
//     $("#"+id).modal('hide');
// }
//
// function showModal(id) {
//     $("#"+id).modal('show');
// }
//
// //Load HTML pages on Main container
// function loadPage(url) {
//     //$('#content').load(url);
//     $('#newcontent').load(url);
//
// }
//
// function goLogin() {
//     window.location.href = "../index.html";
// }
//
// function validateEmail(email) {
//     var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(email);
// }
//
// function isNumber(evt) {
//     evt = (evt) ? evt : window.event;
//     var charCode = (evt.which) ? evt.which : evt.keyCode;
//     if (charCode > 31 && (charCode < 48 || charCode > 57)) {
//         return false;
//     }
//     return true;
// }
//
// const monthNames = ["January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
// ];
//
// function removeAmountCharacters(input) {
//     let forbiddenChars = ['$', '.', ',']
//
//     for (let char of forbiddenChars){
//         input = input.split(char).join('');
//     }
//     return input
// }



function removeCurrencyCharacters(input) {
    
    let forbiddenChars = ['$', '.', ','];

    for (let char of forbiddenChars) {
        input = input.split(char).join('');
    }
    return input;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}