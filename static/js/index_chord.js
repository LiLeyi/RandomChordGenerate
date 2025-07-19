document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submit');
    const chordSeriesShow = document.getElementById('chord_series_show');
    const chordNameShow = document.getElementById('chord_name_show');
    const chordNotesShow = document.getElementById('chord_notes_show');
    
    // Web Audio API 初始化
    let audioContext;
    let mainGainNode;

    function initAudio() {
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                mainGainNode = audioContext.createGain();
                mainGainNode.connect(audioContext.destination);
                mainGainNode.gain.value = 0.3; // 设置一个合适的默认音量
                console.log("Web Audio API 初始化成功。");
            } catch (e) {
                console.error("Web Audio API 初始化失败:", e);
                alert("您的浏览器不支持Web Audio API，无法播放声音。");
            }
        }
    }

    // 事件监听器，在用户首次交互时初始化AudioContext
    document.body.addEventListener('click', initAudio, { once: true });
    document.body.addEventListener('keydown', initAudio, { once: true });


    submitButton.addEventListener('click', generateChord);
    window.change_chord = generateChord;

    function generateChord() {
        console.log("“生成和弦”按钮被点击，正在准备生成数据...");
        if (!audioContext) {
            console.warn("AudioContext尚未初始化，声音可能无法播放。请先与页面交互。");
        }

        const modeSelect = document.getElementById('chord_generate_mode_select');
        const mode = modeSelect.getValue();
        
        const requestData = {
            chord_generate_mode: mode,
            show_pattern: {
                chord_series: document.getElementById('show_chord_series').checked,
                chord_name: document.getElementById('show_chord_name').checked,
                chord_notes: document.getElementById('show_chord_notes').checked
            },
            play_chord_sound: document.getElementById('play_chord_sound').checked
        };
        
        if (mode === 'complete_random') {
            requestData.root_note_pattern = document.getElementById('root_note_pattern').value;
            requestData.chord_pattern = {
                common_triad: document.getElementById('common_triad').checked,
                uncommon_triad: document.getElementById('uncommon_triad').checked,
                common_seventh_chord: document.getElementById('common_seventh_chord').checked,
                uncommon_seventh_chord: document.getElementById('uncommon_seventh_chord').checked
            };
        } 
        else if (mode === 'diatonic_random') {
            requestData.mode_diatonic_random = {
                mode_type_select: document.getElementById('mode_select').value,
                root_natural_note_select: document.getElementById('root_natural_note_select').value,
                accidental: document.getElementById('accidental').value,
                chord_select: {
                    triads: document.getElementById('mode_diatonic_random_triads').checked,
                    seventh_chords: document.getElementById('mode_diatonic_random_seventh_chords').checked
                }
            };
        }
        
        fetch('/chord_generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            // 如果响应成功，则解析JSON
            if (response.ok) {
                return response.json();
            }
            // 如果响应失败，尝试解析错误信息并拒绝Promise
            return response.json().then(errorData => {
                return Promise.reject(errorData);
            }).catch(() => {
                // 如果错误响应体不是有效的JSON，则创建通用错误
                return Promise.reject({ error: `服务器错误: ${response.status} ${response.statusText}` });
            });
        })
        .then(data => {
            chordSeriesShow.textContent = data.show_pattern.chord_series && data.chord_series ? data.chord_series : '';
            chordNameShow.textContent = data.show_pattern.chord_name && data.chord_name ? data.chord_name : '';
            chordNotesShow.textContent = data.show_pattern.chord_notes && data.chord_notes ? data.chord_notes : '';
            
            if (data.show_pattern.chord_name && data.chord_name) {
                animateElement(chordNameShow);
            }

            if (data.play_chord_sound && data.chord_notes_midi) {
                playChord(data.chord_notes_midi);
            }
        })
        .catch(error => {
            console.error('请求出错:', error);
            // 优先显示后端返回的具体错误信息
            const errorMessage = error && error.error ? error.error : '生成失败，请检查网络或设置';
            chordNameShow.textContent = errorMessage;
            // 清空其他区域
            chordSeriesShow.textContent = '';
            chordNotesShow.textContent = '';
        });
    }
    
    function animateElement(element) {
        element.style.transform = 'scale(1.1)';
        element.style.opacity = '0.8';
        setTimeout(() => {
            element.style.transition = 'all 0.3s ease-out';
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
            setTimeout(() => {
                element.style.transition = '';
            }, 300);
        }, 50);
    }

    // 音符名称到MIDI编号的映射
    const noteToMidi = {
        'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
        'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };

    function noteNameToMidiNumber(noteName) {
        const octave = parseInt(noteName.slice(-1));
        const pitch = noteName.slice(0, -1);
        return noteToMidi[pitch] + (octave + 1) * 12;
    }
    
    function midiToFrequency(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    function playChord(notes) {
        if (!audioContext || audioContext.state === 'suspended') {
            audioContext.resume();
        }
        if (!audioContext) {
            console.error("AudioContext 不可用，无法播放声音。");
            return;
        }

        // 如果没有音符（例如，在某些无效输入下），则不执行任何操作
        if (!notes || notes.trim() === '') {
            console.log("没有音符可供播放。");
            return;
        }

        const now = audioContext.currentTime;
        const noteNames = notes.trim().split(' ');

        noteNames.forEach(noteName => {
            const midiNumber = noteNameToMidiNumber(noteName);
            if (isNaN(midiNumber)) {
                console.warn(`无效的音符名称: "${noteName}"`);
                return;
            }
            const frequency = midiToFrequency(midiNumber);
            
            const oscillator = audioContext.createOscillator();
            const noteGain = audioContext.createGain();

            // 使用 'triangle' 波形，比 'sine' 更丰富，听起来更像乐器
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(frequency, now);

            // 创建一个模拟钢琴击键的音量包络 (ADSR)
            noteGain.gain.setValueAtTime(0, now);
            // Attack - 快速起音
            noteGain.gain.linearRampToValueAtTime(0.7, now + 0.05); 
            // Decay - 衰减到持续音量
            noteGain.gain.exponentialRampToValueAtTime(0.1, now + 0.5);
            // Release - 缓慢释放
            noteGain.gain.exponentialRampToValueAtTime(0.00001, now + 2);

            oscillator.connect(noteGain);
            noteGain.connect(mainGainNode);

            oscillator.start(now);
            oscillator.stop(now + 2);
        });
    }
});