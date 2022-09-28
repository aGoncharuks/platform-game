export function trackEventsKeys(keys) {
	let eventsToProcess = [];
	
	window.addEventListener('keyup', (event) => {
		if (!keys.includes(event.key) || eventsToProcess.includes(event.key)) { return; }
		eventsToProcess.push(event.key);
	});
	return eventsToProcess;
}
