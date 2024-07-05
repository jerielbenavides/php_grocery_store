let cart_items = {};
let ea_user_id = "";

$(document).foundation();
// import Swal from 'sweetalert2';


function getStars(num) {
    numFloor = Math.floor(num);
    let stars = "";
    for (let i = 0; i < numFloor; i++){ 
        stars += '<i class="fa-solid fa-star reviewStar"></i>';
    }
    let difference = num - numFloor;
    if (difference >= 0.5){
        stars += '<i class="fas fa-star-half  reviewStar"></i>';
    }
    return stars;
}

function loadPage(className) {
    $(".hideAll").hide();
    $(className).show();
}
function loadFeatured(){
    //Some departments array (should probably fetch this instead of hardcoding it);
    let deptCodes = [1,2,3,5,6,7,9,11,13,14,15,18,19,20,23,24,25,26,28,31,33]
    let featured_products_grid = $('#featured_products_grid');
    featured_products_grid.empty();

    let getFeaturedProducts = $.ajax({
        url: "./services/get_products_by_department.php",
        type: "POST",
        data: {
            department_id: deptCodes[Math.floor(Math.random() * deptCodes.length)],
            filter_id: 127, //filter by random 4
        },
        dataType: "json"
    })
    getFeaturedProducts.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getProductsByDepartments)" +
            textStatus);
    });
    getFeaturedProducts.done(function (data) {
        $.each(data['products'], function (i, item) {
            featured_products_grid.append(`
            <article class="card product_card product cell large-3 medium-4 small-6" data-id='${item.id}'>
                <div class="product_photo">
                    <img class="weekly_product_image"src="${item.image_path}">
                    <i class="info_icon fa-solid fa-circle-info" data-desc= "${item.product_description}"></i>
                </div>
                <div class = "product_details">
                    <div class="product_reviews">
                        ${getStars(item.stars)}
                    </div>
                    <p class="product_brand">${item.brand}</p>
                    <p class="product_name">${item.product_name}</p>
                    <p class="product_price">$${item.avg_price}</p>
                    <div class="product_actions grid-x">
                        <div class="amount_picker cell large-9 medium-12 small-12">
                            <span class="minus_bttn button">-</span>
                            <input id="quantity_${item.id}" class="counter_input" type="number" value="1" type="number" name="productQty" min="1" max="10" disabled/>
                            <span class="plus_bttn button">+</span>
                        </div>
        
                        <div class="product_button cell large-3 medium-12 small-12">
                            <a class="button addCart" data-id='${item.id}'><i class="fa-solid fa-cart-shopping"></i></a>
                        </div>
                    </div> 
                </div>
            </article>
            `)
        })
        setCardCounters();
    });
}
function loadDepartments() {
    //Clear children of needed containers.
    let nav_dropdown = $('#nav_department_list');
    nav_dropdown.empty();
    let department_grid = $('#department_grid');
    department_grid.empty();

    let getDepartments = $.ajax({
        url: "./services/get_departments.php",
        type: "POST",
        data: {
        },
        dataType: "json"
    })
    getDepartments.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getDepartments)" +
            textStatus);
    });
    getDepartments.done(function (data) {
        let counter = 1;
        $.each(data['departments'], function(i, item){
            nav_dropdown.append(
                `<li><a href="#/department/${item.id}" data-id='${item.id}'>${item.name}</a></li>`
            ); 
            if (counter <= 12){    
                department_grid.append(`
                <article class="card department_card department cell large-3 medium-4 small-6" data-id='${item.id}'>
                    <div class="department_header">
                        <p>${item.name}</p>
                    </div>
                    <div class="department_photo">
                        <img class="department_image" src="assets/images/departments/${item.id}.jpg">
                    </div>
                </article>
                `);       
            }
            counter++;
        });
    });
}

function setCardCounters(){
    //QTY Picker function
    $(".minus_bttn" ).click(function() {
        let counter = $(this).parent().children('input').first();
        let value = counter.attr('value');
        let newValue = value-1;
        //All good, assign new value
        if (newValue >= counter.attr('min') && newValue <= counter.attr('max')){
            counter.attr('value', newValue);
            $(this).parent().children('span').last().removeClass( "disabled" );
            $(this).removeClass( "disabled" );
        }
        if (newValue == counter.attr('min')){
            $(this).addClass( "disabled" );
        }
        // alert( `${counter.attr('id')} was found!` );
    });

    $(".plus_bttn" ).click(function() {
        let counter = $(this).parent().children('input').first();
        let value = counter.attr('value');
        let newValue = Number(value)+1;
        //All good, assign new value
        if (newValue >= counter.attr('min') && newValue <= counter.attr('max')){
            counter.attr('value', newValue);
            $(this).removeClass( "disabled" );
            $(this).parent().children('span').first().removeClass( "disabled" );
        }
        if (newValue == counter.attr('max')){
            $(this).addClass( "disabled" );
        }
        // alert( `${counter.attr('id')} was found!` );
    });
}

function getSearch(){
    location.href = `#/search/`;
    let products_grid = $('#search_products_grid');
    products_grid.empty();
    loadPage('.search-container');
    let search = $("#search").val();

    let getProductsBySearch = $.ajax({
        url: "./services/get_products_by_search.php",
        type: "POST",
        data: {
            search: search
        },
        dataType: "json"
    })
    getProductsBySearch.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getProductsBySearch)" +
            textStatus);
    });
    getProductsBySearch.done(function (data) {
        $.each(data['products'], function (i, item) {
            products_grid.append(`
            <article class="card product_card product cell large-3 medium-4 small-6" data-id='${item.id}'>
                <div class="product_photo">
                    <img class="weekly_product_image"src="${item.image_path}">
                    <i class="info_icon fa-solid fa-circle-info" data-desc= "${item.product_description}"></i>
                </div>
                <div class = "product_details">
                    <div class="product_reviews">
                        ${getStars(item.stars)}
                    </div>
                    <p class="product_brand">${item.brand}</p>
                    <p class="product_name">${item.product_name}</p>
                    <p class="product_price">$${item.avg_price}</p>
                    <div class="product_actions grid-x">
                        <div class="amount_picker cell large-9 medium-9 small-12">
                            <span class="minus_bttn button">-</span>
                            <input id="quantity_${item.id}" class="counter_input" type="number" value="1" type="number" name="productQty" min="1" max="10" disabled/>
                            <span class="plus_bttn button">+</span>
                        </div>
        
                        <div class="product_button cell large-3 medium-3 small-12">
                            <a class="button addCart" data-id='${item.id}'><i class="fa-solid fa-cart-shopping"></i></a>
                        </div>
                    </div> 
                </div>
            </article>
            `)
        })
        setCardCounters();
    });
}

function loadDepartment(department_id){
    let products_grid = $('#department_products_grid');
    products_grid.empty();

    let getProductsByDepartment = $.ajax({
        url: "./services/get_products_by_department.php",
        type: "POST",
        data: {
            department_id: department_id,
            filter_id: 2, //filter by name
        },
        dataType: "json"
    })
    getProductsByDepartment.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getProductsByDepartments)" +
            textStatus);
    });
    getProductsByDepartment.done(function (data) {
        $('.departmentName').html(data['department_search']);
        $.each(data['products'], function (i, item) {
            products_grid.append(`
            <article class="card product_card product cell large-3 medium-4 small-6" data-id='${item.id}'>
                <div class="product_photo">
                    <img class="weekly_product_image"src="${item.image_path}">
                    <i class="info_icon fa-solid fa-circle-info" data-desc= "${item.product_description}"></i>
                </div>
                <div class = "product_details">
                    <div class="product_reviews">
                        ${getStars(item.stars)}
                    </div>
                    <p class="product_brand">${item.brand}</p>
                    <p class="product_name">${item.product_name}</p>
                    <p class="product_price">$${item.avg_price}</p>
                    <div class="product_actions grid-x">
                        <div class="amount_picker cell large-9 medium-9 small-12">
                            <span class="minus_bttn button">-</span>
                            <input id="quantity_${item.id}" class="counter_input" type="number" value="1" type="number" name="productQty" min="1" max="10" disabled/>
                            <span class="plus_bttn button">+</span>
                        </div>
        
                        <div class="product_button cell large-3 medium-3 small-12">
                            <a class="button addCart" data-id='${item.id}'><i class="fa-solid fa-cart-shopping"></i></a>
                        </div>
                    </div> 
                </div>
            </article>
            `)
        })
        setCardCounters();
    });
}

function loadCart(){
    let content = ``;
    let myCart = JSON.stringify(cart_items);
    if (Object.keys(cart_items).length <= 0){
        $(".cart-table-container").html('Your cart is empty');
        $('.cart-summary').html("");
    }
    else{
        let getCart = $.ajax({
            url: "./services/get_products_by_cart.php",
            type: "POST",
            data: {
                json: myCart
            },
            dataType: "json"
        });
    
        getCart.fail(function (jqXHR, textStatus) {
            alert("Something went Wrong! (getCart)" +
                textStatus);
        });
    
        getCart.done(function (data) {
            if (data.error.id == "0") {
                let subtotal = 0.00;

                //Table header
                content = `<table class="cart_table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Product</th>
                                        <th>QTY</th>
                                        <th>Price</th>
                                        <th>Extended Price</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>`;
                $.each(data.products, function (i, item) {
                    let id = item.id;
                    let upc = item.upc;
                    let brand = item.brand;
                    let product_name = item.product_name;
                    let product_description = item.product_description;
                    let avg_price = parseFloat(item.avg_price);
                    let department_name = item.category_name;
                    let image_path = item.image_path;
                    let quantity = item.quantity;
                    let taxable = item.taxable;
    
                    let extended_price = parseInt(quantity) * parseFloat(avg_price);
                    subtotal = subtotal + extended_price;
                    let price = avg_price.toFixed(2);
                    let extended = extended_price.toFixed(2);

                    content += `<tr>
                                    <td>
                                        <div class="large-1 cell text-align-left">
                                            <img class="cart_table_image" src="${image_path}" alt="${product_name}">
                                        </div>
                                    </td>
                                    <td class="text-align-left">
                                        <p>${product_name}<br>
                                        ${brand}<br>
                                        ${upc}</p>
                                    </td>
                                    <td id="cart_counter">
                                        <input type="button" value="-" class="cart-minus" data-id="${id}">
                                        <span>${quantity}</span>
                                        <input type="button" value="+" class="cart-plus" data-id="${id}">
                                    </td>
                                    <td>$${price}</td>
                                    <td>$${extended}</td>
                                    <td><input type="button" class="cart-delete alert small button" data-id="${id}" value="Delete"></td>
                                </tr>`;
                let cart_summary = `<div class="grid-x">
                                        <div class="large-8  cell">
                                        </div>
                                        <div class="large-1 cell">
                                        Sub-Total:
                                        </div>
                                        <div class="large-2 cell cart-subtotal">
                                        $2.50
                                        </div>
                                        <div class="large-1 cell">
                                        </div>
                                    </div>
                                    <div class="grid-x">
                                        <div class="large-8 cell">
                                        </div>
                                        <div class="large-1 cell">
                                        HST:
                                        </div>
                                        <div class="large-2 cell  cart-hst">
                                        $0.33
                                        </div>
                                        <div class="large-1 cell">
                                        </div>
                                    </div>
                            
                                    <div class="grid-x">
                                        <div class="large-8 cell">
                                        </div>
                                        <div class="large-1 cell">
                                        Total:
                                        </div>
                                        <div class="large-2 cell  cart-total">
                                        $2.83
                                        </div>
                                        <div class="large-1 cell">
                                        </div>
                                    </div>
                            
                                    <div class="grid-x">
                                        <div class="large-8 cell">
                                        </div>
                                        <div class="large-1 cell">
                                        
                                        </div>
                                        <div class="large-2 cell">
                                        <input type="button" value="Checkout" id="" onclick="goToCheckout()" class="button small checkout-link">
                                        </div>
                                        <div class="large-1 cell">
                                        </div>
                                    </div>`;
                $('.cart-summary').html(cart_summary);
                //subtotal
                let sub = subtotal.toFixed(2);
                $(".cart-subtotal").html("$" + sub);
    
                let hst = subtotal * 0.13;
                let HST = hst.toFixed(2);
                $(".cart-hst").html("$" + HST);
    
                let total = subtotal + hst;
                let TOTAL = total.toFixed(2);
                $(".cart-total").html("$" + TOTAL);
            });
            content += `</tbody></table>`;
            $(".cart-table-container").html(content);
        };
    });
}
}
function doLogin() {
    let email = $("#li-email").val();
    let password = $("#li-password").val();
    let errorText = '';

    if (email == null || email == "") {
        $('#login_errors').text("Please enter an email address.");
        $("#li-email").focus();
    } else {
        if (password == null || password == "") {
            $('#login_errors').text("Please enter a password.");
            $("#li-password").focus();
        } else {
            // everything is good
            //alert("everything is good");
            $('#login_errors').text("");
            let loginaccount = $.ajax({
                url: "./services/login_account.php",
                type: "POST",
                data: {
                    email: email,
                    password: password
                },
                dataType: "json"
            });

            loginaccount.fail(function (jqXHR, textStatus) {
                alert("Something went Wrong! (loginaccount)" +
                    textStatus);
            });

            loginaccount.done(function (data) {
                if (data.error.id == "0") {
                    // populate fields
                    ea_user_id = data.ea_user_id;
                    $("#billing-name-last").val(data.billing_name_last);
                    $("#billing-name-first").val(data.billing_name_first);
                    $("#billing-email").val(data.email);
                    $("#li-password").val("");
                    $("#billing-address").val(data.billing_address);
                    $("#billing-city").val(data.billing_city);
                    $("#billing-province").val(data.billing_province);
                    $("#billing-postal-code").val(data.billing_postal_code);
                    $("#billing-phone").val(data.billing_phone);
                    $("#shipping-name-last").val(data.shipping_name_last);
                    $("#shipping-name-first").val(data.shipping_name_first);
                    $("#shipping-address").val(data.shipping_address);
                    $("#shipping-city").val(data.shipping_city);
                    $("#shipping-province").val(data.shipping_province);
                    $("#shipping-postal-code").val(data.shipping_postal_code);
                    $("#shipping-phone").val(data.billing_phone);
                    //Only redirect to checkout if cart items>o
                    if (Object.keys(cart_items).length>0){
                        location.href = `#/checkout/`;
                    }
                    else{
                        location.href = `#/home/`;
                    }
                    // set value of email in login screen
                } else {
                    $('#login_errors').text("Your email and password do not match.");
                }
            });

        }

    }
}
function doCreateAccount() {
    let email = $("#register-email").val();
    let emailconfirm = $("#register-email-confirm").val();
    let password = $("#register-password").val();
    let namefirst = $("#register-name-first").val();
    let namelast = $("#register-name-last").val();
    let billing_address = $("#register-billing-address").val();
    let billing_city = $("#register-billing-city").val();
    let billing_province = $("#register-billing-province").val();
    let billing_postal_code = $("#register-billing-postal-code").val();
    let billing_phone = $("#register-billing-phone").val();
    if (email == null || email == "") {
        $('#register_errors').text("Please enter an email address.");
        $("#register-email").focus();
    } else {
        if (email != emailconfirm) {
            $('#register_errors').text("Your email addresses do not match.");
            $("#register-email-confirm").focus();
        } else {
            if (password == null || password == "") {
                $('#register_errors').text("Please enter a password.");
                $("#register-password").focus();
            } else {
                // everything is good
                //alert("everything is good");
                let createaccount = $.ajax({
                    url: "./services/create_account.php",
                    type: "POST",
                    data: {
                        email: email,
                        password: password,
                        name_last: namelast,
                        name_first: namefirst,
                        billing_address : billing_address, 
                        billing_city : billing_city, 
                        billing_province : billing_province, 
                        billing_postal_code : billing_postal_code, 
                        billing_phone : billing_phone 
                     },
                    dataType: "json"
                });

                createaccount.fail(function (jqXHR, textStatus) {
                    $('#register_errors').text("Something went Wrong! (createaccount)" +
                        textStatus);
                });

                createaccount.done(function (data) {
                    if (data.error.id == "0") {
                        $("#li-email").val(email);
                        //Redirect to login page and place email.
                        location.href = `#/login/`;
                        $("#li-password").focus();

                        // clear this page
                        $("#register-email").val("");
                        $("#register-password").val("");
                        $("#register-email-confirm").val("");
                        $("#register-name-first").val("");
                        $("#register-name-last").val("");
                        // set value of email in login screen
                    } else {
                        $('#register_errors').text("We could not create your account at this time.");
                    }
                });

            }
        }
    }
}

function doPayment() {

    let payment_name = $("#payment-name").val();
    let payment_number = $("#payment-number").val();
    let payment_month = $("#payment-month").val();
    let payment_year = $("#payment-year").val();
    let payment_cvv = $("#payment-cvv").val();

    let doPayment = $.ajax({
        url: "./services/make_payment.php",
        type: "POST",
        data: {
            card_holder_name: payment_name,
            card_number: payment_number,
            month: payment_month,
            year: payment_year,
            cvv: payment_cvv
        },
        dataType: "json"
    });

    doPayment.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (doPayment)" +
            textStatus);
    });

    doPayment.done(function (data) {

        if (data.error.id == "0") {
            transaction_code = data.transaction_code;
            getConfirm();
            location.href = `#/confirm/`;
        } else {
            alert("We can not process your payment at this time.");
        }
    });
}

function getConfirm(){
    let content = ``;
    let myCart = JSON.stringify(cart_items);
    if (Object.keys(cart_items).length <= 0){
    }
    else{
        let getCart = $.ajax({
            url: "./services/get_products_by_cart.php",
            type: "POST",
            data: {
                json: myCart
            },
            dataType: "json"
        });
    
        getCart.fail(function (jqXHR, textStatus) {
            alert("Something went Wrong! (getCart)" +
                textStatus);
        });
    
        getCart.done(function (data) {
            if (data.error.id == "0") {
                let subtotal = 0.00;

                //Table header
                content = `<table class="cart_table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Product</th>
                                        <th>QTY</th>
                                        <th>Price</th>
                                        <th>Extended Price</th>
                                    </tr>
                                </thead>
                                <tbody>`;
                $.each(data.products, function (i, item) {
                    let id = item.id;
                    let upc = item.upc;
                    let brand = item.brand;
                    let product_name = item.product_name;
                    let product_description = item.product_description;
                    let avg_price = parseFloat(item.avg_price);
                    let department_name = item.category_name;
                    let image_path = item.image_path;
                    let quantity = item.quantity;
                    let taxable = item.taxable;
    
                    let extended_price = parseInt(quantity) * parseFloat(avg_price);
                    subtotal = subtotal + extended_price;
                    let price = avg_price.toFixed(2);
                    let extended = extended_price.toFixed(2);

                    content += `<tr>
                                    <td>
                                        <div class="large-1 cell text-align-left">
                                            <img class="cart_table_image" src="${image_path}" alt="${product_name}">
                                        </div>
                                    </td>
                                    <td class="text-align-left">
                                        <p>${product_name}<br>
                                        ${brand}<br>
                                        ${upc}</p>
                                    </td>
                                    <td>
                                        <span>${quantity}</span>
                                    </td>
                                    <td>$${price}</td>
                                    <td>$${extended}</td>
                                </tr>`;
                let cart_summary = `<div class="grid-x">
                                        <div class="large-8  cell">
                                        </div>
                                        <div class="large-1 cell">
                                        Sub-Total:
                                        </div>
                                        <div class="large-2 cell cart-subtotal">
                                        $2.50
                                        </div>
                                        <div class="large-1 cell">
                                        </div>
                                    </div>
                                    <div class="grid-x">
                                        <div class="large-8 cell">
                                        </div>
                                        <div class="large-1 cell">
                                        HST:
                                        </div>
                                        <div class="large-2 cell  cart-hst">
                                        $0.33
                                        </div>
                                        <div class="large-1 cell">
                                        </div>
                                    </div>
                            
                                    <div class="grid-x">
                                        <div class="large-8 cell">
                                        </div>
                                        <div class="large-1 cell">
                                        Total:
                                        </div>
                                        <div class="large-2 cell  cart-total">
                                        $2.83
                                        </div>
                                        <div class="large-1 cell">
                                        </div>
                                    </div>
                            
                                    <div class="grid-x">
                                        <div class="large-8 cell">
                                        </div>
                                        <div class="large-1 cell">
                                        
                                        </div>
                                        <div class="large-2 cell">
                                        <input type="button" value="Complete" id="finish_purchase" onclick="finishPurchase()" class="button small">
                                        </div>
                                        <div class="large-1 cell">
                                        </div>
                                    </div>`;
                $('.confirm-summary').html(cart_summary);
                //subtotal
                let sub = subtotal.toFixed(2);
                $(".cart-subtotal").html("$" + sub);
    
                let hst = subtotal * 0.13;
                let HST = hst.toFixed(2);
                $(".cart-hst").html("$" + HST);
    
                let total = subtotal + hst;
                let TOTAL = total.toFixed(2);
                $(".cart-total").html("$" + TOTAL);
            });
            content += `</tbody></table>`;
            $(".confirm-table-container").html(content);
        };
    });
}
}

let updateCartNumber = function(){
    console.log(cart_items);
    console.log(`Number of items: ${Object.keys(cart_items).length}`)
    $(`#cart_number`).text(Object.keys(cart_items).length);
}


let goToCheckout = function(){
    location.href = `#/checkout/`;
}
let finishPurchase = function(){
    location.href = `#/complete/`;
}

let sendInvoice = function(){
    let myCart = {};
    myCart["transaction_code"] = transaction_code;
    myCart["ea_user_id"] = ea_user_id;

    myCart["email"] = $("#billing-email").val();
    myCart["billing_name_first"] = $("#billing-name-first").val();
    myCart["billing_name_last"] = $("#billing-name-last").val();
    myCart["myItems"] = cart_items;


    // stringify
    let jsonCart = JSON.stringify(myCart);

    let makeInvoice = $.ajax({
        url: "./services/make_invoice.php",
        type: "POST",
        data: {
            myCart: jsonCart
        },
        dataType: "json"
    });

    makeInvoice.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getComplete)" +
            textStatus);
    });

    makeInvoice.done(function (data) {
        if (data.error.id == "0") {
            $("#transaction_number").html(data.invoice_id);
            //Clear Cart
            cart_items = {};
            updateCartNumber();
        } else {
            alert("Order not processed!");
        }
    });
}




$(window).on("load", function () {
    let splide = new Splide( '.splide', { 
        arrows: false,
        autoplay: true,    
    } );
    splide.mount();
    $(".home").click(function () {
        location.href = "#/home/";
    });

    $(document).on('click', 'body .department', function () {
        let department_id = $(this).attr('data-id');
        location.href = `#/department/${department_id}`;
        // location.href = "#/department/";
    });

    $(document).on('click', '#cart_link', function () {
        location.href = "#/cart/";
    });
    $(document).on('click', 'cart_link', function () {
        location.href = "#/cart/";
    });
    $(document).on('click', '.addCart', function () {
        let product_id = $(this).attr('data-id');
        let qty = $(`#quantity_${product_id}`).attr('value');
        cart_items[product_id] = qty;
        updateCartNumber();
    });
    $(document).on('click', 'body .cart-plus', function () {
        let id = $(this).data("id");
        let quantity = parseInt(cart_items[id]) + 1;
        cart_items[id] = quantity;
        loadCart();
    });
    $(document).on('click', 'body .cart-delete', function () {
        let id = $(this).data("id");
        delete cart_items[id];
        updateCartNumber();
        loadCart();
    });

    $(document).on('click', 'body .cart-minus', function () {
        let id = $(this).data("id");
        let quantity = parseInt(cart_items[id]) - 1;
        if (quantity < 1) {
            quantity = 1;
        }
        cart_items[id] = quantity;
        loadCart();
    });
    $(".back-link").click(
        function () {
            location.href = `#/checkout/`;
        }
    );
    $('#search').keyup(function () { 
        if ($('#search').val().length > 0) {
            getSearch();
        }
    });

    $('#same_as_billing').change(function() {
        if(this.checked) {
            $("#shipping-name-last").val($("#billing-name-last").val());
            $("#shipping-name-first").val($("#billing-name-first").val());
            $("#shipping-address").val($("#billing-address").val());
            $("#shipping-city").val($("#billing-city").val());
            $("#shipping-province").val($("#billing-province").val());
            $("#shipping-postal-code").val($("#billing-postal-code").val());
            $("#shipping-phone").val($("#billing-phone").val());
            $("#shipping-name-last").prop('disabled',true);            
            $("#shipping-name-first").prop('disabled',true);
            $("#shipping-address").prop('disabled',true);          
            $("#shipping-city").prop('disabled',true);       
            $("#shipping-province").prop('disabled',true);           
            $("#shipping-postal-code").prop('disabled',true);
            $("#shipping-phone").prop('disabled',true);
        }
        else{
            $("#shipping-name-last").prop('disabled',false);            
            $("#shipping-name-first").prop('disabled',false);
            $("#shipping-address").prop('disabled',false);          
            $("#shipping-city").prop('disabled',false);       
            $("#shipping-province").prop('disabled',false);           
            $("#shipping-postal-code").prop('disabled',false);
            $("#shipping-phone").prop('disabled',false);
        }

    });
    $("#li-login").click(
        function () {
            doLogin();
        }
    );
    $("#register-create-account").click(
        function () {
            doCreateAccount();
        }
    );
    $(".confirm-payment-link").click(
        function () {
            doPayment();
        }
    );
    $(".create-account-link").click(
        function () {
            location.href = `#/register/`;
        }
    );
    $(".login-link").click(
        function () {
            location.href = `#/login/`;
        }
    );
    $(".checkout-link").click(
        function () {
            console.log('clicked checkout')
            location.href = `#/checkout/`;
        }
    );
    $(".payment-link").click(
        function () {
            location.href = `#/payment/`;
        }
    );
    $("#finish_purchase").click(
        function () {
            location.href = `#/complete/`;
        }
    );


    $(document).on('click', '.info_icon', function () {
        let desc = $(this).attr('data-desc');
        Swal.fire({
            title: 'Product Information',
            text: desc,
            icon: 'info',
            confirmButtonText: 'Okay',
            confirmButtonColor: '#3A9106;',
        });
    });

    let app = $.sammy(function () {

        this.get('#/home/', function () {
            loadPage('.home-container');
            window.scrollTo(0,0);
        });

        this.get('#/department/:id', function () {
            //Populate Specific Department
            let id = this.params["id"];
            loadDepartment(id); //load specific department based on id
            loadPage('.departments-container');
            window.scrollTo(0,0);
        });

        this.get('#/cart/', function () {
            loadCart();
            loadPage('.cart-container');
            window.scrollTo(0,0);
        });
        this.get('#/login/', function () {
            $('#login_errors').text("");
            loadPage('.login-container');
            window.scrollTo(0,0);
        });
        this.get('#/register/', function () {
            loadPage('.register-container');
            window.scrollTo(0,0);
        });
        this.get('#/billing/', function () {
            loadPage('.billing-container');
            window.scrollTo(0,0);
        });
        this.get('#/checkout/', function () {
            if(ea_user_id != ""){
            loadPage('.checkout-container');
            window.scrollTo(0,0);
            }
            else{
                location.href = `#/login/`;
            }
        });
        this.get('#/payment/', function () {
            loadPage('.payment-container');
            window.scrollTo(0,0);
        });
        this.get('#/confirm/', function () {
            loadPage('.payment-confirm-container');
            window.scrollTo(0,0);
        });
        this.get('#/complete/', function () {
            sendInvoice();
            loadPage('.order-placed-container');
            window.scrollTo(0,0);
        });
    });
    $(function () {
        app.run('#/home/');
        loadFeatured();
        loadDepartments();
    });

    //
});





