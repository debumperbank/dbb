export const workPhases = {
  "intake": {
    "label": "Intake",
    "items": {
      "wishes": "Wensen en werkzaamheden met klant besproken",
      "damage": "Bestaande schade en voertuigstaat vastgelegd",
      "belongings": "Sleutels en achtergelaten spullen gecontroleerd"
    }
  },
  "preparation": {
    "label": "Voorbewerking",
    "items": {
      "clean": "Werkoppervlak gereinigd en ontvet",
      "sand": "Schuurwerk en ondergrond gecontroleerd",
      "mask": "Niet te behandelen delen afgedekt"
    }
  },
  "disassembly": {
    "label": "Demontage",
    "items": {
      "parts": "Benodigde onderdelen gedemonteerd",
      "label": "Onderdelen en bevestigingen gelabeld en opgeborgen",
      "damage": "Verborgen schade gecontroleerd en vastgelegd"
    }
  },
  "painting": {
    "label": "Spuitwerk",
    "items": {
      "colour": "Kleur en materiaal gecontroleerd",
      "surface": "Ondergrond en afplakwerk gecontroleerd",
      "finish": "Lakbeeld en droging gecontroleerd"
    }
  },
  "assembly": {
    "label": "Montage",
    "items": {
      "parts": "Onderdelen teruggeplaatst",
      "fixings": "Bevestigingen volgens voorschrift gecontroleerd",
      "function": "Aansluiting en werking gecontroleerd"
    }
  },
  "finishing": {
    "label": "Afwerking",
    "items": {
      "edges": "Randen en overgangen gecontroleerd",
      "defects": "Afwerkingsfouten gecontroleerd",
      "quality": "Eindcontrole van het uitgevoerde werk gedaan"
    }
  },
  "cleaning": {
    "label": "Reinigen en poetsen",
    "items": {
      "outside": "Buitenzijde gereinigd",
      "inside": "Werksporen in interieur verwijderd",
      "polish": "Poetswerk en productresten gecontroleerd"
    }
  },
  "result": {
    "label": "Eindresultaat",
    "items": {
      "photos": "Eindfoto’s vastgelegd",
      "agreed": "Afgesproken werkzaamheden gecontroleerd",
      "handover": "Oplevering en aandachtspunten met klant besproken"
    }
  }
} as const;
export type WorkPhase = keyof typeof workPhases;
export type CheckAnswer = "yes" | "no" | "na";
export type PhaseRecord = {phase: WorkPhase; answers: Record<string,CheckAnswer>; notes: string; revision: number};
export function isWorkPhase(value: string): value is WorkPhase {return Object.hasOwn(workPhases,value);}
export function validatePhase(phase:string, answers:unknown, notes:unknown, revision:unknown) {
 if(!isWorkPhase(phase) || !answers || typeof answers!=="object" || Array.isArray(answers) || typeof notes!=="string" || notes.length>10000 || !Number.isSafeInteger(revision) || Number(revision)<0) throw Error("Controleer de werkfase, antwoorden en notities.");
 const clean:Record<string,CheckAnswer>={};
 for(const [key,value] of Object.entries(answers)) {
  if(!Object.hasOwn(workPhases[phase].items,key) || !["yes","no","na"].includes(String(value)) || typeof value!=="string") throw Error("Ongeldig checklistantwoord.");
  clean[key]=value as CheckAnswer;
 }
 return {answers:clean,notes:notes.trim()};
}
export const legacyPhotoLabels:Record<string,string>={request:"Bij de aanvraag",before:"Voor de werkzaamheden (bestaand)",during:"Tijdens de werkzaamheden (bestaand)",after:"Na de werkzaamheden (bestaand)"};
