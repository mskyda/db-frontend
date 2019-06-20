interface AppState {
	currencies: {
		[key: string]: {
			text : string,
			rate: number,
			sign: string
		}
	},
	results: {
		[key: string]: {}
	},
	history: {
		city: string,
		country: string,
		domain : string
	}[],
	groupThresholds: {
		length: number[],
		price: string[],
		default: string[]
	},
	progress: {
		processed?: number,
		available?: number,
		avgPrice?: string,
		status?: number,
		total?: number,
		pending?: XMLHttpRequest[]
	},
	public: {
		domain: string,
		sort: string,
		filter: string,
		currency: string
	}
}

interface ItemInterface {
	enabled?: string,
	separator?: string
	price: {
		[key: string]: string
	},
	currencySign: string,
	name: string
}

interface HeaderProps {
	startSearch: () => void,
	changeDomain: (domain: string) => void,
	applyOption: (name: keyof AppState['public'], value: string) => void,
	isValid: (domain: string) => boolean,
	public: AppState['public'],
	progress: AppState['progress'],
	results: { [key: string]: ItemInterface },
	currencies: {
		[key: string]: {
			text : string
		}
	}
}

export {
	AppState as AppState,
	ItemInterface as ItemInterface,
	HeaderProps as HeaderProps
};