const logError = (error: string, stack : string) => {

	if(encodeURIComponent && window.location.hostname !== 'localhost') {

		const params = `location=${encodeURIComponent(window.location.href)}
		&msg=${encodeURIComponent(error)}
		&stack=${encodeURIComponent(stack)}
		&userAgent=${encodeURIComponent(navigator.userAgent)}`;

		const image = new Image;

		const body = document.querySelector('body') as HTMLBodyElement;

		body.appendChild(image);

		image.onerror = image.onload = () => { body.removeChild(image); };

		image.src = `https://logs-01.loggly.com/inputs/610c0785-9403-4632-b2f1-21d6e67feeef/tag/client/pixel.gif?${params}`;
	}

	return false;

};

export default logError;