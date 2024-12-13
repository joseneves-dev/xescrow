export const createCountdownWorker = (
  date: Date,
  onTick: (value: number) => void,
  onComplete: () => void
): Worker => {
  // Worker script as a string
  const workerScript = `
    self.onmessage = (event) => {
      const targetDate = Math.floor(new Date(event.data).getTime() / 1000);
      const currentDate = Math.floor(Date.now() / 1000);
      
      // If the target date is in the past or immediate present, post complete message
      if (targetDate <= currentDate) {
        self.postMessage(false);
        self.close();
        return;
      }
      
      let countdown = targetDate - currentDate;
      
      const countdownInterval = setInterval(() => {
        countdown -= 1;
        
        if (countdown <= 0) {
          self.postMessage(false); // Send false when countdown reaches zero
          clearInterval(countdownInterval); // Clear interval
          self.close(); // Close the worker
        } else {
          self.postMessage(countdown); // Send current countdown value
        }
      }, 1000);
    };
  `;

  // Create a Blob from the worker script and instantiate the Worker
  const blob = new Blob([workerScript], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));

  // Send the date to the worker
  worker.postMessage(date);

  // Worker message handler
  worker.onmessage = (event: MessageEvent) => {
    if (event.data === false) {
      onComplete(); // Call onComplete when countdown finishes
      worker.terminate(); // Terminate the worker
    } else {
      onTick(event.data as number); // Call onTick with the countdown value
    }
  };

  return worker; // Return the worker instance
};
