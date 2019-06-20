import React from 'react';

import Share from './Share';

function Footer(){
	return (
		<footer>
			<Share />
			<p>Disclaimer: data about availability and price of domains may contain mistakes caused by third-party providers.</p>
			<p>Copyright &copy; {(new Date).getFullYear()} <a href='mailto:admin@domain.bingo'>Domain Bingo</a>. All Rights Reserved.</p>
		</footer>
	);
}

export default Footer;