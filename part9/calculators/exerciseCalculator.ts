export interface evaluationObj {
	periodLength: number;
	trainingDays: number;
	success: boolean;
	rating: number;
	ratingDescription: string;
	target: number;
	average: number;
}

import { parseExerciseArgs } from "./utils";

export const calculateExercises = (args: number[]): evaluationObj => {
	// calculate average time of daily exercise hours
	const target = args.shift();

	if (target === undefined) throw new Error("malformatted parameters");

	const trainingDays = args.filter((d) => d > 0);
	const totalTime = trainingDays.reduce(
		(acc: number, curr: number) => acc + curr
	);
	const average = totalTime / args.length;
	let rating =
		average >= target ? 3 : average < target && average >= target - 0.5 ? 2 : 1;

	let ratingDescription =
		rating === 3
			? "Well done!"
			: rating === 2
			? "Not too bad but could be better"
			: "Read David Goggins and try again";

	if (average >= target) {
		rating = 3;
		ratingDescription = "Well done!";
	}
	return {
		periodLength: args.length,
		trainingDays: trainingDays.length,
		success: rating === 3,
		rating,
		ratingDescription,
		target,
		average,
	};
};

if (require.main === module) {
	try {
		const input = parseExerciseArgs(process.argv);
		console.log(calculateExercises(input));
	} catch (error: unknown) {
		let errorMessage = "Something bad happened.";
		if (error instanceof Error) {
			errorMessage += " Error: " + error.message;
		}
		console.log(errorMessage);
	}
}
