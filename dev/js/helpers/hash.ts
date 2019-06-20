const stringToObj = (string : string) => {

	if(!string) { return {}; }

	const pairs = string.split('&');

	let parsedStr = '{', pairArr;

	pairs.forEach((pair, i) => {

		pairArr = pair.split('=');

		parsedStr += `"${decodeURIComponent(pairArr[0]) || ''}":"${decodeURIComponent(pairArr[1]) || ''}"${i < pairs.length - 1 ? ',' : '}'}`;

	});

	return JSON.parse(parsedStr);

};

const objToString = (obj: { [key: string]: string }) => {

	obj = Object.assign(stringToObj(window.location.hash.substring(1).toLowerCase()), obj);

	const fragments : string[] = [];

	for(const key in obj){

		if(obj[key]) { fragments.push(`&${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`); }

	}

	return fragments.join('').substring(1);

};

const hashHelper = (data ?: {}) => {

	if(typeof data !== 'undefined'){ // set to hash

		window.location.hash = objToString(data);

	} else { // get from hash

		return stringToObj(window.location.hash.substring(1).toLowerCase());

	}

};

export default hashHelper;
