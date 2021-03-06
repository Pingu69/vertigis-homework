require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer",
  "esri/layers/support/Field",
  "esri/Graphic"
], function (Map, MapView, CSVLayer, Field, Graphic) {

  // TASK 1 
  const map = new Map({
    basemap: "gray-vector"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [16.3738, 48.2082], // Vienna
    zoom: 4
  });

  // CSV fields are INDEX, CODE, RECHTSWERT, HOCHWERT
  // TASK 2
  const csvLayer = new CSVLayer("https://austria.maps.arcgis.com/sharing/rest/content/items/81b6dd9c931e45ec82022a2b9cd18ca0/data", {
    latitudeField: "HOCHWERT",
    longitudeField: "RECHTSWERT",
    fields: [
      new Field({
        "name": "Index",
        "alias": "INDEX",
        "type": "string" // integer results in null because of new line character
      })]
  });

  // TASK 3
  csvLayer.renderer = {
    type: "simple",
    symbol: {
      type: "simple-marker",
      size: 4,
      color: "black",
      outline: {
        width: 0.5,
        color: "white"
      }
    }
  };
  map.add(csvLayer);

  logCodes(csvLayer);
  createCountryPolyline(csvLayer, view);

  /** TASK 4
   * queries the layer for all features with optional supplied codes, then logs them to console.
   * @param {CSVLayer} layer 
   * @param {String|String[]} codes codes = ['AT', 'DE']
   */
  async function logCodes(layer, codes = ['AT', 'DE']) {
    const query = layer.createQuery();
    const codesArray = [].concat(codes);
    
    query.where = `CODE IN ('${codesArray.join("','")}')`;
    query.outFields = ["CODE"];
    query.orderByFields = ["CODE DESC"];

    const featureSet = await layer.queryFeatures(query);
    featureSet.features.forEach(feature => console.log(feature.attributes["CODE"]));
  };

  /** BONUS TASK
   * creates a polyline with the optional supplied country code, and adds it to the view 
   * @param {CSVLayer} layer 
   * @param {MapView} view 
   * @param {String} countryCode countryCode = 'AT'
   */
  async function createCountryPolyline(layer, view, countryCode = 'AT') {
    const query = layer.createQuery();
    query.where = `CODE = '${countryCode}'`;
    query.orderByFields = ["INDEX DESC"];

    const featureSet = await layer.queryFeatures(query);
    const paths = featureSet.features.map(feature => [feature.geometry.longitude, feature.geometry.latitude]);
    const polyline = {
      type: "polyline",
      paths
    };

    polylineGraphic = new Graphic({
      geometry: polyline,
      symbol: {
        type: "simple-line",
        color: [226, 119, 40],
        width: 4
      }
    });
    view.graphics.add(polylineGraphic);

  }
});
