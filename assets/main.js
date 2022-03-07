/**
    @function
    @param {string} element - name selector html
    @returns {objects} Element DOM
 */
const selectElement = (element) => document.querySelector(element);
const selectElementAll = (element) => document.querySelectorAll(element);
const selectVarCSS = (element) => getComputedStyle(document.body).getPropertyValue(element);

/**
    @constant
    @type {string}
    @default 
 */
const url_consult_asic = 'assets/php/consult_asic.php';
const url_consult_code_establishment_health = 'assets/php/consult_code_establishment_health.php';

/**
    Element HTML contains Class close_sidebar 
    is required attribute data-sidebar
    @param {string} dataset - name ID Element 
 */
function close_sidebar(e){
    e.preventDefault();
    var name_sidebar = this.dataset.sidebar;
    var id_sidebar = '#' + name_sidebar;
    var sidebar = selectElement(id_sidebar);

    var wallpaper = selectElement('#wallpaper');

    selectElement('#screen').style['animation-name'] = 'fade_in_screen';

    setTimeout(() => {
        sidebar.classList.remove(name_sidebar);
        sidebar.classList.add('hide');

        wallpaper.classList.remove('wallpaper');
        wallpaper.classList.add('hide');
    }, 1000);

    setTimeout(() => {
        selectElement('#screen').style['animation-name'] = '';
    }, 2100);
    
}

/**
    ckeck if it contains class name
    @param {Element} element - Element HTML
    @param {string} class_name - name class
    @returns {boolean}
 */
function verify_class_element(element, class_name){
    return element.classList.contains(class_name);
}

function restart_menu_burge(){
    const media_query = '(max-width: 900px)';
    var font_burge = selectElement('#font_burge'),
        font_close = selectElement('#font_close'),
        menu_items = selectElement('.menu_items');

    if(window.matchMedia(media_query)){
        if(verify_class_element(font_burge, 'hide')){
            font_burge.classList.remove('hide');
        }

        if(verify_class_element(font_close, 'hide') == false){
            font_close.classList.add('hide');
        }
        
        if(verify_class_element(menu_items, 'hide_menu') == false){
            menu_items.classList.add('hide_menu');
        }
        
    }
}

/**
    Element HTML list menu nav 
    is requerid attribute data-sidebar
    @param {string} dataset - name ID Element
*/

function open_sidebar(e){
    e.preventDefault();

    var btn = this;
    btn.disabled = true;

    var name_sidebar = this.dataset.sidebar;
    var id_sidebar = '#' + name_sidebar;
    var sidebar = selectElement(id_sidebar);

    var wallpaper = selectElement('#wallpaper');

    wallpaper.classList.remove('hide');
    wallpaper.classList.add('wallpaper');

    sidebar.classList.add(name_sidebar);

    selectElement('#screen').style['animation-name'] = 'fade_in_screen';

    restart_menu_burge();

    setTimeout(() => {
        btn.removeAttribute('disable');
        sidebar.classList.remove('hide');
    }, 1000);

    setTimeout(() => {
        selectElement('#screen').style['animation-name'] = '';
    }, 2100);
}

function state_menu_burge(e){
    e.preventDefault();
    selectElement('#font_burge').classList.toggle('hide');
    selectElement('#font_close').classList.toggle('hide');
    selectElement('.menu_items').classList.toggle('hide_menu');
}

async function get_data_json(url){
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

async function get_data_img(url){
    let response = await fetch(url);
    let blob = await response.blob();
    return URL.createObjectURL(blob);
}

function load_img_establishment(url){

    var btn_close_response = selectElementAll('.close_info_response');

    btn_close_response.forEach((element) =>{
        element.disabled = true;
    });

    get_data_img(url)
    .then(response_img =>{

        btn_close_response.forEach((element) =>{
            element.removeAttribute('disabled');
        });

        var preload_img = selectElement('#preload_img'),
            img = document.createElement('img');

        img.src = response_img;

        preload_img.innerHTML = '';
        preload_img.appendChild(img);
        selectElement('#preload_img img').style['animation.name'] = 'fade_in_data';

        setTimeout(() => {
            selectElement('#preload_img img').style['animation.name'] = '';
        }, 1100);
        
    })
    .catch(error => {

        btn_close_response.forEach((element) =>{
            element.removeAttribute('disabled');
        });

        var preload_img = selectElement('#preload_img');

        preload_img.innerHTML = `
        <div class="error_response">
            <svg><use xlink:href="#cloud_computing"/></svg>
            <h3>¡Disculpe! Ocurrió un error de conexión con el servidor.</h3>
            <h3>Verifique su conexión de internet.</h3>
        </div>
        `;

        console.log(error.message);
    });
}

async function callback_response({cod_number, name_field, url}){
    var data = new FormData();
    data.append(name_field, cod_number);

    selectElement('#screen').style['animation-name'] = 'fade_in_screen';

    setTimeout(() => {
        var sidebar = selectElement('#info_response');
        var wallpaper = selectElement('#wallpaper');

        wallpaper.classList.remove('hide');
        wallpaper.classList.add('wallpaper');

        sidebar.classList.add('info_response');
        sidebar.classList.remove('hide');

    }, 1000);

    setTimeout(() => {
        selectElement('#screen').style['animation-name'] = '';
    }, 2100);

    await fetch(url, {
        method : 'POST',
        body : data
    })
    .then(response => response.json())
    .then(data => {
        var preloader_header = selectElement('#preloader_header'),
            content_response = selectElement('#content_response'),
            body_response = selectElement('#body_response');
        
        if(data.response){
            preloader_header.classList.add('hide');
            content_response.classList.remove('hide');
            content_response.classList.add('sidebar');
            content_response.style['animation-name'] = 'fade_in_data';
            body_response.innerHTML = data.html;

            setTimeout(() => {
                content_response.style['animation-name'] = '';
            }, 1100);

            if(name_field == 'id_estab' && data.url_photo != null){
                load_img_establishment(data.url_photo);
            }
        }
        
    })
    .catch((error) => {
        var preloader_header = selectElement('#preloader_header'),
            content_response = selectElement('#content_response'),
            body_response = selectElement('#body_response');

        preloader_header.classList.add('hide');
        content_response.classList.remove('hide');
        content_response.classList.add('sidebar');
        
        body_response.innerHTML = `
        <div class="error_response">
            <svg><use xlink:href="#cloud_computing"/></svg>
            <h3>¡Disculpe! Ocurrió un error de conexión con el servidor.</h3>
            <h3>Verifique su conexión de internet.</h3>
        </div>
        `;

        console.log(error.message);
    });

}

function create_legend(array_img){
    var legend = L.control({
        position : 'bottomright'
    });
    
    var html = `
        <div class="title">
            <h3>
                <i class="fas fa-list"></i>
                Leyenda
            </h3>
        </div>
        <div class="items">
            <img src="${array_img[0]}" alt="hospital">
            <b>Hospital</b>
        </div>
        <div class="items">
            <img src="${array_img[1]}" alt="cdi">
            <b>Centro de Diágnostico Integral Comunitario</b>
        </div>
        <div class="items">
            <img src="${array_img[2]}" alt="raes">
            <b>Ambulatorio de la Red Especializada</b>
        </div>
        <div class="items">
            <img src="${array_img[3]}" alt="racs">
            <b>Consultorio de la Red Comunal</b>
        </div>
    `;

    legend.onAdd = function(e){
        var name_class = 'map_legend',
            name_baselayer = selectElement('#toggle').dataset.basemap;

        if(name_baselayer == 'osm'){
            name_class += ' background_primary';
        }else{
            name_class += ' background_secondary';
        }

        this._div = L.DomUtil.create('div', name_class);
        this._div.innerHTML = html;
        return this._div;
    }

    return legend;
}

function create_info_map(){

    let info = L.control();

    info.onAdd = function(map){
		this._div = L.DomUtil.create('div', 'info background_primary');
		this.update();
		return this._div;
	}
	
	info.update = function(props){
        var html = `<div class='header_info'>
            <svg><use xlink:href="#map-pin-2"/></svg>
            <h3>AREA DE SALUD INTEGRAL COMUNITARIA <b>(ASIC)</b></h3>
        </div>`;

        var items_txt = (props) ? props.asic : 'DESPLACE EL CURSOR SOBRE UN ASIC';

        html += `<div id="info_text_asic">${items_txt}</div>`;
		
		this._div.innerHTML = html;
	}

    return info;
}

function create_polygon_geojson({polygon_asic, config, info, map}){

    function style(feature){
		return {
			weight: 2,
			opacity: 1,
			color: config.color_feature,
			dashArray: '3',
			fillOpacity: 0
		};
	}

	function highlightFeature(e){
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: config.color_highlightFeature,
			dashArray: '',
			fillOpacity: config.fillOpacity_highlightFeature
			});

		info.update(layer.feature.properties);
	};

    function resetHighlight(e){
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e){
		map.fitBounds(e.target.getBounds());

        var cod_asic = e.target.feature.properties.cod_asic;

        if(config.callback instanceof Function){
            config.callback({
                cod_number: cod_asic, 
                name_field: 'cod_asic', 
                url: url_consult_asic});
        }

	}

	function onEachFeature(feature, layer){
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

    var geojson = L.topoJson(polygon_asic, {
        style: style,
        onEachFeature: onEachFeature
    });

    return geojson;
}

function create_geojson_point(array_data_point){
    let geojson = {
        type : 'FeatureCollection',
        features : []
    };

    array_data_point.forEach((element) => {
        geojson.features.push(
            {
                type : 'Feature',
                geometry : {
                    type : 'Point',
                    coordinates: [element[2], element[3]]
                },
                properties: {
                    id_estab: element[0],
                    id_tipo: element[1]
                }
            }
        )
    });

    return geojson;
}

function filter_layer_geojson_point(layer_geojson, id_tipo, array_img, icon_size = 30){
    return L.geoJson(layer_geojson, {
        filter: function(feature, layer){
            return feature.properties.id_tipo == id_tipo
        },

        pointToLayer: function(feature, latlng){
            return icon = L.marker(latlng, {
                icon: L.icon({
                    iconUrl: array_img[id_tipo - 1],
                    iconSize: [icon_size, icon_size]
                })
            });
        },
        
        onEachFeature: function(feature, layer){
            layer.on('click', function(e){
                var id_estab = e.target.feature.properties.id_estab;

                callback_response({
                    cod_number: id_estab, 
                    name_field: 'id_estab', 
                    url: url_consult_code_establishment_health
                });

            })
        }
    });
}

function create_config_polygon_asic_change({
    name_basemap,
    input_checked,
    config_initial, 
    config_initial_callback}){

    if (name_basemap == 'osm'){
        config_initial.color_feature = selectVarCSS('--primary-color');
        config_initial.color_highlightFeature = selectVarCSS('--primary-color');
        config_initial.color_feature = selectVarCSS('--primary-color');

        config_initial_callback.color_feature = selectVarCSS('--primary-color');
        config_initial_callback.color_feature = selectVarCSS('--primary-color');
    }else{
        config_initial.color_feature = selectVarCSS('--secondary-color');
        config_initial.color_highlightFeature = selectVarCSS('--secondary-color');
        config_initial.color_feature = selectVarCSS('--secondary-color');

        config_initial_callback.color_feature = selectVarCSS('--secondary-color');
        config_initial_callback.color_feature = selectVarCSS('--secondary-color');
    }

    if(input_checked){
        return config_initial_callback;
    }else{
        return config_initial;
    }

}

function verifyCoordinateLimits(leafletObjectLatLng){
    var lat= leafletObjectLatLng.lat,
        lng = leafletObjectLatLng.lng;
        
    var limitLat = lat >= 8.36808 && lat <= 11.85079,
        limitLng = lng >= -73.37939 && lng <= -70.66714;
        
    if(limitLat == true && limitLng == true){
        return true;
    }else{
        return false;
    }
}

function init_geolocation({layer_group_geolocation, map}){

    var icon_init_geolocation = selectElement('#init_geolocation span span');

    icon_init_geolocation.classList.remove('fa-crosshairs');
    icon_init_geolocation.classList.add('fa-circle');
    icon_init_geolocation.classList.add('fade_in_color');

    map.locate({setView: true, maxZoom: 16});

    function onLocationFound(e){
        var radius = e.accuracy,
            verify_coordintes_point = verifyCoordinateLimits(e.latlng);

        if(parseInt(radius) > 100){

            Swal.fire({
                title: 'No se obtuvo buena precisión en la geolocalización',
                icon: 'error',
                iconColor: selectVarCSS('--fourth-color'),
                confirmButtonText: 'Cerrar',
                buttonsStyling: false,
                customClass: {
                    title: 'title_error_swal',
                    confirmButton: 'btn_close_swal'
                }
            });

            icon_init_geolocation.classList.remove('fa-circle');
            icon_init_geolocation.classList.add('fa-crosshairs');
            icon_init_geolocation.classList.remove('fade_in_color');

            selectElement('#init_geolocation').removeAttribute('disabled');

        }else if(verify_coordintes_point == false){
            Swal.fire({
                title: '¡Disculpe! Usted se encuentra fuera del área de influencia del estado Zulia - Venezuela',
                icon: 'error',
                iconColor: selectVarCSS('--fourth-color'),
                confirmButtonText: 'Cerrar',
                buttonsStyling: false,
                customClass: {
                    title: 'title_error_swal',
                    confirmButton: 'btn_close_swal'
                }
            });

            icon_init_geolocation.classList.remove('fa-circle');
            icon_init_geolocation.classList.add('fa-crosshairs');
            icon_init_geolocation.classList.remove('fade_in_color');

            selectElement('#init_geolocation').removeAttribute('disabled');

        }else{
            var content_html = `<div class="popup">
                <h2><i class="fas fa-user"></i></h2>
                <h3>Esta es tu ubicación con una precisión ${parseInt(radius)} de metros</h3>
            </div>`;
    
            var marker = L.marker(e.latlng)
                .bindPopup(content_html)
                .openPopup();
    
            var circle = L.circle(e.latlng, radius);

            setTimeout(()=>{

                Swal.fire({
                    title: 'Geolocalización satisfactoria',
                    icon: 'success',
                    iconColor: selectVarCSS('--primary-color'),
                    confirmButtonText: 'Cerrar',
                    buttonsStyling: false,
                    customClass: {
                        title: 'title_swal',
                        confirmButton: 'btn_close_swal'
                    }
                });

                icon_init_geolocation.classList.remove('fa-circle');
                icon_init_geolocation.classList.add('fa-crosshairs');
                icon_init_geolocation.classList.remove('fade_in_color');

                layer_group_geolocation.addLayer(marker);
                layer_group_geolocation.addLayer(circle);

                selectElement('#zoom_geolocation').removeAttribute('disabled');
                selectElement('#remove_geolocation').removeAttribute('disabled');

            }, 1000);

        }

    }

    function onLocationError(e){
        selectElement('#init_geolocation').removeAttribute('disabled');

        Swal.fire({
            title: 'Acceso denegado en el dispositivo para el proceso de geolocalización',
            icon: 'error',
            iconColor: selectVarCSS('--fourth-color'),
            confirmButtonText: 'Cerrar',
            buttonsStyling: false,
            customClass: {
                title: 'title_error_swal',
                confirmButton: 'btn_close_swal'
            }
        });
        
        console.log(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
}

function create_map({polygon_asic, array_img, geojson_point}){
    const initial_coordinates = [10.90847, -72.08446];
    const initial_zoom = 7;

    var map = L.map('map', {
		center: initial_coordinates,
		zoom: initial_zoom,
		minZoom: 7,
		maxZoom: 18,
        gestureHandling: true
	});

    L.control.scale({imperial: false}).addTo(map);

    //extend Leaflet to create a GeoJSON layer from a TopoJSON file
    L.TopoJSON = L.GeoJSON.extend({
        addData: function (data) {
            var geojson, key;
            if (data.type === "Topology") {
            for (key in data.objects) {
                if (data.objects.hasOwnProperty(key)) {
                geojson = topojson.feature(data, data.objects[key]);
                L.GeoJSON.prototype.addData.call(this, geojson);
                }
            }
            return this;
            }
            L.GeoJSON.prototype.addData.call(this, data);
            return this;
        }
    });

    L.topoJson = function (data, options){
        return new L.TopoJSON(data, options);
    };

    
   var osm_basemap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		minZoom: 7,
		maxZoom: 19,
		type:'osm'
	}).addTo(map);

    var google_basemap = L.gridLayer.googleMutant({
		type:'hybrid'
	});

    var baseLayers = {
		"Base Cartografica": osm_basemap,
		"Imagen Satelital": google_basemap
	};
    

    let CONFIG_INITIAL = {
        'color_feature': selectVarCSS('--primary-color'),
        'color_highlightFeature': selectVarCSS('--primary-color'),
        'fillOpacity_highlightFeature': 0.2,
        'callback': null
    }

    let CONFIG_INITIAL_CALLBACK = {
        'color_feature': selectVarCSS('--primary-color'),
        'color_highlightFeature': selectVarCSS('--fourth-color'),
        'fillOpacity_highlightFeature': 0.7,
        'callback': callback_response
    }

    //create legend map
    var legend = null;

    var media_query = '(min-width: 900px)';

    if(window.matchMedia(media_query).matches){
        legend = create_legend(array_img);
        legend.addTo(map);
    }

    window.addEventListener('resize', (e) =>{
        if(legend != null){
            map.removeControl(legend);
            legend = null;
        }

        if(window.matchMedia(media_query).matches){
            legend = create_legend(array_img);
            legend.addTo(map);
        }

    }, false);

    //end create legend map

    let info = create_info_map();

    info.addTo(map);

    var layer_polygon_asic = create_polygon_geojson({
        polygon_asic: polygon_asic,
        config: CONFIG_INITIAL,
        info: info,
        map: map
    })

    layer_polygon_asic.addTo(map);

    selectElement('#toggle').addEventListener('input', (e) => {
        var element = e.target,
            name_basemap = element.dataset.basemap,
            input_checked = element.checked;

        element.disabled = true;

        setTimeout(() => {
            element.removeAttribute('disabled');
        }, 2000);

        var config_function = create_config_polygon_asic_change({
            name_basemap: name_basemap,
            input_checked: input_checked,
            config_initial: CONFIG_INITIAL,
            config_initial_callback: CONFIG_INITIAL_CALLBACK
        });

        layer_polygon_asic.clearLayers();

        var config_polygon = {
            polygon_asic: polygon_asic,
            config: config_function,
            info: info,
            map: map
        };

        layer_polygon_asic = create_polygon_geojson(config_polygon);

        layer_polygon_asic.addTo(map);

    }, false);

    map.on('baselayerchange', (e) => {
        name_basemap = e.name.toLowerCase();

        var name_dataset = 'osm';

        if(name_basemap == 'imagen satelital'){
            name_dataset = 'google';
        }

        var info_map = selectElement('div.info'),
            icon_info_map = selectElement('#map-pin-2 path');

        if(name_dataset == 'google'){
            info_map.classList.remove('background_primary');
            info_map.classList.add('background_secondary');
            icon_info_map.style['stroke'] = selectVarCSS('--primary-color');

            if(legend != null){
                selectElement('div.map_legend').classList.remove('background_primary');
                selectElement('div.map_legend').classList.add('background_secondary');
            }

        }else{
            info_map.classList.remove('background_secondary');
            info_map.classList.add('background_primary');
            icon_info_map.style['stroke'] = selectVarCSS('--secondary-color');

            if(legend != null){
                selectElement('div.map_legend').classList.remove('background_secondary');
                selectElement('div.map_legend').classList.add('background_primary');
            }
        }

        var input_switch = selectElement('#toggle'),
            input_checked = input_switch.checked;

        input_switch.setAttribute('data-basemap', name_dataset);

        var config_function = create_config_polygon_asic_change({
            name_basemap: name_dataset,
            input_checked: input_checked,
            config_initial: CONFIG_INITIAL,
            config_initial_callback: CONFIG_INITIAL_CALLBACK
        });

        layer_polygon_asic.clearLayers();

        var config_polygon = {
            polygon_asic: polygon_asic,
            config: config_function,
            info: info,
            map: map
        };

        layer_polygon_asic = create_polygon_geojson(config_polygon);

        layer_polygon_asic.addTo(map);
        
    });

    let point_hospital = filter_layer_geojson_point(geojson_point, 1, array_img, 35),
        point_cdi = filter_layer_geojson_point(geojson_point, 2, array_img),
        point_amb = filter_layer_geojson_point(geojson_point, 3, array_img),
        point_cmp = filter_layer_geojson_point(geojson_point, 4, array_img);

    let parentGroup = L.markerClusterGroup(),
		subGroup_hospitales = L.featureGroup.subGroup(parentGroup, [point_hospital]),
        subGroup_cdi = L.featureGroup.subGroup(parentGroup, [point_cdi]),
        subGroup_amb = L.featureGroup.subGroup(parentGroup, [point_amb]),
        subGroup_cmp = L.featureGroup.subGroup(parentGroup, [point_cmp]);

    let control = L.control.layers(baseLayers, null, {
        collapsed: true,  
        position: 'topright'
    }).addTo(map);
            
    control.addOverlay(subGroup_hospitales, 'HOSPITALES');
    control.addOverlay(subGroup_cdi, 'CDI');
    control.addOverlay(subGroup_amb, 'AMBULATORIOS RED ESPECIALIZADA');
    control.addOverlay(subGroup_cmp, 'CONSULTORIOS RED COMUNAL')
    parentGroup.addTo(map);
    subGroup_hospitales.addTo(map);
    subGroup_cdi.addTo(map);
    subGroup_amb.addTo(map);
    subGroup_cmp.addTo(map);

    let layer_group_geolocation = L.featureGroup();
    layer_group_geolocation.addTo(map);

    L.easyButton('fa-home', function(btn, map){
        map.setView(initial_coordinates, initial_zoom);
    }).addTo(map);

    L.easyButton({
        id: 'init_geolocation',
        position: 'topleft',
        type: 'replace',
        leafletClasses: true,
        states:[{
          stateName: 'get-center',
          onClick: function(btn, map){
            btn.button.disabled = true;

            init_geolocation({
                layer_group_geolocation: layer_group_geolocation, 
                map: map
            });

          },
          title: 'Iniciar geolocalización',
          icon: 'fa-crosshairs'
        }]
    }).addTo(map);

    L.easyButton({
        id: 'zoom_geolocation',
        position: 'topleft',
        type: 'replace',
        leafletClasses: true,
        states:[{
          stateName: 'get-center',
          onClick: function(btn, map){

            var bounds = layer_group_geolocation.getBounds();
            map.fitBounds(bounds);

          },
          title: 'Zoom a la geolocalización',
          icon: 'fa-search-location'
        }]
    }).addTo(map);

    selectElement('#zoom_geolocation').disabled = true;

    L.easyButton({
        id: 'remove_geolocation',
        position: 'topleft',
        type: 'replace',
        leafletClasses: true,
        states:[{
          stateName: 'get-center',
          onClick: function(btn, map){

            btn.button.disabled = true;

            Swal.fire({
                title: 'Capa de geolocalización eliminada satisfactoriamente',
                icon: 'success',
                iconColor: selectVarCSS('--primary-color'),
                confirmButtonText: 'Cerrar',
                buttonsStyling: false,
                customClass: {
                    title: 'title_swal',
                    confirmButton: 'btn_close_swal'
                }
            });

            layer_group_geolocation.clearLayers();

            selectElement('#init_geolocation').removeAttribute('disabled');
            selectElement('#zoom_geolocation').disabled = true;

          },
          title: 'Remover a la geolocalización',
          icon: 'fa-trash-restore'
        }]
    }).addTo(map);

    selectElement('#remove_geolocation').disabled = true;
}

function load_svg_legend(array_img){
    var items_img = selectElementAll('.items img');

    items_img.forEach((element, index, array) => {
        element.src = array_img[index];
    });
}

function change_status_switch_text(e){
    var input = e.target,
        text = selectElement('#config_asic_text p b'),
        icon = selectElement('#config_asic_text p i');

    if(input.checked){
        text.innerHTML = 'activada';
        icon.classList.remove('fa-times');
        icon.classList.add('fa-check');
    }else{
        text.innerHTML = 'desactivada';
        icon.classList.remove('fa-check');
        icon.classList.add('fa-times');
    }
}

function start(){

    selectElement('#burge_icon').addEventListener('click', state_menu_burge, false);

    selectElement('#toggle').addEventListener('input', change_status_switch_text, false);

    selectElementAll('.btn_close_sidebar').forEach((element) =>{
        element.addEventListener('click', close_sidebar, false);
    });

    selectElementAll('.open_sidebar').forEach((element) => {
        element.addEventListener('click', open_sidebar, false);
    });

    
    selectElementAll('.close_info_response').forEach((items) =>{

        items.addEventListener('click', (e) => {
            
            setTimeout(() => {
                var preloader_header = selectElement('#preloader_header'),
                    content_response = selectElement('#content_response'),
                    body_response = selectElement('#body_response');

                content_response.classList.remove('sidebar');
                content_response.classList.add('hide');
                body_response.innerHTML = '';
                preloader_header.classList.remove('hide');
            }, 2100);

        }, false);

    })
    

    Promise.all([
        get_data_json('assets/polygon_asic.topojson'),
        get_data_img('assets/svg/hospital.svg'),
        get_data_img('assets/svg/cdi.svg'),
        get_data_img('assets/svg/raes.svg'),
        get_data_img('assets/svg/racs.svg'),
        get_data_json('assets/php/consult_create_array_establishment_health.php')
    ])
    .then(array_response => {
        var polygon = array_response[0];
            array_img = [
                array_response[1],
                array_response[2],
                array_response[3],
                array_response[4]
            ],
            data_point = array_response[5].data;

        load_svg_legend(array_img);

        let geojson_point = create_geojson_point(data_point);

        create_map({
            'polygon_asic': polygon,
            'array_img' : array_img,
            'geojson_point': geojson_point
        })
    })
    .catch((error) => {
		console.log(error);
	})
    
}

window.addEventListener('load', start, false);