import { useState, useMemo } from 'react';
import { Headphones, Keyboard, Mouse, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { 
  HeroSection, 
  SearchAndFilters, 
  FilterPanel, 
  FilterSelect, 
  FilterCheckbox, 
  ProductCard, 
  ProductGrid 
} from '../../components/shop';
import type { Periferico } from '../../types/shop';


// Mock de periféricos GAMER
const mockPerifericos: Periferico[] = [
  {
    id: 1,
    nome: "Teclado Mecânico RGB",
    preco: 799.99,
    precoOriginal: 999.99,
    imagem: "https://images.unsplash.com/photo-1555680202-c86f0e12f086",
    freteGratis: true,
    avaliacao: 4.9,
    marca: "Redragon",
    tipo: "Teclado",
    especificacoes: {
      tipo: "Mecânico (Red Switch)",
      rgb: true,
      conexao: "USB"
    },
    numeroAvaliacoes: 842
  },
  {
    id: 2,
    nome: "Mouse Gamer 16000DPI",
    preco: 349.99,
    imagem: "https://images.unsplash.com/photo-1527814050087-3793815479db",
    freteGratis: false,
    avaliacao: 4.7,
    marca: "Logitech",
    tipo: "Mouse",
    especificacoes: {
      tipo: "Sem Fio",
      rgb: true,
      conexao: "Bluetooth"
    },
    numeroAvaliacoes: 721
  },
  // Adicione mais 5-7 itens...
];

export default function Perifericos() {
  const navigate = useNavigate();
  
  // Estados dos filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({
    precoMax: 2000,
    freteGratis: false,
    tipo: 'Todos' as 'Todos' | 'Teclado' | 'Mouse' | 'Headset',
    rgb: false,
    conexao: 'Todos' as 'Todos' | 'USB' | 'Bluetooth',
    busca: ''
  });

  // Função para redirecionar para página do produto
  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  // Filtros avançados (memoizado para performance)
  const perifericosFiltrados = useMemo(() => {
    return mockPerifericos.filter(item => {
      if (item.preco > filtros.precoMax) return false;
      if (filtros.freteGratis && !item.freteGratis) return false;
      if (filtros.tipo !== 'Todos' && item.tipo !== filtros.tipo) return false;
      if (filtros.rgb && !item.especificacoes.rgb) return false;
      if (filtros.conexao !== 'Todos' && item.especificacoes.conexao !== filtros.conexao) return false;
      if (filtros.busca && !item.nome.toLowerCase().includes(filtros.busca.toLowerCase())) return false;
      return true;
    });
  }, [filtros]);

  // Ícones por tipo (memoizado)
  const iconesPorTipo = useMemo(() => ({
    Teclado: <Keyboard className="text-red-500" size={20} />,
    Mouse: <Mouse className="text-green-500" size={20} />,
    Headset: <Headphones className="text-blue-400" size={20} />,
    Mousepad: <Zap className="text-purple-400" size={20} />
  }), []);

  // Opções dos filtros
  const precoOptions = [
    { value: 500, label: 'Até R$ 500' },
    { value: 1000, label: 'Até R$ 1.000' },
    { value: 2000, label: 'Até R$ 2.000' }
  ];

  const tipoOptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Teclado', label: 'Teclado' },
    { value: 'Mouse', label: 'Mouse' },
    { value: 'Headset', label: 'Headset' }
  ];

  const conexaoOptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'USB', label: 'USB' },
    { value: 'Bluetooth', label: 'Bluetooth' }
  ];

  const clearFilters = () => {
    setFiltros({
      precoMax: 2000,
      freteGratis: false,
      tipo: 'Todos',
      rgb: false,
      conexao: 'Todos',
      busca: ''
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-900 to-gray-900 text-white">
        <HeroSection
          icon={Headphones}
          title="PERIFÉRICOS GAMER"
          description="Equipamentos para dominar nos games. Precisão, estilo e performance."
          iconColor="text-red-500"
          gradientFrom="from-red-500"
          gradientTo="to-purple-500"
        />

        <SearchAndFilters
          searchValue={filtros.busca}
          onSearchChange={(value) => setFiltros({ ...filtros, busca: value })}
          onToggleFilters={() => setShowFilters(!showFilters)}
          placeholder="Buscar teclados, mouses..."
          primaryColor="red"
        />

        <FilterPanel isVisible={showFilters}>
          <FilterSelect
            label="Preço Máximo"
            value={filtros.precoMax}
            onChange={(value) => setFiltros({ ...filtros, precoMax: Number(value) })}
            options={precoOptions}
            color="red"
          />
          
          <FilterSelect
            label="Tipo"
            value={filtros.tipo}
            onChange={(value) => setFiltros({ ...filtros, tipo: value as typeof filtros.tipo })}
            options={tipoOptions}
            color="red"
          />

          <FilterSelect
            label="Conexão"
            value={filtros.conexao}
            onChange={(value) => setFiltros({ ...filtros, conexao: value as typeof filtros.conexao })}
            options={conexaoOptions}
            color="red"
          />

          <FilterCheckbox
            label="RGB 🌈"
            checked={filtros.rgb}
            onChange={(checked) => setFiltros({ ...filtros, rgb: checked })}
            color="red"
          />
        </FilterPanel>

        <ProductGrid 
          emptyMessage="Nenhum periférico encontrado com esses filtros"
          onClearFilters={clearFilters}
        >
          {perifericosFiltrados.map(item => (
            <ProductCard
              key={item.id}
              id={item.id}
              nome={item.nome}
              preco={item.preco}
              precoOriginal={item.precoOriginal}
              imagem={item.imagem}
              freteGratis={item.freteGratis}
              marca={item.marca}
              especificacoes={item.especificacoes}
              onClick={handleProductClick}
              typeIcon={iconesPorTipo[item.tipo]}
              primaryColor="red"
            />
          ))}
        </ProductGrid>
      </div>
    </>
  );
}