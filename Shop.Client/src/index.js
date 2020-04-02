let token = window.localStorage.getItem('shopapitoken');

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

$(document).ready(function () {
   
    alert('11');
    
    $("#logoutBtn").click(function() {
        window.localStorage.removeItem('shopapitoken');
        $('#userInfo').addClass("d-none");
        $('#categoriesTable').addClass("d-none");
    });

    let userInfo = parseJwt(token);
    
    alert(userInfo.exp);


    if (token != null && userInfo.exp > Date.now) {
        $('#userName').removeClass("d-none");
        $("#userName").text(userInfo.unique_name);
        $('#userInfo').removeClass("d-none");
    }else{
        $('#userName').addClass("d-none");
        $('#userInfo').addClass("d-none");
    }

    //getAllCategories();
});