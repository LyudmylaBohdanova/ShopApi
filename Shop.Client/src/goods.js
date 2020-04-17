let token = window.localStorage.getItem('shopapitoken');
let userInfo = parseJwt(token);
let userRole = userInfo.role;
let categoryAll = [];
let goodsEdit = [];
let good;
let id;

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

async function getAllGoods() {
    let categoryUrl = `http://localhost:5000/api/categories`;

    let categoryResponse = await fetch(categoryUrl, { headers: { 'Authorization': `bearer ${token}` }});
    if (!categoryResponse.ok){
        $('#infoBlock').removeClass('d-none').text(x.statusText);
    }else{
        $('#infoBlock').addClass('d-none');
        let json = await categoryResponse.json();
        getCategory(json.data);
    }

    let goodUrl = 'http://localhost:5000/api/goods';

    let goodResponse = await fetch(goodUrl, { headers: { 'Authorization': `bearer ${token}` }});
    if (!goodResponse.ok){
        $('#infoBlock').removeClass('d-none').text(x.statusText);
    }else{
        $('#infoBlock').addClass('d-none');
        let json = await goodResponse.json();
        renderGoodsTable(json.data);
    }
}

function getCategory(categoryObj){
    
    for(category of categoryObj){
        categoryAll.push(category);
    }
}

function createSel(id){
    let sel = document.createElement('select');
    sel.id = "sel";
    sel.name = "categoryId";
    sel.className = 'form-control';
    for(let i = 0; i < categoryAll.length; i++){
        let opt = document.createElement("option");
        opt.value = categoryAll[i].id;
        opt.innerHTML = categoryAll[i].name;
        if(id != null && categoryAll[i].id == id){
            opt.selected = true;
        };
        sel.appendChild(opt);
    }
    
    return sel;
}

function renderGoodsTable(goodsObj) {

    let tableContent = "";
    for (let good of goodsObj) {
        tableContent += `
        <tr>
            <td>${good.id}</td>
            <td class="goodName name${good.id}">${good.goodName}</td>
            <td class="categoryName catName${good.id}" id="${good.categoryId}">${good.categoryName}</td>
            <td class="count count${good.id}">${good.goodCount}</td>
            <td class="price price${good.id}">${good.price.toFixed(2)}</td>
            <td class="admin">
                <div data-id=${good.id} class="btnEdit edit${good.id}"
                    data-toggle="modal" data-target="#modalGood">
                    <img src="https://img.icons8.com/office/30/000000/edit.png"/>
                </div>
            </td>
            <td class="admin">
                <div data-id=${good.id} class="btnRemove">
                    <img src="https://img.icons8.com/office/30/000000/delete-sign.png"/>
                </div>
            </td>
        </tr>
        `;
    }

    let goodsTable = `
    <table class="table table-hover">
        <thead class="thead-light">
            <th>Id</th>
            <th>Name</th>
            <th>Category Name</th>
            <th>Count</th>
            <th>Price</th>
            <th class="admin">Edit</th>
            <th class="admin">Remove</th>
        </thead>
   
        <tbody>
            ${tableContent}
        </tbody>
    </table>
    `;

    

    $('#goodsTable #tableData').html(goodsTable);
    $('#goodsTable').removeClass("d-none");

    admin();

     $('.btnEdit').click(function() {
         id = $(this).data('id');
         good = {
             name: $(`.name${id}`).text(),
             category: $(`.catName${id}`).attr('id'),
             count: $(`.count${id}`).text(),
             price: $(`.price${id}`).text()
         };
         let selCat = createSel(good.category);
         $("#categoryId").childNodes?$("#categoryId").replace(selCat):$("#categoryId").html(selCat);
         form.goodName.value = good.name;
         form.goodCount.value = good.count;
         form.goodPrice.value = good.price;
     });

    $('.btnRemove').click(function() {
        id = $(this).data('id');
        let removeUrl = `http://localhost:5000/api/goods/${id}`;
        fetch(removeUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
        .then(x => getAllGoods());
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

function createGood(){
    let createUrl = 'http://localhost:5000/api/goods';

    let data = {
        "goodName" : good.name,
        "goodCount": good.count,
        "price": good.price,
        "categoryId": good.category
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
            .then(result => getAllGoods()
    );
}

function editGood(id){
    let updateUrl = `http://localhost:5000/api/goods/${id}`;

    let data = {
        "goodName" : good.name,
        "goodCount": good.count,
        "price": good.price,
        "categoryId": good.category
    };

    fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(x => getAllGoods()
    );
}

$("#addBtn").on('click', function() {
    let sel = createSel(id);
    $("#categoryId").childNodes?$("#categoryId").replace(sel):$("#categoryId").html(sel);
});

$(document).ready(function () {

    getAllGoods();

    $('#saveBtn').on('click',function() {
        
        let sel = document.getElementById("sel").childNodes;
        let catId;
        for ( let i = 0; i < sel.length; i++ ) {
            if (sel[i].selected === true ) {
                catId = sel[i].value;
            }
        }

        good = {
            name: form.goodName.value,
            category: catId,
            count: form.goodCount.value,
            price: form.goodPrice.value
        };

        if(id != null){
            editGood(id);
        }else{
            createGood();
        }
        
        good = null;
        id = null;
        form.goodName.value = null;
        form.goodCount.value = null;
        form.goodPrice.value = null;
    });

    $("#cancel").on('click', function() {
        good = null;
        id = null;
        form.goodName.value = null;
        form.goodCount.value = null;
        form.goodPrice.value = null;
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
    };
});