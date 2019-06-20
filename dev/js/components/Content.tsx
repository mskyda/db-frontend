import React from 'react';

import {
	AppState,
	ItemInterface
} from '../helpers/interfaces';
import Item from './Item';

interface ContentProps {
	results: {
		[key : string] : ItemInterface
	},
	progress: AppState['progress']
}

class Content extends React.Component <ContentProps> {

	animateTLDs(list : NodeListOf<Element>, index: number){

		if(index === 0){

			list.forEach((element) => { element.classList.add('invisible'); });
		}

		const item = list[index];

		if(item){

			setTimeout(() => {

				item.classList.remove('invisible');

				index++;

				this.animateTLDs(list, index);

			});

		}

	}

	render() {

		const results = this.props.results;
		const isIntro = !Object.keys(this.props.progress).length;

		return (
			<section id='main'>
				<ul className='tlds-list'>
					{Object.keys(results).map((key) => <Item key={key} tld={key} data={results[key]} />)}
				</ul>
				{isIntro &&
					<div className='intro'>
						<div className='content'>
							<div className='title'>Welcome to <h1>Domain Bingo</h1></div>
							<p>Free search engine across 500+ top-level domain names and aggregator of domain-registrars.</p>
							<p>To start the search - input desired domain-name and press &quot;Search&quot;.</p>
						</div>
					</div>
				}
			</section>
		);
	}

	componentDidMount() {

		const items = document.querySelectorAll('.tlds-list li');

		this.animateTLDs(items, 0);

	}

}

export default Content;