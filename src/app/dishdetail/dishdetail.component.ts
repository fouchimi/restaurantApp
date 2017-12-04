import { Component, OnInit, Inject } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import 'rxjs/add/operator/switchMap';

import { Dish } from '../shared/dish';
import { Comment} from '../shared/comment';

import { DishService } from '../services/dish.service';
import { baseURL } from '../shared/baseurl';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  animations: [trigger('visibility', [
               state('shown', style({
                transform: 'scale(1.0)',
                opacity: 1
               })),
               state('hidden', style({
                 transform: 'scale(0.5)',
                 opacity: 0
               })),
               transition('* => *', animate('0.5s ease-in-out'))
              ])
            ],
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishcopy = null;
  dishIds: number[];
  prev: number;
  next: number;
  feedbackForm: FormGroup;
  comment: Comment;
  errMess: string;
  visibility = 'shown';

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
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
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
       .switchMap((params: Params) => { this.visibility = 'hidden'; return  this.dishService.getDish(+params['id']); })
       .subscribe(dish => {this.dish = dish; this.dishcopy = dish, this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
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
    this.comment = this.feedbackForm.value;
    this.comment.date = new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishcopy.save()
                 .subscribe(dish => this.dish = dish);
    this.feedbackForm.reset({
      rating: 5,
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
