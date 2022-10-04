import { NxWelcomeComponent } from './nx-welcome.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent],
  selector: 'platform-root',
  template: ` <platform-nx-welcome></platform-nx-welcome> `,
  styles: [],
})
export class AppComponent {
  title = 'platform-game-builder';
}
