import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FormBuilder,Validators,FormGroup,FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email :FormControl
  clave :FormControl

  admin:boolean = false;
  usuario:boolean = false;
  invitado:boolean = false;
  ninguno:boolean = true;

  usuariosHardcode = [
    {email: 'admin@admin.com', password:'111111'},
    {email: 'usuario@usuario.com', password:'333333'},
    {email: 'invitado@invitado.com', password:'222222'}
  ]

  constructor(private userService:UserService,private router:Router) 
  { 
    this.email = new FormControl('',[
      Validators.required,
      Validators.email
    ])
    this.clave = new FormControl('',[
      Validators.required,
      Validators.minLength(6)
    ])
  }

  ngOnInit() {
    this.CargarForm(-1)
  }

  login()
  {
    const boton:HTMLButtonElement = document.getElementById("botonSesion") as HTMLButtonElement

    boton.innerHTML = '<ion-spinner name="lines-sharp"></ion-spinner>'
    boton.disabled = true
    this.userService.login(this.email.value?.toString(),this.clave.value?.toString())
    .then(() => {
      setTimeout(() => {
        this.router.navigate(['/home'])
        boton.innerHTML = 'Iniciar Sesión'
        boton.disabled = false
        this.CargarForm(-1)
      },2000)
    }).catch(error => {
      setTimeout(() => {
        this.userService.MostrarToast("ERROR!",this.userService.obtenerError(error),"danger","remove-circle-outline")
        boton.innerHTML = 'Iniciar Sesión'
        boton.disabled = false
      },2000)
    })
  }

  get isFormValid(): boolean {
    return this.email.valid && this.clave.valid;
  }

  CargarForm(opcion:number){

    const admin= <HTMLInputElement>document.getElementById('admin');
    const usuario = <HTMLInputElement>document.getElementById('usuario');
    const invitado = <HTMLInputElement>document.getElementById('invitado');
    const ninguno = <HTMLInputElement>document.getElementById('ninguno');

    switch (opcion) {
      case -1:
        usuario.checked = false;
        invitado.checked = false;
        admin.checked = false;
        ninguno.checked = true;
        this.LimpiarForm()
        this.ninguno = true;
        this.usuario = false;
        this.invitado = false;
        this.admin = false;
        break;
      case 0: 
        ninguno.checked = false;
        usuario.checked = false;
        invitado.checked = false;
        this.email.patchValue(this.usuariosHardcode[opcion].email)
        this.clave.patchValue(this.usuariosHardcode[opcion].password)
        this.admin = true;
        this.usuario = false;
        this.invitado = false;
        this.ninguno = false;
        break;
      case 1:
        ninguno.checked = false;
        invitado.checked = false;
        admin.checked = false;
        this.email.patchValue(this.usuariosHardcode[opcion].email)
        this.clave.patchValue(this.usuariosHardcode[opcion].password)
        this.admin = false;
        this.usuario = true;
        this.invitado = false;
        this.ninguno = false;
        break;
      case 2:
        ninguno.checked = false;
        admin.checked = false;
        usuario.checked = false;
        this.email.patchValue(this.usuariosHardcode[opcion].email)
        this.clave.patchValue(this.usuariosHardcode[opcion].password)
        this.admin = false;
        this.usuario = false;
        this.invitado = true;
        this.ninguno = false;
        break;
    }
  }

  LimpiarForm()
  {
    this.email.reset()
    this.clave.reset()
  }

}
