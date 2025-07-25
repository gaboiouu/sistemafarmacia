import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../models/usuario.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioForm: FormGroup;
  isEditMode = false;
  currentUsuarioId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private toastr: ToastrService
  ) {
    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      nombreCompleto: ['', Validators.required],
      rol: ['VENDEDOR', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        this.toastr.error('Error al cargar los usuarios.');
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      if (this.isEditMode && this.currentUsuarioId) {
        this.usuarioService.updateUsuario(this.currentUsuarioId, this.usuarioForm.value).subscribe(
          () => {
            this.toastr.success('Usuario actualizado con éxito.');
            this.resetForm();
            this.loadUsuarios();
          },
          (error) => {
            this.toastr.error('Error al actualizar el usuario.');
            console.error(error);
          }
        );
      } else {
        this.usuarioService.createUsuario(this.usuarioForm.value).subscribe(
          () => {
            this.toastr.success('Usuario creado con éxito.');
            this.resetForm();
            this.loadUsuarios();
          },
          (error) => {
            this.toastr.error('Error al crear el usuario.');
            console.error(error);
          }
        );
      }
    }
  }

  editUsuario(usuario: Usuario): void {
    this.isEditMode = true;
    this.currentUsuarioId = usuario.id!;
    this.usuarioForm.patchValue(usuario);
    this.usuarioForm.get('password')?.clearValidators();
    this.usuarioForm.get('password')?.updateValueAndValidity();
  }

  deleteUsuario(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe(
        () => {
          this.toastr.success('Usuario eliminado con éxito.');
          this.loadUsuarios();
        },
        (error) => {
          this.toastr.error('Error al eliminar el usuario.');
          console.error(error);
        }
      );
    }
  }

  resetForm(): void {
    this.isEditMode = false;
    this.currentUsuarioId = null;
    this.usuarioForm.reset({ rol: 'VENDEDOR' });
    this.usuarioForm.get('password')?.setValidators(Validators.required);
    this.usuarioForm.get('password')?.updateValueAndValidity();
  }
}
