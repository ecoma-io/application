<?php

if( $_SERVER['QUERY_STRING'] == '' || empty($_COOKIE['adminer_permanent'] ) ){

    $_POST['auth'] = [
        'driver'    => 'pgsql',
        'server'    => 'postgres',
        'username'  => 'user',
        'password'  => 'password',
        'db'        => 'database',
        'permanent' => 1,
    ];

}

?>
