import express from "express";
import diagnosisRouter from "./routes/diagnoses";
import patientsRouter from "./routes/patients";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

app.use("/api/diagnoses", diagnosisRouter);
app.use("/api/patients", patientsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
