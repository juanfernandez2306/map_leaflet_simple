const selectElement = (element) => document.querySelector(element);
const selectElementAll = (element) => document.querySelectorAll(element);
const selectVarCSS = (element) => getComputedStyle(document.body).getPropertyValue(element);

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

function close_sidebar(e){
    e.preventDefault();
    var name_sidebar = this.dataset.sidebar;
    var id_sidebar = '#' + name_sidebar;
    var sidebar = selectElement(id_sidebar);

    sidebar.classList.remove(name_sidebar);
    sidebar.classList.add('hide');

    var wallpaper = selectElement('#wallpaper');

    wallpaper.classList.remove('wallpaper');
    wallpaper.classList.add('hide');
    
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
    sidebar.classList.remove('hide');

    setTimeout(() => {
        btn.removeAttribute('disable');
    }, 1000);
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

function add_geojson({map, polygon_asic}){
    var info = L.control();

	info.onAdd = function(map){
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	}
	
	info.update = function(props){
		if(props){
            var html = props.asic;
        }else{
            var html = 'hola mundo';
        }
		
		this._div.innerHTML = html;
	}

    var color_prueba = '#fff';

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: selectVarCSS('--primary-color'),
			dashArray: '3',
			fillOpacity: 0
		};
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: selectVarCSS('--primary-color'),
			dashArray: '',
			fillOpacity: 0.2
			});

		info.update(layer.feature.properties);
	};

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer){
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

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

    L.topoJson = function (data, options) {
        return new L.TopoJSON(data, options);
    };

    var geojson = L.topoJson(polygon_asic, {
        style: style,
        onEachFeature: onEachFeature
    });

	info.addTo(map);
	geojson.addTo(map);

}

function create_map({polygon_asic}){
    const initial_coordinates = [10.90847, -72.08446];

    var map = L.map('map', {
		center: initial_coordinates,
		zoom: 7,
		minZoom: 7,
		maxZoom: 18
	});

    
    osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		minZoom: 7,
		maxZoom: 19,
		type:'osm'
	}).addTo(map);

    add_geojson({
        'map': map,
        'polygon_asic': polygon_asic
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

    selectElement('#btn_config_asic').addEventListener('input', state_btn_config_asic, false);

    Promise.all([
        get_data_json('assets/polygon_asic.topojson')
    ])
    .then(array_response => {
        create_map({
            'polygon_asic': array_response[0]
        })
    })
    .catch((error) => {
		console.log(error);
	})

}

window.addEventListener('load', start, false);