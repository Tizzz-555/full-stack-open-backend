export const parseBmiArgs = (
	args: string[]
): { height: number; weight: number } => {
	if (args.length < 4) throw new Error("Not enough arguments");
	if (args.length > 4) throw new Error("Too many arguments");

	if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
		return {
			height: Number(args[2]),
			weight: Number(args[3]),
		};
	} else {
		throw new Error("Provided values were not numbers!");
	}
};

export const parseExerciseArgs = (args: string[]): number[] => {
	if (args.length < 4) throw new Error("Not enough arguments");
	const outputArray = [];
	for (let i = 2; i <= args.length - 1; i++) {
		if (!isNaN(Number(args[i]))) {
			outputArray.push(Number(args[i]));
		} else {
			throw new Error("Provided values were not numbers!");
		}
	}
	return outputArray;
};
