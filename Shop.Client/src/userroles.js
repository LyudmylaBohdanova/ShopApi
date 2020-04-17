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

async function getAllUserRoles() {
    let userUrl = 'http://localhost:5000/api/users';
    let roleUrl = 'http://localhost:5000/api/roles';

    let users = await fetch(userUrl, { headers: { 'Authorization': `bearer ${token}` }});
    let roles = await fetch(roleUrl, { headers: { 'Authorization': `bearer ${token}` }});

    let jsonUsers = await users.json();
    let jsonRoles = await roles.json();
    renderUserRolesTable(jsonUsers.data, jsonRoles.data);
}

function renderUserRolesTable(usersObj, rolesObj) {

    let tableContent = "";
    for (let user of usersObj) {
        let listRoles = "";
        for (let role of rolesObj) {
            let checked = user.role.includes(role.name) ? "checked" : "";

            listRoles += `
                <div class="form-check">
                    <label class="form-check-label">
                        <input type="checkbox" onchange="changeRole(${user.id}, ${role.id})" class="form-check-input roleCheck-${user.id}-${role.id}" ${checked} /> 
                            <span>${role.name}</span>
                    </label>
                </div>
            `
        }
        tableContent += `
        <tr>
            <td class="userId">${user.id}</td>
            <td>${user.firstname}</td>
            <td>${user.login}</td>
            <td>${listRoles}</td>
        </tr>
        `;
    }

    let usersTable = `
    <table class="table table-hover">
        <thead class="thead-light">
            <th>Id</th>
            <th>Name</th>
            <th>Login</th>
            <th>Roles</th>
        </thead>
        <tbody>
            ${tableContent}
        </tbody>
    </table>
    `;

    $('#userRolesTable #tableData').html(usersTable);
    $('#userRolesTable').removeClass("d-none");
}

function changeRole(userId, roleId){
    let url = `http://localhost:5000/api/userroles`;

    let data = {
        "userid": userId,
        "roleid": roleId
    };

    let elem = $(`.roleCheck-${userId}-${roleId}`);
    if(elem.is(':checked')){
        fetch(url, {
        method: 'POST',
        headers:{
            'Authorization': `bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(x => getAllUserRoles()
        );
    }else{
        fetch(url, {
        method: 'DELETE',
        headers:{
            'Authorization': `bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(x => getAllUserRoles()
        );
    }
}

$(document).ready(function () {

    getAllUserRoles();

    $("#logoutBtn").click(function() {
        window.localStorage.removeItem('shopapitoken');
        $('#userInfo').addClass("d-none");
        $('#goodsTable').addClass("d-none");
    });

    if (token != null && userInfo.exp * 1000 > Date.now()) {
        $('#userName').removeClass("d-none");
        $("#userName").text(userInfo.unique_name);
        $('#userInfo').removeClass("d-none");
    }else{
        $('#userName').addClass("d-none");
        $('#userInfo').addClass("d-none");
    }
});