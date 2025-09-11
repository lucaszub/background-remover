export default function Hero() {
  return (
    <div className="text-center">
      <h1 
        className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-center animate-fade-in-up" 
        style={{animationDelay: '0.15s', animationDuration: '1000ms'}}
      >
        Retirez le fond{' '}
        <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
          d&apos;une image
        </span>{' '}
        en 1 clic
      </h1>
      <p 
        className="max-w-xl text-neutral-400 text-lg mb-8 text-center font-normal animate-fade-in-up mx-auto" 
        style={{animationDelay: '0.22s', animationDuration: '1000ms'}}
      >
        Notre IA détecte et isole l&apos;objet ou la personne sur vos photos ou vidéos.<br />
        Téléchargez une image, visualisez le résultat et récupérez-la en toute simplicité.
      </p>
    </div>
  )
}