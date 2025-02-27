document.addEventListener("DOMContentLoaded", () => {
    var map = document.getElementById ('map'); 
    var maplistner = function (e) { 
    var frame = document.createElement ('iframe'); 
    frame.src = this.getAttribute ('data-src'); 
    map.appendChild (frame); 
    map.removeEventListener ("mouseover", maplistner); 
    }; 
    map.addEventListener ('mouseover', maplistner);
});