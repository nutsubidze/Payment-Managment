$(function () {

    //events for show/hide
    $(document).on('click', '.list--item', function () {
        $('.list--item').removeClass('active');
        $(this).addClass('active');
    });

    //close pop-up and reset
    $('#closePopUp').click(function () {
        $('#popUp').fadeOut('slow');
        $('#addTitle').val('');
        $('#addAmount').val('');
        $('#addDate').val('');
        $('#addComment').val('');
    });

    $('#addPaymentBtn').click(function () {
        $('#popUp').fadeIn('slow');
    });

    $('#extendBtn').click(function () {
        $('#extendedFiltersSection').slideToggle('slow');
    });

    $('.columns-container').fadeIn('slow');

    $('.list--chart--title').fadeIn('slow');
    //events for show/hide  ---

    // chart ---------------------------------

    //general chart function for initialize
    function initChart() {
        $('.column').each(function (item) {
            // var random = Math.floor((Math.random() * 100) + 1);
            var left = $(this).data('index') * ($(this).width() + ($(this).width() * 0.2));
            $(this).css("left", left);
            $(this).css("height", (Math.round($(this).data('percent')) * 2) + "px");
        });
    }

    initChart();
    //processing charts after resizing for responsive
    $(window).resize(function () {
        initChart();
    });

    // chart -------------------------------

    //initialize datepicker
    $('.datepicker').datepicker();

    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    //general function for payments list rendering
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

    //general function for charts rendering
    function generateChart(data) {

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

    //check valid after change for only current input
    $('.requiredForCreate').change(function () {
        if ($(this).val() === '') {
            $(this).closest('.form--layout').addClass('error');
        } else {
            $(this).closest('.form--layout').removeClass('error');
        }
    });

    //check form valid for all inputs for pop-up - add payment
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

    //get Categories chart data info for offline mode
    function getFilteredDataForCategoryChart(formData, data) {
        data.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        if (formData && formData.categoryIds.length != 0) {
            data = jQuery.grep(data, function (item) {
                return formData.categoryIds.includes(item.category_id);
            });
        }

        var allMonthInfo = [];
        for (var i = 1; i <= 12; i++) {
            var totalAmountPerMonth = 0;
            var totalAmount = 0;
            var monthNumber = i;
            var currentYear = new Date().getFullYear();
            data.forEach(function (item) {
                totalAmount = totalAmount + parseInt(item.amount);
                if (monthNumber < 10) monthNumber = '0' + i;
                var startMonth = new Date(currentYear + ',' + monthNumber + ',01');
                var endMonth = new Date(currentYear + ',' + monthNumber + ',31');

                if (new Date(item.date) >= startMonth && new Date(item.date) <= endMonth) {
                    totalAmountPerMonth += parseInt(item.amount);
                }
            });
            allMonthInfo[i] = (totalAmountPerMonth / totalAmount) * 100;
        }
        return allMonthInfo;
    }

    //running filter parameters for offline mode
    function getFilteredDataForOfflineMode(formData, data) {

        data.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        if (formData.title) {
            data = jQuery.grep(data, function (item) {
                return item.title.includes(formData.title);
            });
        }

        if (formData.amountFrom) {
            data = jQuery.grep(data, function (item) {
                return parseInt(item.amount) >= parseInt(formData.amountFrom);
            });
        }

        if (formData.amountTo) {
            data = jQuery.grep(data, function (item) {
                return parseInt(item.amount) <= parseInt(formData.amountTo);
            });
        }

        if (formData.categoryIds.length != 0) {
            data = jQuery.grep(data, function (item) {
                return formData.categoryIds.includes(item.category_id);
            });
        }

        if (formData.dateFrom !== '') {
            data = jQuery.grep(data, function (item) {
                return new Date(item.date) <= new Date(formData.dateFrom);
            });
        }

        if (formData.dateTo !== '') {
            data = jQuery.grep(data, function (item) {
                return new Date(item.date) >= new Date(formData.dateTo);
            });
        }
        return data;
    }

    //generate all data information for offline mode to rendering
    function countDataForOfflineMode(formData, data) {
        var allData = [];
        var filteredData = [];
        var filteredDataTotalAmount = 0;
        var filteredDateForCategoryChart;

        if (formData) {
            filteredDateForCategoryChart = getFilteredDataForCategoryChart(formData, data);
            data = getFilteredDataForOfflineMode(formData, data);
        } else {
            filteredDateForCategoryChart = getFilteredDataForCategoryChart('', data);
        }

        data.forEach(function (item) {

            var monthName = month[new Date(item.date).getMonth()];
            var dayNumber = new Date(item.date).getDate();
            if (dayNumber < 10) dayNumber = '0' + dayNumber;
            item.date = monthName + ', ' + dayNumber + ', ' + new Date(item.date).getFullYear();
            filteredData.push(item);
            filteredDataTotalAmount += parseInt(item.amount);

        });

        allData['filteredData'] = filteredData;
        allData['filteredDataTotalAmount'] = parseFloat(filteredDataTotalAmount).toFixed(2);
        allData['filteredDateForCategoryChart'] = filteredDateForCategoryChart;
        return allData;
    }

    //common ajax methods ---
    Offline.check();
    var syncData = [];
    //create payment ----
    $('#createPayment').click(function (e) {
        //check offline status -----
        Offline.check();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        // e.preventDefault();

        //check form valid client side
        if (!checkCreateValidity()) {
            return 0;
        }

        //request params
        var formData = {
            title: $('#addTitle').val(),
            amount: $('#addAmount').val(),
            date: $('#addDate').val(),
            comment: $('#addComment').val(),
            category_id: $('#addCategory').val(),

        };

        var type = "POST";
        var url = '/create';

        //when is connection
        if (Offline.state === 'up') {

            if (syncData.length > 0) {
                formData['syncData'] = syncData;
            }
            $.ajax({
                type: type,
                url: url,
                data: formData,
                dataType: 'json',
                success: function (data) {
                    //clear sync array after success added
                    syncData = [];

                    //set all payment data after init for offline mode
                    window.sessionStorage.setItem("allPaymentsForOffline", JSON.stringify(data.allPaymentsForOffline));

                    //client side rendering
                    $('#paymentList').html(generatePaymentList(data.payments));
                    $('#allMonthJs').html(generateChart(data.allMonth));
                    $('#allMonthCategoryJs').html(generateChart(data.allMonth));
                    $('#totalNumber').html(data.filteredAmount);
                    $('#closePopUp').click();
                    initChart();

                },
                error: function (data) {
                    console.log('Error:', data);
                }
            });
        }

        //when not connection
        if (Offline.state === 'down') {
            //get saved info for processing data - for offline
            var data = JSON.parse(window.sessionStorage.getItem("allPaymentsForOffline"));

            data.push(formData);
            //save in session after add obj
            window.sessionStorage.setItem("allPaymentsForOffline", JSON.stringify(data));

            //encoding data after save
            data = JSON.parse(window.sessionStorage.getItem("allPaymentsForOffline"));

            //save new obj another array for sync to server
            syncData.push(formData);

            var obj = countDataForOfflineMode('', data);

            //client side render
            $('#paymentList').html(generatePaymentList(obj['filteredData']));
            $('#totalNumber').html(obj['filteredDataTotalAmount']);
            $('#allMonthJs').html(generateChart(obj['filteredDateForCategoryChart']));
            $('#closePopUp').click();
            initChart();
        }
        return false;
    });


    $('#search').keyup(function (e) {
        //check offline status -----
        Offline.check();

        var CategoryIds = new Array();
        $('.categoryJs').each(function (item) {
            if ($(this).hasClass('active')) {
                CategoryIds.push($(this).data('id'));
            }
        });

        //request params
        var formData = {
            title: $(this).val(),
            categoryIds: CategoryIds,
            dateFrom: $('#dateFrom').val(),
            dateTo: $('#dateTo').val(),
            amountFrom: $('#amountFrom').val(),
            amountTo: $('#amountTo').val()
        };

        var type = "GET";
        var url = '/search';

        //when is connection
        if (Offline.state === 'up') {
            $.ajax({
                type: type,
                url: url,
                data: formData,
                dataType: 'json',
                success: function (data) {
                    //set all payment data after init for offline mode
                    window.sessionStorage.setItem("allPaymentsForOffline", JSON.stringify(data.allPaymentsForOffline));

                    //render client side
                    $('#paymentList').html(generatePaymentList(data.payments));
                    $('#allMonthCategoryJs').html(generateChart(data.allMonth_category));
                    $('#totalNumber').html(data.filteredAmount);
                    initChart();
                },
                error: function (data) {
                    console.log('Error:', data);
                }
            });
        }

        //when not connection
        if (Offline.state === 'down') {
            //get saved info for processing data - for offline
            var data = JSON.parse(window.sessionStorage.getItem("allPaymentsForOffline"));
            var obj = countDataForOfflineMode(formData, data);

            //client side render
            $('#paymentList').html(generatePaymentList(obj['filteredData']));
            $('#totalNumber').html(obj['filteredDataTotalAmount']);
            $('#allMonthCategoryJs').html(generateChart(obj['filteredDateForCategoryChart']));
            initChart();
        }

    });

    //active category buttons and initialize search
    var categoryJs = $('.categoryJs');
    categoryJs.click(function () {
        $(this).toggleClass('active');
        $('#search').keyup();
    });

    //init after site load
    $('#search').keyup();

    //event if exist sync data for server
    $(window).click(function (e) {
        if (Offline.state === 'up' && syncData.length > 0) {
            $('#createPayment').click();
        }
    });

    //running events for binding
    var inputJs = $('.inputJS');
    inputJs.blur(function () {
        $('#search').keyup();
    });

    //running events for binding
    inputJs.keyup(function () {
        $('#search').keyup();
    });

});