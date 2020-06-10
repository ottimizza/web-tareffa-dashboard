import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringUtils {
  public static normalize(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  public static cut(text: string, charAmount: number): string {
    if (text.length > charAmount) {
      return text.slice(0, charAmount - 3) + '...';
    } else {
      return text;
    }
  }
}
