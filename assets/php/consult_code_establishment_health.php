<?php 
    require_once 'Class/Database.php';
    require_once 'function.php';

    $sentence = file_get_contents('sql/query_health_establishment_code.sql');
    $html = file_get_contents('html/table_establishment_health.html');
    $id_estab = isset($_POST['id_estab']) ? validation_input_integer($_POST['id_estab']) : null;

    if($id_estab != null){
        $db = new Database();
        $query = $db -> connect() -> prepare($sentence);
        $query -> execute(['id_estab' => $id_estab]);
        if($query){
            $data = $query -> fetch(PDO::FETCH_ASSOC);

            if($data['nombre'] != null){

                foreach($data as $items => $value){
                    $html = str_replace('{' . $items . '}', $value, $html);
                }
    
                $response = [
                    'response' => true,
                    'html' => $html,
                    'url_photo' => $data['url_foto']
                ];
            }else{
                $response = [
                    'response' => false,
                    'html' => '<b>la consulta no genero ningún registro valido</b>',
                    'url_photo' => null
                ];
            }

        }

        
    }else{
        $response = [
            'response' => false,
            'html' => '<b>la variable de entrada es invalido y/o nulo</b>',
            'url_photo' => null
        ];
    }
    
    echo json_encode($response, JSON_NUMERIC_CHECK);
?>