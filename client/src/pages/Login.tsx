function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-sans">
      <div className="bg-gray-800 rounded-xl shadow-lg flex w-[90%] max-w-6xl overflow-hidden">
        {/* Formulário de Login */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-purple-400 mb-6">Kachau Loja</h2>
          <h3 className="text-xl font-semibold mb-4">Login</h3>

          <label className="text-sm block mb-1" htmlFor="cpf">CPF</label>
          <input
            type="text"
            id="cpf"
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 mb-4 text-white"
            placeholder="Digite seu CPF"
          />

          <label className="text-sm block mb-1" htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 mb-2 text-white"
            placeholder="Digite sua senha"
          />

          <div className="text-right mb-4">
            <a href="#" className="text-sm text-purple-300 hover:underline">Esqueceu sua senha?</a>
          </div>

          <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded text-white font-bold transition">
            Entrar
          </button>
        </div>

        {/* Área de Cadastro */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gray-700 w-1/2 p-10">
          <h3 className="text-lg font-bold text-white mb-2">Cadastrar-se como:</h3>
          <p className="text-sm text-gray-300 mb-6">Você será encaminhado após a seleção.</p>

          <button className="w-full py-3 mb-4 bg-gray-600 hover:bg-purple-600 rounded text-white transition">
            Usuario/Comprador
          </button>
          <button className="w-full py-3 mb-4 bg-gray-600 hover:bg-purple-600 rounded text-white transition">
            Empresa
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
