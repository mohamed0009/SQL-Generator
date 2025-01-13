import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  keyframes,
  query,
  stagger,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('footerAnimation', [
      transition(':enter', [
        query('.footer-content > *', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(200, [
            animate(
              '0.6s cubic-bezier(0.35, 0, 0.25, 1)',
              keyframes([
                style({ opacity: 0, transform: 'translateY(20px)', offset: 0 }),
                style({
                  opacity: 0.5,
                  transform: 'translateY(-5px)',
                  offset: 0.5,
                }),
                style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
              ])
            ),
          ]),
        ]),
      ]),
    ]),
    trigger('generatorAnimation', [
      transition(':enter', [
        query('.char', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger(0.1, [
            animate(
              '0.5s cubic-bezier(0.35, 0, 0.25, 1)',
              keyframes([
                style({
                  opacity: 0,
                  transform: 'translateY(-20px)',
                  offset: 0,
                }),
                style({
                  opacity: 0.5,
                  transform: 'translateY(10px)',
                  offset: 0.5,
                }),
                style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
              ])
            ),
          ]),
        ]),
      ]),
    ]),
    trigger('cursorBlink', [
      transition(':enter', [
        animate(
          '1s',
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 1, offset: 0.5 }),
            style({ opacity: 0, offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
  template: `
    <footer class="sql-footer sql-card" @footerAnimation>
      <div class="footer-content">
        <div class="footer-left">
          <p class="comment">
            <span class="line-number">1</span>
            <span class="comment-text" @generatorAnimation>
              <span class="char">-</span>
              <span class="char">-</span>
              <span class="char">S</span>
              <span class="char">Q</span>
              <span class="char">L</span>
              <span class="char">&nbsp;</span>
              <span class="char">G</span>
              <span class="char">e</span>
              <span class="char">n</span>
              <span class="char">e</span>
              <span class="char">r</span>
              <span class="char">a</span>
              <span class="char">t</span>
              <span class="char">o</span>
              <span class="char">r</span>
              <span class="char">&nbsp;</span>
              <span class="char">©</span>
              <span class="char">&nbsp;</span>
              <span class="char">2</span>
              <span class="char">0</span>
              <span class="char">2</span>
              <span class="char">4</span>
            </span>
          </p>
          <p class="sql-line">
            <span class="line-number">2</span>
            <span class="keyword">COMMIT</span>
            <span class="operator">;</span>
          </p>
          <p class="sql-line">
            <span class="line-number">3</span>
            <span class="keyword">END</span>
            <span class="operator">;</span>
            <span class="cursor" @cursorBlink>_</span>
          </p>
        </div>
        <div class="footer-right">
          <p class="created-by" @generatorAnimation>
            <span class="char">C</span>
            <span class="char">r</span>
            <span class="char">e</span>
            <span class="char">a</span>
            <span class="char">t</span>
            <span class="char">e</span>
            <span class="char">d</span>
            <span class="char">&nbsp;</span>
            <span class="char">b</span>
            <span class="char">y</span>
            <span class="char">&nbsp;</span>
            <span class="char g7-text">G</span>
            <span class="char g7-text">7</span>
          </p>
        </div>
      </div>
      <div class="footer-decoration"></div>
      <div class="footer-pattern"></div>
    </footer>
  `,
  styles: [
    `
      .sql-footer.sql-card {
        background: rgba(30, 30, 30, 0.95) !important;
        backdrop-filter: blur(10px);
        padding: 1.5rem;
        font-family: 'Fira Code', monospace;
        border-top: 1px solid rgba(78, 201, 176, 0.2);
        position: relative;
        overflow: hidden;
        box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.2),
          0 -2px 4px -1px rgba(0, 0, 0, 0.1);
      }

      .sql-footer .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        p {
          margin: 0.25rem 0;
          display: flex;
          align-items: center;
          gap: 1rem;

          &.comment {
            font-style: italic;
          }

          &.sql-line {
            color: var(--sql-foreground);
          }
        }
      }

      .sql-footer .char {
        display: inline-block;
        transform-origin: bottom;

        &:hover {
          color: #4ec9b0;
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
      }

      .sql-footer .footer-decoration {
        position: absolute;
        top: -150%;
        left: -25%;
        right: -25%;
        bottom: -50%;
        background: radial-gradient(
          circle at center,
          rgba(78, 201, 176, 0.03) 0%,
          rgba(86, 156, 214, 0.03) 50%,
          transparent 70%
        );
        transform: rotate(-12deg);
        z-index: 1;
        pointer-events: none;
      }

      .sql-footer .footer-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.02;
        background-size: 50px 50px;
        background-image: linear-gradient(
            to right,
            #4ec9b0 1px,
            transparent 1px
          ),
          linear-gradient(to bottom, #569cd6 1px, transparent 1px);
        z-index: 1;
        pointer-events: none;
      }

      .sql-footer .line-number {
        color: #858585;
        opacity: 0.8;
        min-width: 1.5rem;
        text-align: right;
        user-select: none;
        font-size: 0.9em;
        padding-right: 1rem;
        border-right: 1px solid #404040;
        margin-right: 1rem;
      }

      .sql-footer .keyword {
        color: #569cd6;
        font-weight: 500;
      }

      .sql-footer .operator {
        color: #d4d4d4;
      }

      .sql-footer .comment-text {
        color: #6a9955;
      }

      .sql-footer .cursor {
        display: inline-block;
        color: #569cd6;
        font-weight: bold;
        margin-left: 0.25rem;
        animation: blink 1s infinite;
      }

      @keyframes blink {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }

      @media (max-width: 768px) {
        .sql-footer {
          padding: 1rem;
        }

        .sql-footer .footer-decoration {
          top: -100%;
        }
      }

      .footer-left {
        flex: 1;
      }

      .footer-right {
        padding-left: 2rem;
        display: flex;
        align-items: center;
      }

      .created-by {
        color: #858585;
        font-size: 0.9em;
        opacity: 0.8;
        font-weight: 500;
        letter-spacing: 0.5px;
        position: relative;
        padding-bottom: 2px;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: #569cd6;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }

        &:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .char {
          display: inline-block;
          transform-origin: bottom;
          transition: all 0.3s ease;

          &:hover {
            color: #4ec9b0;
            transform: translateY(-2px);
          }

          &.g7-text {
            color: #569cd6;
            font-weight: 700;
            font-size: 1.1em;
          }
        }
      }
    `,
  ],
})
export class FooterComponent {}
