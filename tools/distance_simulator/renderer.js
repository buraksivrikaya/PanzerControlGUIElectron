var DS = require('./distanceSimulator').DistanceSimulator;
DS.setDistanceColorSchema('default');

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4321 });
const MAX_SENSOR_VALUE = 300;
const MIN_SENSOR_VALUE = 0;

var defaultGapColors = {
    'f':{'r' : 255, 'g' : 255, 'b' : 255},
    'r':{'r' : 255, 'g' : 255, 'b' : 255},
    'b':{'r' : 255, 'g' : 255, 'b' : 255},
    'l':{'r' : 255, 'g' : 255, 'b' : 255}
};

wss.on('connection', function connection(ws) {
    ws.on('message', wsMessageHandler);
});

function wsMessageHandler(message) {
    message[0] === '{' ? changeColors(DS.getColors(JSON.parse(message), MIN_SENSOR_VALUE, MAX_SENSOR_VALUE)) : changeColors(defaultGapColors);
    addToLogDIV(message);
}

function addToLogDIV(message) {
    var consoleC = $("#console");
    consoleC.html(consoleC.html() + '> ' + message + '</br>');
    consoleC[0].scrollTop = consoleC[0].scrollHeight;
}

function changeColors(colorsJSON) {
    if (colorsJSON !== undefined && colorsJSON.f !== undefined && colorsJSON.r !== undefined && colorsJSON.b !== undefined && colorsJSON.l !== undefined &&
        colorsJSON.f.r !== undefined && colorsJSON.f.g !== undefined && colorsJSON.f.b !== undefined &&
        colorsJSON.r.r !== undefined && colorsJSON.r.g !== undefined && colorsJSON.r.b !== undefined &&
        colorsJSON.b.r !== undefined && colorsJSON.b.g !== undefined && colorsJSON.b.b !== undefined &&
        colorsJSON.l.r !== undefined && colorsJSON.l.g !== undefined && colorsJSON.l.b !== undefined) {
        $('#frontGap').css('background-color', 'rgb('+ colorsJSON.f.r + ',' + colorsJSON.f.g + ',' + colorsJSON.f.b +')');
        $('#rightGap').css('background-color', 'rgb('+ colorsJSON.r.r + ',' + colorsJSON.r.g + ',' + colorsJSON.r.b +')');
        $('#backGap').css('background-color', 'rgb('+ colorsJSON.b.r + ',' + colorsJSON.b.g + ',' + colorsJSON.b.b +')');
        $('#leftGap').css('background-color', 'rgb('+ colorsJSON.l.r + ',' + colorsJSON.l.g + ',' + colorsJSON.l.b +')');
    }
    else
    {
        console.error(new Error('WRONG MESSAGE TYPE' + JSON.stringify(colorsJSON)));
    }
}

changeColors(defaultGapColors);

var colorSchema = DS.getDistanceColorSchema();

for(var i = 0; i < colorSchema.length; i++) {
    $('#gapMeasuresContainer').append('<div class="colorPaletteElement" style="background-color:rgb(' + colorSchema[i].r + ',' + colorSchema[i].g + ',' + colorSchema[i].b + ')"></div>')
}
