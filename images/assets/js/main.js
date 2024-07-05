//main.js
// routing for MMDB

function getSplash() {
    $(".hideAll").hide();
    // call splash XHR
    // Populate splash div
    $(".splash").show();
}

function getProducts() {
    $(".hideAll").hide();
    // call product XHR
    // Populate product div
    $(".products").show();
}

function getCart() {
    $(".hideAll").hide();
    // call cart XHR
    // Populate cart div
    $(".cart").show();
}

$(window).on("load", function () {

    // SAMMY ROUTING
    // Controller in MVC

    var app = $.sammy(function () {

        this.get('#/splash/', function () {
            getSplash();
        });

        this.get('#/products/', function () {
            getProducts();
        });

        this.get('#/cart/', function () {
            getCart();
        });

    });

    // default when page first loads
    $(function () {
        app.run('#/splash/');
    });
    
    $(document).foundation();
});
