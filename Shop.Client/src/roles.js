let token = window.localStorage.getItem('shopapitoken');
let userInfo = parseJwt(token);
let userRole = userInfo.role;
let usersAll = [];
let roleName;

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function getAllRoles() {
    // let userUrl = `http://localhost:5000/api/users`;

    // fetch(userUrl, {
    //     headers: {
    //         'Authorization': `bearer ${token}`
    //     }})
    //     .then(x => {
    //         if (!x.ok) {
    //             $('#infoBlock')
    //                 .removeClass('d-none')
    //                     .text(x.statusText);
    //         } else {
    //             $('#infoBlock').addClass('d-none')
    //             x.json().then(result => getUser(result));
    //         }
    //     });

    let roleUrl = 'http://localhost:5000/api/roles';
    
    fetch(roleUrl, {
        headers: {
            'Authorization': `bearer ${token}`
        }})
        .then(x => {
            if (!x.ok) {
                $('#infoBlock')
                    .removeClass('d-none')
                        .text(x.statusText);
            } else {
                $('#infoBlock').addClass('d-none');
                x.json().then(result => renderRolesTable(result));
            }
    });
}

// function getUser(users){
    
//     for(user of users){
//         userAll.push(user);
//     }
// }

// function createSel(){
//     let self = document.createElement('select');
//     self.id = "sel";
//     for(let i = 0; i < categoryAll.length; i++){
//         let opt = document.createElement("option");
//         opt.value = categoryAll[i].id;
//         opt.innerHTML = categoryAll[i].name;
//         self.appendChild(opt);
//     }
//     return self;
// }

function renderRolesTable(rolesObj) {

    let tableContent = "";
    for (let role of rolesObj) {
        tableContent += `
        <tr>
            <td>${role.id}</td>
            <td class="goodName name${role.id}">${role.name}</td>
            <td class="admin">
                <div data-id=${role.id} class="btnEdit edit${role.id}">
                    <img src="https://img.icons8.com/office/30/000000/edit.png"/>
                </div>
                <div class="row">
                    <div data-id=${role.id} class="col btnCancel cancel${role.id} d-none">
                        <img src="https://img.icons8.com/ultraviolet/32/000000/cancel.png"/>
                    </div>
                    <div data-id=${role.id} class="col btnSave save${role.id} d-none">
                        <img src="https://img.icons8.com/officel/30/000000/ok.png"/>
                    </div>
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

    // let sel = createSel();
    // document.getElementById('roleId').appendChild(sel);
    // $(`#sel`).addClass('form-control');

    $('#rolesTable #tableData').html(rolesTable);
    $('#rolesTable').removeClass("d-none");

    admin();

     $('.btnEdit').click(function() {
         let id = $(this).data('id');
         $(this).addClass('d-none');
         $(`.save${id}`).removeClass('d-none');
         $(`.cancel${id}`).removeClass('d-none');
         let elemRole = $(`.name${id}`);
         roleName = elemRole.text();
         elemRole.html(`<input type='text' class="form-control" id="nameEdit" value='${roleName}' />`);
     });

     $(`.btnCancel`).click(function() {
        let id = $(this).data('id');
        $(this).addClass('d-none');
        $(`.save${id}`).addClass('d-none');
        $(`.edit${id}`).removeClass('d-none');
        let elemRole = $(`.name${id}`);
        elemRole.html(`${roleName}`);
    });


    $('.btnRemove').click(function() {
        let id = $(this).data('id');
        let removeUrl = `http://localhost:5000/api/roles/${id}`;
        fetch(removeUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
        .then(x => getAllRoles());
    });

    // $('#saveBtn').on('click',function() {
    //     let createUrl = 'http://localhost:5000/api/roles';

    //     let catSel = $('option');
    //     let sel;

    //     for(let i = 0; i < catSel.length; i++){
    //         if(catSel[i].selected == true){
    //             sel = catSel[i].value;
    //         }
    //     }

    //     let newGood = {
    //         "goodName" : $('#goodname').text(),
    //         "goodCount" : $('goodcount').text(),
    //         "price" : $('goodprice').text(),
    //         "categoryId" :  sel,
    //         "categoryName" : null
    //     };

    //     fetch(createUrl, {
    //         method: 'POST',
    //         headers: {
    //             'Authorization': `bearer ${token}`,
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(newGood)
    //     })
    //         .then(x => x.json())    
    //             .then(result => getAllGoods()
    //     );
        
    //     //$('#saveGood').close();
    // });
}

function admin(){
    if(userRole == 'lexus_driver'){
       $('.admin').removeClass("d-none");
    }else{
       $('.admin').addClass("d-none");
    }
}

$(document).ready(function () {

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


    getAllRoles();
});