const selectElement = (element) => document.querySelector(element);

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
    
    e.target.classList.remove('active');
    e.target.disabled = true;

    var element_i = e.target.querySelector('i');
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

function start(){

    selectElement('#burge_icon').addEventListener('click', state_menu_burge, false);

    selectElement('#start_geolocation').addEventListener('click', state_button, false);
    selectElement('#remove_geolocation').addEventListener('click', state_button, false);
    selectElement('#zoom_geolocation').addEventListener('click', state_button, false);

}

window.addEventListener('load', start, false);