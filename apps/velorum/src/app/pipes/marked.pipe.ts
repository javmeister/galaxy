import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({
  name: 'marked',
})
export class MarkedPipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (value) {
      return marked(value as string, {breaks: true});
    }
    return value;
  }
}
