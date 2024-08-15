class Note:
    def __init__(self,base_num:int,halftone_num:int) -> None:
        self.note_arr = [base_num,halftone_num]
    def text(self) -> str:
        base_pitch_num = self.note_arr[0]
        halftone_pitch_num = self.note_arr[1]
        standard_halftone_pitch_arr = [1,3,5,6,8,10,12]
        standard_halftone_pitch = standard_halftone_pitch_arr[base_pitch_num - 1]
        difference = halftone_pitch_num - standard_halftone_pitch
        accidental = ''
        match difference:
            case 0:
                accidental = ''
            case -2 | 10:
                accidental = '𝄫'
            case -1 | 11:
                accidental = '♭'
            case 1 | -11:
                accidental = '♯'
            case 2 | -10:
                accidental = '𝄪'
        return Note.numToBasePitch(base_pitch_num) + accidental
    def getNoteByInterval(self, interval):
        """
        同度    (0,0)

        小二度  (1,1)
        大二度  (1,2)

        减三度  (2,2)
        小三度  (2,3)
        大三度  (2,4)
        增三度  (2,5)

        减四度  (3,4)
        纯四度  (3,5)
        增四度  (3,6)

        减五度  (4,6)
        纯五度  (4,7)
        增五度  (4,8)

        减六度  (5,7)
        小六度  (5,8)
        大六度  (5,9)
        增六度  (5,10)

        减七度  (6,9)
        小七度  (6,10)
        大七度  (6,11)
        增七度  (6,12)
        """
        new_note = Note((self.note_arr[0] + interval[0] - 1) % 7 + 1, (self.note_arr[1] + interval[1] -1) % 12 + 1)
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