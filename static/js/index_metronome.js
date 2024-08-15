let metronome_switch = document.getElementById("metronome_switch");
let beat_regular = document.getElementById("beat_regular");
let beat_accent = document.getElementById("beat_accent");
let metronome_interval
metronome_switch.addEventListener('change', ()=>{
    if(metronome_switch.checked){
        let beats_per_bar = document.getElementById("beats_per_bar").value;
        let bpm = document.getElementById("bpm").value;
        metronome_start(beats_per_bar,bpm);
    }else{
        metronome_stop();
    }
});
function metronome_start(beats_per_bar,bpm){
    clearInterval(metronome_interval)
    beat_accent.play()
    let beat_count = 0;
    metronome_interval = setInterval(()=>{
        if(beat_count >= beats_per_bar - 1){
            beat_accent.pause()
            beat_accent.currentTime = 0
            beat_accent.play()
            beat_count = 0
            if(document.getElementById('change_chord_on_accent').checked){
                change_chord()
            }
        } else {
            beat_regular.pause()
            beat_regular.currentTime = 0
            beat_regular.play()
            beat_count += 1
        }
    },Math.floor(60000 / bpm))
}
function metronome_stop(){
    clearInterval(metronome_interval)
}