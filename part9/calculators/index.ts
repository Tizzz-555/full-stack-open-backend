import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";
const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
	res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
	const { height, weight } = req.query;

	if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
		res.status(400).json({ error: "malformatted parameters" });
		return;
	}
	const bmi = calculateBmi(Number(height), Number(weight));

	res.json({ weight, height, bmi });
});

app.post("/exercises", (req, res) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const {
		daily_exercises,
		target,
	}: { daily_exercises: number[]; target: number } = req.body;

	if (!daily_exercises || !target) {
		res.status(400).json({ error: "parameters missing" });
		return;
	} else if (
		!daily_exercises.every((n) => !isNaN(Number(n))) ||
		isNaN(Number(target))
	) {
		res.status(400).json({ error: "malformatted parameters" });
		return;
	}

	try {
		const exercisesWithTarget = [target, ...daily_exercises];
		const result = calculateExercises(exercisesWithTarget);
		res.status(200).json({ result });
	} catch (error) {
		res.status(400).json({ error: error as Error });
	}
});
const PORT = 3003;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
