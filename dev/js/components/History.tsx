import React from 'react';

import sortIcon from '../../img/sort-icon.png';

interface HistoryProps {
	history: {
		city: string,
		country: string,
		domain : string
	}[]
}
interface HistoryState {
	msgIndex: number,
	animal: string,
	cookies: boolean
}

class History extends React.Component <HistoryProps, HistoryState> {

	constructor(props : HistoryProps){

		super(props);

		this.state = {
			msgIndex: this.generateMessageIndex(),
			animal  : this.generateAnimalName(),
			cookies : !!~document.cookie.indexOf('cookiesAllowed')
		};

	}

	componentDidMount(){

		if(this.state.cookies){ this.runHistorySlider(); }

	}

	runHistorySlider(){

		const element = document.querySelector('.history-bar') as HTMLElement;

		this.attachEvents(element);

		if(this.props.history.length > 1){

			setInterval(() => this.updateMessage(element), 5000);

		}

	}

	attachEvents(element : HTMLElement){

		const barToggler = element.querySelector('.bar-toggler') as HTMLElement;

		barToggler.addEventListener('click', () => { element.classList.toggle('hidden'); });
		element.addEventListener('mouseenter', () => { element.classList.add('frozen'); });
		element.addEventListener('mouseleave', () => { element.classList.remove('frozen'); });

	}

	updateMessage(element: HTMLElement){

		if(element.classList.contains('frozen') || element.classList.contains('hidden')){ return; }

		element.classList.add('animating');

		setTimeout(() => this.setState((prevState) => {

			element.classList.remove('animating');

			return {
				msgIndex: this.generateMessageIndex(prevState.msgIndex),
				animal  : this.generateAnimalName()
			};

		}), 1000);

	}

	generateMessageIndex(currentIndex?: number) : number{

		const newIndex = Math.round(Math.random() * (this.props.history.length - 1));

		if(newIndex !== currentIndex) { return newIndex; }

		return this.generateMessageIndex(currentIndex);

	}

	generateAnimalName(){

		const animals = [ 'Fox', 'Wolf', 'Rabbit', 'Koala', 'Tiger', 'Lion', 'Hedgehog', 'Elephant', 'Bear', 'Panda', 'Zebra', 'Squirrel', 'Eagle', 'Kangaroo', 'Bison' ];

		return animals[Math.round(Math.random() * (animals.length - 1))];

	}

	agreeOnCookies(){

		const date = new Date();

		date.setTime(date.getTime() + 365*24*60*60*1000);

		document.cookie = `cookiesAllowed=true;expires=${date.toUTCString()};path=/`;

		this.setState({ cookies: true });

		setTimeout(() => this.runHistorySlider());

	}

	render(){

		const msg = this.props.history[this.state.msgIndex];

		if(!this.state.cookies){
			return (
				<div className='history-bar'>
					This website uses <a href='https://en.wikipedia.org/wiki/HTTP_cookie'>Cookies</a> in order to optimise on-page experience <span className='submit-btn' onClick={() => this.agreeOnCookies()}>OK</span>
				</div>
			);
		}

		return (
			<div className='history-bar'>
				<span style={{ backgroundImage: `url(${sortIcon})` }} className='bar-toggler'></span>
				<div className='slider'>
					Anonymous {this.state.animal} from {msg.city} ({msg.country}) recently searched for <a href={`#domain=${msg.domain}`} onClick={() => window.location.reload() }>{msg.domain}</a> domain name.
				</div>
			</div>
		);
	}

}

export default History;