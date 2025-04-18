export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export type NonSensitivePatient = Omit<Patient, "ssn">;
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
}

export type NewPatientEntry = Omit<Patient, "id">;
