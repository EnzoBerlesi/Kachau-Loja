# 💰 Sistema de Vendas - Kachau Loja

## 📋 Visão Geral

Sistema completo de vendas que permite aos usuários vendedores registrar vendas, gerenciar clientes e cadastrar produtos com controle de estoque integrado.

## 🚀 Funcionalidades

### 📊 Dashboard de Vendas
- **Métricas em tempo real**: Total vendido, número de vendas, ticket médio
- **Análise de crescimento**: Comparação com períodos anteriores
- **Top produtos**: Produtos mais vendidos no período
- **Vendas recentes**: Últimas transações realizadas
- **Alertas de estoque**: Produtos com estoque baixo
- **Filtros por período**: 7, 30 ou 90 dias

### 🛒 Nova Venda
- **Seleção de cliente**: Busca e seleção com autocomplete
- **Adição de produtos**: Busca e adição com controle de estoque
- **Carrinho dinâmico**: Adição, remoção e alteração de quantidades
- **Cálculos automáticos**: Subtotal, desconto e total
- **Formas de pagamento**: Dinheiro, cartão, PIX, parcelado
- **Validações**: Estoque, cliente obrigatório, etc.

### 👥 Gestão de Clientes
- **Cadastro completo**: Dados pessoais, contato e endereço
- **Validações**: Email, CPF, campos obrigatórios
- **Busca inteligente**: Por nome, email ou CPF
- **Modal responsivo**: Interface limpa e intuitiva

### 📦 Gestão de Produtos
- **Cadastro detalhado**: Nome, descrição, preço, categoria
- **Controle de estoque**: Quantidade disponível
- **Organização**: Categorias, marcas, fornecedores
- **Código de barras**: Para facilitar identificação
- **Imagens**: URL para foto do produto

### 📈 Histórico de Vendas
- **Lista completa**: Todas as vendas realizadas
- **Filtros avançados**: Data, status, forma de pagamento, cliente
- **Estatísticas**: Total vendido, número de vendas, itens
- **Status tracking**: Pendente, pago, cancelado, devolvido

## 🏗️ Estrutura Técnica

### 📁 Arquivos e Pastas

```
src/
├── types/
│   └── vendas.ts                 # Interfaces TypeScript
├── services/
│   └── vendaService.ts           # Lógica de negócio e API mock
├── components/
│   └── vendas/
│       ├── ClienteModal.tsx      # Modal para cadastro/edição de clientes
│       ├── ProdutoModal.tsx      # Modal para cadastro/edição de produtos
│       └── index.ts              # Exports dos componentes
└── pages/
    └── vendas/
        ├── DashboardVendas.tsx   # Dashboard principal
        ├── VendasPage.tsx        # Página de nova venda
        ├── ListaVendasPage.tsx   # Histórico de vendas
        └── index.ts              # Exports das páginas
```

### 🔧 Tipos de Dados

#### Cliente
```typescript
interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  dataCadastro: Date;
  ativo: boolean;
}
```

#### ProdutoVenda
```typescript
interface ProdutoVenda {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  estoque: number;
  codigoBarras?: string;
  marca?: string;
  fornecedor?: string;
  dataCadastro: Date;
  ativo: boolean;
  imagem?: string;
}
```

#### Venda
```typescript
interface Venda {
  id: string;
  numeroVenda: string;
  clienteId: string;
  cliente: Cliente;
  itens: ItemVenda[];
  subtotal: number;
  desconto: number;
  total: number;
  formaPagamento: 'dinheiro' | 'cartao-credito' | 'cartao-debito' | 'pix' | 'parcelado';
  parcelas?: number;
  status: 'pendente' | 'pago' | 'cancelado' | 'devolvido';
  dataVenda: Date;
  vendedorId: string;
  observacoes?: string;
}
```

## 💡 Funcionalidades Técnicas

### ⚡ Performance
- **React.useState**: Estado local otimizado
- **useEffect**: Carregamento eficiente de dados
- **Debounce**: Busca otimizada (implícito no onChange)
- **Lazy Loading**: Carregamento sob demanda

### 🔍 Busca e Filtros
- **Autocomplete**: Busca dinâmica de clientes e produtos
- **Filtros múltiplos**: Data, status, forma de pagamento
- **Busca textual**: Nome, email, número da venda

### 📊 Cálculos Automáticos
- **Subtotal**: Soma dos itens
- **Desconto**: Aplicação flexível
- **Total**: Cálculo final
- **Parcelas**: Divisão automática para pagamento parcelado
- **Estoque**: Controle automático na venda

### 🔒 Validações
- **Campos obrigatórios**: Cliente, produtos, quantidades
- **Estoque**: Verificação de disponibilidade
- **Email**: Formato válido
- **Valores**: Números positivos
- **Data**: Formatos corretos

## 🎨 Interface do Usuário

### 📱 Responsividade
- **Mobile First**: Design adaptável
- **Grid System**: Layout flexível
- **Breakpoints**: sm, md, lg, xl

### 🎯 UX/UI
- **Feedbacks visuais**: Loading states, mensagens de sucesso/erro
- **Navegação intuitiva**: Breadcrumbs, botões contextuais
- **Cores semânticas**: Verde (sucesso), vermelho (erro), amarelo (atenção)
- **Ícones**: Lucide React para consistência visual

### 🔄 Estados da Interface
- **Loading**: Spinners e estados de carregamento
- **Empty State**: Mensagens quando não há dados
- **Error State**: Tratamento de erros
- **Success State**: Confirmações de ações

## 🚦 Como Usar

### 1. Dashboard
1. Acesse a página principal de vendas
2. Visualize métricas e estatísticas
3. Use filtros de período conforme necessário
4. Acesse links rápidos para ações específicas

### 2. Nova Venda
1. Clique em "Nova Venda" no dashboard
2. Selecione ou cadastre um cliente
3. Adicione produtos ao carrinho
4. Configure desconto e forma de pagamento
5. Finalize a venda

### 3. Cadastro de Cliente
1. Na tela de nova venda, clique em "Novo Cliente"
2. Preencha todos os dados obrigatórios
3. Salve o cliente
4. Cliente ficará disponível para seleção

### 4. Cadastro de Produto
1. Na tela de nova venda, clique em "Novo Produto"
2. Preencha informações do produto
3. Defina preço e estoque inicial
4. Salve o produto

### 5. Histórico de Vendas
1. Acesse "Histórico" no dashboard
2. Use filtros para encontrar vendas específicas
3. Visualize detalhes de cada venda
4. Acompanhe estatísticas gerais

## 🔮 Próximas Funcionalidades

### 📊 Relatórios Avançados
- Relatórios em PDF
- Gráficos de vendas por período
- Análise de performance por vendedor
- Relatórios de estoque

### 💳 Pagamentos
- Integração com gateways de pagamento
- Controle de parcelas
- Histórico de pagamentos
- Conciliação financeira

### 📱 Mobile App
- App nativo para vendedores
- Scanner de código de barras
- Vendas offline
- Sincronização automática

### 🤖 Automações
- Alertas de estoque baixo por email
- Backup automático de dados
- Relatórios automáticos
- Integração com sistemas externos

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **React Router** para navegação
- **Date-fns** para manipulação de datas (opcional)
- **Mock Services** para simulação de API

## 📞 Suporte

Para dúvidas ou sugestões sobre o sistema de vendas, entre em contato com a equipe de desenvolvimento.
