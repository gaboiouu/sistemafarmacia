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
      email: ['', [Validators.required, Validators.email]],
      rol: ['VENDEDOR', Validators.required],
      password: ['', Validators.required],
      sede: [null],
      activo: [true]
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
      const formValue = { ...this.usuarioForm.value };
      // Adaptar sede: si es un valor (número o string), convertir a objeto {id: value}
      if (formValue.sede !== null && formValue.sede !== undefined && formValue.sede !== '') {
        formValue.sede = { id: formValue.sede };
      } else {
        formValue.sede = null;
      }
      // Si está en modo edición, no enviar password si está vacío
      if (this.isEditMode && !formValue.password) {
        delete formValue.password;
      }
      if (this.isEditMode && this.currentUsuarioId) {
        this.usuarioService.updateUsuario(this.currentUsuarioId, formValue).subscribe(
          () => {
            this.toastr.success('Usuario actualizado con éxito.');
            this.resetForm();
            this.loadUsuarios();
          },
          (error) => {
            this.toastr.error(error?.error?.error || 'Error al actualizar el usuario.');
            console.error(error);
          }
        );
      } else {
        this.usuarioService.createUsuario(formValue).subscribe(
          () => {
            this.toastr.success('Usuario creado con éxito.');
            this.resetForm();
            this.loadUsuarios();
          },
          (error) => {
            this.toastr.error(error?.error?.error || 'Error al crear el usuario.');
            console.error(error);
          }
        );
      }
    }
  }

  editUsuario(usuario: Usuario): void {
    this.isEditMode = true;
    this.currentUsuarioId = usuario.id!;
    this.usuarioForm.patchValue({
      ...usuario,
      password: '' // No mostrar password
    });
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
    this.usuarioForm.reset({ rol: 'VENDEDOR', activo: true });
    this.usuarioForm.get('password')?.setValidators(Validators.required);
    this.usuarioForm.get('password')?.updateValueAndValidity();
  }
}
