import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  FreshnessList: string[] = ['Brand New', 'Second Hand', 'Refurbished'];
  CategoryList: string[] = [];
  // CategoryList: string[] = [
  //   'Fruits',
  //   'Vegetables',
  //   'Dairy',
  //   'Meat',
  //   'Electronics',
  // ];
  productForm!: FormGroup;
  actionBtn: string = 'Save';

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogref: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    //  Product Name Column
    this.productForm = this.formBuilder.group({
      // productName: ['', Validators.required],
      // category: ['', Validators.required],
      // freshness: ['', Validators.required],
      // price: ['', Validators.required],
      // comment: ['', Validators.required],
      // date: ['', Validators.required],
      productName: '',
      category: '',
      freshness: '',
      price: '',
      comment: '',
      date: '',
    });
    if (this.editData) {
      this.actionBtn = 'Update';
      this.productForm.controls['productName'].setValue(
        this.editData.productName
      );
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
    //Category List
    this.getCategory();
  }

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert('Product added successfully');
            console.log(this.productForm.value);
            this.productForm.reset();
            this.dialogref.close('save');
          },
          error: () => {
            alert('Error while adding the product');
          },
        });
      }
    } else {
      this.updateProduct();
    }
  }
  updateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id).subscribe({
      next: (res) => {
        console.log(res);
        alert('Product updated successfully');
        this.productForm.reset();
        this.dialogref.close('update');
      },
      error: (err) => {
        alert('Error found while updating ' + err);
      },
    });
  }
  getCategory() {
    this.api.getCategory().subscribe({
      next: (res) => {
        for (var i in res) {
          this.CategoryList.push(res[i].categoryName);
          this.CategoryList.sort();
          // console.log('CategoryList ' + this.CategoryList);
        }
      },
    });
  }
}

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog.component.content.html',
  styleUrls: ['./dialog.component.content.scss'],
})
export class DialogComponentContent {}

@Component({
  selector: 'app-dialog-category',
  templateUrl: './dialog.component.category.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponentCategory implements OnInit {
  categoryForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData1: any,
    private dialogref: MatDialogRef<DialogComponentCategory>
  ) {}

  ngOnInit(): void {
    //  Category Name Column
    this.categoryForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
    });
    if (this.editData1) {
      this.categoryForm.controls['categoryName'].setValue(
        this.editData1.categoryName
      );
    }
  }
  addCategory() {
    if (!this.editData1) {
      if (this.categoryForm.valid) {
        this.api.postCategory(this.categoryForm.value).subscribe({
          next: (res) => {
            alert('Category added successfully');
            this.categoryForm.reset();
            this.dialogref.close('save');
          },
          error: () => {
            alert('Error while adding the category');
          },
        });
      }
    } else {
      this.updateCategory();
    }
  }
  updateCategory() {
    this.api.putProduct(this.categoryForm.value, this.editData1.id).subscribe({
      next: (res) => {
        console.log(res);
        alert('Product updated successfully');
        this.categoryForm.reset();
        this.dialogref.close('update');
      },
      error: (err) => {
        alert('Error found while updating ' + err);
      },
    });
  }
}
