let token = window.localStorage.getItem('shopapitoken');
let userInfo = parseJwt(token);
let userRole = userInfo.role;

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function getAllUsers() {
    let url = 'http://localhost:5000/api/users';

    //let token = window.localStorage.getItem('shopapitoken');
    fetch(url, {
        headers: {
            'Authorization': `bearer ${token}`
        }})
        .then(x => {
            if (!x.ok) {
                $('#infoBlock')
                    .removeClass('d-none')
                        .text(x.statusText);
            } else {
                $('#infoBlock').addClass('d-none')
                x.json()
                    .then(result => renderUsersTable(result));
            }
        });
}

function renderUsersTable(usersObj) {

    let tableContent = "";
    for (let user of usersObj) {
        tableContent += `
        <tr>
            <td>${user.id}</td>
            <td class="userName">${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.login}</td>
            <td>${user.role}</td>
            <td class="admin">
                <div class="admin">
                <div data-id=${user.id} class="btnEdit edit${user.id}">
                    <img src="https://img.icons8.com/office/30/000000/edit.png"/>
                </div>
                </div>
                <div class="row admin d-none">
                    <div data-id=${user.id} class="col btnCancel cancel${user.id} d-none">
                        <img src="https://img.icons8.com/ultraviolet/32/000000/cancel.png"/>
                    </div>
                    <div data-id=${user.id} class="col btnSave save${user.id} d-none">
                        <img src="https://img.icons8.com/officel/32/000000/ok.png"/>
                    </div>
                </div>
            </td>
            <td class="admin">
                <div class="admin d-none">
                <div data-id=${user.id} class="btnRemove">
                    <img src="https://img.icons8.com/office/32/000000/delete-sign.png"/>
                </div>
                </div>
            </td>
        </tr>
        `;
    }

    let usersTable = `
    <table class="table table-hover">
        <thead class="thead-light">
            <th>Id</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Login</th>
            <th>Role</th>
            <th class="admin">Edit</th>
            <th class="admin">Remove</th>
        </thead>
   
        <tbody>
            ${tableContent}
        </tbody>
    </table>
    `;

    $('#usersTable #tableData').html(usersTable);
    $('#usersTable').removeClass("d-none");

    admin();


    $('.btnEdit').click(function() {
        let elem = $(this).parent().prev();
        let userName = elem.text();
        elem.html(`<input type='text' value=${userName} />`);
    });

    $('.btnRemove').click(function() {
        let id = $(this).data('id');
        let removeUrl = `http://localhost:5000/api/users/${id}`;
        let token = window.localStorage.getItem('shopapitoken');
        fetch(removeUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
        .then(x => getAllUsers());

    });

   

    
}

function admin(){
    if(userRole == 'lexus_driver'){
       $('.admin').removeClass("d-none");
    }else{
       $('.admin').addClass("d-none");
    }
}

function createUser() {

    let url = 'http://localhost:5000/api/users';
    let newUser = {
        "firstname": $('#nameForm').val(),
        "lastname": $('#lastnameForm').val(),
        "login": $('#loginForm').val(),
        "password": $('#passwordForm').val(),
        "role": $('#roleForm').val()
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(x => {
            $('#createUserModal').modal('hide');
            getAllUsers();
        });

};




$(document).ready(function () {
   
    $('#saveChangesBtn').click(function () {
        createUser();
        $('#createUserModal input').val('');
    });

    //#region LogName

    $("#logoutBtn").click(function() {
        window.localStorage.removeItem('shopapitoken');
        $('#userInfo').addClass("d-none");
        $('#categoriesTable').addClass("d-none");
    });



    if (token != null && userInfo.exp * 1000 > Date.now()) {
        $('#userName').removeClass("d-none");
        $("#userName").text(userInfo.unique_name);
        $('#userInfo').removeClass("d-none");
    }else{
        $('#userName').addClass("d-none");
        $('#userInfo').addClass("d-none");
    }

    //#endregion

    getAllUsers();
});