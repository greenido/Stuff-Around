/* 
 * Author: Ido Green
   Date: 4-15-2011
*/
var map;
            
function success(position) {
    var s = document.querySelector('#status');
  
    if (s.className == 'success') {
        // not sure why we're hitting this twice in FF, I think it's to do with a cached result coming back    
        return;
    }
  
    s.innerHTML = "You are at (" + position.coords.latitude + ", " + position.coords.longitude + ")";
    s.className = 'success';
  
    var mapcanvas = document.createElement('div');
    mapcanvas.id = 'mapcanvas';
    mapcanvas.style.height = '300px';  //'400px';
    mapcanvas.style.width = '320px'; //'560px';
    
    document.querySelector('article').appendChild(mapcanvas);
  
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var myOptions = {
        zoom: 15,
        center: latlng,
        mapTypeControl: false,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
            },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
  
    var marker = new google.maps.Marker({
        position: latlng, 
        map: map, 
        title:"That's where you are dude!"
    });
                
    getStuff(position);
}
            
function addItemsToPage(items) {
    var listPoints = [];
    $.each(items, function() {
        listPoints.push('<li id="' + this.id + '">' + this.name + '<br/> [Distance:' +
            this.location.distance +'m] with: '+ this.hereNow.count + ' others. Total checkinsCount: '+
            this.stats.checkinsCount +'</li>'); //location.lat
                    
        var latLng = new google.maps.LatLng(this.location.lat, this.location.lng);
        var iconLink = "http://maps.google.com/mapfiles/kml/pal4/icon21.png"; // default one
        if (this.categories[0]) {
            iconLink = this.categories[0].icon;
        }
        marker = new google.maps.Marker({
            map:map,
            draggable:true,
            title: this.name,
            icon: iconLink,
            //animation: google.maps.Animation.DROP,
            position: latLng
        });
    });

    $('<ul/>', {
        'class': 'my-new-list',
        html: listPoints.join('')
    }).appendTo('body');
                  
                  
}
            
function getStuff(position) {
    var sqUrl = "https://api.foursquare.com/v2/venues/search?ll=" + position.coords.latitude +
    "," + position.coords.longitude +
    "&oauth_token=USL12O1JGUS0YYVXEVH0S5AVSEXAUD0SAY4ATTEYU21X0DPQ";
    $.getJSON(sqUrl, function(data) {
        if (data.meta.code == 200) {
            for (var i=0; i < data.response.groups.length; i++) {
                addItemsToPage(data.response.groups[i].items);
            }
        }
                  
    });
}
            
function error(msg) {
    var s = document.querySelector('#status');
    s.innerHTML = typeof msg == 'string' ? msg : "failed";
    s.className = 'fail';
  
// console.log(arguments);
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    error('not supported');
}






















