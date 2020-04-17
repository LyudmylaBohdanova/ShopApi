let token = window.localStorage.getItem('shopapitoken');
let userInfo = parseJwt(token);
let userRole = userInfo.role;
let roleName;
let id;

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

async function getAllRoles() {
    let roleUrl = 'http://localhost:5000/api/roles';

    let response = await fetch(roleUrl, { headers: { 'Authorization': `bearer ${token}` }});
    if (!response.ok){
        $('#infoBlock').removeClass('d-none').text(x.statusText);
    }else{
        $('#infoBlock').addClass('d-none');
        let json = await response.json();
        renderRolesTable(json.data);
    }
}

function renderRolesTable(rolesObj) {

    let tableContent = "";
    for (let role of rolesObj) {
        tableContent += `
        <tr>
            <td>${role.id}</td>
            <td class="roleName name${role.id}">${role.name}</td>
            <td class="admin">
                <div data-id=${role.id} class="btnEdit edit${role.id}"
                    data-toggle="modal" data-target="#modalRole">
                    <img src="https://img.icons8.com/office/30/000000/edit.png"/>
                </div>
            </td>
            <td class="admin">
                <div data-id=${role.id} class="btnRemove">
                    <img src="https://img.icons8.com/office/30/000000/delete-sign.png"/>
                </div>
            </td>
        </tr>
        `;
    }

    let rolesTable = `
    <table class="table table-hover">
        <thead class="thead-light">
            <th>Id</th>
            <th>Name</th>
            <th class="admin">Edit</th>
            <th class="admin">Remove</th>
        </thead>
   
        <tbody>
            ${tableContent}
        </tbody>
    </table>
    `;

    $('#rolesTable #tableData').html(rolesTable);
    $('#rolesTable').removeClass("d-none");

    admin();

    $('.btnEdit').click(function() {
         id = $(this).data('id');
         let elemRole = $(`.name${id}`);
         roleName = elemRole.text();
         form.roleName.value = roleName;
     });

    $('.btnRemove').click(function() {
        id = $(this).data('id');
        let removeUrl = `http://localhost:5000/api/roles/${id}`;
        fetch(removeUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
        .then(x => getAllRoles());
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

function createRole(){
    let createUrl = 'http://localhost:5000/api/roles';

    let data = {
        "name" : roleName
    };

    fetch(createUrl, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(x => x.json())    
            .then(result => getAllRoles()
    );
}

function editRole(id){
    let updateUrl = `http://localhost:5000/api/roles/${id}`;

    let data = {
        "name" : roleName
    };

    fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(x => getAllRoles()
    );
}

$(document).ready(function () {

    getAllRoles();

    $('#saveBtn').on('click',function() {
        
        roleName = form.roleName.value;

        if(id != null){
            editRole(id);
        }else{
            createRole();
        }
        
        roleName = null;
        id = null;
        form.roleName.value = null;
    });

    $("#cancel").on('click', function() {
        roleName = null;
        id = null;
        form.roleName.value = null;
    });

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