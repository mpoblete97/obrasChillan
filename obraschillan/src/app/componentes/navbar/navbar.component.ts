import {Component, NgZone, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() {

  }

  ngOnInit(): void {
    this.navSlide()
  }

  navSlide(): void {
    let burger = document.querySelector('.burger');
    let nav = document.querySelector('.nav-links');
    let navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click',()=>{
      //Cambio de clase para marcar como activa
      nav.classList.toggle('nav-active')
      //Animaciones a links
      navLinks.forEach((link:HTMLElement,index)=>{
        if(link.style.animation){
          link.style.animation=''
        }else{
          link.style.animation=`navLinkFade 0.5s ease forwards ${index / 7+0.4}s`
        }
      })
      //Animación de burger
      burger.classList.toggle('toggle')
    })

  }
}
