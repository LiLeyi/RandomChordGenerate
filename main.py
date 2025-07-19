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
    data = request.get_json(force=True)
    if not data:
        return jsonify({"error": "无效的请求数据"}), 400

    if data.get('chord_generate_mode') == 'complete_random':
        # 选择根音
        root_notes_arr: list[Note] = []
        if data.get('root_note_pattern') == 'only_natural_pitch' or data.get('root_note_pattern') == '':
            note_root = Note(1, 1)
            new_mode = Mode(note_root, 'Ionian')
            root_notes_arr = new_mode.notes
        if data.get('root_note_pattern') == 'include_halftone_pitch':
            root_notes_arr = [
                Note(1, 1), Note(1, 2), Note(2, 3), Note(2, 4), Note(3, 5), Note(4, 6),
                Note(4, 7), Note(5, 8), Note(5, 9), Note(6, 10), Note(6, 11), Note(7, 12)
            ]
        
        if not root_notes_arr:
            return jsonify({"error": "未能确定根音池"}), 400

        root_note = random.choice(root_notes_arr)
        
        #选择和弦类型
        chord_types_arr : list[str] = []
        chord_settings = data.get('chord_pattern', {})
        if chord_settings.get('common_triad'):
            chord_types_arr.extend(['m','M'])
        if chord_settings.get('uncommon_triad'):
            chord_types_arr.extend(['dim','aug'])
        if chord_settings.get('common_seventh_chord'):
            chord_types_arr.extend(['M7','m7','7','ø','o7'])
        if chord_settings.get('uncommon_seventh_chord'):
            chord_types_arr.extend(['mM7','M7+'])
        
        if not chord_types_arr:
            return jsonify({"error": "未选择和弦类型"}), 400
        
        chord_type = random.choice(chord_types_arr)
        chord = Chord(root_note, chord_type)
        return jsonify({
            "chord_series": None,
            "chord_name": chord.name(),
            "chord_notes": chord.text(),
            "chord_notes_midi": chord.text_midi(),
            'show_pattern': data.get('show_pattern', {}),
            'play_chord_sound': data.get('play_chord_sound', False)
        })

    elif data.get('chord_generate_mode') == 'diatonic_random':
        mode_data = data.get('mode_diatonic_random', {})
        root_natural_note = mode_data.get('root_natural_note_select')
        if not root_natural_note:
            return jsonify({"error": "未选择根音"}), 400
            
        root_note_basic = Note.basicPitchToNum(root_natural_note)
        if root_note_basic is None:
            return jsonify({"error": "无效的根音名称"}), 400
            
        root_note_halftone = Note.getStandardHalftoneNum()[root_note_basic - 1]
        accidental = mode_data.get('accidental')
        if accidental == 'flat':
            root_note_halftone = (root_note_halftone - 2) % 12 + 1
        elif accidental == 'sharp':
            root_note_halftone = (root_note_halftone) % 12 + 1
        
        root_note = Note(root_note_basic, root_note_halftone)
        
        mode_type = mode_data.get('mode_type_select')
        if not mode_type:
            return jsonify({"error": "未选择调式"}), 400
            
        new_mode = Mode(root_note, mode_type)
        chords_data = new_mode.getRandomChord()
        chords:list[Chord]=[]
        
        chord_select = mode_data.get('chord_select', {})
        if chord_select.get('triads'):
            chords.append(chords_data[1])
        if chord_select.get('seventh_chords'):
            chords.append(chords_data[2])
            
        if not chords:
            return jsonify({"error": "未选择和弦类型"}), 400
            
        chord = random.choice(chords)

        return jsonify({
            "chord_series": chords_data[0],
            "chord_name": chord.name(),
            "chord_notes": chord.text(),
            "chord_notes_midi": chord.text_midi(),
            'show_pattern': data.get('show_pattern', {}),
            'play_chord_sound': data.get('play_chord_sound', False)
        })
    
    return jsonify({"error": "无效的和弦生成模式"}), 400

@app.errorhandler(400)
def bad_request(error):
    # 尝试记录原始请求数据以供调试
    try:
        request_data = request.get_data(as_text=True)
        print(f"捕获到400错误，请求数据: {request_data}")
    except Exception as e:
        print(f"在处理400错误时无法获取请求数据: {e}")
    
    # 确保总是返回JSON格式的错误
    response = jsonify({
        "error": "请求无效",
        "description": "服务器无法处理该请求，请检查发送的数据格式。"
    })
    response.status_code = 400
    return response


if __name__ == '__main__':
    app.run(debug=True)