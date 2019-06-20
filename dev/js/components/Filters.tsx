import React from 'react';

import { AppState } from '../helpers/interfaces';

interface FiltersProps {
	applyOption: (name: keyof AppState['public'], value: string) => void,
	filters: {[key: string]: { text ?: string }},
	active: string
}

function Filters(props : FiltersProps){

	const filters = Object.keys(props.filters);

	return (
		<ul className='wrapper filters'>
			{ filters.length > 1 && filters.map((key) => {
				return <li key={key}>
					<span className={props.active === key ? 'active' : ''} onClick={() => props.applyOption('filter', key)}>{props.filters[key].text}</span>
				</li>;
			})}
		</ul>
	);
}

export default Filters;