var messageToSend = '0|0';
var previousMessage = '';
var connectionAddress = 'DEVICEIP'; // TODO discover this address automatically
var motorPowerDifferece = 0;
var motorPowerDifferenceSlider = $('#motorPowerDifferenceSlider')[0];
var motorPowerDifferenceValue = $('#motorPowerDifferenceValue')[0];
var messageDelay = 100;
var directions = {
    'forwards' : 'F',
    'backwards' : 'B',
    'stopped' : 'S'
}

var Socket = new WebSocket('ws://' + connectionAddress + ':81/');
Socket.onmessage=function(evt){
    console.log(evt.data);
    //TODO if there is a delay on receiving "OK", show user the lag
}


motorPowerDifferenceValue.innerHTML = motorPowerDifferenceSlider.value;

motorPowerDifferenceSlider.oninput = function() {
    motorPowerDifferenceValue.innerHTML = motorPowerDifferenceSlider.value;
    motorPowerDifferece = parseInt(motorPowerDifferenceSlider.value);
};

var leftSpeedSlider = $('#leftSpeedSlider')[0];
var leftSpeedValue = $('#leftSpeedValue')[0];
leftSpeedValue.innerHTML = leftSpeedSlider.value;

var rightSpeedSlider = $('#rightSpeedSlider')[0];
var rightSpeedValue = $('#rightSpeedValue')[0];
rightSpeedValue.innerHTML = rightSpeedSlider.value;

$('#discoverButton').on('click', startDiscovery.bind(this));

function startDiscovery ()
{
    console.log('discovery Started');
    // TODO start discovery then set connectionAddress, update ui
}

var stickOptions = {
    zone: $('#joystickAreaContainer')[0],
    mode: 'static',
    catchDistance: 150,
    position: {left: '50%', top: '50%'},
    color: 'red',
}

var manager = require('nipplejs').create(stickOptions);

manager.on('move', function(event, data){
    var speeds = calculateSpeeds(data.force, data.angle.radian, motorPowerDifferece);
    setSpeed(speeds.speedL, speeds.speedR);
});

manager.on('end', function(){
    setSpeed(0,0);
});

function mapTo255 (num) {
    return parseInt(num * 1024 / 100);
}

function createDualSDMessage (speedOne, speedTwo){
    return speedOne + '|' + speedTwo;
}

function setSpeed(LSpeed, RSpeed){
    var speedLeft = parseInt(LSpeed), speedRight = parseInt(RSpeed)
    $('#motorSpeeds').html("LS:" + speedLeft + "-RS:" + speedRight);
    rightSpeedSlider.value = speedRight;
    leftSpeedSlider.value = speedLeft;
    messageToSend = createDualSDMessage(mapTo255(speedRight),
    									mapTo255(speedLeft));

    console.log(messageToSend)
}

function calculateSpeeds(force, angleRad, powDiff)
{
    var maxForce = 3.0;
    var factorS = 100 / maxForce;
    var minPower = -100;
    var maxPower = 100;
    var tempForce = force > maxForce ? maxForce : force;

    var speedL = factorS * tempForce * (Math.sin(angleRad) + Math.cos(angleRad));
    var speedR = factorS * tempForce * (Math.sin(angleRad) - Math.cos(angleRad));
    
	speedL = speedL < minPower ? minPower : speedL;
	speedR = speedR < minPower ? minPower : speedR;

	speedL = speedL > maxPower ? maxPower : speedL;
	speedR = speedR > maxPower ? maxPower : speedR;

    // PowerDiff
    if (powDiff < 0) // left motor needs more power, lower right motor power
    {
        speedR += speedR < 0 ? -powDiff : powDiff;
    }
    else // right motor needs more power, lower left motor power
    {
        speedL += speedL < 0 ? powDiff : -powDiff;
    }
    

    return {'speedL' : speedL, 'speedR' : speedR};
}

function sendMessage(message)
{
    if(previousMessage !== message && Socket.readyState === Socket.OPEN)
    {
        Socket.send(message);
        previousMessage = message;
    }
}
var m = -1024;
setInterval(function(){m += 1; 
var testMessage = m + '|0'; 
sendMessage(messageToSend)}, messageDelay);