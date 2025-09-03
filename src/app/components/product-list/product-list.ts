import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../interfaces/product/product';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductCard],
  standalone: true,
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  template: "<app-product-list><app-product-list>"
})
export class ProductList {

  @Input() icon: string = 'star';
  @Input() title: string = 'Lista';
  @Input() products: any[] = [];
  @Input() emptyMessage: string = 'Nenhum produto encontrado :(';

}
