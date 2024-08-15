let chord_generate_mode_select = document.getElementById("chord_generate_mode_select");

let mode_complete_random = document.getElementById("mode_complete_random");
let diatonic_random = document.getElementById("mode_diatonic_random")
let custom_chords_progression = document.getElementById("mode_custom_chords_progression")

function change_chord_generate(){
    mode_complete_random.hidden = true
    diatonic_random.hidden = true
    custom_chords_progression.hidden = true
    switch (chord_generate_mode_select.value) {
        case 'complete_random':
            mode_complete_random.hidden = false
            break;
        case  'diatonic_random':
            diatonic_random.hidden = false
            break;
        case 'custom_chords_progression':
            custom_chords_progression.hidden = false
            break;
    }
}

window.onload = () => {
    change_chord_generate()
}

chord_generate_mode_select.addEventListener('change',()=>{
    change_chord_generate()
})
