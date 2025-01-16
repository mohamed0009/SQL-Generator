import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SqlFormComponent } from './sql-form/sql-form.component';
import { fadeIn, fadeInUp } from './animations/shared-animations';
import { FooterComponent } from './components/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    SqlFormComponent,
    MatButtonModule,
    MatIconModule,
  ],
  animations: [fadeIn, fadeInUp],
  template: `
    <div class="app-container sql-syntax" @fadeIn>
      <div class="background-container">
        <div class="animated-background">
          <div class="gradient-layer"></div>
          <div class="pattern-layer"></div>
          <div class="glow-layer"></div>
        </div>
        <div class="app-decoration primary"></div>
        <div class="app-decoration secondary"></div>
        <div class="app-pattern"></div>
      </div>

      <div class="content-wrapper" [class.expanded]="showForm">
        <app-header></app-header>

        <button
          *ngIf="!showForm"
          mat-raised-button
          color="primary"
          class="show-form-button"
          (click)="showForm = true"
        >
          <mat-icon>add</mat-icon>
          Create SQL Tables
        </button>

        <main @fadeInUp class="sql-card" [class.expanded]="showForm">
          <app-sql-form
            [showForm]="showForm"
            (formReady)="onFormReady()"
          ></app-sql-form>
        </main>

        <app-footer class="footer"></app-footer>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        font-family: 'Fira Code', monospace;
        min-height: 100vh;
        position: relative;
        overflow-x: hidden;
        background: #f8f9fa;
      }

      .app-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        color: var(--sql-foreground);
        transition: all 0.3s ease;
        position: relative;
        z-index: 1;
      }

      .background-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
        overflow: hidden;
        background: #f8fafc;

        .animated-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;

          .gradient-layer {
            position: absolute;
            top: -50%;
            left: -50%;
            right: -50%;
            bottom: -50%;
            background: linear-gradient(
              45deg,
              rgba(99, 102, 241, 0.1),
              rgba(78, 201, 176, 0.1),
              rgba(86, 156, 214, 0.1)
            );
            animation: rotate 20s linear infinite;
          }

          .pattern-layer {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.05;
            background-image: linear-gradient(45deg, #000 25%, transparent 25%),
              linear-gradient(-45deg, #000 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #000 75%),
              linear-gradient(-45deg, transparent 75%, #000 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            animation: slide 10s linear infinite;
          }

          .glow-layer {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(
              circle at 50% 50%,
              rgba(99, 102, 241, 0.1),
              transparent 70%
            );
            animation: pulse 5s ease-in-out infinite;
          }
        }
      }

      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes slide {
        0% {
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        100% {
          background-position: 20px 0, 20px 10px, 30px -10px, 10px 0px;
        }
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 0.5;
        }
        50% {
          transform: scale(1.2);
          opacity: 0.8;
        }
      }

      .content-wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        position: relative;

        app-header {
          position: relative;
          z-index: 2;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        // Initially header and footer are attached
        main {
          display: none;
          height: 0;
          opacity: 0;
          transition: all 0.5s ease-out;
        }

        .footer {
          position: relative;
          z-index: 2;
          margin-top: 0;
          background: white;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.5s ease-out;
        }

        // When not expanded, footer moves up to meet header
        &:not(.expanded) {
          .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            transform: translateY(0);
          }
        }

        // When expanded, create space for the form
        &.expanded {
          main {
            display: block;
            flex: 1;
            height: auto;
            opacity: 1;
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }

          .footer {
            position: relative;
            transform: none;
          }
        }
      }

      .app-decoration {
        position: absolute;
        pointer-events: none;

        &.primary {
          top: -50%;
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
        }

        &.secondary {
          top: -50%;
          left: 25%;
          right: -75%;
          bottom: -50%;
          background: radial-gradient(
            circle at center,
            rgba(99, 102, 241, 0.02) 0%,
            rgba(78, 201, 176, 0.02) 50%,
            transparent 70%
          );
          transform: rotate(15deg);
        }
      }

      .app-pattern {
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
        pointer-events: none;
      }

      ::ng-deep {
        .sql-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 128, 102, 0.2);
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        app-header,
        app-footer {
          position: relative;
          z-index: 2;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
        }
      }

      app-header {
        position: relative;
        z-index: 2;
        transform: translateY(0);
        transition: transform 0.5s ease-out;
      }

      app-footer {
        position: relative;
        z-index: 2;
        transform: translateY(-100%);
        transition: transform 0.5s ease-out;

        .expanded + & {
          transform: translateY(0);
        }
      }

      .show-form-button {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        padding: 1rem 2rem;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--primary-color, #6366f1);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translate(-50%, -50%) scale(1.05);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }
    `,
  ],
})
export class AppComponent {
  showForm = false;

  onFormReady() {
    // Remove the timeout, form will show when button is clicked
    // this.showForm is now controlled by the button
  }
}
