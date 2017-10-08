<!DOCTYPE html>
<html lang="ka">
@include('_partials.head')
<body>
@include('_partials.modals')
@include('_partials.header')
<main>
    <div class="container">
        <!--    filters block-->
        <section class="filters">
            <a id="addPaymentBtn" class="item item--add">
                <span class="icon icon--add"></span>
                <span class="item--text">ADD PAYMENT</span>
            </a>
            <div class="filters--items--container">
                <a class="item item--search">
                    <span class="icon icon--search"></span>
                    <input type="text" id="search" placeholder="filter by any property..."/>
                </a>
                <div class="item item--extend">
                    <span class="btn item-btn" id="extendBtn">extended filters</span>
                </div>
            </div>
        </section>

        {{--extended filters--}}
        <section class="extendedFilters" id="extendedFiltersSection">
            <div class="triangle"></div>
            <div class="item item--category">
                <h2>filter by category</h2>
                @foreach($categories as $item)
                    <div class="btn item-btn categoryJs" data-id="{{$item->id}}">{{$item->title}}</div>
                @endforeach
            </div>
            <div class="item item--date">
                <h2>filter by date</h2>
                <input type="text" id="dateFrom" class="datepicker inputJS" placeholder="from"/>
                <input type="text" id="dateTo" class="datepicker inputJS" placeholder="to"/>
            </div>
            <div class="item item--amount">
                <h2>filter by amount</h2>
                <input type="number" class="inputJS" id="amountFrom" placeholder="from"/>
                <input type="number" class="inputJS" id="amountTo" placeholder="to"/>
            </div>
        </section>

        {{--{{dd($allMonth)}}--}}
        <section class="content">
            <h3><span id="countPayment">{{count($allPayment)}}</span> records found</h3>

            <div class="list list--payment">
                <div class="items--container" id="paymentList">
                    @foreach($allPayment as $payment)
                        <div class="list--item">
                            <div class="item item--title">{{$payment->title}}</div>
                            <div class="item item--date"> {{ $payment->date }}</div>
                            <div class="clearfix"></div>
                            <div class="item item--category">
                                <div class="btn item--category--btn">{{$payment->category_title}}</div>
                            </div>
                            <div class="item item--amount"><span>-{{$payment->amount}}</span> <span
                                        class="gel">GEL</span>
                            </div>
                            <div class="item item--comment">
                                <h3>comment</h3>
                                <p>{{$payment->comment}}</p>
                            </div>
                        </div>
                    @endforeach
                </div>
                <div class="total">
                    <span class="total--text">Total:</span>
                    <span class="total--number" id="totalNumber">{{$sumPayments}}</span>
                </div>
            </div>
            <div class="list list--chart">
                <div class="list--chart--title">Payments per date</div>
                <div class="columns-container" id="allMonthJs">
                    @foreach($allMonth as $month=>$percent)
                        <div class="column" data-percent="{{$percent}}" data-index="{{$month}}">
                            <div class="date">
                                {{date('M', mktime(0, 0, 0, $month, 10))}}</div>
                            <div class="percent">{{number_format($percent, 2)}}</div>
                        </div>
                    @endforeach
                </div>
                <div class="list--chart--title">Payments per category</div>
                <div class="columns-container" id="allMonthCategoryJs">
                    @foreach($allMonth_category as $month=>$percent)
                        <div class="column" data-percent="{{$percent}}" data-index="{{$month}}">
                            <div class="date">
                                {{date('M', mktime(0, 0, 0, $month, 10))}}</div>
                            <div class="percent">{{number_format($percent, 2)}}</div>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>
    </div>
</main>
@include('_partials.footer')
</body>
<script src="./js/app.js"></script>
</html>