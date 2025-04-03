import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { Livro } from './livro';
import { BotaoComponent } from '../botao/botao.component';
import { LivroService } from '../../services/livro.service';

@Component({
  selector: 'app-livro',
  imports: [
    CommonModule,
    BotaoComponent
  ],
  templateUrl: './livro.component.html',
  styleUrl: './livro.component.css'
})
export class LivroComponent {
  excluirLivro = output<string>();
  livro = input.required<Livro>();

  constructor(private livroService: LivroService) {}

  alternarFavorito() {
    const livroAtualizado = {...this.livro(), favorito: !this.livro().favorito}

    this.livroService.atualizarFavorito(livroAtualizado).subscribe(() => {
      this.livro().favorito = livroAtualizado.favorito
    })

  }

  excluir() {
    this.excluirLivro.emit(this.livro().id)
  }

}
