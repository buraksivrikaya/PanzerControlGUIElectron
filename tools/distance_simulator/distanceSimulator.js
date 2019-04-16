var DistanceSimulator = {
    frontDistance : undefined,
    rightDistance : undefined,
    backDistance : undefined,
    leftDistance : undefined,

    distanceColorSchemas : {
        default : [{'r' : 0, 'g' : 195, 'b' : 253},
            {'r' : 3, 'g' : 209, 'b' : 0},
            {'r' : 210, 'g' : 195, 'b' : 0},
            {'r' : 207, 'g' : 125, 'b' : 0},
            {'r' : 210, 'g' : 0, 'b' : 0}]
    },
    distanceColorSchema : undefined,
/*
    getDistances : function () {
        return {'f' : this.frontDistance, 'r' : this.rightDistance, 'b' : this.backDistance, 'l' : this.leftDistance};
    },

    setDistances : function (text) {
        this.frontDistance = text.f;
        this.rightDistance = text.r;
        this.backDistance = text.b;
        this.leftDistance = text.l;
    },
*/
    getDistanceColorSchema : function (colorSchema) {
        return this.distanceColorSchema;
    },

    setDistanceColorSchema : function (colorSchema) {
        this.distanceColorSchema = this.distanceColorSchemas[colorSchema];
    },

    gapToColor : function(distanceValue, minSensorValue, maxSensorValue){
        var sensorRange = (maxSensorValue - minSensorValue) / this.getDistanceColorSchema().length;
        var counter = 0;

        for(var i = minSensorValue; i < maxSensorValue; i += sensorRange)
        {
            if(distanceValue >= i && distanceValue < i + sensorRange){
                return this.getDistanceColorSchema()[counter];
            }
            counter++;
        }

        return {'r':160,'g':160,'b':160}
    },

    getColors : function (distanceValuesJson, minSensorValue, maxSensorValue) {
        return {
            'f' : this.gapToColor(distanceValuesJson.f, minSensorValue, maxSensorValue),
            'r' : this.gapToColor(distanceValuesJson.r, minSensorValue, maxSensorValue),
            'b' : this.gapToColor(distanceValuesJson.b, minSensorValue, maxSensorValue),
            'l' : this.gapToColor(distanceValuesJson.l, minSensorValue, maxSensorValue)
        };
    }
};

module.exports.DistanceSimulator = DistanceSimulator;