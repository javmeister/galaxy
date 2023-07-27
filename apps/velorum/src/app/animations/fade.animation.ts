import {
  trigger,
  animate,
  transition,
  style,
  query,
  animateChild,
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(':enter', [style({ opacity: 0 }), animateChild()], {
      optional: true,
    }),

    query(
      ':enter',
      [style({ opacity: 0 }), animate('0.25s', style({ opacity: 1 })), animateChild()],
      { optional: true }
    ),
  ]),
]);
