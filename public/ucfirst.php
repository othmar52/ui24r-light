<?php

$i = "
consoleconsoleconsolesnak_the_ripper
console
consolesnak_the_rippersnak_the_ripper
console
";

$firstIsNum = true;
foreach (explode("\n", $i) as $x) {
    $numba = "";
    if ($firstIsNum === true) {
        $xxx = explode(" ", $x, 2);
        $numba = $xxx[0].",";
        $x = $xxx[1];
    }
    echo $numba . ucfirst(strtolower($x)) . "\n";
}
