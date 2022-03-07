<?php 
    require_once 'Class/Database.php';
    require_once 'function.php';

    $sentence = file_get_contents('sql/query_code_polygon_asic.sql');
    $html = file_get_contents('html/table_asic.html');
    $cod_asic = isset($_POST['cod_asic']) ? validation_input_integer($_POST['cod_asic']) : null;

    if($cod_asic != null){
        $db = new Database();
        $query = $db -> connect() -> prepare($sentence);
        $query -> execute(['cod_asic' => $cod_asic]);
        if($query){
            $data = $query -> fetch(PDO::FETCH_ASSOC);

            if($data['nombre'] != null){
                $remove_duplicate_text_mun = remove_duplicate_text($data['municipios']);
                $data['municipios'] = $remove_duplicate_text_mun['text'];
                $data['mun'] = ($remove_duplicate_text_mun['count'] == 1) ? 'municipio' : 'municipios';

                $remove_duplicate_text_parr = remove_duplicate_text($data['parroquias']);
                $data['parroquias'] = $remove_duplicate_text_parr['text'];
                $data['parr'] = ($remove_duplicate_text_parr['count'] == 1) ? 'parroquia' : 'parroquias';

                foreach($data as $items => $value){
                    $html = str_replace('{' . $items . '}', $value, $html);
                }
    
                $response = [
                    'response' => true,
                    'html' => $html
                ];
            }else{
                $response = [
                    'response' => false,
                    'html' => '<b>la consulta no genero ningún registro valido</b>'
                ];
            }

        }

        
    }else{
        $response = [
            'response' => false,
            'html' => '<b>la variable de entrada es invalido y/o nulo</b>'
        ];
    }
    
    echo json_encode($response, JSON_NUMERIC_CHECK);
    
?>