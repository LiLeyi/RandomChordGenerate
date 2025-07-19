document.addEventListener('DOMContentLoaded', function() {
    const beatAccent = document.getElementById('beat_accent');
    const beatRegular = document.getElementById('beat_regular');
    const beatsPerBarInput = document.getElementById('beats_per_bar');
    const bpmInput = document.getElementById('bpm');
    const metronomeSwitch = document.getElementById('metronome_switch');
    const changeChordOnAccent = document.getElementById('change_chord_on_accent');
    const volumeSlider = document.getElementById('volume-slider');
    const decreaseBpmBtn = document.getElementById('decrease-bpm');
    const increaseBpmBtn = document.getElementById('increase-bpm');
    const metronomeVisual = document.getElementById('metronome-visual');

    let beatCount = 0;
    let timer = null;
    let lastBeatTime = 0;
    let beatsPerBar = 4;
    let bpm = 60;
    let isPlaying = false;
    let audioUnlocked = false;

    // 更新节拍器可视化元素
    function updateMetronomeVisual() {
        metronomeVisual.innerHTML = '';
        for (let i = 1; i <= beatsPerBar; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'beat-indicator';
            indicator.setAttribute('data-beat', i);
            metronomeVisual.appendChild(indicator);
        }
    }

    // 激活特定节拍的指示器
    function activateBeatIndicator(beat) {
        const indicators = document.querySelectorAll('.beat-indicator');
        indicators.forEach(ind => ind.classList.remove('active'));
        if (beat >= 1 && beat <= indicators.length) {
            indicators[beat - 1].classList.add('active');
        }
    }

    // 根据音频播放创建可视化效果
    function visualizeSound(isAccent) {
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => {
            const height = isAccent ? 60 + Math.random() * 40 : 20 + Math.random() * 40;
            bar.style.height = `${height}%`;
            setTimeout(() => {
                bar.style.height = '10%';
            }, 200);
        });
    }

    // 封装的音频播放函数，包含错误处理
    function playAudio(audioElement, isAccent) {
        console.log(`尝试播放音频: ${audioElement.id}`);
        audioElement.currentTime = 0;
        const playPromise = audioElement.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log(`成功播放: ${audioElement.id}`);
                visualizeSound(isAccent);
                audioUnlocked = true;
            }).catch(error => {
                console.error("音频播放失败:", error);
                stopMetronome();
                if (!audioUnlocked) {
                    alert("浏览器阻止了声音播放。请在页面上进行一次点击或交互（如点击“生成和弦”按钮），然后重新打开节拍器。");
                }
                metronomeSwitch.checked = false;
            });
        }
    }

    // 播放节拍声音
    function playBeat() {
        const now = Date.now();
        beatCount++;

        if (beatCount > beatsPerBar) {
            beatCount = 1;
            if (isPlaying && changeChordOnAccent.checked) {
                document.getElementById('submit').click();
            }
            playAudio(beatAccent, true);
        } else {
            playAudio(beatRegular, false);
        }
        
        activateBeatIndicator(beatCount);

        const theoreticalInterval = 60000 / bpm;
        const drift = (now - lastBeatTime) - theoreticalInterval;
        lastBeatTime = now;
        timer = setTimeout(playBeat, Math.max(0, theoreticalInterval - drift));
    }

    // 开始节拍器
    function startMetronome() {
        if (isPlaying) return;
        
        beatCount = 0;
        lastBeatTime = Date.now();
        isPlaying = true;
        playBeat();
    }

    // 停止节拍器
    function stopMetronome() {
        if (!isPlaying) return;
        
        clearTimeout(timer);
        isPlaying = false;
        beatCount = 0;
        const indicators = document.querySelectorAll('.beat-indicator');
        indicators.forEach(ind => ind.classList.remove('active'));
    }

    // 设置音量
    function setVolume() {
        const volume = volumeSlider.value / 100;
        beatAccent.volume = volume;
        beatRegular.volume = volume;
    }

    // 事件监听器
    metronomeSwitch.addEventListener('change', function() {
        if (this.checked) {
            startMetronome();
        } else {
            stopMetronome();
        }
    });

    beatsPerBarInput.addEventListener('change', function() {
        const value = parseInt(this.value);
        if (value >= 1 && value <= 12) {
            beatsPerBar = value;
            updateMetronomeVisual();
        } else {
            this.value = beatsPerBar;
        }
    });

    function updateBpm() {
        const value = parseInt(bpmInput.value);
        if (value >= 20 && value <= 240) {
            bpm = value;
            if (isPlaying) {
                stopMetronome();
                startMetronome();
            }
        } else {
            bpmInput.value = bpm;
        }
    }

    bpmInput.addEventListener('change', updateBpm);
    volumeSlider.addEventListener('input', setVolume);

    decreaseBpmBtn.addEventListener('click', function() {
        bpmInput.value = Math.max(20, parseInt(bpmInput.value) - 1);
        updateBpm();
    });

    increaseBpmBtn.addEventListener('click', function() {
        bpmInput.value = Math.min(240, parseInt(bpmInput.value) + 1);
        updateBpm();
    });

    // 初始化
    beatsPerBar = parseInt(beatsPerBarInput.value);
    updateMetronomeVisual();
    setVolume();
    const bars = document.querySelectorAll('.bar');
    if (bars) {
        bars.forEach(bar => {
            bar.style.height = '10%';
        });
    }
});