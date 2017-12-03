import { Component, OnInit } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import 'rxjs/add/operator/switchMap';

import { Dish } from '../shared/dish';
import { Comment} from '../shared/comment';

import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
  feedbackForm: FormGroup;
  comment: Comment;
  formErrors = {
    'rating': 0,
    'comment': '',
    'author': '',
    'date': ''
  };

  validationMessages = {
    'rating': {
      'required': 'Rating is required'
    },
    'comment': {
      'required': 'comment is required',
      'minlength': 'comment must be at least 3 characters long',
      'maxlength': 'comment cannot exceed 250 characters long'
    },
    'author': {
      'required': 'Name  is required',
      'minlength': 'Name must be at least 2 characters long',
      'maxlength': 'Name cannot more than 25 characters long'
    }
  };

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      rating: ['', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      date: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // reset form validation messages
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);

    this.route.params
       .switchMap((params: Params) => this.dishService.getDish(+params['id']))
       .subscribe(dish => {this.dish = dish; this.setPrevNext(dish.id); });
  }

  setPrevNext(dishId: number) {
    let index;
    index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    console.log(this.feedbackForm.value);
    this.feedbackForm.value.date = new Date().toISOString();
    this.dish.comments.push(this.feedbackForm.value);
    this.feedbackForm.reset({
      rating: '',
      comment: '',
      author: '',
      date: ''
    });
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }


}
