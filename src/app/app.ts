import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './component/nav-bar/nav-bar';
import { MobileNavBarComponent } from './component/mobile-nav-bar/mobile-nav-bar';
import { ThemeService } from './services/theme.service';

@Component({
  imports: [RouterOutlet, NavBarComponent, MobileNavBarComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App { readonly theme = inject(ThemeService); }
