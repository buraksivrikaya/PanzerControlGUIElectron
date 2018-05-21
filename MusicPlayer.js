var MusicPlayer = function (musicFilePath){

    const { createAudio } = require('node-mp3-player')
    const Audio = createAudio();
    var musicFile = undefined;

    function init (){
        setMusicFile(musicFilePath)
    }

    async function setMusicFile(path){
        musicFile = await Audio(path);
    }

    this.playMusic = async function(){
        await musicFile.play();
    }


    this.stopMusic = async function(){
        await musicFile.stop();
    }

    this.adjustVolume = async function(volumeLevel){
        await musicFile.volume(volumeLevel / 100)
    }
    init();
}

module.exports = MusicPlayer;