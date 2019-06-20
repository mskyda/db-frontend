import React from 'react';
import ReactGA from 'react-ga';

import { ItemInterface } from '../helpers/interfaces';
import providerIcon from '../../img/provider-icon.png';

/* todo: investigate PureComponent - reduce amount of renders */

interface ItemProps {
	data: ItemInterface,
	tld: string
}

class Item extends React.PureComponent <ItemProps> {

	getLink(key : string, domain: string){

		let link;

		switch(key){
			case 'NC':
				link = `https://www.namecheap.com/domains/registration/results.aspx?domain=${domain}&affId=113670`;
				break;
			case 'GD':
				link = `https://godaddy.com/domains/searchresults.aspx?domainToCheck=${domain}`;
				break;
			case 'NS':
				link = 'https://www.namesilo.com/register.php?rid=fc33550yb';
				break;
			case 'PB':
				link = `https://porkbun.com/checkout/search?q=${domain}&ref=mskyda`;
				break;
			case 'DD':
				link = 'https://www.dynadot.com/domain/search.html';
				break;
			default:
				link = '#';
				break;
		}

		return link;

	}

	trackLink(href : string){

		ReactGA.event({
			category: 'navigate',
			action  : href
		});

	}

	render() {

		const data = this.props.data;
		const tld = this.props.tld;

		if(!Object.keys(data).length ){

			return <li data-tld={tld}>{tld}</li>;

		}

		if(data.separator){

			return data.enabled ? <li className='separator'>{data.separator}:</li> : '';

		}

		if(!Object.keys(data.price).length){

			return <li data-tld={tld} className='occupied'>{tld}<span className='status'>taken</span></li>;

		}

		let href = this.getLink(Object.keys(data.price)[0], data.name);

		return (
			<li data-tld={tld} className='available'>

				<a style={{ backgroundImage: `url(${providerIcon})` }} href={href} className={Object.keys(data.price)[0]} target='_blank' rel='noopener noreferrer' onClick={() => this.trackLink(href)}>

					{tld}

					<span>{data.price[Object.keys(data.price)[0]]} {data.currencySign}</span>

				</a>

				{ Object.keys(data.price).length > 1 && <ul className='drop-down'>

					{ Object.keys(data.price).map((key) => {

						href = this.getLink(key, data.name);

						return (<li key={key}>

							<a style={{ backgroundImage: `url(${providerIcon})` }} href={href} className={key} target='_blank' rel='noopener noreferrer' onClick={() => this.trackLink(href)}>

								{data.price[key]} {data.currencySign}

							</a>

						</li>);

					})}

				</ul> }

			</li>
		);
	}

}

export default Item;