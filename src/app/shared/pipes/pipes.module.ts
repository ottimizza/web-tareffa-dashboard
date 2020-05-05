import { ThousandSeparatorPipe } from './thousand-separator.pipe';
import { NgModule } from '@angular/core';
import { DocPipe } from './doc.pipe';

@NgModule({
  declarations: [DocPipe, ThousandSeparatorPipe],
  imports: [],
  providers: [],
  bootstrap: [],
  exports: [DocPipe, ThousandSeparatorPipe]
})
export class PipesModule {}
