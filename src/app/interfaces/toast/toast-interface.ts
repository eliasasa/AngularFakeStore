export interface ToastMessage {
  id: number;
  message: string;
  type: 'sucesso' | 'erro' | 'aviso' | 'info';
  timestamp: number;
}