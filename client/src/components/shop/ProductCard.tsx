import React from 'react';
import { ShoppingCart, Truck } from 'lucide-react';

interface ProductCardProps {
  id: number;
  nome: string;
  preco: number;
  precoOriginal?: number;
  imagem: string;
  freteGratis: boolean;
  marca: string;
  tipo?: string;
  especificacoes?: {
    tipo?: string;
    conexao?: string;
    rgb?: boolean;
  };
  onClick: (id: number) => void;
  typeIcon?: React.ReactNode;
  primaryColor?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  nome,
  preco,
  precoOriginal,
  imagem,
  freteGratis,
  marca,
  especificacoes,
  onClick,
  typeIcon,
  primaryColor = "red"
}) => {
  const handleCardClick = () => {
    onClick(id);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(id);
  };

  return (
    <div 
      className={`bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-${primaryColor}-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-${primaryColor}-500/10 cursor-pointer`}
      onClick={handleCardClick}
    >
      {/* Badge de tipo */}
      {typeIcon && (
        <div className="absolute top-3 left-3 z-10">
          {typeIcon}
        </div>
      )}

      {/* Imagem */}
      <div className="relative h-48 bg-gray-900/30">
        <img
          src={imagem}
          alt={nome}
          className="w-full h-full object-contain p-4"
        />
        {especificacoes?.rgb && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            RGB
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{nome}</h3>
        <p className={`text-${primaryColor}-400 text-sm mb-3`}>{marca}</p>

        {/* Especificações */}
        {especificacoes && (
          <div className="space-y-2 text-sm text-gray-300 mb-4">
            {especificacoes.tipo && (
              <p><span className={`text-${primaryColor}-400`}>Tipo:</span> {especificacoes.tipo}</p>
            )}
            {especificacoes.conexao && (
              <p><span className={`text-${primaryColor}-400`}>Conexão:</span> {especificacoes.conexao}</p>
            )}
          </div>
        )}

        {/* Preço */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-xl font-bold text-${primaryColor}-400`}>
              R$ {preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            {precoOriginal && (
              <p className="text-sm text-gray-500 line-through">
                R$ {precoOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>
          {freteGratis && (
            <span className="flex items-center gap-1 text-green-400 text-sm">
              <Truck size={16} />
              <span>Grátis</span>
            </span>
          )}
        </div>

        <button 
          className={`w-full bg-${primaryColor}-600 hover:bg-${primaryColor}-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-1 transition-colors`}
          onClick={handleButtonClick}
        >
          <ShoppingCart size={16} />
          Add ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
