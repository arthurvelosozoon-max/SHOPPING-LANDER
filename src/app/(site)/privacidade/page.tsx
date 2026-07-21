export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <span className="inline-block rounded-full border border-sl-red/50 bg-sl-red/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-sl-red">
        Privacidade
      </span>
      <h1 className="mt-4 text-4xl font-black text-white">Política de Privacidade</h1>
      <p className="mt-4 text-sm text-white/40">Última atualização: julho de 2026</p>

      <div className="mt-10 space-y-8 text-white/70 leading-relaxed">
        <section>
          <h2 className="mb-2 text-lg font-bold text-white">1. Quais dados coletamos</h2>
          <p>
            Ao navegar pelo Shopping Lander, podemos coletar informações que você fornece
            voluntariamente ao montar um pedido, como nome, forma de pagamento escolhida e
            observações enviadas junto com o pedido pelo WhatsApp. Também usamos o armazenamento
            local do seu navegador (localStorage) para manter o carrinho e a lista de favoritos
            salvos entre visitas.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-white">2. Como usamos seus dados</h2>
          <p>
            Os dados informados no checkout são usados exclusivamente para montar a mensagem do
            seu pedido, enviada diretamente para o nosso WhatsApp de atendimento. Não
            compartilhamos essas informações com terceiros para fins de marketing.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-white">3. Armazenamento local</h2>
          <p>
            O carrinho e os favoritos ficam salvos apenas no seu próprio navegador (localStorage),
            e não são enviados aos nossos servidores até que você finalize um pedido pelo
            WhatsApp. Você pode limpar essas informações a qualquer momento pelo botão &ldquo;Limpar
            carrinho&rdquo; ou apagando os dados do site nas configurações do navegador.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-white">4. Seus direitos</h2>
          <p>
            Você pode solicitar a qualquer momento informações sobre os dados que temos
            relacionados ao seu atendimento, ou pedir a exclusão do seu histórico de conversa,
            entrando em contato diretamente pelo WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-white">5. Contato</h2>
          <p>
            Dúvidas sobre esta política podem ser enviadas a qualquer momento pelo nosso canal de
            atendimento no WhatsApp.
          </p>
        </section>
      </div>
    </div>
  );
}
