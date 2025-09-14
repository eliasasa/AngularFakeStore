import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
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
export class ProductList implements AfterViewInit {

  @Input() icon: string = 'star';
  @Input() title: string = 'Lista';
  @Input() products: any[] = [];
  @Input() emptyMessage: string = 'Nenhum produto encontrado :(';
  @Input() rowClass: boolean = false;


  botao () {
    window.alert('oi')
  }

  ngAfterViewInit(): void {
    
  }

  @ViewChild('productRow', { static: false }) productRow!: ElementRef;

  scrollRight() {
    if (this.productRow) {
      this.productRow.nativeElement.scrollLeft += 216;
    }
  }

  scrollLeft() {
    if (this.productRow) {
      this.productRow.nativeElement.scrollLeft -= 216;
    }
  }

}
