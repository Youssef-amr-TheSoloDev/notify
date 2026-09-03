import { Component, input } from '@angular/core';
import { IconName } from '../../types/models';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `<span class="icon icon-{{ name() }}" [style.mask-image]="'url(' + assets[name()] + ')'" [style.webkitMaskImage]="'url(' + assets[name()] + ')'" aria-hidden="true"></span>`,
  styles: [`.icon { display: inline-block; width: 1.5em; height: 1.5em; flex: 0 0 auto; aspect-ratio: 1; vertical-align: middle; background: currentColor; mask-position: center; mask-repeat: no-repeat; mask-size: contain; -webkit-mask-position: center; -webkit-mask-repeat: no-repeat; -webkit-mask-size: contain; }`],
})
export class IconComponent {
  readonly name = input<IconName>('dashboard');
  protected readonly assets: Record<IconName, string> = {
    dashboard: '/assets/icons/layout-dashboard.svg', notes: '/assets/icons/notebook-tabs.svg', tasks: '/assets/icons/list-check.svg', alerts: '/assets/icons/bell.svg', about: '/assets/icons/info.svg', moon: '/assets/icons/moon.svg', sun: '/assets/icons/sun.svg', plus: '/assets/icons/plus.svg', trash: '/assets/icons/trash-2.svg', edit: '/assets/icons/pencil.svg', clock: '/assets/icons/clock.svg', check: '/assets/icons/check.svg', x: '/assets/icons/x.svg', menu: '/assets/icons/menu.svg', grid: '/assets/icons/grid-2x2.svg', list: '/assets/icons/list.svg',
  };
  protected readonly glyphs: Record<IconName, string> = {
    dashboard: '▦', notes: '▤', tasks: '☑', alerts: '♧', about: 'ⓘ', moon: '☾', sun: '☼', plus: '+', trash: '♧', edit: '✎', clock: '◷', check: '✓', x: '×', menu: '≡', grid: '▦', list: '☷',
  };
}
