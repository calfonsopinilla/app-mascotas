import { Component, OnInit } from '@angular/core';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { Mascota } from 'src/app/_model/mascota';
import { MascotaService } from '../../_services/mascota.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-mascota',
  templateUrl: './mascota.component.html'
})
export class MascotaComponent implements OnInit {

  mascotas: Mascota[];
  mascota: Mascota = {
    id: null,
    nombre: null,
    raza: null,
    edad: null,
    registro: null
  };
  selectMascota: Mascota = {
    id: null,
    nombre: null,
    raza: null,
    edad: null,
    registro: null
  };
  cols: any[];
  items: MenuItem[];
  enviado: boolean = false;
  mascotaDialog: boolean = false;

  constructor(private mascotaService: MascotaService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getAllMascotas();
    this.cols = [
      {field: "nombre", header: "Nombre"},
      {field: "edad", header: "Edad"},
      {field: "raza", header: "Raza"},
      {field: "registro", header: "Registro"},
    ],
    this.items= [
      {
        label: "Nuevo",
        icon: 'pi pi-fw pi-plus',
        command: () => this.showSaveDialog(false)
      },
      {
        label: "Editar",
        icon: 'pi pi-fw pi-pencil',
        command: () => this.showSaveDialog(true)
      },
      {
        label: "Eliminar",
        icon: 'pi pi-fw pi-times',
        command: () => this.deleteMascota()
      }
    ]
  }

  getAllMascotas(){
    this.mascotaService.getMascotas().subscribe(
      (result: any)=>{
        let mascotas: Mascota[] = [];
        for (let i = 0; i < result.length; i++) {
          let mascota = result[i] as Mascota;
          mascotas.push(mascota);
        }
        this.mascotas=mascotas;
      },
      error =>{
        console.log(error);
      }
    );
  }

  postMascota(){
      this.mascotaService.postMascota(this.mascota).subscribe(
        (result: any) => {
          let mascota = result as Mascota;
          this.validateMascota(mascota);
          this.messageService.add({severity:'success',summary:'Bien 😀', detail:'Mascota añadida'})
          this.mascotaDialog = false;
        },
        error => {
          console.log(error);
        }
      );
  }

  deleteMascota(){
    if(this.selectMascota == null || this.selectMascota.id == null ){
      this.messageService.add({severity:'warn', summary:'Advertencia ❗', detail:'Por favor selecciona una mascota para eliminar'});      
      return;
    }
    this.confirmationService.confirm({
      message:'Deseas eliminar la mascota?',
      accept: () => {
        this.mascotaService.deleteMascota(this.selectMascota.id).subscribe(
          (result: any) => {
            this.messageService.add({severity:'info',summary:'Resultado', detail:'Se elimino correctamente la Mascota'})
            this.refreshDeleteOMascota(result.id);
          }
        )
      }
    })
  }

  refreshDeleteOMascota(id:string){
    let index = this.mascotas.findIndex((e)=> e.id == id);
    if(index != -1){
      this.mascotas.splice(index,1);
    }
  }

  validateMascota(mascota: Mascota){
    let index = this.mascotas.findIndex((e)=>e.id == mascota.id);
    if(index != -1){
      this.mascotas[index] = mascota;
    }else{
      this.mascotas.push(mascota);
    }
  }

  showSaveDialog(editar: boolean){
    if(editar){
      if(this.selectMascota.id != null){
        this.mascota = this.selectMascota;
      }else{
        this.messageService.add({severity:'warn', summary:'Advertencia ❗', detail:'Por favor selecciona una mascota para editar'});
        return;
      }
    }else{
      this.mascota = new Mascota();
    }
    this.mascotaDialog=true;
  }
}
