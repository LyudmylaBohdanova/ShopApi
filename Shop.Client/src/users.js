let token = window.localStorage.getItem('shopapitoken');
let userInfo = parseJwt(token);
let userRole = userInfo.role;
let roleAll = [];
let user;
let id;

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

async function getAllUsers() {
    let url = 'http://localhost:5000/api/users';

    let response = await fetch(url, { headers: { 'Authorization': `bearer ${token}` }});
    if (!response.ok){
        $('#infoBlock').removeClass('d-none').text(x.statusText);
    }else{
        $('#infoBlock').addClass('d-none');
        let json = await response.json();
        renderUsersTable(json.data);
    }
}

function createSel(id){
    let checkbox = document.createElement('div');
    let divRow;
    for(let i = 0, c = 0; i < roleAll.length; i++, c++){
        let check = document.createElement('div');
        check.className = "form-check form-check-inline";
        let input = document.createElement('input')
        inpyt.className = 'form-check-input';
        input.type = "checkbox";
        input.id = `cb${role[i].id}`;
        input.value = `${role[i].id}`;
        let label = document.createElement('label');
        label.className = 'form-check-label';
        label.for = `cb${role[i].id}`;
        if(id != null){
            for(let x = 0; x < id.length; x++){
                if(role[i].id == id[x])
                input.checked = true;
            }
        };
        check.appendChild(input);
        check.appendChild(label);
        if(c == 0){
            divRow = document.createElement('div');
        }
        divRow.appendChild(check);
        if(c == 2){
            checkbox.appendChild(divRow);
            c = 0;
        }
    }
    
    return checkbox;
}

function renderUsersTable(usersObj) {

    let tableContent = "";
    for (let user of usersObj) {
        tableContent += `
        <tr>
            <td>${user.id}</td>
            <td class="firstname${user.id}">${user.firstname}</td>
            <td class="lastname${user.id}">${user.lastname}</td>
            <td class="login${user.id}">${user.login}</td>
            <td class="role${user.id}">${user.role}</td>
            <td class="admin">
                <div class="admin">
                    <div data-id=${user.id} class="btnEdit edit${user.id}"
                        data-toggle="modal" data-target="#modalUser">
                        <img src="https://img.icons8.com/office/30/000000/edit.png"/>
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
        id = $(this).data('id');
        user = {
            firstname: $(`.firstname${id}`).text(),
            lastname: $(`.lastname${id}`).text(),
            login: $(`.login${id}`).text(),
            password: '********',
            role: $(`.role${id}`).text()
        }
        form.firstname.value = user.firstname;
        form.lastname.value = user.lastname;
        form.login.value = user.login;
        form.password.value = user.password;
        form.role.value = user.role;
    });

    $('.btnRemove').click(function() {
        id = $(this).data('id');
        let removeUrl = `http://localhost:5000/api/users/${id}`;
        let token = window.localStorage.getItem('shopapitoken');
        fetch(removeUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
        .then(x => getAllUsers());
        id = null;
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
    let data = {
        "firstname": user.firstname,
        "lastname": user.lastname,
        "login": user.login,
        "password": user.password
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(x => {
            getAllUsers();
        });
};

function editUser(id){
    let updateUrl = `http://localhost:5000/api/users/${id}`;

    let data = {
        "firstname": user.firstname,
        "lastname": user.lastname,
        "login": user.login,
        "password": user.password
    };

    fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(x => {
            getAllUsers();
    });
}

$(document).ready(function () {

    getAllUsers();
   
    $('#saveBtn').click(function () {

        user = {
            firstname: form.firstname.value,
            lastname: form.lastname.value,
            login: form.login.value,
            password: form.password.value
        }

        if(id != null){
            editUser(id);
        }else{
            createUser();
        }
        
        user = null;
        id = null;
        form.firstname.value = null;
        form.lastname.value = null;
        form.login.value = null;
        form.password.value = null;
        form.role.value = null;
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

    
});