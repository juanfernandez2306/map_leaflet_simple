<?php 
    require_once 'Class/Database.php';

    $sentence = file_get_contents('sql/query_establishment_health.sql');

    $db = new Database();
    $query = $db -> connect() -> prepare($sentence);
    $query -> execute();

    $header = ['id_estab', 'id_tipo', 'x', 'y'];
    $data = [];

    while($rows = $query -> fetch(PDO::FETCH_ASSOC)){
        array_push($data, [
            $rows['id_estab'],
            $rows['id_tipo'],
            $rows['x'],
            $rows['y']
        ]);
    }

    echo json_encode([
        'header' => $header,
        'data' => $data
    ], JSON_NUMERIC_CHECK);
?>