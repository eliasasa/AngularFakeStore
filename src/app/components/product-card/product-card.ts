import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard {
    @Input() product!: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
}
