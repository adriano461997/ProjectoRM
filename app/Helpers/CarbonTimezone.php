<?php

namespace App\Helpers;

use Illuminate\Support\Carbon;

class CarbonTimezone
{
    /**
     * @param $string
     * @return Carbon|null
     */
    static function make($string): ?Carbon
    {

        if(!$string){
            return Carbon::now();
        }

        return Carbon::make($string)->timezone("Africa/Luanda");
    }
}
