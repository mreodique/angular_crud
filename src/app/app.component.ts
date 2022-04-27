import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  DialogComponent,
  DialogComponentCategory,
  DialogComponentContent,
} from './dialog/dialog.component';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-crud';
  displayedColumns: string[] = [
    'productName',
    'category',
    'freshness',
    'date',
    'price',
    'comment',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  value: string = '';

  constructor(private dialog: MatDialog, private api: ApiService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }
  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllProducts();
        }
      });
  }
  getAllProducts() {
    this.api.getProduct().subscribe({
      next: (res) => {
        // console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log('Error found! ' + err);
      },
    });
  }
  editProduct(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        this.getAllProducts();
      });
  }
  deleteProduct(id: number) {
    this.dialog
      .open(DialogComponentContent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.api.deleteProduct(id).subscribe({
            next: (res) => {
              alert('Product Deleted Successfully');
              this.getAllProducts();
            },
            error: () => {
              alert('Error while deleting the product');
            },
          });
        }
      });
  }
  onClear() {
    this.value = '';
    this.getAllProducts();
  }

// Category
  openDialogCategory() {
    this.dialog.open(DialogComponentCategory, {
      width: '30%',
    });
    // .afterClosed()
    // .subscribe((val) => {
    //   if (val === 'save') {
    //     this.getAllProducts();
    //   }
    // });
  }
  getAllCategories() {
    this.api.getCategory().subscribe({
      next: (res) => {
        console.log(res);
        // this.dataSource = new MatTableDataSource(res);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log('Error found! ' + err);
      },
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
