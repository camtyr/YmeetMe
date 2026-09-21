import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../_services/account/account-service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe } from '@angular/common';
import { TextInput } from '../_forms/text-input/text-input';
import { DateInput } from '../_forms/date-input/date-input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, TextInput, DateInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm = signal<FormGroup>(new FormGroup({}));
  maxDate!: Date;
  validationErrors = signal<string[]>([]);

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit() {
    this.intitializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  intitializeForm() {
    this.registerForm.set(
      this.fb.group({
        gender: ['male'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8),
          ],
        ],
        confirmPassword: [
          '',
          [Validators.required, this.matchValues('password')],
        ],
      }),
    );

    this.registerForm().controls.password.valueChanges.subscribe(() => {
      this.registerForm().controls.confirmPassword.updateValueAndValidity();
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value
        ? null
        : { isMatching: true };
    };
  }

  register() {
    this.accountService.register(this.registerForm().value).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
      },
      error: (error) => {
        console.log(error)
        if (error?.error) {
          this.validationErrors.set([error.error]);
        } else {
          this.validationErrors.set(error);
        }
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
