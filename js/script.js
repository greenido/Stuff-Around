/* 
 * Author: Ido Green
   Date: 4-15-2011
*/

// TODO - put them out of GLOBAL...
var map;
var infowindow = new google.maps.InfoWindow();
 
function roundNum(num) {
    return Math.round(num*100)/100;
}

// putting the pins on the map
function success(position) {
    var s = document.querySelector('#status');
  
    if (s.className == 'success') {
        // not sure why we're hitting this twice in FF, I think it's to do with a cached result coming back    
        return;
    }
  
    s.innerHTML = "Found Specails";
    console.log("You are at (" + roundNum(position.coords.latitude) +
        " , " + roundNum(position.coords.longitude) + ")");
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
        
        var iconLink = "http://maps.google.com/mapfiles/kml/pal4/icon21.png"; // default one
        if (this.categories[0]) {
            iconLink = this.categories[0].icon;
        }
        //
        var others = this.hereNow.count;
        var othersStr = "";
        if (others > 0) {
            othersStr += " with:" + others + " others";
        }
        //<div class="ui-btn-text"><a href="index.html" class="ui-link-inherit"><img src="images/fi.png" alt="Finland" class="ui-li-icon ui-li-thumb">Finland <span class="ui-li-count ui-btn-up-c ui-btn-corner-all">12</span></a></div>
        
        // TODO - put the this.specials.message / provider / redumption / title in a dialog...
        
        var searchUrl = "http://www.google.com/search?q=" + encodeURI(this.name);
        listPoints.push('<li id="' + this.id + '"><a href="'+ searchUrl +
            '" data-transition="pop" target="_blank"><img src="'+ iconLink +
            '" alt="place icon" class="ui-li-icon ui-li-thumb"/> ' +
            '<h2>&nbsp;' +this.name +'</h2><p>'+ othersStr + 
            // ' Checkins: '+ this.stats.checkinsCount + 
            ' Specail: ' + this.specials[0].message +
            ' [' + this.location.distance +'m]'+ '</p></a></li>'); //location.lat
        var mapDesc = '<a href="'+ searchUrl + '" target="_blank">' + 
        this.name + 
        '</a><p>'+ othersStr + 
        // ' Checkins: '+ this.stats.checkinsCount + 
        ' Specail: ' + this.specials[0].message +
        ' [' + this.location.distance +'m]'+ '</p>';
        
        var latLng = new google.maps.LatLng(this.location.lat, this.location.lng);
       
        var marker = new google.maps.Marker({
            map:map,
            draggable:false,
            title: this.name,
            icon: iconLink,   //animation: google.maps.Animation.DROP,
            position: latLng
        });
        
       
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.close();
            getPointDesc(marker, mapDesc);
        });
        
        
    });
    var ulHeader = '<li data-role="list-divider">Cool Specails</li>';
    $("#ulPoints").html(ulHeader + listPoints.join(''));
    
    $("#ulPoints").listview("refresh");
    
//    $(ulHeader, {
//        'class': 'my-new-list',
//        html: listPoints.join('')
//    }).appendTo('body');
                  
                  
}
      
function getPointDesc(marker, text){
    infowindow.setContent(text);
    infowindow.open(map, marker);
    
//  $.ajax({
//    url: 'aulas/show/' + id,
//    success: function(data){
//      infowindow.setContent(data);
//      infowindow.open(map, marker);
//    }
//  });
}

            
/**
 * TODO - limit/intent should be in setting page...
 */
function getStuff(position) {
    var sqUrl = "https://api.foursquare.com/v2/venues/search?ll=" + 
    position.coords.latitude +
    "," + position.coords.longitude +
    "&oauth_token=USL12O1JGUS0YYVXEVH0S5AVSEXAUD0SAY4ATTEYU21X0DPQ&intent=specials&limit=15"; // specials or checkin
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






















