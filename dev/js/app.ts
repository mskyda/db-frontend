import React from 'react';
import { render } from 'react-dom';

import logError from './helpers/error-logger';
import App from './components/App';

class ErrorBoundary extends React.Component {

	componentDidCatch(error: Error | string, info: { componentStack: string }) { logError(error.toString(), info && info.componentStack); }

	render() { return React.createElement(App); }
}

export default render(React.createElement(ErrorBoundary), document.getElementById('app'));