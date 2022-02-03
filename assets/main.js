const selectElement = (element) => document.querySelector(element);
const selectElementAll = (element) => document.querySelectorAll(element);

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

}

window.addEventListener('load', start, false);