// let token = window.localStorage.getItem('shopapitoken');
// let userInfo = parseJwt(token);
// let userRole = userInfo.role;

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

$(document).ready(function () {

    $('#loginBtn').click(function () {
        let loginUrl = 'http://localhost:5000/api/auth/authenticate';

        let login = $('#loginForm').val();
        let password = $('#passwordForm').val();

        let credentials = {
            "login": login,
            "password": password
        }

        fetch(loginUrl, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(x => {
                if (!x.ok) {
                    x.text()
                        .then(res => {
                            $('#infoBlock')
                                .removeClass('d-none')
                                .addClass('alert-danger')
                                .text(JSON.parse(res).message);
                        });
                } else {
                    x.json().then(result => {
                        let userInfo = parseJwt(result.data.token);
                        console.log(userInfo);
                        window.localStorage.setItem('shopapitoken', result.data.token);
                        $('#infoBlock')
                        .removeClass('d-none')
                        .addClass('alert-success')
                        .text(`Welcome, ${userInfo.unique_name}!`);
                    });
                }
            });
    });

    let token = window.localStorage.getItem('shopapitoken');

    let userInfo = parseJwt(token);

    if (token != null && userInfo.exp * 1000 > Date.now()) {
        $('#userName').removeClass("d-none");
        $("#userName").text(userInfo.unique_name);
        $('#userInfo').removeClass("d-none");
    }else{
        $('#userName').addClass("d-none");
        $('#userInfo').addClass("d-none");
    }
});

