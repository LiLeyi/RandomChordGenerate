class Note:
    pitch_name_arr = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

    def __init__(self, base_num: int, halftone_num: int, octave: int = 4) -> None:
        self.base_num = base_num
        self.halftone_num = halftone_num
        self.octave = octave

    def name_without_octave(self):
        return self.pitch_name_arr[self.halftone_num - 1]

    def name(self):
        return self.pitch_name_arr[self.halftone_num - 1] + str(self.octave)

    def text(self) -> str:
        # This function can be more complex if you need to display accidentals like '♭' or '♯'
        # based on the mode or key. For now, it returns the simple name.
        base_pitch_map = {1: 'C', 2: 'D', 3: 'E', 4: 'F', 5: 'G', 6: 'A', 7: 'B'}
        standard_halftone = Note.getStandardHalftoneNum()[self.base_num - 1]
        diff = self.halftone_num - standard_halftone
        
        accidental = ''
        if diff in [-2, 10]: accidental = '𝄫'
        elif diff in [-1, 11]: accidental = '♭'
        elif diff in [1, -11]: accidental = '♯'
        elif diff in [2, -10]: accidental = '𝄪'
        
        return base_pitch_map.get(self.base_num, '') + accidental

    def getNoteByInterval(self, interval):
        base_pitch_num = (self.base_num + interval[0] - 1) % 7 + 1
        halftone_pitch_num = (self.halftone_num + interval[1] - 1) % 12 + 1
        
        # Adjust octave
        octave_change = (self.base_num + interval[0] - 2) // 7
        new_octave = self.octave + octave_change
        
        new_note = Note(base_pitch_num, halftone_pitch_num, new_octave)
        return new_note
    @staticmethod
    def numToBasePitch(num):
        pitch_arr = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
        return pitch_arr[num - 1]
    @staticmethod
    def basicPitchToNum(pitch):
        if pitch == 'C':
            return 1
        elif pitch == 'D':
            return 2
        elif pitch == 'E':
            return 3
        elif pitch == 'F':
            return 4
        elif pitch == 'G':
            return 5
        elif pitch == 'A':
            return 6
        elif pitch == 'B':
            return 7
    @staticmethod
    def getStandardHalftoneNum():
        return [1,3,5,6,8,10,12]