export default function Footer() {
  return (
    <footer 
      className="w-full max-w-5xl mx-auto px-6 pb-6 pt-10 mt-auto text-center border-t border-neutral-900 text-neutral-600 text-xs animate-fade-in-up" 
      style={{animationDelay: '0.65s', animationDuration: '1000ms'}}
    >
      © 2024 Background Remover — Fait avec{' '}
      <span className="text-pink-400">♥</span> et IA.
    </footer>
  )
}