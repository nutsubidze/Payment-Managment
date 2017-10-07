$(function () {

    $(document).on('click', '.list--item', function () {
        $('.list--item').removeClass('active');
        $(this).addClass('active');
    });

    $('#closePopUp').click(function () {
        $('#popUp').fadeOut('slow');
    });

    $('#addPaymentBtn').click(function () {
        $('#popUp').fadeIn('slow');
    });

    $('#extendBtn').click(function () {
        $('#extendedFiltersSection').slideToggle('slow');
    });

    $('.columns-container').fadeIn('slow');

    $('.list--chart--title').fadeIn('slow');

    //chart >>>
    function initChart() {
        $('.column').each(function (item) {
            // var random = Math.floor((Math.random() * 100) + 1);
            var left = $(this).data('index') * ($(this).width() + ($(this).width() * 0.2));
            $(this).css("left", left);
            $(this).css("height", (Math.round($(this).data('percent')) * 2) + "px");
        });
    }

    initChart();

    $(window).resize(function () {
        initChart();
    });

    //chart <<<<<

    $('.datepicker').datepicker();


//    Crud Ajax Operations

    function generatePaymentList(data) {
        var payment_item = '';
        $('#countPayment').html(data.length);

        data.forEach(function (item) {
            payment_item += '<div class="list--item">';
            payment_item += '<div class="item item--title">' + item.title + '</div>';
            payment_item += '<div class="item item--date">' + item.date + '</div>';
            payment_item += '<div class="clearfix"></div>';
            payment_item += '<div class="item item--category">';
            payment_item += '<div class="btn item--category--btn">' + item.category_title + '</div>';
            payment_item += '</div>';
            payment_item += '<div class="item item--amount"><span>-' + item.amount + '</span> <span class="gel">GEL</span>';
            payment_item += '</div>';
            payment_item += '<div class="item item--comment">';
            payment_item += '<h3>comment</h3>';
            payment_item += '<p>' + item.comment + '</p>';
            payment_item += '</div>';
            payment_item += '</div>';
        });

        return payment_item;
    }

    function generateChart(data) {
        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        var column_item = '';
        for (var i = 1; i <= 12; i++) {

            column_item += '<div class="column" data-percent="' + parseFloat(Math.round(data[i] * 100) / 100).toFixed(2) + '" data-index="' + i + '">';
            column_item += '<div class="date">' + month[i - 1];
            column_item += '</div>';
            column_item += '<div class="percent">' + parseFloat(Math.round(data[i] * 100) / 100).toFixed(2) + '</div>';
            column_item += '</div>';
        }

        initChart();

        return column_item;
    }

    $('.requiredForCreate').change(function () {
        if ($(this).val() === '') {
            $(this).closest('.form--layout').addClass('error');
        } else {
            $(this).closest('.form--layout').removeClass('error');
        }
    });

    function checkCreateValidity() {
        var valid = true;
        $('.requiredForCreate').each(function () {
            if ($(this).val() === '') {
                valid = false;
                $(this).closest('.form--layout').addClass('error');
            } else {
                $(this).closest('.form--layout').removeClass('error');
            }
        });
        return valid;
    }

    $('#createPayment').click(function (e) {

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        e.preventDefault();

        if (!checkCreateValidity()) {
            return 0;
        }

        var formData = {
            title: $('#addTitle').val(),
            amount: $('#addAmount').val(),
            date: $('#addDate').val(),
            comment: $('#addComment').val(),
            category_id: $('#addCategory').val(),
        };

        var type = "POST";
        var url = '/create';

        $.ajax({

            type: type,
            url: url,
            data: formData,
            dataType: 'json',
            success: function (data) {
                console.log(data);

                $('#paymentList').html(generatePaymentList(data.payments));
                $('#allMonthJs').html(generateChart(data.allMonth));
                $('#totalNumber').html(data.filteredAmount);
                $('#closePopUp').click();
                initChart();

            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });


    $('#search').keyup(function (e) {

        var CategoryIds = new Array();

        $('.categoryJs').each(function (item) {
            if ($(this).hasClass('active')) {
                CategoryIds.push($(this).data('id'));
            }
        });

        var formData = {
            title: $(this).val(),
            categoryIds: CategoryIds,
            dateFrom: $('#dateFrom').val(),
            dateTo: $('#dateTo').val(),
            amountFrom: $('#amountFrom').val(),
            amountTo: $('#amountTo').val(),
        };

        var type = "GET";
        var url = '/search';

        $.ajax({

            type: type,
            url: url,
            data: formData,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                $('#paymentList').html(generatePaymentList(data.payments));
                $('#allMonthCategoryJs').html(generateChart(data.allMonth_category));
                $('#totalNumber').html(data.filteredAmount);
                initChart();
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });


    });

    var categoryJs = $('.categoryJs');
    categoryJs.click(function () {
        $(this).toggleClass('active');
        $('#search').keyup();
    });

    var inputJs = $('.inputJS');
    inputJs.blur(function () {
        $('#search').keyup();
    });

    inputJs.keyup(function () {
        $('#search').keyup();
    });

});