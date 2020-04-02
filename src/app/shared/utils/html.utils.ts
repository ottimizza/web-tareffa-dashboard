import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HTMLUtils {

  public addStyles(native, classes: string[], delay: number = 0) {
    for (const clazz of classes) {
      setTimeout(() => native.classList.add(clazz), delay);
    }
  }
  public removeStyles(native, classes: string[]) {
    for (const clazz of classes) {
      native.classList.remove(clazz);
    }
  }

}
