<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\models\Payment;
use Response;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function index()
    {
        $data['categories'] = DB::table('categories')->get();
        $data['allPayment'] = $this->getAllPayment('', '', '', '', '', '')['payments'];
        $data['allMonth'] = $this->getAllPayment('', '', '', '', '', '')['allMonth'];
        $data['allMonth_category'] = $this->getAllPayment('', '', '', '', '', '')['allMonth_category'];
        $data['sumPayments'] = $this->getAllPayment('', '', '', '', '', '')['filteredAmount'];
        return view('app', $data);
    }


    public function create(Request $request)
    {
        $request['date'] = Carbon::parse($request['date']);
        $payment = Payment::create($request->all());

        return Response::json($this->getAllPayment('', '', '', '', '', ''));
    }

    public function getAllPayment($searchValue, $categoryIds, $dateFrom, $dateTo, $amountFrom, $amountTo)
    {

        $sumPayments = DB::table('payments')->sum('amount');

        $query = DB::table('payments')->join('categories', 'categories.id', '=', 'payments.category_id')
            ->select('*',
                'categories.title as category_title',
                'payments.title as title'
            );

        $queryForAllPayments = $query;
        $data['allPaymentsForOffline'] = $queryForAllPayments->get();

        $queryForAmount = DB::table('payments');

        if ($searchValue) {
            $query->where('payments.title', 'LIKE', "%$searchValue%");
            $queryForAmount->where('payments.title', 'LIKE', "%$searchValue%");
        }

        if ($dateFrom) {
            $dateFrom = Carbon::parse($dateFrom)->format('Y-m-d');
            $query->where('payments.date', '>=', $dateFrom);
            $queryForAmount->where('payments.date', '>=', $dateFrom);
        }

        if ($dateTo) {
            $dateTo = Carbon::parse($dateTo)->format('Y-m-d');
            $query->where('payments.date', '<=', $dateTo);
            $queryForAmount->where('payments.date', '<=', $dateTo);
        }

        if ($amountFrom) {
            $query->where('payments.amount', '>=', $amountFrom);
            $queryForAmount->where('payments.amount', '>=', $amountFrom);
        }

        if ($amountTo) {
            $query->where('payments.amount', '<=', $amountTo);
            $queryForAmount->where('payments.amount', '<=', $amountTo);
        }

        if ($categoryIds) {
            $query->whereIn('payments.category_id', $categoryIds);
            $queryForAmount->whereIn('category_id', $categoryIds);
        }

        $data['payments'] = $query
            ->orderBy('date', 'desc')
            ->get()->each(function ($item, $key) {
                $item->date = Carbon::parse($item->date)->format('M, d, Y');
            });

        $data['filteredAmount'] = $queryForAmount->sum('amount');
        $currentYear = Carbon::now()->year;
        $allMonth = [];
        $allMonth_category = [];

        for ($i = 1; $i <= 12; $i++) {

            if ($categoryIds) {
                $queryForChart = DB::table('payments')->whereIn('category_id', $categoryIds);
            } else {
                $queryForChart = DB::table('payments');
            }

            if ($sumPayments === 0) break;

            if ($i < 10) {
                $month = '0' . $i;
            } else {
                $month = $i;
            }

            $StartMonth = Carbon::parse($currentYear . '-' . $month . '-01')->format('Y-m-d');
            $EndMonth = Carbon::parse($currentYear . '-' . $month . '-31')->format('Y-m-d');

            $sumMonth = DB::table('payments')
                ->whereBetween('date', [$StartMonth, $EndMonth])
                ->sum('amount');

            $sumMonth_Category = $queryForChart
                ->whereBetween('date', [$StartMonth, $EndMonth])
                ->sum('amount');

            $allMonth[$i] = ($sumMonth / $sumPayments) * 100;
            $allMonth_category[$i] = ($sumMonth_Category / $sumPayments) * 100;
        }
        $data['allMonth'] = $allMonth;
        $data['allMonth_category'] = $allMonth_category;
        $data['sumPayments'] = $sumPayments;
        return $data;

    }

    public function search(Request $request)
    {
        $searchValue = $request->title;
        $categoryIds = $request->categoryIds;
        $dateFrom = $request->dateFrom;
        $dateTo = $request->dateTo;
        $amountFrom = $request->amountFrom;
        $amountTo = $request->amountTo;

        return Response::json($this->getAllPayment($searchValue, $categoryIds, $dateFrom, $dateTo, $amountFrom, $amountTo));
    }
}
