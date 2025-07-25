import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from './cliente.service';
import { Cliente } from '../models/cliente.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteForm: FormGroup;
  searchForm: FormGroup;
  dniSearchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.clienteForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      direccion: [''],
      id_ubigeo: [''],
      num_doc: ['', Validators.required]
    });

    this.searchForm = this.fb.group({
      termino: ['']
    });

    this.dniSearchForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]]
    });
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getClientes().subscribe(
      (data) => {
        this.clientes = data;
      },
      (error) => {
        this.toastr.error('Error al cargar los clientes.');
        console.error(error);
      }
    );
  }

  onSearch(): void {
    const termino = this.searchForm.value.termino;
    if (termino) {
      this.clienteService.buscarPorNombre(termino).subscribe(data => this.clientes = data);
    } else {
      this.loadClientes();
    }
  }

  onDniSearch(): void {
    if (this.dniSearchForm.valid) {
      const dni = this.dniSearchForm.value.dni;
      this.clienteService.getClienteByDni(dni).subscribe(
        (response) => {
          if (response.success) {
            this.toastr.success('Cliente encontrado y/o registrado.');
            this.loadClientes();
          } else {
            this.toastr.warning(response.message);
          }
        },
        (error) => {
          this.toastr.error('Error al buscar el DNI.');
          console.error(error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      this.clienteService.createClienteManual(this.clienteForm.value).subscribe(
        () => {
          this.toastr.success('Cliente registrado con éxito.');
          this.clienteForm.reset();
          this.loadClientes();
        },
        (error) => {
          this.toastr.error('Error al registrar el cliente.');
          console.error(error);
        }
      );
    }
  }

  realizarVenta(cliente: Cliente): void {
    this.router.navigate(['/ventas'], { state: { cliente } });
  }
}
