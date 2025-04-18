import patients from "../../data/patientsData";
import { NonSensitivePatient, Patient } from "../types";
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

const addPatient = (
  name: string,
  dateOfBirth: string,
  ssn: string,
  gender: string,
  occupation: string
): Patient => {
  try {
    const id = uuid();
    const patientWithId = { id, name, dateOfBirth, ssn, gender, occupation };
    patients.push(patientWithId);
    return patientWithId;
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

export default {
  getPatients,
  addPatient,
  editPatient,
};
