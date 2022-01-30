const selectElement = (element) => document.querySelector(element);

function state_menu_burge(e){
    e.preventDefault();
    selectElement('#font_burge').classList.toggle('hide');
    selectElement('#font_close').classList.toggle('hide');
    selectElement('.menu_items').classList.toggle('hide_menu');
}

function start(){

    selectElement('#burge_icon').addEventListener('click', state_menu_burge, false);

}

window.addEventListener('load', start, false);