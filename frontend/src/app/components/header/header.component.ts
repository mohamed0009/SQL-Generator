import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="app-header">
      <div class="header-content">
        <h1>SQL Generator</h1>
        <p>Generate SQL tables with a powerful and intuitive interface</p>
        <div class="header-decoration"></div>
      </div>
      <div class="header-pattern"></div>
    </header>
  `,
  styles: [
    `
      .app-header {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        padding: 4rem 2rem;
        text-align: center;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);

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
          font-weight: 800;
          color: white;
          margin: 0 0 1rem;
          letter-spacing: -0.025em;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

          @media (max-width: 768px) {
            font-size: 2.5rem;
          }
        }

        p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          line-height: 1.6;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

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
          rgba(255, 255, 255, 0.1) 0%,
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
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l7.9-7.9h-.828zm5.656 0L19.515 8.485 17.343 10.657 28 0h-2.83zM32.656 0L41.142 8.485 39.728 9.9l-7.9-7.9h.828zm5.656 0l8.485 8.485-2.172 2.172L28 0h2.83zM0 0l.828.828-1.415 1.415L0 2.828V0zm54.627 0L60 5.373l-.828.828L54.627 1.656 55.455.828 54.627 0zm-5.656 0L60 11.03l-.828.828L48.97 1.656 49.8.828 48.97 0zm-5.657 0L60 16.686l-.828.828L43.314 1.656 44.142.828 43.314 0zm-5.657 0L60 22.343l-.828.828L37.657 1.656 38.485.828 37.657 0zm-5.657 0L60 28l-.828.828L32 1.656 32.828.828 32 0zm-5.657 0L60 33.657l-.828.828L26.343 1.656 27.17.828 26.343 0zm-5.657 0L60 39.314l-.828.828L20.686 1.656 21.514.828 20.686 0zm-5.657 0L60 44.97l-.828.828L15.03 1.656 15.857.828 15.03 0zm-5.657 0L60 50.627l-.828.828L9.373 1.656 10.2.828 9.373 0zM3.716 0L60 56.284l-.828.828L2.888 1.656 3.716.828 3.716 0zM60 60L0 0h60v60z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
        opacity: 0.5;
      }
    `,
  ],
})
export class HeaderComponent {}
