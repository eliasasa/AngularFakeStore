import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard implements OnInit{
    @Input() product!: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    inList?: boolean;
  };

  ngOnInit(): void {
    const favProducts = JSON.parse(
      localStorage.getItem('favProducts') || '[]'
    ) as { id: number }[];

    this.product.inList = favProducts.some(
      item => item.id === this.product.id
    );
  }

  toggleFavorite(product: any) {
    const stored = localStorage.getItem('favProducts');
    let favProducts: any[] = stored ? JSON.parse(stored) : [];

    const exists = favProducts.some((item) => item.id === product.id);

    if (exists) {
      favProducts = favProducts.filter((item) => item.id !== product.id);
    } else {
      favProducts.push({...product, inList: true});
    }

    localStorage.setItem('favProducts', JSON.stringify(favProducts));
  }

  


}
