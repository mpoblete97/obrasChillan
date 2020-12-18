import {Component, HostListener, NgZone, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery'
@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.css']
})
export class FormulariosComponent implements OnInit {

  constructor(public router:Router, private ngZone:NgZone) {

  }

  ngOnInit(): void {
    $(document).ready(this.onChangeScreen())
  }

  onChangeScreen():void{

    if(document.getElementById("first")!=null&&
      document.getElementById("first2")!=null) {
      if (window.innerWidth <= 767) {
        document.getElementById("first").className = "dissapear"
        document.getElementById("first2").className = "col-md-4"
      }
      window.onresize = (e) => {
        this.ngZone.run(() => {
          if (window.innerWidth <= 767) {
            document.getElementById("first").className = "dissapear"
            document.getElementById("first2").className = "col-md-4"
          }
          if (window.innerWidth > 767) {
            document.getElementById("first").className = "col-md-4"
            document.getElementById("first2").className = "dissapear"
          }
        })
      }
    }
  }


}
