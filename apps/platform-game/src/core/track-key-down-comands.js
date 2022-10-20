export function trackKeyDownComands(commands) {
	let commandsToProcess = [];
	
	window.addEventListener('keydown', (event) => {
		const command = commands[event.key];
		
		if(!command) { return; }
		
		if(commandsToProcess.includes(command)) {return;}
		
		if(command.cleanup && commandsToProcess.includes(command.cleanup.action)) {return;}
		
		commandsToProcess.push(command);
	});
	return commandsToProcess;
}
