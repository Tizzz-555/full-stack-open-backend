import patients from "../../data/patientsData";
import {
  NonSensitivePatient,
  Patient,
  NewPatient,
  EntryWithoutId,
  Entry,
} from "../types";
import { v1 as uuid } from "uuid";

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatient = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);
  return patient;
};

const addPatient = (patient: NewPatient): Patient => {
  try {
    const newPatient = {
      id: uuid(),
      ...patient,
      entries: [],
    };
    patients.push(newPatient);
    return newPatient;
  } catch (error) {
    console.error("Error adding patient:", error);
    throw new Error("Failed to add patient");
  }
};

const editPatient = (
  id: string,
  updatedFields: Partial<Omit<Patient, "id">>
): Patient | undefined => {
  const patientIndex = patients.findIndex((p) => p.id === id);
  if (patientIndex === -1) {
    return undefined;
  }
  const existingPatient = patients[patientIndex];
  const updatedPatient = { ...existingPatient, ...updatedFields, id };
  patients[patientIndex] = updatedPatient;
  return updatedPatient;
};

const addEntry = (id: string, entry: EntryWithoutId): Entry | undefined => {
  const patientIndex = patients.findIndex((p) => p.id === id);
  if (patientIndex === -1) {
    return undefined;
  }
  const existingPatient = patients[patientIndex];
  const newEntry = {
    id: uuid(),
    ...entry,
  };
  existingPatient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getPatient,
  addPatient,
  editPatient,
  addEntry,
};
