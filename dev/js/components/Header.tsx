import React from 'react';

import { HeaderProps } from '../helpers/interfaces';
import logo from '../../img/logo.png';
import searchIcon from '../../img/search-icon.png';
import filterIcon from '../../img/filter-icon.png';
import sortIcon from '../../img/sort-icon.png';
import currencyIcon from '../../img/currency-icon.png';
import Filters from './Filters';
import Loading from './Loading';

class Header extends React.Component <HeaderProps> {

	constructor(props : HeaderProps){

		super(props);

		this.attachEvents();

	}

	attachEvents(){

		document.addEventListener('keypress', (e) => {

			const activeElement = document.activeElement as HTMLElement;

			if(e.keyCode === 13 && activeElement.getAttribute('id') === 'domain') {

				this.props.startSearch();

			}

		});

	}

	render(){

		const isDisabled = !Object.keys(this.props.progress).length;
		const filters : {[key: string]: { text ?: string }} = { '': { text: 'All' }};

		for(const key in this.props.results){
			if(this.props.results[key].separator){ filters[key] = { text: this.props.results[key].separator }; }
		}

		return (
			<header>
				<div className='wrapper'>
					<label className='logo' style={{ backgroundImage: `url(${logo})` }} htmlFor='domain'>Domain Bingo</label>
					<input type='text'
						id='domain'
						placeholder='domain name'
						value={this.props.public.domain}
						onChange={(e) => this.props.changeDomain(e.currentTarget.value)}
						className={this.props.public.domain && (this.props.isValid(this.props.public.domain) ? 'valid' : 'invalid') || ''} />
					<button id='start' onClick={this.props.startSearch} style={{ backgroundImage: `url(${searchIcon})` }}>SEARCH</button>
					<div className='add-controls'>

						{/* todo: abstract out 'Option.tsx' (select) */}
						<div className='add-control'>
							<select style={{ backgroundImage: `url(${filterIcon})` }} id='filter' disabled={isDisabled} value={this.props.public.filter} onChange={(e) => this.props.applyOption('filter', e.currentTarget.value)}>
								{Object.keys(filters).map((key) => {
									return <option value={key} key={key}>{filters[key].text}</option>;
								})}
							</select>
							<label htmlFor='filter' className={isDisabled ? 'disabled' : ''}>{this.props.public.filter || 'all'}</label>
						</div>

						{/* todo: abstract out 'Option.tsx' (select) */}
						<div className='add-control'>
							<select style={{ backgroundImage: `url(${sortIcon})` }} id='sort' disabled={isDisabled} value={this.props.public.sort} onChange={(e) => this.props.applyOption('sort', e.currentTarget.value)}>
								<option value=''>A-Z</option>
								<option value='length'>Length</option>
								<option value='price'>Price</option>
							</select>
							<label htmlFor='sort' className={isDisabled ? 'disabled' : ''}>{this.props.public.sort || 'a-z'}</label>
						</div>

						{/* todo: abstract out 'Option.tsx' (select) */}
						<div className='add-control'>
							<select style={{ backgroundImage: `url(${currencyIcon})` }} id='currency' disabled={isDisabled} value={this.props.public.currency} onChange={(e) => this.props.applyOption('currency', e.currentTarget.value)}>
								{Object.keys(this.props.currencies).map((key, i) => {
									return <option value={i && key || ''} key={key}>{this.props.currencies[key].text}</option>;
								})}
							</select>
							<label htmlFor='currency' className={isDisabled ? 'disabled' : ''}>{this.props.public.currency || 'usd'}</label>
						</div>

					</div>
				</div>
				{!isDisabled && <Filters filters={filters} applyOption={this.props.applyOption} active={this.props.public.filter} /> }
				{/* todo: move 'localizeProgress' logic to Loading.tsx render */}
				{!isDisabled && <Loading {...this.props.progress} /> }
			</header>
		);
	}

}

export default Header;