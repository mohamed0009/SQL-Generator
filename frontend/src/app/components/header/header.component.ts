import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  keyframes,
  state,
  query,
  stagger,
} from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        query('.animated-char', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(50, [
            animate(
              '0.5s cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'translateY(0)' })
            ),
          ]),
        ]),
      ]),
    ]),
    trigger('titleAnimation', [
      transition(':enter', [
        style({ perspective: '1000px' }),
        query('.keyword, .object, .text', [
          style({
            opacity: 0,
            transform: 'rotateX(-90deg)',
            transformOrigin: 'bottom',
          }),
          stagger(100, [
            animate(
              '0.8s cubic-bezier(0.35, 0, 0.25, 1)',
              keyframes([
                style({
                  opacity: 0,
                  transform: 'rotateX(-90deg)',
                  offset: 0,
                }),
                style({
                  opacity: 0.5,
                  transform: 'rotateX(20deg)',
                  offset: 0.6,
                }),
                style({
                  opacity: 1,
                  transform: 'rotateX(0)',
                  offset: 1.0,
                }),
              ])
            ),
          ]),
        ]),
      ]),
    ]),
    trigger('commentAnimation', [
      transition(':enter', [
        style({ width: 0, opacity: 0 }),
        animate(
          '0.8s 0.5s cubic-bezier(0.35, 0, 0.25, 1)',
          style({ width: '*', opacity: 1 })
        ),
      ]),
    ]),
    trigger('cursorBlink', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible <=> hidden', animate('0.5s')),
    ]),
  ],
  template: `
    <header class="app-header">
      <div class="header-content">
        <h1 @titleAnimation>
          <span class="keyword">CREATE</span>
          <span class="object">SQL</span>
          <span class="text">Generator</span><span class="dot cursor ">;</span>
        </h1>
        <p>
          <span class="comment" @commentAnimation
            >-- Generate SQL tables with a powerful and intuitive
            interface</span
          >
          <span class="cursor" [@cursorBlink]="cursorState">_</span>
        </p>
        <div class="header-decoration"></div>
      </div>
      <div class="header-pattern"></div>
    </header>
  `,
  styles: [
    `
      .app-header {
        background: #1e1e1e;
        padding: 4rem 2rem;
        text-align: center;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        font-family: 'Fira Code', monospace;

        @media (max-width: 768px) {
          padding: 3rem 1rem;
        }
      }

      .header-content {
        position: relative;
        z-index: 1;
        max-width: 800px;
        margin: 0 auto;

        h1 {
          font-size: 3.5rem;
          font-weight: 600;
          color: #d4d4d4;
          margin: 0 0 1rem;
          letter-spacing: -0.025em;
          line-height: 1.2;

          .keyword {
            color: #569cd6;
            font-weight: 700;
          }

          .object {
            color: #4ec9b0;
          }

          .text {
            color: #d4d4d4;
            display: inline-block;
            animation: dotPulse 2s infinite;
          }

          .dot {
            color: #d4d4d4;
            display: inline-block;
            animation: dotPulse 2s infinite;
          }

          .cursor {
            display: inline-block;
            color: #569cd6;
            font-weight: bold;
            margin-left: 2px;
          }

          @media (max-width: 768px) {
            font-size: 2.5rem;
          }
        }

        p {
          font-size: 1.25rem;
          margin: 0;
          line-height: 1.6;

          .comment {
            color: #6a9955;
            font-style: italic;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
          }

          .cursor {
            display: inline-block;
            color: #569cd6;
            font-weight: bold;
            margin-left: 2px;
          }

          @media (max-width: 768px) {
            font-size: 1.125rem;
          }
        }
      }

      .header-decoration {
        position: absolute;
        top: -50%;
        left: -25%;
        right: -25%;
        bottom: -50%;
        background: radial-gradient(
          circle at center,
          rgba(99, 102, 241, 0.05) 0%,
          transparent 70%
        );
        transform: rotate(-12deg);
      }

      .header-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.05;
        background-size: 50px 50px;
        background-image: linear-gradient(to right, #333 1px, transparent 1px),
          linear-gradient(to bottom, #333 1px, transparent 1px);
      }

      .keyword,
      .object,
      .text {
        display: inline-block;
        backface-visibility: hidden;
      }

      .cursor {
        display: inline-block;
        color: #569cd6;
        font-weight: bold;
        margin-left: 2px;
      }

      @keyframes dotPulse {
        0%,
        100% {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
        50% {
          transform: scale(1.2) translateY(-2px);
          opacity: 0.8;
        }
      }

      @keyframes glowPulse {
        0%,
        100% {
          text-shadow: 0 0 5px rgba(86, 156, 214, 0);
        }
        50% {
          text-shadow: 0 0 10px rgba(86, 156, 214, 0.3);
        }
      }

      .keyword {
        animation: glowPulse 3s infinite;
      }

      .dot {
        animation: dotPulse 2s infinite;
      }
    `,
  ],
})
export class HeaderComponent {
  cursorState: 'visible' | 'hidden' = 'visible';

  constructor() {
    // Start cursor blinking
    setInterval(() => {
      this.cursorState = this.cursorState === 'visible' ? 'hidden' : 'visible';
    }, 500);
  }
}
