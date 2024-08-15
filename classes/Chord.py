from classes.Note import Note

class Chord:
    def __init__(self,root_note:Note,chord_type:str) -> None:
        self.root_note = root_note
        self.chord_type = chord_type
        self.notes: list[Note] = [root_note]
        notes_except_root = Chord.chordTypeToArr(chord_type)
        for n_interval in notes_except_root:
            self.notes.append(root_note.getNoteByInterval(n_interval))
    def name(self)->str:
        return self.root_note.text() + self.chord_type
    def text(self) -> str:
        txt = ''
        for n in self.notes:
            txt += n.text() + ' '
        return txt
    @staticmethod
    def chordTypeToArr(chord_type:str) -> list[tuple[int,int]]:
        match chord_type:
            case 'dim':
                return [(2,3),(4,6)]
            case 'm':
                return [(2,3),(4,7)]
            case ''|'M':
                return [(2,4),(4,7)]
            case 'aug':
                return [(2,4),(4,8)]
            
            case 'M7' | 'Maj7' | '△7':
                arr = Chord.chordTypeToArr('M')
                arr.append((6,11))
                return arr
            case '7' | 'Mm7' | 'dom7':
                arr = Chord.chordTypeToArr('M')
                arr.append((6,10))
                return arr
            case 'm7' | 'min7' | '-7':
                arr = Chord.chordTypeToArr('m')
                arr.append((6,10))
                return arr
            # 带括号类的类型稍后考虑是否要去掉
            case 'ø' | 'm7(♭5)' | 'half-dim7' | 'm7-5':
                arr = Chord.chordTypeToArr('dim')
                arr.append((6,10))
                return arr
            case 'o7' | '°7' | '°' | 'dim7':
                arr = Chord.chordTypeToArr('dim')
                arr.append((6,9))
                return arr
            case 'mM7' | '-△':
                arr = Chord.chordTypeToArr('m')
                arr.append((6,11))
                return arr
            case 'Maj7+5' | 'M7+':
                arr = Chord.chordTypeToArr('aug')
                arr.append((6,11))
                return arr

# note_root = Note(1,1)
# new_chord = Chord(note_root,'m')
# print(new_chord.text())