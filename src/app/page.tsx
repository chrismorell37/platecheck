import PlateCheck from '@/components/PlateCheck';

// Pyramid indicator component - shows which section is active
function PyramidIndicator({ activeSection }: { activeSection: 'protein' | 'veggies' | 'grains' }) {
  return (
    <svg viewBox="0 0 60 60" className="w-14 h-14">
      {/* Top left - Protein section */}
      <path 
        d="M 8 12 L 30 12 L 30 48 Z" 
        fill={activeSection === 'protein' ? '#4A9B4F' : '#D4D4D4'}
        className="transition-colors duration-300"
      />
      {/* Top right - Veggies section */}
      <path 
        d="M 30 12 L 52 12 L 30 48 Z" 
        fill={activeSection === 'veggies' ? '#4A9B4F' : '#D4D4D4'}
        className="transition-colors duration-300"
      />
      {/* Bottom - Grains section */}
      <path 
        d="M 19 30 L 41 30 L 30 48 Z" 
        fill={activeSection === 'grains' ? '#D4A853' : '#D4D4D4'}
        className="transition-colors duration-300"
      />
    </svg>
  );
}

export default function Home() {

  return (
    <div className="min-h-screen bg-[#F7F6F1]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-semibold text-[#1A1A1A] text-lg tracking-tight">
            <span className="text-xl">✓</span>
            PlateCheck
          </a>
          <a 
            href="#snap" 
            className="bg-[#1A1A1A] text-white font-medium px-5 py-2.5 rounded-full text-sm hover:bg-[#3D3D3D] transition-colors"
          >
            Check Your Plate
          </a>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="pt-28 pb-20 lg:pt-36 lg:pb-28 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-5xl lg:text-6xl text-[#1A1A1A] text-center leading-[1.1] tracking-tight mb-6">
            America Has a New<br />
            <span className="italic">Food Pyramid</span>
          </h1>

          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#2E7D32] text-sm font-semibold px-4 py-2 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Official 2025–2030 Dietary Guidelines
            </span>
          </div>

          {/* Subhead */}
          <p className="text-xl text-[#3D3D3D] text-center leading-relaxed max-w-2xl mx-auto mb-12">
            For the first time in decades, the official U.S. dietary guidelines have been 
            completely reimagined. The pyramid has been flipped—and everything you thought 
            you knew about healthy eating is changing.
          </p>

          {/* What's Changed - Three Points */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
              <div className="bg-[#FAF8F3] p-6 flex items-center justify-center h-28">
                <div className="text-5xl">🔄</div>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-semibold text-[#1A1A1A] text-lg mb-2">The Pyramid Is Flipped</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">
                  Grains are no longer the foundation. Protein, healthy fats, vegetables, 
                  and fruits now take center stage at the top.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
              <div className="bg-[#FAF8F3] p-6 flex items-center justify-center h-28">
                <div className="flex items-end gap-1">
                  <span className="text-5xl">🥩</span>
                  <span className="text-4xl">🍳</span>
                  <span className="text-3xl">🐟</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-semibold text-[#1A1A1A] text-lg mb-2">Protein Takes Priority</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">
                  The war on protein is over. New guidelines recommend 1.2–1.6g of protein 
                  per kilogram of body weight daily.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
              <div className="bg-[#FAF8F3] p-6 flex items-center justify-center h-28">
                <div className="flex items-end gap-1">
                  <span className="text-4xl">🧈</span>
                  <span className="text-5xl">🥑</span>
                  <span className="text-4xl">🫒</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-semibold text-[#1A1A1A] text-lg mb-2">Healthy Fats Are Back</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">
                  Full-fat dairy, olive oil, nuts, and avocados are now encouraged—not 
                  avoided. Science has evolved.
                </p>
              </div>
            </div>
          </div>

          {/* How PlateCheck Helps */}
          <div className="bg-[#F7F6F1] rounded-2xl p-8 lg:p-10 text-center">
            <h3 className="font-semibold text-[#1A1A1A] text-lg mb-3">
              How PlateCheck Helps You
            </h3>
            <p className="text-[#3D3D3D] leading-relaxed max-w-xl mx-auto mb-6">
              Whether you're an adult looking to improve your health or a parent teaching 
              kids about nutrition, PlateCheck breaks down the new pyramid in simple terms. 
              <strong> Then, snap a photo of your plate</strong> to get instant AI-powered 
              feedback on how your meals measure up to the new guidelines.
            </p>
            <a href="#snap" className="group bg-[#1A1A1A] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#3D3D3D] transition-colors inline-flex items-center gap-3">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Check Your Plate
            </a>
          </div>
        </div>
      </section>

      {/* The Pyramid Visual */}
      <section className="py-16 lg:py-20 px-6 bg-[#F7F6F1]">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] tracking-tight leading-[1]">
              The New Pyramid
            </h2>
            <p className="text-[#6B6B6B] mt-3 max-w-lg mx-auto">
              An inverted approach: prioritize what's at the top, limit what's at the bottom.
            </p>
          </div>
          
          {/* Official Pyramid Image Card */}
          <figure className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden max-w-3xl mx-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              <img 
                src="https://www.eatingwell.com/thmb/YGB1qNYblVg9P2PaEredWBp9hkc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/The-New-Food-Pyramid-Is-Here--Should-You-Actually-Follow-It-embed-74d2b04ca2914479b936adf76250e7b4.jpg"
                alt="The New Food Pyramid showing Protein, Dairy & Healthy Fats on the left, Vegetables & Fruits on the right, and Whole Grains at the bottom"
                className="w-full h-auto"
              />
            </div>
            <figcaption className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-0">
              <p className="text-xs sm:text-sm text-[#6B6B6B] text-center">
                Source: Dietary Guidelines for Americans, 2025–2030.
              </p>
            </figcaption>
          </figure>
          
          {/* Scroll hint */}
          <div className="text-center mt-10">
            <p className="text-sm text-[#6B6B6B] mb-2">Explore each food group below</p>
            <svg className="w-6 h-6 mx-auto text-[#6B6B6B] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Section 1: Protein, Dairy & Healthy Fats */}
      <section className="py-16 lg:py-20 px-6 bg-[#F7F6F1]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text */}
            <div className="max-w-md">
              <div className="flex items-start gap-4 mb-6">
                <PyramidIndicator activeSection="protein" />
                <div>
                  <h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-5xl text-[#1A1A1A] tracking-tight leading-[1] italic">
                    Protein, Dairy, &<br />Healthy Fats
                  </h2>
                </div>
              </div>
              
              <p className="text-[#3D3D3D] leading-relaxed mb-6">
                We are ending the war on protein. Every meal must prioritize high-quality, 
                nutrient-dense protein from both animal and plant sources, paired with healthy 
                fats from whole foods such as eggs, seafood, meats, full-fat dairy, nuts, 
                seeds, olives, and avocados.
              </p>
              
              <p className="text-[#1A1A1A]">
                <span className="font-semibold">Protein target:</span>{' '}
                <span className="text-[#3D3D3D]">1.2–1.6 grams of protein per kilogram of body weight per day</span>
              </p>
            </div>
            
            {/* Right: Image card only */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden p-4 sm:p-6">
              <img 
                src="/Protein.png"
                alt="Illustrated protein and healthy fats including steak, salmon, chicken, eggs, cheese, milk, olive oil, yogurt, butter, and canned fish"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Vegetables & Fruits */}
      <section className="py-16 lg:py-20 px-6 bg-[#F7F6F1]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text */}
            <div className="max-w-md">
              <div className="flex items-start gap-4 mb-6">
                <PyramidIndicator activeSection="veggies" />
                <div>
                  <h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-5xl text-[#1A1A1A] tracking-tight leading-[1] italic">
                    Vegetables &<br />Fruits
                  </h2>
                </div>
              </div>
              
              <p className="text-[#3D3D3D] leading-relaxed mb-6">
                Vegetables and fruits are essential to real food nutrition. Eat a wide variety 
                of whole, colorful, nutrient-dense vegetables and fruits in their original form, 
                prioritizing freshness and minimal processing.
              </p>
              
              <div className="space-y-1">
                <p className="text-[#1A1A1A]">
                  <span className="font-semibold">Vegetables:</span>{' '}
                  <span className="text-[#3D3D3D]">3 servings per day.</span>
                </p>
                <p className="text-[#1A1A1A]">
                  <span className="font-semibold">Fruits:</span>{' '}
                  <span className="text-[#3D3D3D]">2 servings per day.</span>
                </p>
              </div>
            </div>
            
            {/* Right: Image card only */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden p-4 sm:p-6">
              <img 
                src="/veg-fruit.png"
                alt="Illustrated vegetables and fruits including broccoli, carrots, tomatoes, lettuce, bananas, apples, grapes, oranges, and berries"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Whole Grains */}
      <section className="py-16 lg:py-20 px-6 bg-[#F7F6F1]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text */}
            <div className="max-w-md">
              <div className="flex items-start gap-4 mb-6">
                <PyramidIndicator activeSection="grains" />
                <div>
                  <h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-5xl text-[#1A1A1A] tracking-tight leading-[1] italic">
                    Whole Grains
                  </h2>
                </div>
              </div>
              
              <p className="text-[#3D3D3D] leading-relaxed mb-6">
                Whole grains are encouraged. Refined carbohydrates are not. Prioritize 
                fiber-rich whole grains and significantly reduce the consumption of highly 
                processed, refined carbohydrates that displace real nourishment.
              </p>
              
              <p className="text-[#1A1A1A]">
                <span className="font-semibold">Target:</span>{' '}
                <span className="text-[#3D3D3D]">2–4 servings per day.</span>
              </p>
            </div>
            
            {/* Right: Image card only */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden p-4 sm:p-6">
              <div className="bg-[#FAF8F3] rounded-lg">
                <img 
                  src="/whole-grains.png"
                  alt="Illustrated whole grains including bread, oatmeal, and scattered grains"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Snap Your Plate - Interactive Analysis */}
      <section id="snap" className="py-24 lg:py-32 bg-[#1A1A1A]">
        <div id="snap-your-plate-section" className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight mb-6 italic text-white">
              See how your plate<br />measures up
            </h2>
            <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
              Take a photo of your meal and get instant AI-powered feedback based on the new food pyramid.
            </p>
          </div>
          
          <PlateCheck />
        </div>
      </section>

      {/* For Kids Section */}
      <section className="py-24 lg:py-32 bg-[#F7F6F1]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-[#1A1A1A]/5 text-[#1A1A1A] text-sm font-medium px-4 py-2 rounded-full mb-6">
              👧 For Kids
            </span>
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-5xl text-[#1A1A1A] tracking-tight leading-[1.1] italic mb-6">
              The upside-down<br />food triangle!
            </h2>
            <p className="text-lg text-[#3D3D3D] leading-relaxed">
              Imagine flipping a triangle on its head. The biggest part at the top 
              is where the most powerful foods live!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 text-center">
              <span className="text-5xl mb-4 block">🦸</span>
              <h3 className="font-semibold text-[#1A1A1A] text-lg mb-2">Superhero Foods</h3>
              <p className="text-sm text-[#6B6B6B]">
                Meat, fish, eggs & cheese give you power to run fast and think smart!
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 text-center">
              <span className="text-5xl mb-4 block">🌈</span>
              <h3 className="font-semibold text-[#1A1A1A] text-lg mb-2">Rainbow Foods</h3>
              <p className="text-sm text-[#6B6B6B]">
                Eat veggies and fruits in every color of the rainbow every day!
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 text-center">
              <span className="text-5xl mb-4 block">⚡</span>
              <h3 className="font-semibold text-[#1A1A1A] text-lg mb-2">Energy Foods</h3>
              <p className="text-sm text-[#6B6B6B]">
                Oatmeal and whole grain bread give you fuel to play all day!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#EDEBE6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#1A1A1A] tracking-tight text-lg">
                ✓ PlateCheck
              </span>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-8 text-sm">
              <a href="#" className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                About
              </a>
              <a href="#" className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                Resources
              </a>
              <a href="#" className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                Privacy
              </a>
              <a href="#" className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                Accessibility
              </a>
            </nav>
            
            <p className="text-sm text-[#6B6B6B]">
              © 2026 PlateCheck
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
