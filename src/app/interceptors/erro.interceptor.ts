import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { catchError, throwError } from 'rxjs';
import { MensagemErroService } from '../services/mensagem-erro.service';

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

export const MENSAGENS_ERRO: Record<number, string> = {
  0: 'Erro de rede - Não foi possível se conectar ao servidor.',
  401: 'Não autorizado. Faça login novamente.',
  403: 'Acesso proibido. Você não tem permissão para esta ação.',
  404: 'O recurso solicitado não foi encontrado.',
  500: 'Erro no servidor. Tente novamente mais tarde.'
};

export function obterMensagemDeErro(status: number): string {
  return MENSAGENS_ERRO[status] || 'Ocorreu um erro inesperado';
}
