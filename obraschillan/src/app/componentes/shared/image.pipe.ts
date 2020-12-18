import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(value:string, fallback:string): string {
    let image = "";
    if(value === undefined || value === "" || value == null){
      image = fallback;
    }else{
      image = value;
    }
    return image;
  }

}
