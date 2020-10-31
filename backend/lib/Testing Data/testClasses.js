const geometry = {
    name: 'Geometry',
	location: 'Zurn 101',
	instructor: 'Dr. Lee',
	time: {
		start: new Date(),
		end: new Date(),
	},
	date: {
		start: new Date,
		end: new Date,
	},
	daysOfWeek: [false, false, true, true, false, false,false],
}

const algebra = {
    name: 'Algebra',
	location: 'Zurn 202',
	instructor: 'Dr. Twic',
	time: {
		start: new Date(),
		end: new Date(),
	},
	date: {
		start: new Date,
		end: new Date,
	},
	daysOfWeek: [false, true, false, true, false, false,false],
}

module.exports = [geometry, algebra];