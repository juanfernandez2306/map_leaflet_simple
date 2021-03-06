SELECT
UPPER(e.nombre) AS nombre,
CASE 
	WHEN e.id_tipo = 1 THEN 'RED HOSPITALARIA'
	WHEN e.id_tipo = 2 THEN 'RED DE CENTRO DE DIAGNOSTICO INTEGRAL DE SALUD'
	WHEN e.id_tipo = 3 THEN 'RED AMBULATORIA ESPECIALIZADA DE SALUD'
	ELSE 'RED DE ATENCION COMUNAL DE SALUD'
END AS tipo_estab,
UPPER(a.nombre) AS asic,
UPPER(m.municipio) AS municipio,
UPPER(p.parroquia) AS parroquia,
UPPER(e.direccion) AS direccion,
CASE 
	WHEN e.url_foto IS NULL THEN NULL
	ELSE CONCAT('assets/img_estab/', LOWER(e.url_foto))
END AS url_foto,
IF(e.url_foto IS NULL, 'hide', '') AS class_hide
FROM establecimientos_salud AS e
LEFT JOIN parroquias AS p ON p.cod_parr = e.cod_parr
LEFT JOIN municipios AS m ON m.cod_mun = p.cod_mun
LEFT JOIN asic AS a ON a.cod_asic = e.cod_asic
WHERE e.id_estab = :id_estab