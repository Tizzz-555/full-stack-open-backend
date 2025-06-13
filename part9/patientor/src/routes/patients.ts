import express, { Request, Response } from "express";
import patientService from "../services/patientService";
import {
  NonSensitivePatient,
  NewPatient,
  Patient,
  EntryWithoutId,
  Entry,
} from "../types";
import { newPatientParser, newEntryParser, errorMiddleware } from "../utils";

const router = express.Router();

router.get("/", (_req, res: express.Response<NonSensitivePatient[]>) => {
  res.send(patientService.getPatients());
});

router.get("/:id", (req, res) => {
  const patient = patientService.getPatient(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  }
);

router.post(
  "/:id/entries",
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, EntryWithoutId>,
    res: Response<Entry>
  ) => {
    const patientId = req.params.id;
    const newEntry = req.body;
    const addedEntry = patientService.addEntry(patientId, newEntry);
    res.json(addedEntry);
  }
);

router.use(errorMiddleware);

export default router;
