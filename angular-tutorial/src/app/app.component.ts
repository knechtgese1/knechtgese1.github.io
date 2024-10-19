import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouterOutlet, RouterModule, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    RouterLink,
    HomeComponent
  ],
  template: `
    <main>
      <a [routerLink]="['/']">
        <header class="brand-name">
          <img class="brand-logo" src="/assets/house.svg" alt="logo" aria-hidden="true" height="50"/>
        </header>
      </a>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'homes';
}
