import { Builder } from '../builder/builder.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'platform-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Builder],
  template: ` <pgb-builder></pgb-builder> `,
  styles: [],
})
export class AppComponent {
  title = 'platform-game-builder';
}
