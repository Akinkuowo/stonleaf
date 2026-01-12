export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/bg.jpeg)' }}
      />
      
      {/* Optional overlay for better text readability if needed in the future */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Container for any future content if needed */}
      <div className="relative min-h-[600px] md:min-h-[800px]"></div>
    </section>
  )
}