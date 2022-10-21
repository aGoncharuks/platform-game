import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom, fromEvent } from 'rxjs';

@Component({
  selector: 'pgb-builder-preview',
  template: `<iframe #previewIframe class="preview-iframe" src="http://localhost:8080" width="100%" height="100%"></iframe>`,
  styleUrls: ['builder-preview.component.scss'],
  standalone: true
})

export class BuilderPreviewComponent implements OnInit {
  @ViewChild('previewIframe', {static: true}) previewIframe!: ElementRef;

  ngOnInit() {
    firstValueFrom(fromEvent(this.previewIframe.nativeElement, 'load')).then(
      () => this.focusOnPreviewIframe()
    );
  }

  private focusOnPreviewIframe() {
    this.previewIframe.nativeElement.focus();
  }
}
