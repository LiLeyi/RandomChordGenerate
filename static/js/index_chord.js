let button = document.getElementById("submit");
let chord_name_show = document.getElementById("chord_name_show");
let chord_notes_show = document.getElementById("chord_notes_show");

let select_root_note_pattern = document.getElementById("root_note_pattern");

button.addEventListener('click', () => {
    change_chord()
})

let data_id_list = [
    "chord_generate_mode_select", "root_note_pattern", "common_triad", "uncommon_triad",
    "common_seventh_chord", "uncommon_seventh_chord", "root_natural_note_select", "accidental",
    "mode_select", "mode_diatonic_random_triads", "mode_diatonic_random_seventh_chords",
    "show_chord_series", "show_chord_name", "show_chord_notes",

    "change_chord_on_accent", "beats_per_bar", "bpm",

    "chord_generate_mode_select"
]
window.addEventListener('load',()=>{
    init_data(data_id_list)
})
window.onbeforeunload = () => {
    store_data(data_id_list)
}
function change_chord() {
    fetch('/chord_generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'chord_generate_mode': document.getElementById("chord_generate_mode_select").value,

            //complete_random
            'root_note_pattern': document.getElementById("root_note_pattern").value,
            'chord_pattern': {
                'common_triad': document.getElementById("common_triad").checked,
                'uncommon_triad': document.getElementById("uncommon_triad").checked,
                'common_seventh_chord': document.getElementById("common_seventh_chord").checked,
                'uncommon_seventh_chord': document.getElementById("uncommon_seventh_chord").checked
            },

            //diatonic_random
            'mode_diatonic_random': {
                'root_natural_note_select': document.getElementById("root_natural_note_select").value,
                'accidental': document.getElementById("accidental").value,
                'mode_type_select': document.getElementById("mode_select").value,
                'chord_select': {
                    'triads': document.getElementById("mode_diatonic_random_triads").value,
                    'seventh_chords': document.getElementById("mode_diatonic_random_seventh_chords").value
                }
            },

            'show_pattern': {
                'show_chord_series': document.getElementById("show_chord_series").checked,
                'show_chord_name': document.getElementById("show_chord_name").checked,
                'show_chord_notes': document.getElementById("show_chord_notes").checked
            }
        })
    })
        .then(response => response.json())
        .then(data => {
            store_data(data_id_list)
            if (data['show_pattern']['show_chord_series'] && data['chord_series'] != null) {
                chord_series_show.textContent = String(data.chord_series)
            }
            if (data['show_pattern']['show_chord_name']) {
                chord_name_show.textContent = data.chord_name
            }
            if (data['show_pattern']['show_chord_notes']) {
                chord_notes_show.textContent = data.chord_notes
            }
        })
}

function store_data(id_list) {
    id_list.forEach(id => {
        if (document.getElementById(id).checked != null) {
            localStorage.setItem(id, document.getElementById(id).checked)
        } else {
            localStorage.setItem(id, document.getElementById(id).value)
        }
    })
}

function init_data(id_list) {
    id_list.forEach(id => {
        if (document.getElementById(id).checked != null) {
            if(localStorage.getItem(id) == 'true'){
                document.getElementById(id).checked = true
            } else {
                document.getElementById(id).checked = false

            }
        } else {
            document.getElementById(id).value = localStorage.getItem(id)
        }
    })
}