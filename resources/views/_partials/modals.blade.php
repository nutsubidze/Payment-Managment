<div class="pop-up" id="popUp">
    <div class="container">
        <div class="row">
            <div class="col-md-6 col-md-offset-3">
                <div class="item">
                    <div class="item--title">ADD NEW PAYMENT</div>
                    <div class="close--btn pull-right" id="closePopUp">
                        <img src="{{asset('css/imgs/Close--icon.png')}}">
                    </div>
                    <div class="row">
                        <div class="col-md-10 col-md-offset-1">
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="form--layout">
                                        <p>Title</p>
                                        <input type="text" class="requiredForCreate"  id="addTitle">
                                        <p class="error-msg">* Required</p>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form--layout filled">
                                        <p>Amount:</p>
                                        <input type="number" class="requiredForCreate" id="addAmount">
                                        <p class="error-msg">* Required</p>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form--layout filled">
                                        <p>Category:</p>
                                        <select id="addCategory" class="requiredForCreate">
                                            @foreach($categories as $category)
                                                <option value="{{$category->id}}"
                                                        data-id="{{$category->id}}">
                                                    {{$category->title}}
                                                </option>
                                            @endforeach
                                        </select>
                                        <p class="error-msg">* Required</p>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form--layout filled">
                                        <p>Date:</p>
                                        <input type="text" id="addDate" class="datepicker requiredForCreate" placeholder="Date"/>
                                        <p class="error-msg">* Required</p>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form--layout filled">
                                        <p>Comment:</p>
                                        <textarea id="addComment" class="requiredForCreate"></textarea>
                                        <p class="error-msg">* Required</p>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <button class="btn btn--create pull-right " id="createPayment">create</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>