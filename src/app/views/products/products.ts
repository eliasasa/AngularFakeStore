import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product-service';
import { ToastService } from '../../services/toast/toast-service';
import { CommonModule } from '@angular/common';
import { Load } from '../../components/load/load';

@Component({
  selector: 'app-products',
  imports: [CommonModule,
    Load
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  produto: any;

  load: boolean = true;
  success: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private toast: ToastService
  ) {
    
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');

    if (!id || isNaN(Number(id))) {
      this.router.navigate(['/']);
      return;
    }

    const idNum = parseInt(id, 10);

    this.productService.getProductById(idNum).subscribe({
      next: (product) => {
        this.produto = product;
        this.load = false;
        this.success = true;
        console.log(this.produto)
      },
      error: (err) => {
        this.load = false;
        console.error('Erro ao buscar produto:', err);
        this.toast.showToast(`Erro ao encontrar produto: ${err}`, 'erro');
        this.success = false;
      }
    })    
  
  }

}
