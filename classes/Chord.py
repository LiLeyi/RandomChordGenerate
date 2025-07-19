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
    def text(self):
        return ' '.join([note.name_without_octave() for note in self.notes])

    def text_midi(self):
        return ' '.join([note.name() for note in self.notes])
    @staticmethod
    def chordTypeToArr(chord_type: str) -> list[tuple[int, int]]:
        chord_map = {
            'm': [(2, 3), (4, 7)],
            'M': [(2, 4), (4, 7)],
            'dim': [(2, 3), (4, 6)],
            'aug': [(2, 4), (4, 8)],
            'M7': [(2, 4), (4, 7), (6, 11)],
            'm7': [(2, 3), (4, 7), (6, 10)],
            '7': [(2, 4), (4, 7), (6, 10)],
            'ø': [(2, 3), (4, 6), (6, 10)],
            'o7': [(2, 3), (4, 6), (6, 9)],
            'mM7': [(2, 3), (4, 7), (6, 11)],
            'M7+': [(2, 4), (4, 8), (6, 11)],
        }
        return chord_map.get(chord_type, [])

# note_root = Note(1,1)
# new_chord = Chord(note_root,'m')
# print(new_chord.text())