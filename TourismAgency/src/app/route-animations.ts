import { trigger, transition, style, query, group, animateChild, animate, keyframes } from '@angular/animations'

export const slider = trigger('routeAnimations', [
	transition('* => isLeft', slideTo('left')),
	transition('* => isRight', slideTo('right')),
	transition('isRight => *', slideTo('left')),
	transition('isLeft => *', slideTo('right')),
	transition('isPage1 => isPage2', slideTo('right')),
	transition('isPage1 => isPage3', slideTo('right')),
	transition('isPage1 => isPage4', slideTo('right')),
	transition('isPage2 => isPage1', slideTo('left')),
	transition('isPage2 => isPage3', slideTo('right')),
	transition('isPage2 => isPage4', slideTo('right')),
	transition('isPage3 => isPage1', slideTo('left')),
	transition('isPage3 => isPage2', slideTo('left')),
	transition('isPage3 => isPage4', slideTo('right')),
	transition('isPage4 => isPage1', slideTo('left')),
	transition('isPage4 => isPage2', slideTo('left')),
	transition('isPage4 => isPage3', slideTo('left')),
]);

function slideTo(direction: string) {
	const optional = { optional: true };
	return [
		query(':enter, :leave', [
			style({
				position: 'absolute',
				top: 0,
				[direction]: 0,
				width: '100%'
			})
		], optional),
		query(':enter', [
			style({ [direction]: '-100%' })
		]),
		group([
			query(':leave', [
				animate('600ms ease', style({ [direction]: '100%' }))
			], optional),
			query(':enter', [
				animate('600ms ease', style({ [direction]: '0%' }))
			])
		])
	];
}
