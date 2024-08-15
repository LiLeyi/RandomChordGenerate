from classes.Note import Note
from classes.Chord import Chord
import random


class Mode:
    def __init__(self, root_note: Note, mode_type: str):
        self.root_note = root_note
        self.mode_type = mode_type
        self.notes: list[Note] = []
        self.triads: list[Chord] = []
        self.seventh_chords: list[Chord] = []
        (self.intervals,self.triads_types,self.seventh_chords_types) = Mode.modeTypeToArr(mode_type)
        for n in range(0,len(self.intervals)):
            note_temp = root_note.getNoteByInterval(self.intervals[n])
            self.notes.append(note_temp)
            self.triads.append(Chord(note_temp,self.triads_types[n]))
            self.seventh_chords.append(Chord(note_temp,self.seventh_chords_types[n]))

    def text(self) -> str:
        txt = ''
        for n in self.notes:
            txt += n.text() + ' '
        return txt

    def getRandomChord(self) -> list:
        chord_series = random.randint(1,len(self.notes))
        return (chord_series,self.triads[chord_series-1],self.seventh_chords[chord_series-1])

    @staticmethod
    def modeTypeToArr(mode_type: str)->tuple[list[list[int,int]],list[str],list[str]]:
        new_scale = [[0, 0], [1, 2], [2, 4], [3, 5], [4, 7], [5, 9], [6, 11]]
        new_triad_chords = ['M','m','m','M','M','m','dim']
        new_seventh_chords = ['Maj7','min7','min7','Maj7','7','min7','ø']
        offset = 0
        match mode_type:
            case 'Ionian' | 'Major':
                offset = 0
            case 'Dorian':
                offset = 1
            case 'Phrygian':
                offset = 2
            case 'Lydian':
                offset = 3
            case 'Mixolydian':
                offset = 4
            case 'Aeolian' | 'Minor':
                offset = 5
            case 'Locrian':
                offset = 6
        offset_tuple = tuple(new_scale[offset])
        for i in range(0, offset):
            new_scale.append(new_scale.pop(0))
            new_triad_chords.append(new_triad_chords.pop(0))
            new_seventh_chords.append(new_seventh_chords.pop(0))
        for l in new_scale:
            l[0] = (l[0] - offset_tuple[0]) % 7
            l[1] = (l[1] - offset_tuple[1]) % 12
        if mode_type == 'All':
            new_scale = [
                [0, 11], [0, 0], [0, 1],
                [1, 1], [1, 2], [1, 3],
                [2, 3], [2, 4],[2, 5],
                [3, 4], [3, 5], [3, 6],
                [4, 6], [4, 7], [4, 8],
                [5, 8], [5, 9], [5, 10],
                [6, 10], [6, 11],[6, 0]
            ]
        return (new_scale,new_triad_chords,new_seventh_chords)
    @staticmethod
    def getAllModeNames():
        return ['Ionian','Dorian','Phrygian','Lydian','Mixolydian','Aeolian','Locrian']

# note_root = Note(1,1)
# new_mode = Mode(note_root,'Aeolian')
# print(new_mode.text())
