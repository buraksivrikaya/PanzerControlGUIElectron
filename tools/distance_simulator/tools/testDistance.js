const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:4321');

const MAX_SENSOR_VALUE = 300;
const MIN_SENSOR_VALUE = 0;

ws.on('open', function open() {
    ws.send('testDistance is started...');
});

ws.on('message', function incoming(data) {
    console.log(data);
});

setInterval(function(){
    if(ws.readyState === ws.OPEN)
    {
        ws.send(getRandomWSMessage());
    }
}, 500);


function getRandomDistance() {
    return Math.floor(Math.random() * (MAX_SENSOR_VALUE - MIN_SENSOR_VALUE + 1)) + MIN_SENSOR_VALUE;
}

function getRandomWSMessage() {
    return JSON.stringify({
        'f': getRandomDistance(),
        'r': getRandomDistance(),
        'b': getRandomDistance(),
        'l': getRandomDistance()
    });
}