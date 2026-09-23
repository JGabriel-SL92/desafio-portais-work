
export interface ButtonItem {
  ID: string;
  NOME: string;
  LINK: string;
  IMG: string;
  POSICAO: number | null; 
}

export interface CategoryItem {
  ID_CATEGORIA: string;
  CATEGORIA: string;
  CATEGORIA_POSICAO: number;
  BUTTONS: ButtonItem[]; 
  
}

export interface ApiResponse {
  error: boolean;
  message: string;
  res: CategoryItem[]; 
}