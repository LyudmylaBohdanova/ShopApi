let token = window.localStorage.getItem('shopapitoken');
let userInfo = parseJwt(token);
let userRole = userInfo.role;
let categoryAll = [];
let goodsEdit = [];

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function getAllGoods() {
    let categoryUrl = `http://localhost:5000/api/categories`;

    fetch(categoryUrl, {
        headers: {
            'Authorization': `bearer ${token}`
        }})
        .then(x => {
            if (!x.ok) {
                $('#infoBlock')
                    .removeClass('d-none')
                        .text(x.statusText);
               
            } else{
                $('#infoBlock').addClass('d-none');
                x.json().then(result => getCategory(result));
            }
    });

    let goodUrl = 'http://localhost:5000/api/goods';
    
    fetch(goodUrl, {
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
                x.json().then(result => renderGoodsTable(result));
            }
    });
}

function getCategory(categoryObj){
    
    for(category of categoryObj){
        categoryAll.push(category);
    }
}

function createSel(){
    let self = document.createElement('select');
    self.id = "sel";
    for(let i = 0; i < categoryAll.length; i++){
        let opt = document.createElement("option");
        opt.value = categoryAll[i].id;
        opt.innerHTML = categoryAll[i].name;
        self.appendChild(opt);
    }
    return self;
}

function renderGoodsTable(goodsObj) {

    let tableContent = "";
    for (let good of goodsObj) {
        tableContent += `
        <tr>
            <td>${good.id}</td>
            <td class="goodName name${good.id}">${good.goodName}</td>
            <td class="categoryName catName${good.id}">${categoryAll.find(x => x.id == good.categoryId).name}</td>
            <td class="count count${good.id}">${good.goodCount}</td>
            <td class="price price${good.id}">${good.price.toFixed(2)}</td>
            <td class="admin">
                <div data-id=${good.id} class="btnEdit edit${good.id}">
                    <img src="https://img.icons8.com/office/30/000000/edit.png"/>
                </div>
                <div class="row">
                    <div data-id=${good.id} class="col btnCancel cancel${good.id} d-none">
                        <img src="https://img.icons8.com/ultraviolet/32/000000/cancel.png"/>
                    </div>
                    <div data-id=${good.id} class="col btnSave save${good.id} d-none">
                        <img src="https://img.icons8.com/officel/30/000000/ok.png"/>
                    </div>
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

    let sel = createSel();
    document.getElementById('categoryId').appendChild(sel);
    $(`#sel`).addClass('form-control');

    $('#goodsTable #tableData').html(goodsTable);
    $('#goodsTable').removeClass("d-none");

    admin();

     $('.btnEdit').click(function() {
         let id = $(this).data('id');
         $(this).addClass('d-none');
         $(`.save${id}`).removeClass('d-none');
         $(`.cancel${id}`).removeClass('d-none');
         let goodName = $(`.name${id}`);
         let goodCatName = $(`.catName${id}`);
         let goodCount = $(`.count${id}`);
         let goodPrice = $(`.price${id}`);
         goodEdit = {
            goodId: id, 
            name: goodName.text(), 
            categoryId: categoryAll.find(x => x.name == goodCatName.text()).id, 
            count: goodCount.text(), 
            price: goodPrice.text()
        };
         goodsEdit.push(goodEdit);
         goodName.html(`<input type='text' class="form-control" id="nameEdit" value='${goodEdit.name}' />`);
         let selCat = createSel();
         selCat.id = `sel${id}`;
         goodCatName.html(selCat);
         $(`#sel${id}`).addClass('form-control');
         goodCount.html(`<input type='text' class="form-control" id="countEdit" value='${goodEdit.count}' />`);
         goodPrice.html(`<input type='text' class="form-control" id="priceEdit" value='${goodEdit.price}' />`);
     });

     $(`.btnCancel`).click(function() {
        let id = $(this).data('id');
        $(this).addClass('d-none');
        $(`.save${id}`).addClass('d-none');
        $(`.edit${id}`).removeClass('d-none');
        let goodOld = goodsEdit.find(x => x.id == id);
        let elemName = $(`.name${id}`);
        elemName.html(`${goodOld.name}`);
        let elemCount = $(`.count${id}`);
        elemCount.html(`${goodOld.count}`);
        let elemPrice = $(`.price${id}`);
        elemPrice.html(`${goodOld.price}`);
        let elemCategory = $(`.catName${id}`);
        let catName = categoryAll.find(x => x.id == goodOld.categoryId).name;
        elemCategory.html(`${catName}`);
        let index = goodsEdit.indexOf(goodOld);
        goodsEdit.splice(index, index);
    });


    $('.btnRemove').click(function() {
        let id = $(this).data('id');
        let removeUrl = `http://localhost:5000/api/goods/${id}`;
        fetch(removeUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
        .then(x => getAllGoods());
    });

    $('#saveBtn').on('click',function() {
        let createUrl = 'http://localhost:5000/api/goods';

        let catSel = $('option');
        let sel;

        for(let i = 0; i < catSel.length; i++){
            if(catSel[i].selected == true){
                sel = catSel[i].value;
            }
        }

        let newGood = {
            "goodName" : $('#goodname').text(),
            "goodCount" : $('goodcount').text(),
            "price" : $('goodprice').text(),
            "categoryId" :  sel,
            "categoryName" : null
        };

        fetch(createUrl, {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGood)
        })
            .then(x => x.json())    
                .then(result => getAllGoods()
        );
        
        //$('#saveGood').close();
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


    getAllGoods();
});