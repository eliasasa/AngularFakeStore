import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductCard],
  standalone: true,
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  template: "<app-product-list><app-product-list>"
})
export class ProductList {

  favoriteProducts: any[] = JSON.parse(localStorage.getItem('favProducts') || '[]');

  


}
