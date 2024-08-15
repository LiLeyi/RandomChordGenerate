import random
from flask import Flask, render_template, request, jsonify
from classes.Chord import Chord
from classes.Mode import Mode
from classes.Note import Note
import os
import sys
os.chdir(sys.path[0])


app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def index():
    return render_template('index.html',mode_options = Mode.getAllModeNames())


@app.route('/chord_generate', methods=['POST'])
def chord_generate():
    data = request.get_json()

    if data['chord_generate_mode'] == 'complete_random':
        # 选择根音
        root_notes_arr: list[Note] = []
        if data['root_note_pattern'] == 'only_natural_pitch':
            note_root = Note(1, 1)
            new_mode = Mode(note_root, 'Ionian')
            root_notes_arr = new_mode.notes
        if data['root_note_pattern'] == 'include_halftone_pitch':
            note_root = Note(1, 1)
            new_mode = Mode(note_root, 'All')
            root_notes_arr = new_mode.notes
        root_note = random.choice(root_notes_arr)
        #选择和弦类型
        chord_types_arr : list[str] = []
        chord_settings = data['chord_pattern']
        if chord_settings['common_triad']:
            chord_types_arr.extend([
                'm','M'
            ])
        if chord_settings['uncommon_triad']:
            chord_types_arr.extend([
                'dim','aug'
            ])
        if chord_settings['common_seventh_chord']:
            chord_types_arr.extend([
                'M7','m7','7','ø','o7'
            ])
        if chord_settings['uncommon_seventh_chord']:
            chord_types_arr.extend([
                'mM7','M7+'
            ])
        chord_type = random.choice(chord_types_arr)
        chord = Chord(root_note, chord_type)
        return jsonify({
            "chord_series": None,
            "chord_name": chord.name(),
            "chord_notes": chord.text(),
            'show_pattern': data['show_pattern']
            })
    elif data['chord_generate_mode'] == 'diatonic_random':
        # 翻译出根音
        root_note_basic = Note.basicPitchToNum(data['mode_diatonic_random']['root_natural_note_select'])
        root_note_halftone = Note.getStandardHalftoneNum()[root_note_basic - 1]
        accidental = data['mode_diatonic_random']['accidental']
        if(accidental == 'flat'):
            root_note_halftone = (root_note_halftone - 2) % 12 + 1
        elif(accidental == 'sharp'):
            root_note_halftone = (root_note_halftone) % 12 + 1
        root_note = Note(root_note_basic,root_note_halftone)
        # 新建调式
        new_mode = Mode(root_note, data['mode_diatonic_random']['mode_type_select'])
        chords_data = new_mode.getRandomChord()
        chord: Chord
        chords:list[Chord]=[]
        if(data['mode_diatonic_random']['chord_select']['triads']):
            chords.append(chords_data[1])
        if(data['mode_diatonic_random']['chord_select']['seventh_chords']):
            chords.append(chords_data[2])
        chord = random.choice(chords)

        return jsonify({
            "chord_series": chords_data[0],
            "chord_name": chord.name(),
            "chord_notes": chord.text(),
            'show_pattern': data['show_pattern']
            })

if __name__ == '__main__':
    app.run(debug=True)