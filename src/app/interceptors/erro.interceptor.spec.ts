import { HttpHandlerFn, HttpInterceptorFn, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { erroInterceptor, MENSAGENS_ERRO } from './erro.interceptor';
import { of, throwError } from 'rxjs';
import { MensagemErroService } from '../services/mensagem-erro.service';

describe('erroInterceptor', () => {
  let mensagemErroService: MensagemErroService;
  let requestMock: HttpRequest<any>;
  let nextMock: HttpHandlerFn;

  const sucessoResponse = new HttpResponse({ status: 200, body: { sucesso: true } });
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => erroInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MensagemErroService]
    });

    mensagemErroService = TestBed.inject(MensagemErroService);
    nextMock = jest.fn().mockImplementation((req: HttpRequest<any>) => of(sucessoResponse));
    requestMock = new HttpRequest('GET', '/api/teste');
    jest.spyOn(mensagemErroService, 'mostrarMensagemDeErro');
  });

  it('deve ser criado', () => {
    expect(interceptor).toBeTruthy();
  });

  it('deve continuar a requisição sem modificação', (done) => {
    interceptor(requestMock, nextMock).subscribe({
      next: (res) => {
        expect(nextMock).toHaveBeenCalledWith(requestMock);
        done();
      }
    });
  });

  it('deve permitir requisições sem erro passarem normalmente', (done) => {
    interceptor(requestMock, nextMock).subscribe({
      next: (res) => {
        expect(res).toEqual(sucessoResponse);
        expect(mensagemErroService.mostrarMensagemDeErro).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('deve capturar erro de rede (status 0)', (done) => {
    nextMock = jest.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));

    interceptor(requestMock, nextMock).subscribe({
      error: () => {
        expect(mensagemErroService.mostrarMensagemDeErro).toHaveBeenCalledWith(MENSAGENS_ERRO[0]);
        done();
      }
    });
  });

  it('deve capturar erro 404 e exibir mensagem correta', (done) => {
    nextMock = jest.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 })));

    interceptor(requestMock, nextMock).subscribe({
      error: () => {
        expect(mensagemErroService.mostrarMensagemDeErro).toHaveBeenCalledWith(MENSAGENS_ERRO[404]);
        done();
      }
    });
  });

  it('deve capturar erro 500 e exibir mensagem correta', (done) => {
    nextMock = jest.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    interceptor(requestMock, nextMock).subscribe({
      error: () => {
        expect(mensagemErroService.mostrarMensagemDeErro).toHaveBeenCalledWith(MENSAGENS_ERRO[500]);
        done();
      }
    });
  });

  it('deve capturar erro 403 e exibir mensagem correta', (done) => {
    nextMock = jest.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: 403 })));

    interceptor(requestMock, nextMock).subscribe({
      error: () => {
        expect(mensagemErroService.mostrarMensagemDeErro).toHaveBeenCalledWith(MENSAGENS_ERRO[403]);
        done();
      }
    });
  });

  it('deve capturar erro 401 e exibir mensagem correta', (done) => {
    nextMock = jest.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

    interceptor(requestMock, nextMock).subscribe({
      error: () => {
        expect(mensagemErroService.mostrarMensagemDeErro).toHaveBeenCalledWith(MENSAGENS_ERRO[401]);
        done();
      }
    });
  });

  it('deve capturar erro desconhecido e exibir mensagem genérica', (done) => {
    nextMock = jest.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: 418 })));

    interceptor(requestMock, nextMock).subscribe({
      error: () => {
        expect(mensagemErroService.mostrarMensagemDeErro).toHaveBeenCalledWith('Ocorreu um erro inesperado');
        done();
      }
    });
  });

  //versão com forEach para testar múltiplos códigos de status
  const errosEsperados = [
    { status: 0, mensagem: MENSAGENS_ERRO[0] },
    { status: 404, mensagem: MENSAGENS_ERRO[404] },
    { status: 500, mensagem: MENSAGENS_ERRO[500] },
    { status: 403, mensagem: MENSAGENS_ERRO[403] },
    { status: 401, mensagem: MENSAGENS_ERRO[401] },
    { status: 418, mensagem: 'Ocorreu um erro inesperado' }
  ];

  errosEsperados.forEach(({ status, mensagem }) => {
    it(`deve capturar erro ${status} e exibir a mensagem correta`, (done) => {
      nextMock = jest.fn().mockReturnValue(
        throwError(() => new HttpErrorResponse({ status }))
      );

      interceptor(requestMock, nextMock).subscribe({
        error: () => {
          expect(mensagemErroService.mostrarMensagemDeErro).toHaveBeenCalledWith(mensagem);
          done();
        }
      });
    });
  });
});
