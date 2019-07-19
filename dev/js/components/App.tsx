import React from 'react';
import ReactGA from 'react-ga';

import {
	AppState,
	ItemInterface
} from '../helpers/interfaces';
import hashHelper from '../helpers/hash';
import '../../css/style.scss';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import History from './History';

ReactGA.initialize('UA-82114538-1');
ReactGA.set({ anonymizeIp: true });
ReactGA.pageview('/');

declare global {
	interface Window {
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
		searchHistory: {
			city: string,
			country: string,
			domain : string
		}[]
	}
	interface ProgressTarget extends EventTarget { response: string }
	interface ProgressEvent extends Event { currentTarget: ProgressTarget }
}

class App extends React.Component <{}, AppState> {

	constructor(props : {}){

		super(props);

		this.startSearch = this.startSearch.bind(this);
		this.applyOption = this.applyOption.bind(this);
		this.changeDomain = this.changeDomain.bind(this);

		this.state = {
			currencies     : {},
			results        : {},
			history        : [],
			groupThresholds: {
				length : [ 1, 3, 4, 5, 6, 7, 8, 9, 10, 14 ],
				price  : [ '10', '100', '100', '1k', '1k', '10k', '10k', '100k', '100k', '1M' ],
				default: [ 'a', 'b', 'c', 'e', 'f', 'h', 'i', 'l', 'm', 'o', 'p', 's', 't', 'z' ]
			},
			progress: {},
			public  : this.getPublicState()
		};

	}

	getPublicState(){

		const hashData : { [key: string]: string } = hashHelper();
		const publicState = {
			domain  : '',
			sort    : '',
			filter  : '',
			currency: ''
		};

		let key : keyof AppState['public'];

		for(key in publicState){

			if(key in hashData){ publicState[key] = hashData[key]; }

		}

		return publicState;

	}

	async componentDidMount(){

		const initData = await (await fetch('http://35.238.11.245/init')).json();

		this.setState(initData);

		this.startSearch();

	}

	componentDidUpdate(){

		this.updateHash();

	}

	updateHash(){

		const hashData = hashHelper();

		let key : keyof AppState['public'];

		for(key in this.state.public){

			if(hashData[key] !== this.state.public[key]){

				hashHelper(Object.assign(hashData, { [key]: this.state.public[key] }));

			}

		}

	}

	startSearch(){

		if(!this.state.public.domain || !this.isValid(this.state.public.domain)){

			(document.querySelector('#domain') as HTMLElement).focus();

			return;

		}

		this.updatePendingRequests();

		this.setState((prevState) => {

			return {
				progress: {
					status : 0,
					pending: [],
					total  : Object.keys(prevState.results).length
				}
			};

		});

		ReactGA.event({
			category: 'search',
			action  : this.state.public.domain
		});

		this.checkRequest(50);
	}

	isValid(domain : string){

		domain = domain.split('.')[domain.split('.').length - 1];

		return !!/^[a-z0-9-]+$/.test(domain);

	}

	changeDomain(domain : string){

		domain = domain.toLowerCase();

		this.setState((prevState) => ({ public: Object.assign({}, prevState.public, { domain: domain }) }));

	}

	applyOption(name : keyof AppState['public'], value : string){

		ReactGA.event({
			category: name,
			action  : value || 'reset'
		});

		this.setState((prevState) => ({ public: Object.assign({}, prevState.public, { filter: '' }, { [name]: value }) }));

	}

	sortResults(){

		const sortedObject : { [key: string]: ItemInterface } = {};
		const results = this.state.results as { [key: string]: ItemInterface };
		const sortedArray = Object.keys(results).sort((a : string | number, b : string | number) => {

			const nameA = a;
			const nameB = b;
			const priceA = results[a].price;
			const priceB = results[b].price;

			switch(this.state.public.sort){

				case 'length':

					a = a.toString().length;
					b = b.toString().length;

					break;

				case 'price':

					a = +(priceA && priceA[Object.keys(priceA)[0]] || Infinity);
					b = +(priceB && priceB[Object.keys(priceB)[0]] || Infinity);

					break;

			}

			if(a > b) { return 1; }
			if(a < b) { return -1; }

			return nameA.toString().localeCompare(nameB.toString());

		});

		sortedArray.forEach((key) => { sortedObject[key] = results[key]; });

		return sortedObject;

	}

	checkRequest(step : number, iteration ?: number){

		iteration = iteration || 0;

		const tlds = Object.keys(this.state.results);

		let iterationEnd = iteration + step;

		if(iterationEnd > tlds.length){ iterationEnd = tlds.length; }

		const request = this.sendRequest(iteration, iterationEnd, tlds);

		this.updatePendingRequests(request);

		if(iterationEnd < tlds.length) { this.checkRequest(step, iterationEnd); }

	}

	updatePendingRequests(request?: XMLHttpRequest){

		this.setState((prevState) => {

			const progress = Object.assign({}, prevState.progress);

			if(progress.pending){

				if(request) {

					progress.pending.push(request);

				} else {

					progress.pending.forEach((request) => {

						if(request.readyState !== 4) { request.abort(); }

					});

				}

			}

			return { progress };

		});

	}

	sendRequest(iteration: number, iterationEnd: number, tlds: string[]){

		const request = new XMLHttpRequest();
		const domain = this.state.public.domain;

		const data = {
			name   : domain,
			tlds   : tlds.slice(iteration, iterationEnd),
			initial: iteration === 0
		};

		request.open('POST', 'http://35.238.11.245/api/check');

		request.setRequestHeader('Content-Type', 'application/json');

		request.addEventListener('progress', (e) => this.onRequestProgress(e.currentTarget.response, domain), false);

		request.send(JSON.stringify(data));

		return request;

	}

	onRequestProgress(resp : string, domain: string){

		if(!resp) { return; }

		this.parseResponse(this.cleanResponse(resp), domain);

		this.setState((prevState) => {

			let priceCases = 0;
			let itemPrice = 0;
			let sumPrice = 0;

			const processed : string[] = [];
			const available : string[] = [];

			for(const key in prevState.results){

				const item = prevState.results[key] as ItemInterface;

				if(item.name){ processed.push(key); }

				if(item.price && Object.keys(item.price).length){

					available.push(key);

					itemPrice = +item.price[Object.keys(item.price)[0]];

					if(sumPrice === 0 || itemPrice < sumPrice / priceCases * 10){

						sumPrice += itemPrice;

						priceCases++;

					}

				}

			}

			const progress = Object.assign({}, prevState.progress, {
				processed: processed.length,
				available: available.length,
				avgPrice : sumPrice && priceCases ? sumPrice / priceCases : 0,
				status   : (prevState.progress.status as number) + (1 / (prevState.progress.pending as []).length / 3 * 100)
			});

			return { progress };

		});

	}

	parseResponse(resp : ItemInterface[], domain : string){

		this.setState((prevState) => {

			const results = Object.assign({}, prevState.results) as { [key: string]: ItemInterface };

			resp.forEach((obj) => {

				const tld = obj.name.slice(domain.length + 1, obj.name.length);
				const price = Object.assign({}, results[tld].price || {}, obj.price);
				const sortedPrices = Object.keys(price).sort((a, b) => {

					if(+price[a] > +price[b]){ return 1; }

					if(+price[a] < +price[b]){ return -1; }

					return 0;

				});

				obj.price = {};

				sortedPrices.forEach((key) => { if(price[key]) { obj.price[key] = price[key]; } });

				results[tld] = obj;

			});

			return { results };

		});

	}

	cleanResponse(resp : string){

		resp = resp.replace(new RegExp('\\[]', 'g'), '');

		resp = resp.replace(new RegExp(']\\[', 'g'), ',');

		return JSON.parse(resp);

	}

	localizeProgress(){

		const progress = { ...this.state.progress };

		if(progress.avgPrice){

			const currency = this.getCurrency();

			progress.avgPrice = `${(+progress.avgPrice * currency.rate).toFixed(2)} ${currency.sign}`;

		}

		return progress;

	}

	localizeResults(results: { [key: string]: ItemInterface }){

		const currency = this.getCurrency();

		results = JSON.parse(JSON.stringify(results));

		let price;

		for(const key in results){

			if(results[key].price) {

				for (const priceKey in results[key].price) {

					results[key].currencySign = currency.sign;

					price = results[key].price[priceKey];

					if (price && typeof price === 'number') {

						results[key].price[priceKey] = (price * currency.rate).toFixed(2);

					}

				}

			}

		}

		return results;

	}

	groupResults(results : { [key: string]: ItemInterface }){

		const resultsArray : string[] = [];

		let groupRule;

		Object.keys(results).forEach((item) => {

			const unit = this.getGroupUnit(item, results);

			if(unit){

				groupRule = this.getGroupRule(unit);

				if(groupRule){ resultsArray.push(groupRule); }

				if(this.state.public.filter){

					if(this.state.public.filter === groupRule){ resultsArray.push(item); }

				} else { resultsArray.push(item); }

			}

		});

		const groupedResults : { [key: string]: ItemInterface } = {};
		const suffix = this.getSeparatorSuffix();

		resultsArray.forEach((key) => {
			groupedResults[key] = results[key] || {
				separator: `${key}${suffix}`,
				enabled  : !this.state.public.filter || this.state.public.filter === key
			};
		});

		return groupedResults;

	}

	getGroupUnit(item : string, results: { [key: string]: ItemInterface }){

		if(this.state.public.sort === 'length'){ return item.length; }

		if(this.state.public.sort === 'price') {

			return results[item].price && Object.keys(results[item].price).length && +results[item].price[Object.keys(results[item].price)[0]];

		}

		return item.slice(0, 1);

	}

	getGroupRule(unit : number | string) {

		const tNames = this.state.groupThresholds[(this.state.public.sort || 'default') as keyof AppState['groupThresholds']];

		let tValues = tNames;

		if(this.state.public.sort === 'price') {

			tValues = (tValues as string[]).map((value : string) => value.replace('k', '000').replace('M', '000000'));

		}

		if(unit > tValues[tValues.length - 1]){ return `> ${tNames[tNames.length - 1]}`; } // more then maximum

		if(unit < tValues[0]){ return `< ${tNames[0]}`; } // less than minimum

		for(let index = 0; index < tValues.length - 1; index++){ // in range

			if(index % 2 === 0 && unit >= tValues[index] && unit <= tValues[index + 1]){ return `${tNames[index]}-${tNames[index + 1]}`; }

		}

	}

	getSeparatorSuffix(){

		if(this.state.public.sort === 'length'){ return ' chars'; }

		if (this.state.public.sort === 'price'){ return ` ${this.getCurrency().sign}`; }

		return '';

	}

	getCurrency(){

		return this.state.currencies[this.state.public.currency || Object.keys(this.state.currencies)[0]];

	}

	render(){

		const progress = this.localizeProgress();
		const results = this.groupResults(this.localizeResults(this.sortResults()));

		return (
			<React.StrictMode>
				<Header
					startSearch={this.startSearch}
					applyOption={this.applyOption}
					changeDomain={this.changeDomain}
					isValid={this.isValid}
					progress={progress}
					public={this.state.public}
					results={results}
					currencies={this.state.currencies} />
				<div id='layout-holder'>
					<Content
						results={results}
						progress={progress} />
					<Footer />
				</div>
				{this.state.history && !!this.state.history.length &&
					<History history={this.state.history}/>
				}
			</React.StrictMode>
		);

	}

}

export default App;
