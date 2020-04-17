let token = window.localStorage.getItem('shopapitoken');
let userInfo = parseJwt(token);
let userRole = userInfo.role;
let categoryName;
let id;

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

async function getAllCategories() {
    let url = 'http://localhost:5000/api/categories';

    let response = await fetch(url, { headers: { 'Authorization': `bearer ${token}` }});
    if (!response.ok){
        $('#infoBlock').removeClass('d-none').text(x.statusText);
    }else{
        $('#infoBlock').addClass('d-none');
        let json = await response.json();
        renderCategoriesTable(json.data);
    }
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
                    <div data-id=${category.id} class="btnEdit edit${category.id}" 
                        data-toggle="modal" data-target="#modalCategory">
                        <img src="https://img.icons8.com/office/30/000000/edit.png"/>
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

    $(".btnEdit").click(function() {
        id = $(this).data('id');
        let elem = $(`.name${id}`);
        categoryName = elem.text();
        form.categoryName.value = categoryName;
    });

    $('.btnRemove').click(function() {
        id = $(this).data('id');
        let removeUrl = `http://localhost:5000/api/categories/${id}`;
        fetch(removeUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
        .then(x => getAllCategories());
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

function createCategory(){
    let createUrl = 'http://localhost:5000/api/categories';

    let data = {
        "name" : categoryName
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
            .then(result => getAllCategories()
    );
}

function editCategory(id){
    let updateUrl = `http://localhost:5000/api/categories/${id}`;

    let data = {
        "name" : categoryName
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
            getAllCategories()
    });
}

$(document).ready(function () {

    getAllCategories();
    
    $('#saveBtn').on('click',function() {
        
        categoryName = form.categoryName.value;

        if(id != null){
            editCategory(id);
        }else{
            createCategory();
        }
        
        categoryName = null;
        id = null;
        form.categoryName.value = null;
    });

    $("#cancel").on('click', function() {
        categoryName = null;
        id = null;
        form.categoryName.value = null;
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