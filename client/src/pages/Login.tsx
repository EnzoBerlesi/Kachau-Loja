function Login() {
  return (
    <div className="page">
      <h2>Login</h2>
      <p>Área de login do sistema.</p>

      <h2>Usuário</h2>
      <input type="text" name="Seu Email" id="email"/>
      <h2 className="font-bold" >E-mail</h2>
      <input type="text" name="Sua Senha" id="password" />
    </div>
  );
}

export default Login;
