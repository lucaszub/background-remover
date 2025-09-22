export default function Hero() {
  return (
    <div className="text-center">
      <h1
        className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-center animate-fade-in-up"
        style={{animationDelay: '0.15s', animationDuration: '1000ms'}}
      >
        Remove the background{' '}
        <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
          from an image
        </span>{' '}
        in 1 click
      </h1>
      <p
        className="max-w-xl text-neutral-400 text-lg mb-8 text-center font-normal animate-fade-in-up mx-auto"
        style={{animationDelay: '0.22s', animationDuration: '1000ms'}}
      >
        Our AI detects and isolates the object or person in your photos or videos.<br />
        Upload an image, preview the result, and download it easily.
      </p>
    </div>
  )
}