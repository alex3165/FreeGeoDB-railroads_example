
var FunctionalProcessing = function(limit, mapboxConfig, continentDisplayedCb) {
    this.limit = limit;
    this.datas = [];
    this.resolve = undefined;
    this.continentDisplayedCb = continentDisplayedCb;

    L.mapbox.accessToken = mapboxConfig.token;
    this.currentMap = L.mapbox.map('map', mapboxConfig.mapId);
    this.currentMap.setView([50.7280778,21.3180241], 3);

    $.get('railroads.json', this._onGetRailRoads.bind(this));
}

FunctionalProcessing.prototype.getContinents = function() {
    var self = this;
    return new Promise(function(resolve, reject) {

        if(self.datas.length === 0) {
            self.resolve = resolve;
        } else {
            resolve(self._datasToContinents(datas));
        }
    });
}

FunctionalProcessing.prototype.continentFilter = function(continent) {
    this.currentMap.removeLayer(this.railRoadsLayer);

    var formatted = this._getFilteredAndFormattedDatas(this.datas, continent, this.limit);

    this.railRoadsLayer = this._displayFormattedDatas(formatted);
}

FunctionalProcessing.prototype._datasToContinents = function(datas) {
    return datas.reduce(function(total, next) {
        var hasContinent = total.find(function(storedContinent) {
            return storedContinent === next.continent;
        });

        if(!hasContinent) total.push(next.continent);

        return total;
    }, []);
}

FunctionalProcessing.prototype._onGetRailRoads = function(datas) {
    this.datas = datas;
    if(this.resolve) this.resolve(this._datasToContinents(this.datas));

    var formatted = this._getFilteredAndFormattedDatas(this.datas, 'Europe', this.limit);

    this.railRoadsLayer = this._displayFormattedDatas(formatted);
    this.continentDisplayedCb();
}

FunctionalProcessing.prototype._displayFormattedDatas = function(formatted) {
    var featureGroup = L.featureGroup().addTo(this.currentMap);

    formatted.forEach(function(el) {
        L.polyline(el, {color: '#0E52BF'}).addTo(featureGroup);
    });

    return featureGroup;
}

FunctionalProcessing.prototype._getFilteredAndFormattedDatas = function(datas, continent, limit) {
    console.time('data formatting');

    return datas.filter(function(el) {
        return continent === false || el.continent === continent;
    }).map(function(station) {
        return station.coordinates_wkt.replace(/.*\({2}(.*)\){2}/g, '$1').split(',').map(function(stringPosition) {
            var splitted = stringPosition.trim().split(' ');
            return {
                lon: splitted[0],
                lat: splitted[1]
            }
        });
    }).filter(function(el, index) {
        return limit === false || index < limit;
    });

    console.timeEnd('data formatting');
}


if (!window.module) {
    window.FunctionalProcessing = FunctionalProcessing;
} else {
    module.exports = FunctionalProcessing;
}
