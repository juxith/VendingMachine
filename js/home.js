$(document).ready(function () {

    loadMachine();
});

$('#reset').click(function () {

    $('#message').val('');
    $('#totalIn').val('');
    $('#itemSelection').val('');
    $('#changeReturned').empty();
});


$('#purchase').click(function () {

    var totalMoneyIn = parseFloat($('#totalIn').val().replace('$', ''));
    var itemId = $('#itemSelection').val();

    if (isNaN(totalMoneyIn) || itemId == '') {
        $('#message').val('Item and $ is required');
    }
    else {
        makePurchase(totalMoneyIn, itemId);
    }

});

function makePurchase(totalMoneyIn, itemId) {

    $('#changeReturned').empty();

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/money/' + totalMoneyIn.toFixed(2) + '/item/' + itemId,
        success: function (change) {

            var quarters = change.quarters;
            var dimes = change.dimes;
            var nickels = change.nickels;
            var pennies = change.pennies;

            var returnChange = '<p>';
            returnChange += 'Quarters: ' + quarters;
            returnChange += 'Dimes: ' + dimes + '</p>';
            returnChange += '<p> Nickels: ' + nickels;
            returnChange += 'Pennies: ' + pennies;
            returnChange += '</p>';

            $('#changeReturned').append(returnChange);
            $('#totalIn').val('');
            $('#itemSelection').val('');
            $('#message').val('Thank You!');

            $('.centerContent').empty();
            loadMachine();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var response = jqXHR.responseJSON;
            $('#message').val(response.message);
        }
    });
}


$('#addDollar, #addQuarter, #addDime, #addNickel').click(function () {
    var totalMoneyIn = 0;
    var prevAmount = 0;
    if ($('#totalIn').val() != '') {

        prevAmount = parseFloat($('#totalIn').val().replace('$', ''));
    }
    var amount = parseFloat($(this).data('amount'));
    totalMoneyIn = amount + prevAmount;
    $('#totalIn').val('$' + totalMoneyIn.toFixed(2));
});

function loadMachine() {

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/items',
        success: function (itemInventory) {
            $.each(itemInventory, function (index, item) {

                var itemNumber = $('#item' + item.id);

                var row = '<p class="alignId">';
                row += item.id + '</p>';
                row += '<img src="images/' + item.id + '.jpg" rel="image" class="itemImage"/>'
                row += '<p>$' + item.price.toFixed(2) + '</p>';
                row += '<p>Quantity: ' + item.quantity + '</p></a >';

                itemNumber.append(row);
            });
        },
        error: function (jqXHR, testStatus, errorThrow) {

        }
    });
}

function sendItemNumber(id) {

    $('#itemSelection').val(id);
}