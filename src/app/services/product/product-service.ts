import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Product } from '../../models/product/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'https://fakestoreapi.com';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products`).pipe(
      map(products => products.slice(0, 24)),
      catchError(error => {
        console.error('Erro ao carregar produtos:', error);
        return of([]);
      })
    );
  }

  getProductsByCategory(category?: string): Observable<Product[]> {

  if (!category || category === 'all') {
    return this.getAllProducts(); // Retorna todos os produtos se nenhuma categoria for especificada
  }

  // Validação da categoria antes da requisição
  const validCategories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];
  if (!validCategories.includes(category)) {
    console.warn(`Categoria inválida: ${category}. Retornando lista vazia.`);
    return of([]); // Retorna um Observable vazio se a categoria não existir
  }

  // Chamada para a API filtrando pela categoria
  return this.http.get<Product[]>(`${this.API_URL}/products/category/${category}`).pipe(
    catchError(error => {
      console.error(`Erro ao carregar produtos da categoria ${category}:`, error);
      return of([]); // Retorna um array vazio em caso de erro
    })
  );
}

  getProductsByArray(produtos: number[]): void {
  produtos.forEach(id => {
    fetch(this.API_URL + '/' + id)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao carregar produto ID ${id}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(product => {
      })
      .catch(error => {
        console.error(error);
      });
  });
}
}