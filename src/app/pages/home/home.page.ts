import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ChatService } from 'src/app/services/chat.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user: any = null;
  nuevoMensaje: string = '';
  mensajesA: any = [];
  mensajesB: any = [];
  botonPresionado: boolean = false;
  chat: number = 0;

  constructor(
    private authService: UserService,
    private chatService: ChatService,
    private toast:ToastController
  ) {} // end of constructor

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
      }
    });
    this.chatService.getMessagesA().subscribe((messagesA) => {
      if (messagesA !== null) {
        this.mensajesA = messagesA;
        setTimeout(() => {
          this.scrollToTheLastElementByClassName();
        }, 1000);
      }
    });
    this.chatService.getMessagesB().subscribe((messagesB) => {
      if (messagesB !== null) {
        this.mensajesB = messagesB;
        setTimeout(() => {
          this.scrollToTheLastElementByClassName();
        }, 1000);
      }
    });
  } // end of ngOnInit

  logoutUser() {
    this.authService.logout()
  } // end of logoutUser

  showChat4A() {
    this.nuevoMensaje = '';
    this.showSpinner(1);
    setTimeout(() => {
      this.scrollToTheLastElementByClassName();
    }, 2100);
  } // endo of showChat4A

  showChat4B() {
    this.nuevoMensaje = '';
    this.showSpinner(2);
    setTimeout(() => {
      this.scrollToTheLastElementByClassName();
    }, 2100);
  } // endo of showChat4B

  goToClassrooms() {
    this.nuevoMensaje = '';
    this.showSpinner(0);
  } // end of goToClassrooms

  sendMessageA() {
    if (this.nuevoMensaje.trim() == '') {
      this.MostrarToast('Debes escribir un mensaje', 'warning');
      return;
    } else if (this.nuevoMensaje.trim().length > 21) {
      this.MostrarToast(
        'El mensaje no puede tener más de 21 caracteres',
        'warning'
      );
      return;
    }
    const date = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
    const message = {
      user: this.user,
      text: this.nuevoMensaje,
      date: date,
    };
    this.chatService.createMessageA(message);
    this.nuevoMensaje = '';
    this.scrollToTheLastElementByClassName();
  } // end of sendMessageA

  sendMessageB() {
    if (this.nuevoMensaje.trim() == '') {
      this.MostrarToast('Debes escribir un mensaje', 'warning');
      return;
    } else if (this.nuevoMensaje.trim().length > 21) {
      this.MostrarToast(
        'El mensaje no puede tener más de 21 caracteres',
        'warning'
      );
      return;
    }

    const date = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
    const message = {
      user: this.user,
      text: this.nuevoMensaje,
      date: date,
    };
    this.chatService.createMessageB(message);
    this.nuevoMensaje = '';
    this.scrollToTheLastElementByClassName();
  } // end of sendMessageB

  showSpinner(chatOption: number) {
    this.botonPresionado = true;
    setTimeout(() => {
      this.botonPresionado = false;
      this.chat = chatOption;
    }, 2000);
  } // end of showSpinner

  scrollToTheLastElementByClassName() {
    const elements = document.getElementsByClassName('mensajes');
    const lastElement: any = elements[elements.length - 1];
    const contenedorMensajes = document.getElementById('contenedor-mensajes');
    let toppos: any = [];
    if (lastElement != null) {
      toppos = lastElement.offsetTop;
    }
    if (contenedorMensajes != null) {
      contenedorMensajes.scrollTop = toppos;
    }
  } // end of scrollToTheLastElementByClassName

  async MostrarToast(mensaje:string,color:string)
  {
    const toast = await this.toast.create({
      message:mensaje,
      color:color,
      duration:2000,
      position:'top'
    })

    await toast.present()
  }
}
