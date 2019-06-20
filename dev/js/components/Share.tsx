import React from 'react';
import ReactGA from 'react-ga';
import {
	FacebookShareButton,
	TwitterShareButton,
	GooglePlusShareButton,
	LinkedinShareButton,
	TelegramShareButton,
	WhatsappShareButton,
	FacebookIcon,
	TwitterIcon,
	GooglePlusIcon,
	LinkedinIcon,
	TelegramIcon,
	WhatsappIcon
} from 'react-share';

class Share extends React.Component {

	trackShare(clickTarget: HTMLElement){

		let networkName = (clickTarget.parentNode as HTMLElement).className;

		networkName = networkName.slice(networkName.indexOf('--') + 2, networkName.length);

		ReactGA.event({
			category: 'share',
			action  : networkName
		});

	}

	render(){

		const instances = [
			{
				btn : FacebookShareButton,
				icon: FacebookIcon
			},
			{
				btn : TwitterShareButton,
				icon: TwitterIcon
			},
			{
				btn : GooglePlusShareButton,
				icon: GooglePlusIcon
			},
			{
				btn : LinkedinShareButton,
				icon: LinkedinIcon
			},
			{
				btn : TelegramShareButton,
				icon: TelegramIcon
			},
			{
				btn : WhatsappShareButton,
				icon: WhatsappIcon
			}
		];
		const url = 'https://domain.bingo';
		const title = 'Domain Bingo - domain names search engine.';

		return (
			<div className='share-icons'>
				{instances.map((obj, i) => {

					const params = obj.btn === FacebookShareButton ? { url } : {
						url, title
					};

					return <obj.btn key={i} {...params}>
						<span onClick={(e) => this.trackShare(e.currentTarget)}>
							<obj.icon size={32} round />
						</span>
					</obj.btn>;

				})}
			</div>
		);

	}

}

export default Share;