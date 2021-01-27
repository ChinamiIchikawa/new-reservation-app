import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
   products: any

  constructor(private ProductService: ProductService) { }

  ngOnInit(): void {
    const productsObservable = this.ProductService.getProducts()
    productsObservable.subscribe(
      (data) => {this.products = data},
      (err) => {console.error('次のエラーが発生しました: ' + err)}
    )
  }
}
