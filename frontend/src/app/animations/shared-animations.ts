import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  keyframes,
} from '@angular/animations';

export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', [
    style({ transform: 'translateY(20px)', opacity: 0 }),
    animate(
      '0.6s cubic-bezier(0.35, 0, 0.25, 1)',
      style({ transform: 'translateY(0)', opacity: 1 })
    ),
  ]),
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.4s ease-in', style({ opacity: 1 })),
  ]),
]);

export const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        stagger(60, [
          animate(
            '0.6s cubic-bezier(0.35, 0, 0.25, 1)',
            style({ opacity: 1, transform: 'translateY(0)' })
          ),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);

export const cardAnimation = trigger('cardAnimation', [
  transition(':enter', [
    style({ transform: 'scale(0.95)', opacity: 0 }),
    animate(
      '0.4s cubic-bezier(0.35, 0, 0.25, 1)',
      style({ transform: 'scale(1)', opacity: 1 })
    ),
  ]),
]);

export const slideInOut = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)', opacity: 0 }),
    animate(
      '0.5s cubic-bezier(0.35, 0, 0.25, 1)',
      style({ transform: 'translateX(0)', opacity: 1 })
    ),
  ]),
  transition(':leave', [
    animate(
      '0.5s cubic-bezier(0.35, 0, 0.25, 1)',
      style({ transform: 'translateX(100%)', opacity: 0 })
    ),
  ]),
]);

export const rotateAnimation = trigger('rotateAnimation', [
  transition(':enter', [
    style({ transform: 'rotate(-180deg)', opacity: 0 }),
    animate(
      '0.4s cubic-bezier(0.35, 0, 0.25, 1)',
      style({ transform: 'rotate(0)', opacity: 1 })
    ),
  ]),
  transition(':leave', [
    animate(
      '0.4s cubic-bezier(0.35, 0, 0.25, 1)',
      style({ transform: 'rotate(180deg)', opacity: 0 })
    ),
  ]),
]);

export const bounceAnimation = trigger('bounceAnimation', [
  transition(':enter', [
    style({ transform: 'scale(0)', opacity: 0 }),
    animate(
      '0.5s cubic-bezier(0.35, 0, 0.25, 1)',
      keyframes([
        style({ transform: 'scale(0)', opacity: 0, offset: 0 }),
        style({ transform: 'scale(1.2)', opacity: 0.5, offset: 0.5 }),
        style({ transform: 'scale(1)', opacity: 1, offset: 1 }),
      ])
    ),
  ]),
]);
