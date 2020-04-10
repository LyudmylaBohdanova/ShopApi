let token = window.localStorage.getItem('shopapitoken');
let userInfo = parseJwt(token);
let userRole = userInfo.role;
let categoryName;

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function getAllCategories() {
    let url = 'http://localhost:5000/api/categories';

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
                x.json().then(result => renderCategoriesTable(result));
            }
        });
}

function renderCategoriesTable(categoriesObj) {

    let tableContent = "";
    for (let category of categoriesObj) {
        tableContent += `
        <tr>
            <td>${category.id}</td>
            <td class="categoryName name${category.id}">${category.name}</td>
            <td class="admin">
                <div class="admin">
                <div data-id=${category.id} class="btnEdit edit${category.id}">
                    <img src="https://img.icons8.com/office/30/000000/edit.png"/>
                </div>
                </div>
                <div class="row admin d-none">
                    <div data-id=${category.id} class="col btnCancel cancel${category.id} d-none">
                        <img src="https://img.icons8.com/ultraviolet/32/000000/cancel.png"/>
                    </div>
                    <div data-id=${category.id} class="col btnSave save${category.id} d-none">
                        <img src="https://img.icons8.com/officel/32/000000/ok.png"/>
                    </div>
                </div>
            </td>
            <td class="admin">
                <div class="admin d-none">
                <div data-id=${category.id} class="btnRemove">
                    <img src="https://img.icons8.com/office/32/000000/delete-sign.png"/>
                </div>
                </div>
            </td>
        </tr>
        `;
    }

    let categoriesTable = `
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

    $('#categoriesTable #tableData').html(categoriesTable);
    $('#categoriesTable').removeClass("d-none");

    admin();


    $('.btnEdit').click(function() {
        let id = $(this).data('id');
        $(this).addClass('d-none');
        $(`.save${id}`).removeClass('d-none');
        $(`.cancel${id}`).removeClass('d-none');
        let elem = $(`.name${id}`);
        categoryName = elem.text();
        elem.html(`<input type='text' class="form-control" id='nameEdit${id}' value='${categoryName}' />`);
    });

    $(`.btnCancel`).click(function() {
        let id = $(this).data('id');
        $(this).addClass('d-none');
        $(`.save${id}`).addClass('d-none');
        $(`.edit${id}`).removeClass('d-none');
        //let elemEdit = $(`#nameEdit${id}`);
        let elem = $(`.name${id}`);
        elem.html(`${categoryName}`);
    });

    $('.btnSave').click(function(){
        let id = $(this).data('id');
        $(this).addClass('d-none');
        $(`.cancel${id}`).addClass('d-none');
        $(`.edit${id}`).removeClass('d-none');
        let elemEdit = $(`#nameEdit${id}`);
        let elem = $(`.name${id}`);
        let catName = elemEdit.val();
        elem.html(`${catName}`);

        let updateUrl = `http://localhost:5000/api/categories/${id}`;
        let data = {name: $.trim(catName)};
        fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(x => getAllCategories())
    });

    $('.btnRemove').click(function() {
        let id = $(this).data('id');
        let removeUrl = `http://localhost:5000/api/categories/${id}`;
        fetch(removeUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
        .then(x => getAllCategories());
    });
}



function admin(){
    if(userRole == 'lexus_driver'){
       $('.admin').removeClass("d-none");
    }else{
       $('.admin').addClass("d-none");
    }
}


$(document).ready(function () {
   
    $('#addBtn').on('click',function() {
        let createUrl = 'http://localhost:5000/api/categories';
        let categoryName = prompt("Input category name");

        let newCategory = {
            "name" : categoryName
        };

        fetch(createUrl, {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCategory)
        })
            .then(x => x.json())    
                .then(result => getAllCategories());
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

    getAllCategories();
});