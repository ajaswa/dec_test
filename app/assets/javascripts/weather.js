Weather = function(el) {
  if(this instanceof Weather) {
    this.init(el);
  } else {
    new Weather(el);
  }
};

Weather.prototype.init = function(el){
  this.el = el;
  this._location();
};

Weather.prototype._get = function(state, city){
  var that = this,
      astronomyUrl = 'http://api.wunderground.com/api/bef7ea6353dc412b/astronomy/q/'+state+'/'+city+'.json';

  $.ajax({
    url: astronomyUrl,
    dataType: 'jsonp'
  }).done(function( data ) {
      that.el.append( '<span class="sun">Sunrise: '+data.moon_phase.sunrise.hour+':'+data.moon_phase.sunrise.minute);
      // times are in 24 hour... adjust this?
      that.el.append( '<span class="sun">Sunset: '+data.moon_phase.sunset.hour+':'+data.moon_phase.sunset.minute);
  });
};

Weather.prototype._location = function(){
  var that = this;
      ipGeoUrl = 'http://freegeoip.net/json/',
      locationUrl = 'http://api.wunderground.com/api/bef7ea6353dc412b/geolookup/q/';

  if ("geolocation" in navigator) {

    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude,
          log = position.coords.longitude;

      $.ajax({
        url: locationUrl+lat+','+log+'.json',
        dataType: 'jsonp'
      }).done(function( data ) {
        that._get(data.location.state, data.location.city);
      });
    });

  } else {

    $.ajax({
      url: ipGeoUrl+ipAddress,
      dataType: 'jsonp'
    }).done(function( data ) {
      that._get(data.region_name, data.city);
    });

  }
};
