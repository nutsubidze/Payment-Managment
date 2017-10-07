<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';

    protected $fillable = [
        'category_id', 'title', 'comment', 'date', 'amount','created_at'
    ];

//    public $timestamps = true;

}
