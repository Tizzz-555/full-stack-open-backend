import express, { Request, Response, NextFunction } from "express";
import patientService from "../services/patientService";
import { NonSensitivePatient, NewPatient, Patient } from "../types";
import { NewPatientSchema } from "../utils";
import { z } from "zod";

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

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    console.log(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};
router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  }
);

router.post("/:id/entries", (req: Request, res: Response) => {
  const {} = req.body;
  if (entry) {
    res.json(entry);
  } else {
    res.sendStatus(404);
  }
});

router.use(errorMiddleware);

export default router;
