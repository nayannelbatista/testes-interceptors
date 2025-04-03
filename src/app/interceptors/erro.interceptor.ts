import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MensagemErroService } from '../services/mensagem-erro.service';
import { inject } from '@angular/core';

export const erroInterceptor: HttpInterceptorFn = (req, next) => {

  const mensagemErroService = inject(MensagemErroService)

  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      const mensagemErro = obterMensagemDeErro(erro.status)
      mensagemErroService.mostrarMensagemDeErro(mensagemErro)
      return throwError(() => erro)
    })
  )
};

function obterMensagemDeErro(status: number): string {
  const mensagensDeErro: Record<number, string> = {
    0: 'Erro de rede - Não foi possível se conectar ao servidor.',
    404: 'O recurso solicitado não foi encontrado.',
    500: 'Erro no servidor. Tente novamente mais tarde.'
  }
  return mensagensDeErro[status] || 'Ocorreu um erro inesperado'
}
