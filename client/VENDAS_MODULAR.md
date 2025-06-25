# Sistema de Vendas - Estrutura Modular

## 📋 Visão Geral

O sistema de vendas foi completamente refatorado para uma arquitetura modular, dividindo a interface em componentes menores e mais específicos. Isso torna o código mais leve, organizado e fácil de manter.

## 🧩 Componentes Modulares

### 1. **ClienteSelector** 
📁 `src/components/vendas/ClienteSelector.tsx`
- **Responsabilidade**: Seleção e busca de clientes
- **Features**:
  - Campo de busca com filtro em tempo real
  - Dropdown com lista de clientes
  - Botão para abrir modal de novo cliente
  - Exibição do cliente selecionado

### 2. **VendedorSelector**
📁 `src/components/vendas/VendedorSelector.tsx`
- **Responsabilidade**: Configuração do local de venda e seleção de vendedor
- **Features**:
  - Selector para local de venda (Vendedor/Loja Física)
  - Campo de busca de vendedor (apenas se "Vendedor" selecionado)
  - Exibição condicional baseada no local selecionado

### 3. **ProdutoSelector**
📁 `src/components/vendas/ProdutoSelector.tsx`
- **Responsabilidade**: Busca e seleção de produtos
- **Features**:
  - Campo de busca por nome, descrição ou categoria
  - Dropdown com produtos filtrados
  - Exibição de preço e categoria
  - Feedback quando não há produtos cadastrados

### 4. **ItensVendaList**
📁 `src/components/vendas/ItensVendaList.tsx`
- **Responsabilidade**: Gerenciamento dos itens selecionados
- **Features**:
  - Lista de produtos adicionados à venda
  - Controles de quantidade (+/-)
  - Botão de remoção de item
  - Cálculo automático de subtotais
  - Exibição do total geral

### 5. **VendaResumo**
📁 `src/components/vendas/VendaResumo.tsx`
- **Responsabilidade**: Resumo e finalização da venda
- **Features**:
  - Resumo das informações da venda (cliente, vendedor, itens)
  - Cálculo de subtotal, desconto e total
  - Seleção de forma de pagamento (dinheiro, cartão, PIX, parcelado)
  - Campo de número de parcelas (quando parcelado)
  - Campo de desconto com validação
  - Campo de observações
  - Validação completa antes de finalizar
  - Botão de finalização com loading
  - Alertas de problemas de validação

### 6. **ClienteModal** (já existente, atualizado)
📁 `src/components/vendas/ClienteModal.tsx`
- **Responsabilidade**: Cadastro de novos clientes
- **Features**: Formulário completo para dados do cliente

## 🔄 Página Principal Refatorada

### **VendasPage**
📁 `src/pages/vendas/VendasPage.tsx`

A página principal agora é muito mais limpa e focada apenas na:
- **Orquestração** dos componentes
- **Gerenciamento de estado** global
- **Comunicação** entre componentes
- **Lógica de negócio** (finalizar venda, adicionar/remover itens)

## 🎨 Benefícios da Modularização

### ✅ **Manutenibilidade**
- Cada componente tem uma responsabilidade específica
- Código mais fácil de entender e modificar
- Debugging simplificado

### ✅ **Reutilização**
- Componentes podem ser reutilizados em outras partes do sistema
- Lógica de UI separada da lógica de negócio

### ✅ **Performance**
- Renderizações mais otimizadas
- Componentes independentes se re-renderizam apenas quando necessário

### ✅ **Testabilidade**
- Cada componente pode ser testado isoladamente
- Mocks mais simples para testes unitários

### ✅ **Legibilidade**
- Código da página principal mais limpo
- Arquitetura mais fácil de compreender

## � Formas de Pagamento

O sistema suporta múltiplas formas de pagamento:

### **Opções Disponíveis**
- **💵 Dinheiro**: Pagamento à vista em dinheiro
- **💳 Cartão de Crédito**: Pagamento com cartão de crédito
- **💳 Cartão de Débito**: Pagamento com cartão de débito  
- **📱 PIX**: Pagamento via PIX
- **💰 Parcelado**: Pagamento parcelado (2 a 12x)

### **Funcionalidades de Pagamento**
- **Cálculo automático** de parcelas quando selecionado "Parcelado"
- **Campo de desconto** com validação (não pode ser maior que o subtotal)
- **Exibição clara** do subtotal, desconto e total final
- **Validação** de valores antes da finalização

## 🧮 Cálculos Automáticos

### **Valores Calculados**
```typescript
subtotal = soma de todos os itens (quantidade × preço unitário)
total = subtotal - desconto
valorParcela = total ÷ número de parcelas (quando parcelado)
```

### **Validações**
- Desconto não pode ser maior que o subtotal
- Total final deve ser maior que zero
- Parcelas disponíveis de 2x a 12x

## �🔧 Estado e Comunicação

### **Props Down, Events Up**
- **Props**: Dados fluem de pai para filho
- **Callbacks**: Eventos sobem de filho para pai
- **Estado centralizado**: Mantido na página principal

### **Gerenciamento de Estado**
```typescript
// Estados principais na VendasPage
const [clientes, setClientes] = useState<Cliente[]>([]);
const [produtos, setProdutos] = useState<Product[]>([]);
const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
const [itensVenda, setItensVenda] = useState<ItemVenda[]>([]);
// ...
```

## 📱 Layout Responsivo

### **Desktop (XL+)**
```
┌─────────────────┬─────────────────┐
│  ClienteSelector │  ItensVendaList │
├─────────────────┤                 │
│ VendedorSelector│                 │
├─────────────────┼─────────────────┤
│ ProdutoSelector │   VendaResumo   │
└─────────────────┴─────────────────┘
```

### **Mobile/Tablet**
```
┌─────────────────┐
│  ClienteSelector │
├─────────────────┤
│ VendedorSelector│
├─────────────────┤
│ ProdutoSelector │
├─────────────────┤
│  ItensVendaList │
├─────────────────┤
│   VendaResumo   │
└─────────────────┘
```

## 🚀 Próximos Passos

1. **Testes**: Implementar testes unitários para cada componente
2. **Acessibilidade**: Melhorar suporte a screen readers
3. **Performance**: Implementar memo/useMemo onde necessário
4. **Validação**: Adicionar validação mais robusta nos formulários
5. **Notificações**: Sistema de notificações mais sofisticado

## 🔍 Exemplo de Uso

```tsx
// Na VendasPage - uso dos componentes modulares
<ClienteSelector
  clientes={clientes}
  clienteSelecionado={clienteSelecionado}
  onClienteSelect={setClienteSelecionado}
  onNovoCliente={() => setShowClienteModal(true)}
/>

<ProdutoSelector
  produtos={produtos}
  onAddProduto={adicionarProduto}
  loading={loadingData}
/>

<ItensVendaList
  itens={itensVenda}
  onUpdateQuantidade={atualizarQuantidade}
  onRemoverItem={removerItem}
/>
```

Esta estrutura modular torna o sistema muito mais escalável e fácil de manter! 🎉
