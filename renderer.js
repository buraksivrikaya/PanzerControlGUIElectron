// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var musicFilePath = './sounds/01.mp3';
var MusicPlayer = require('./MusicPlayer');

var MP = new MusicPlayer(musicFilePath);

var musicPlayerSlider = $('#musicPlayerSlider')[0];

musicPlayerSlider.oninput = function() {
    var musicVolume = parseInt(musicPlayerSlider.value)

    MP.adjustVolume(musicVolume);

    if(musicVolume > 50){
        $('#volumeLevelIcon').removeClass().addClass('fas fa-volume-up')
    }else if(musicVolume === 0){
        $('#volumeLevelIcon').removeClass().addClass('fas fa-volume-off')
    }else{
        $('#volumeLevelIcon').removeClass().addClass('fas fa-volume-down')
    }
};


var motorPowerDifferenceSlider = $('#motorPowerDifferenceSlider')[0];
var motorPowerDifferenceValue = $('#motorPowerDifferenceValue')[0];
motorPowerDifferenceValue.innerHTML = motorPowerDifferenceSlider.value;
// Update the current slider value (each time you drag the slider handle)
motorPowerDifferenceSlider.oninput = function() {
    motorPowerDifferenceValue.innerHTML = motorPowerDifferenceSlider.value;
};

var leftSpeedSlider = $('#leftSpeedSlider')[0];
var leftSpeedValue = $('#leftSpeedValue')[0];
leftSpeedValue.innerHTML = leftSpeedSlider.value;
// Update the current slider value (each time you drag the slider handle)
leftSpeedSlider.oninput = function() {
    leftSpeedValue.innerHTML = leftSpeedSlider.value;
};


var rightSpeedSlider = $('#rightSpeedSlider')[0];
var rightSpeedValue = $('#rightSpeedValue')[0];
rightSpeedValue.innerHTML = rightSpeedSlider.value;
// Update the current slider value (each time you drag the slider handle)
rightSpeedSlider.oninput = function() {
    rightSpeedValue.innerHTML = rightSpeedSlider.value;
};

$('#playIcon').on('click', function(){
    if($('#playIcon').hasClass('fa-stop')){
        $('#playIcon').removeClass().addClass('fas fa-play');
        MP.stopMusic();
    }
    else{
        $('#playIcon').removeClass().addClass('fas fa-stop');
        MP.playMusic();
    }
});
/*var stickOptions = {
    zone: $('#joystickAreaContainer')[0],                  // active zone
    color: '#17a2b8',
    size: 100,
    threshold: Float,               // before triggering a directional event
    fadeTime: Integer,              // transition time
    multitouch: Boolean,
    maxNumberOfNipples: Number,     // when multitouch, what is too many?
    dataOnly: Boolean,              // no dom element whatsoever
    position: Object,               // preset position for 'static' mode
    mode: String,                   // 'dynamic', 'static' or 'semi'
    restJoystick: Boolean,
    restOpacity: Number,            // opacity when not 'dynamic' and rested
    catchDistance: Number           // distance to recycle previous joystick in
                                    // 'semi' mode
};*/
/*{
    identifier: 0,              // the identifier of the touch/mouse that triggered it
        position: {                 // absolute position of the center in pixels
            x: 125,
            y: 95
        },
    force: 0.2,                 // strength in %
    distance: 25.4,             // distance from center in pixels
    pressure: 0.1,              // the pressure applied by the touch
    angle: {
        radian: 1.5707963268,   // angle in radian
        degree: 90
    },
    instance: Nipple            // the nipple instance that triggered the event
}*/
var stickOptions = {
    zone: $('#joystickAreaContainer')[0],
    mode: 'static',
    catchDistance: 150,
    position: {left: '50%', top: '50%'},
    color: 'red',
}

var manager = require('nipplejs').create(stickOptions);

manager.on('move', function(event, data){
    // console.log('force : ' + data.force)
    // console.log('angle : ' + data.angle.degree)
    // var speeds = calculateSpeeds(data.force, data.angle.radian);
    var speeds = calculateSpeeds(data.force, data.angle.degree);
    setSpeed(speeds.speedL, speeds.speedR);

});

manager.on('end', function(){
    setSpeed(0,0);
});


function setSpeed(LSpeed, RSpeed){
    var speedLeft = parseInt(LSpeed), speedRight = parseInt(RSpeed)
    $('#motorSpeeds').html("LS:" + speedLeft + "-RS:" + speedRight);
    rightSpeedSlider.value = speedRight;
    leftSpeedSlider.value = speedLeft;
}

function calculateSpeeds(force, angle){
    var tAngle = (180/Math.PI)*Math.atan2(Math.sin(angle), Math.cos(angle)); // ((angle + 180) % 360) - 180;
    var maxForce = 3.0;
    var factorS = 100 / maxForce;
    var tempForce = force > maxForce ? maxForce : force;
    var speed = factorS * tempForce;
    var speedR;
    var speedL;
//console.log(tAngle)
    if(tAngle >= 0 && tAngle <= 90){
        speedL = speed;
        speedR = speed * Math.sin(2 * tAngle - 90);
    }
    if(tAngle < 0 && tAngle >= -90){
        speedL = -speed;
        speedR = speed * Math.sin(2 * tAngle + 90);
    }
    // So = Si * ((r+d)/r)
    console.log(speedL, speedR);
    return {'speedL' : speedL, 'speedR' : speedR};
}

function calculateSpeedsOLD(force, angle){
    var maxForce = 3.0;
    var factorS = 100 / maxForce;
    var factorR;
    var factorL;
    var speedR;
    var speedL;
    if((angle >= 0 && angle < 75) || (angle > 285 && angle < 360)){factorR = -1; factorL = 1;}
    else if(angle >= 75 && angle <= 105){factorR = 1; factorL = 1;}
    else if(angle > 105 && angle < 255){factorR = 1; factorL = -1;}
    else if(angle >= 255 && angle <= 285){factorR = -1; factorL = -1;}


    var tempForce = force > maxForce ? maxForce : force;
    // console.log(angle, factorL, factorR)
  /*  speedR = factorR * factorS * tempForce;
    speedL = factorL * factorS * tempForce;*/
    var angleToSpeed = parseInt(Math.ceil(Math.sin(angle)*100));
    var angleToSpeed2 = parseInt(Math.ceil(Math.cos(angle)*100));
    speedL = angleToSpeed // - angleToSpeed2;
    speedR = angleToSpeed // - angleToSpeed2;
    return {'speedL' : speedL, 'speedR' : speedR};
}