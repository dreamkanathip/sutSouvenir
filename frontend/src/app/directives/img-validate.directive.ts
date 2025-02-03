import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import Swal from 'sweetalert2';

@Directive({
  selector: '[appImgValidate]'
})
export class ImgValidateDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { 
  }
  @HostListener('change', ['$event'])
  onChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const allowedMimeTypes = ['image/png', 'image/jpeg'];

      if (!allowedMimeTypes.includes(file.type)) {
        const customSwal = Swal.mixin({
              customClass:{
                popup: "title-swal",
              },
            });
        customSwal.fire({
          icon: "error",
          title: "รูปแบบไม่ถูกต้อง",
          text: "อนุญาตไฟล์ .png and .jpg เท่านั้น",
          showConfirmButton: true,
        });
        this.renderer.setProperty(this.el.nativeElement, 'value', '');
      }
    }
  }
}
