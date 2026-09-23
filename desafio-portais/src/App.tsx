import { useState, useEffect, useMemo } from 'react';
import type { CategoryItem, ApiResponse } from './src/types';
import './App.css';

const API_URL = 'https://api-portais-workcenter.com.br/483bcd1babe83af2d8e22d0a0b2acc87b495d941/v2/botoes/list/3';


function formatLink(link: string): string {
  if (!link || link === '#' || link === '###') {
    return '#';
  }

  if (link.startsWith('/')) {
    return `https://administracaopublica.com.br${link}`;
  }

  return link.replace('?token={*}', '').replace('&token={*}', '');
}

export default function App() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');

  useEffect(() => {
    async function fetchApiData() {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error('Não foi possível carregar os dados da API.');
        }
        
        const data: ApiResponse = await response.json();
        setCategories(data.res || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro inesperado ao conectar com o servidor.');
      } finally {
        setLoading(false);
      }
    }

    fetchApiData();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        if (selectedCategory !== 'ALL' && cat.ID_CATEGORIA !== selectedCategory) {
          return false;
        }
        return true;
      })
      .map((cat) => {
        const filteredButtons = cat.BUTTONS.filter((btn) =>
          btn.NOME.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );

        const sortedButtons = [...filteredButtons].sort((a, b) => {
          if (sortOrder === 'asc') {
            return a.NOME.localeCompare(b.NOME, 'pt-BR');
          }
          if (sortOrder === 'desc') {
            return b.NOME.localeCompare(a.NOME, 'pt-BR');
          }
          // Padrão: por POSICAO
          return (a.POSICAO ?? 0) - (b.POSICAO ?? 0);
        });

        return {
          ...cat,
          BUTTONS: sortedButtons,
        };
      })
      .filter((cat) => cat.BUTTONS.length > 0); 
  }, [categories, searchTerm, selectedCategory, sortOrder]);

  if (loading) {
    return <div className="status-msg">Carregando informações do Portal da Transparência...</div>;
  }

  if (error) {
    return <div className="status-msg error">Erro: {error}</div>;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Portal da Transparência</h1>
        <p>Acesso fácil aos serviços institucionais e dados públicos</p>
      </header>

      <section className="controls">
        <div className="control-group">
          <label htmlFor="search">Pesquisar Serviço:</label>
          <input
            id="search"
            type="text"
            placeholder="Digite para buscar (ex: Receitas, Leis, Saúde)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="category">Filtrar por Categoria:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">Todas as Categorias ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat.ID_CATEGORIA} value={cat.ID_CATEGORIA}>
                {cat.CATEGORIA}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="sort">Ordenar por Nome:</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'default' | 'asc' | 'desc')}
          >
            <option value="default">Posição Padrão</option>
            <option value="asc">Nome (A - Z)</option>
            <option value="desc">Nome (Z - A)</option>
          </select>
        </div>
      </section>

      <main className="content">
        {filteredCategories.length === 0 ? (
          <div className="no-results">
            <p>Nenhum serviço ou botão foi encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div key={cat.ID_CATEGORIA} className="category-section">
              <h2 className="category-title">{cat.CATEGORIA}</h2>
              <div className="buttons-grid">
                {cat.BUTTONS.map((btn) => {
                  const href = formatLink(btn.LINK);
                  const isExternal = href !== '#';

                  return (
                    <a
                      key={btn.ID}
                      href={href}
                      target={isExternal ? '_blank' : '_self'}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="btn-card"
                    >
                      <span className="btn-name">{btn.NOME}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}