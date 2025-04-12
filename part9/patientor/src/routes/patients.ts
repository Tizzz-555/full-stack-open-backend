import express from "express";
import patientService from "../services/patientService";
import { NonSensitivePatient } from "../types";

const router = express.Router();

router.get("/", (_req, res: express.Response<NonSensitivePatient[]>) => {
  res.send(patientService.getPatients());
});

export default router;
