function validText(val) {
    if (val.value.length == 0) {
        // val.focus();
        return false;
    }

    return true;
}

function validSelect(val) {
    if (val.value == 0) {
        // val.focus();
        return false;
    }
    return true;
}

function validTextArea(val) {
    if (val.value == 0) {
        // val.focus();
        return false;
    }
    return true;
}