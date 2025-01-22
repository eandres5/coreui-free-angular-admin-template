import {Component, OnInit} from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {Toast} from "primeng/toast";
import {MessageService} from "primeng/api";
import {RecuperarPassword} from "../../../models/class/recuperarPassword";
import {UsuarioService} from "../../../services/usuario/usuario.service";

@Component({
    selector: 'app-recovery',
    templateUrl: './recovery.component.html',
    styleUrls: ['./register.component.scss'],
  imports: [ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, FormsModule, Toast]
})
export class RecoveryComponent implements OnInit {

  token: string | null = null;
  password: string = "";
  repeatPassword: string = "";
  recuperarPassword: any;
  constructor(private route: ActivatedRoute,
              public messageService: MessageService,
              public usuarioService: UsuarioService,
              private router: Router) { }

  ngOnInit(): void {
    // Capturar el token desde los parámetros de consulta
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    });
  }

  actualizarPass() {
    if(this.password == "" || this.password == undefined || this.repeatPassword == "" || this.repeatPassword == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar la nueva contraseña', life: 2500 });
    } else if (this.password?.trim() != this.repeatPassword?.trim()){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden', life: 2500 });
    } else {
      this.recuperarPassword = new RecuperarPassword(this.token, this.password);
      this.usuarioService.restablecerPassword(this.recuperarPassword).subscribe(res => {
        if(res.message == "200") {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: "Contraseña Actualizada", life: 2500 });
          this.router.navigate(['/login']);
        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 2500 });
      })
    }
  }

}
