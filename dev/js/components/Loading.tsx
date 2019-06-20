import React from 'react';

import { AppState } from '../helpers/interfaces';

interface LoadingProps extends EventTarget { response: string }

function Loading(props : AppState['progress']){

	return (
		<div className='loading'>
			<div className='loading-status' style={{ width: `${props.status}%` }}>
				{props.processed &&
					<span>{props.processed}/{props.total} checked, {props.available} free{props.avgPrice ? `, av. price: ${props.avgPrice}` : ''}</span>
				}
			</div>
		</div>
	);
}

export default Loading;