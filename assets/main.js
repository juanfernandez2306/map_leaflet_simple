const selectElement = (element) => document.querySelector(element);
const selectElementAll = (element) => document.querySelectorAll(element);
const selectVarCSS = (element) => getComputedStyle(document.body).getPropertyValue(element);

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

function search_class_font_awesome(text){
    let array_text = text.split(' ');
    let regex = new RegExp('^fa-');
    for(var x = 0; x < array_text.length; x++){
        let value = array_text[x];
        let validation = regex.test(value);
        if(validation){
            return value;
        }

    }
}

function state_button(e){
    e.preventDefault();
    
    this.classList.remove('active');
    this.disabled = true;

    var element_i = this.querySelector('i');
    var class_name = element_i.className;

    var class_font_awesome = search_class_font_awesome(class_name);

    element_i.classList.remove(class_font_awesome);
    element_i.classList.add('fa-circle');
    element_i.classList.add('fade_in_color');

}

function state_menu_burge(e){
    e.preventDefault();
    selectElement('#font_burge').classList.toggle('hide');
    selectElement('#font_close').classList.toggle('hide');
    selectElement('.menu_items').classList.toggle('hide_menu');
}

function state_btn_config_asic(){
    const sidebar = selectElement('#config_asic');
    const config_asic_element_b = selectElement('#config_asic_element_b');
    if(this.checked){
        sidebar.classList.add('sidebar_checked');
        config_asic_element_b.innerHTML = 'desactivar'
    }else{
        sidebar.classList.remove('sidebar_checked');
        config_asic_element_b.innerHTML = 'activar';
    }

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

async function callback_asic(cod_asic){
    var data = new FormData();
    data.append('cod_asic', cod_asic);

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

    await fetch('assets/php/consult_asic.php', {
        method : 'POST',
        body : data
    })
    .then(response => response.json())
    .then(data => {
        var preloader_header = selectElement('#preloader_header'),
            header_response = selectElement('#header_response'),
            body_response = selectElement('#body_response');
        if(data.response){
            preloader_header.classList.remove('preloader_header');
            preloader_header.classList.add('hide');
            header_response.classList.remove('hide');
            header_response.classList.add('header_sidebar');
            body_response.innerHTML = data.html;
        }
        
    })
    .catch((error) => {
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
        this._div = L.DomUtil.create('div', 'map_legend');
        this._div.innerHTML = html;
        return this._div;
    }

    return legend;
}

function create_config_geojson({map, polygon_asic, config}){
    var info = L.control();

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
            config.callback(cod_asic);
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

	return [info, geojson];

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

function create_map({polygon_asic, array_img, geojson_point}){
    const initial_coordinates = [10.90847, -72.08446];

    var map = L.map('map', {
		center: initial_coordinates,
		zoom: 7,
		minZoom: 7,
		maxZoom: 18
	});

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

    /*
    osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		minZoom: 7,
		maxZoom: 19,
		type:'osm'
	}).addTo(map);
    */

    var config = {
        'color_feature': selectVarCSS('--primary-color'),
        'color_highlightFeature': selectVarCSS('--primary-color'),
        'fillOpacity_highlightFeature': 0.2,
        'callback': null
    }

    var [info, geojson] = create_config_geojson({
        'map': map,
        'polygon_asic': polygon_asic,
        'config': config
    });

    info.addTo(map);
    geojson.addTo(map);

    selectElement('#btn_config_asic').addEventListener('input', (e) => {
        var checked_btn = e.target.checked;
        var basemap = e.target.dataset.map;

        geojson.clearLayers();
        map.removeControl(info);

        if(basemap == 'osm'){
            config.color_feature = selectVarCSS('--primary-color');

            if(checked_btn){
                config.color_highlightFeature = selectVarCSS('--fourth-color');
                config.fillOpacity_highlightFeature = 0.5;
                config.callback = callback_asic;
            }else{
                config.color_highlightFeature = selectVarCSS('--primary-color');
                config.fillOpacity_highlightFeature = 0.2;
                config.callback = null;
            }
        }

        [info, geojson] = create_config_geojson({
            'map': map,
            'polygon_asic': polygon_asic,
            'config': config
        });
    
        info.addTo(map);
        geojson.addTo(map);

    }, false);

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


    let geojson_point_map = L.geoJson(geojson_point);

    geojson_point_map.addTo(map);

    
}

function load_svg_legend(array_img){
    var items_img = selectElementAll('.items img');

    items_img.forEach((element, index, array) => {
        element.src = array_img[index];
    });
}

function start(){

    selectElement('#burge_icon').addEventListener('click', state_menu_burge, false);

    selectElement('#start_geolocation').addEventListener('click', state_button, false);
    selectElement('#remove_geolocation').addEventListener('click', state_button, false);
    selectElement('#zoom_geolocation').addEventListener('click', state_button, false);

    selectElementAll('.btn_close_sidebar').forEach((element) =>{
        element.addEventListener('click', close_sidebar, false);
    });

    selectElementAll('.open_sidebar').forEach((element) => {
        element.addEventListener('click', open_sidebar, false);
    });

    selectElement('#close_info_response').addEventListener('click', (e) => {
        
        setTimeout(() => {
            var preloader_header = selectElement('#preloader_header'),
            header_response = selectElement('#header_response'),
            body_response = selectElement('#body_response');

            preloader_header.classList.remove('hide');
            preloader_header.classList.add('preloader_header');

            header_response.classList.remove('header_sidebar');
            header_response.classList.add('hide');
            
            body_response.innerHTML = '';
        }, 2100);

    }, false);

    selectElement('#btn_config_asic').addEventListener('input', state_btn_config_asic, false);

    Promise.all([
        get_data_json('assets/polygon_asic.topojson'),
        get_data_img('assets/svg/hospital.svg'),
        get_data_img('assets/svg/cdi.svg'),
        get_data_img('assets/svg/raes.svg'),
        get_data_img('assets/svg/racs.svg'),
        get_data_json('assets/php/consult_establishment_health.php')
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